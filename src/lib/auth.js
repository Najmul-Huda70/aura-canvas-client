import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { jwt } from "better-auth/plugins"
import { mongodbAdapter } from "better-auth/adapters/mongodb";
const MONGO_DB_URI = process.env.MONGO_DB_URI;
const AUTH_DB_NAME = process.env.AUTH_DB_NAME;
const client = new MongoClient(MONGO_DB_URI);
const db = client.db(AUTH_DB_NAME);

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: mongodbAdapter(db, {
    client,
  }),
  user: {
    additionalFields: {
      role: { default: "user" },
      plan:{default:'user_free'}
    },
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true,
    },
    deleteUser: {
      enabled: true,
    },
  },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
         },
        
  plugins: [
        jwt(), 
    ],
    advanced: {
        useCrossSubdomainCookie: true
    },
    cookie: {
        secure: true, 
        sameSite: "none", 
    }
});
