import { Likes } from "@prisma/client";
import { GraphqlContext } from "../../interfaces";
import TweetService from "../../services/tweet";
import UserService from "../../services/user";

const mutations = {
    addLike : async (parent: any,{to}: {to : string},ctx : GraphqlContext) => {
        if(!ctx.user || !ctx.user.id){
            throw new Error("Unauthenticated");
        }
        await TweetService.addLike(ctx.user.id,to)
        return true;
    },
    removeLike : async (parent: any,{to}: {to : string},ctx : GraphqlContext) => {
        if(!ctx.user || !ctx.user.id){
            throw new Error("Unauthenticated");
        }
        await TweetService.removeLike(ctx.user.id,to)
        return true;
    }
}
const extraResolver = {
    Like : {
        author : (parent : Likes) => UserService.getUserById(parent.authorId),
    }
}
export const resolvers ={mutations,extraResolver};