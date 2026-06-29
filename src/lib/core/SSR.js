import { headers } from "next/headers"
import { auth } from "../auth"

//get user
export const getUser=async()=>{
    const session= await auth.api.getSession({
        headers:await headers()
    })
    return session?.user || null;
}

// get user token
export const getToken =async()=>{
    const token= await auth.api.getSession({
        headers:await headers()
    })
    return token?.session?.token || null;
}
