import { headers } from "next/headers"
import { auth } from "../auth"

//get user
export const getUser=async()=>{
    const session= await auth.api.getSession({
        headers:await headers()
    })
    return session?.user || null;
}