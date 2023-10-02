export const typedDefs = `#graphql

directive @auth(roles: [String]) on FIELD_DEFINITION

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
    email: String! @deprecated(reason: "Testing deprecated directive")
    password:String @auth(roles: ["admin", "manager"])
    createdEvents:[Event]
    token: String
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
}

type EventsRes {
    events:[Event!]!
    total:Int
}

type DeleteEventRes {
    message:String!
}

type Query {
    events(_id:ID,page:Int,limit:Int,sortBy:String,sortOrder:String): EventsRes!
    allEvents: [Event!]!
    users: User!
    bookings(_id:ID): [Booking!]!
    login(email: String!, password: String!): User!
    deleteEvent(eventId:String!) : DeleteEventRes!
}

type Mutation {
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
}

directive @hasRole(role: String!) on FIELD_DEFINITION

`;
