import axios from 'axios'
import { prismaClient } from '../../clients/db';
import JWTService from '../../services/jwt';
import { GraphqlContext } from '../../interfaces';
import { User } from '@prisma/client';
import UserService from '../../services/user';

interface GoogleTokenResult {
    iss?: string;
    nbf7: string;
    aud?: string;
    sub?: string;
    email: string;
    email_verified: string;
    azp?: string;
    name?: string;
    picture?: string;
    given_name: string;
    family_name?: string;
    iat?: string;
    exp?: string;
    jti?: string;
    alg?: string;
    kid?: string;
    typ?: string;
}

const queries = {
    verifyGoogleToken : async(parent: any,{token}:{token : string}) => {
        const resultToken= await UserService.verifyGoogleAuthToken(token);
        return resultToken;
    },
    getCurrentUser : async(parent : any, args : any, ctx: GraphqlContext) => {
        const id= ctx.user?.id;
        if(!id) return null;

        const user = await UserService.getUserById(id);
        return user;
    },
    getUserById : async(parent : any, {id} : {id : string}, ctx: GraphqlContext) => 
        prismaClient.user.findUnique({where : {id}})
};

const extraResolver = {
    User : {
        tweets: (parent: User) => prismaClient.tweet.findMany({ where: { author: { id: parent.id } } }),
        followers: async (parent: User) => {
            const result = await prismaClient.follows.findMany({
              where: { following: { id: parent.id } },
              include: {
                follower: true,
              },
            });
            return result.map((el) => el.follower);
          },
          following: async (parent: User) => {
            const result = await prismaClient.follows.findMany({
              where: { follower: { id: parent.id } },
              include: {
                following: true,
              },
            });
            return result.map((el) => el.following);
          },
    }
}

const mutations = {
    followUser : async (parent: any,{to}: {to : string}, ctx: GraphqlContext ) => {
        if(!ctx.user || !ctx.user.id){
            throw new Error("Unauthenticated");
        }
        await UserService.followUser(ctx.user.id,to);
        return true;
    },
    unfollowUser : async (parent: any,{to}: {to : string}, ctx: GraphqlContext ) => {
        if(!ctx.user || !ctx.user.id){
            throw new Error("Unauthenticated");
        }
        await UserService.unfollowUser(ctx.user.id,to);
        return true;
    },
}

export const resolvers = {queries, extraResolver,mutations};