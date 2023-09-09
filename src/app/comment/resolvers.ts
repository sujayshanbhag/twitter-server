import { Comments } from "@prisma/client";
import { GraphqlContext } from "../../interfaces";
import TweetService from "../../services/tweet";
import UserService from "../../services/user";
import { prismaClient } from "../../clients/db";

interface CreateCommentPayload {
    content: string,
    to : string
}

const mutations = {
    addComment: async (parent: any,{payload}: {payload : CreateCommentPayload},ctx : GraphqlContext) => {
        if(!ctx.user) {
            throw new Error("You are not authenticated");
        }
        const comment= await TweetService.addComment({
            ...payload,
            from : ctx.user.id,
        })
        return comment;
    }
}
const extraResolver = {
    Comments : {
        author : async (parent : Comments) => UserService.getUserById(parent.authorId)
    }
}
export const resolvers = {mutations,extraResolver};