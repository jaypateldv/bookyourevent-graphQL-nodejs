export const typedDefs = `#graphql

directive @authenticated on FIELD_DEFINITION
directive @getPresignedUrl on FIELD_DEFINITION
directive @requiredRole(roles:[String]) on FIELD_DEFINITION
directive @showPassword(requiredRoles:[String]) on FIELD_DEFINITION


type Booking {
    _id: ID!
    event:Event!
    user: User!
    createdAt:String
    updatedAt:String
}

type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator:User
    users:[User]
}

type User {
    _id: ID!
    email: String!
    password:String @showPassword(requiredRoles:["Admin"])
    createdEvents:[Event]
    role: String
    token: String
    profileKey:String! @getPresignedUrl
    sensitiveInformation: String
}

type AuthData{
    userId: ID!
    token: String!
}

input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
}

input UserInput {
    email: String!
    password: String!
    role:String!
    profileKey:String!
}

type EventsRes {
    events:[Event!]!
    total:Int
}

type DeleteEventRes {
    message:String!
}

type Query {
    events(_id:ID,page:Int,limit:Int,sortBy:String,sortOrder:String): EventsRes! @authenticated
    allEvents: [Event!]! @authenticated
    users: User! @authenticated 
    bookings(_id:ID): [Booking!]! @authenticated
    login(email: String!, password: String!): User!
    deleteEvent(eventId:String!) : DeleteEventRes! @authenticated

    allUsers: [User!]! @requiredRole(roles: ["Admin"])
}

type Mutation {
    createEvent(eventInput: EventInput): Event @authenticated
    createUser(userInput: UserInput): User
    bookEvent(eventId: ID!): Booking! @authenticated
    cancelBooking(bookingId: ID!): Event! @authenticated
}

directive @hasRole(role: String!) on FIELD_DEFINITION

`;
