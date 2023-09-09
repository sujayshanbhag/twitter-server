import { GraphqlContext } from "../../interfaces";
import TweetService from "../../services/tweet";

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
export const resolvers ={mutations};