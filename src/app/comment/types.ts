export const types = `#graphql

    input CreateCommentData {
        to: String!
        content: String!
    }

    type Comment {
        id: ID!
        content: String!

        author : User
        tweet : Tweet
    }

`