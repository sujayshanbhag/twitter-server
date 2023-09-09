export const types = `#graphql

    input CreateCommentData {
        to: String!
        content: String!
    }

    type Comments {
        id: ID!
        content: String!

        author : User
        tweet : Tweet
    }

`