import express from 'express'
import { ApolloServer } from '@apollo/server';
import bodyParser from 'body-parser';
import cors from 'cors'
import { expressMiddleware } from '@apollo/server/express4';
import {User} from './user'
import {Tweet} from './tweet'
import {Like} from './likes'
import {Comment} from './comment'
import { GraphqlContext } from '../interfaces';
import JWTService from '../services/jwt';


export async function initServer() {
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());

    app.get('/',(req,res) => res.status(200).json({ message: 'EVerything is good'}));

    

    const graphqlServer = new ApolloServer<GraphqlContext>({
        typeDefs: `
        ${User.types}
        ${Tweet.types}
        ${Like.types}
        ${Comment.types}
        type Query {
            ${User.queries}
            ${Tweet.queries}
        }
        type Mutation {
            ${Tweet.mutations}
            ${User.mutations}
            ${Like.mutations}
            ${Comment.mutations}
        }
        `,
        resolvers: {
            Query : {
                ...User.resolvers.queries,
                ...Tweet.resolvers.queries,
            },
            Mutation : {
                ...Tweet.resolvers.mutations,
                ...User.resolvers.mutations,
                ...Like.resolvers.mutations,
                ...Comment.resolvers.mutations
            },
            ...Tweet.resolvers.extraResolver,
            ...User.resolvers.extraResolver,
        },
    });
    await graphqlServer.start();
    

    app.use('/graphql',expressMiddleware(graphqlServer,{
        context : 
        async ({req,res})=> {
            return {
                user: req.headers.authorization 
                ? JWTService.decodeToken(req.headers.authorization.split('Bearer ')[1])
                : undefined,
            };
        }}
    ));

    return app;
}
