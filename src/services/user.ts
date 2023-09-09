import axios from "axios";
import { prismaClient } from "../clients/db";
import JWTService from "./jwt";

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

class UserService {
    public static async verifyGoogleAuthToken(token : string){
        const googleToken = token;
        const googleOauthURL = new URL('https://oauth2.googleapis.com/tokeninfo');
        googleOauthURL.searchParams.set('id_token',googleToken);

        const {data} = await axios.get<GoogleTokenResult>(googleOauthURL.toString(),{
            responseType : 'json'
        });
        const user = await prismaClient.user.findUnique({
            where : {
                email : data.email
            },
        });

        if(!user){
            await prismaClient.user.create({
                data : {
                    email : data.email,
                    firstName : data.given_name,
                    lastName : data.family_name,
                    profileImageURL: data.picture,
                }
            })
        }
        const userInDb = await prismaClient.user.findUnique({
            where : {
                email : data.email
            }
        })
        if(!userInDb) {
            throw new Error('User with email not found');
        }
        const userToken = await JWTService.generateTokenForUser(userInDb)

        return userToken;
    }
    public static async getUserById(id : string) {
        console.log("hello",id);
        return prismaClient.user.findUnique({where : {id}});
    }
    public static followUser(from : string, to: string) {
        return prismaClient.follows.create({
            data : {
                follower : {connect : {id: from}},
                following: {connect: {id: to}}
            },
        });
    }
    public static unfollowUser(from : string, to: string) {
        return prismaClient.follows.delete({
            where : {
                followerId_followingId : {followerId: from, followingId: to}
            }
        });
    }
}
export default UserService;