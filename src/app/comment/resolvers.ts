import { GraphqlContext } from "../../interfaces";
import TweetService from "../../services/tweet";

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

export const resolvers = {mutations};