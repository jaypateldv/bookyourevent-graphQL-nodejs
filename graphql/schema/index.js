// const { buildSchema } = require("graphql");
// module.exports = buildSchema(`
// type Booking {
//     _id: ID!
//     event:Event!
//     user: User!
//     createdAt:String
//     updatedAt:String
// }

// type Event {
//     _id: ID!
//     title: String!
//     description: String!
//     price: Float!
//     date: String!
//     creator:User
//     users:[User]
// }

// type User {
//     _id: ID!
//     email: String!
//     password:String
//     createdEvents:[Event]
//     token: String
// }

// type AuthData{
//     userId: ID!
//     token: String!
// }

// input EventInput {
//     title: String!
//     description: String!
//     price: Float!
//     date: String!
// }

// input UserInput {
//     email: String!
//     password: String!
// }

// type RootQuery {
//     events(_id:ID): [Event!]!
//     allEvents: [Event!]!
//     users: User!
//     bookings(_id:ID): [Booking!]!
//     login(email: String!, password: String!): User!
// }

// type RootMutation {
//     createEvent(eventInput: EventInput): Event
//     createUser(userInput: UserInput): User
//     bookEvent(eventId: ID!): Booking!
//     cancelBooking(bookingId: ID!): Event!
// }

// schema{
//     query: RootQuery
//     mutation: RootMutation
// }
// `);

module.exports.typedDefs = `#graphql
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
    password:String
    createdEvents:[Event]
    token: String
    sensitiveInformation: String @hasRole(role: "ADMIN")
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

type Query {
    events(_id:ID,page:Int,limit:Int,sortBy:String,sortOrder:String): EventsRes!
    allEvents: [Event!]!
    users: User!
    bookings(_id:ID): [Booking!]!
    login(email: String!, password: String!): User!
}

type Mutation {
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
}

directive @hasRole(role: String!) on FIELD_DEFINITION

`;