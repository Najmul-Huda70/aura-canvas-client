import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { jwt } from "better-auth/plugins";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getOAuthState } from "better-auth/api";

const MONGO_DB_URI = process.env.MONGO_DB_URI;
const AUTH_DB_NAME = process.env.AUTH_DB_NAME;
const client = new MongoClient(MONGO_DB_URI);
const db = client.db(AUTH_DB_NAME);

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
   google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    mapProfileToUser: (profile) => {
      return {
        image: `https://api.dicebear.com/10.x/initials/svg?seed=${encodeURIComponent(profile.name)}`,
      };
    },
  },
  },
  database: mongodbAdapter(db, { client }),
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "user", input: false },
      plan: { type: "string", required: false, defaultValue: "user_free", input: false },
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
 databaseHooks: {
  user: {
    create: {
      before: async (user, ctx) => {
        let data = { ...user };

        if (ctx?.path === "/callback/:id") {
          const state = await getOAuthState();
          if (state?.role) {
            const role = state.role === "artist" ? "artist" : "user";
            data.role = role;
            data.plan = role === "user" ? "user_free" : "artist_free";
          }
        }
        data.image = `https://api.dicebear.com/10.x/initials/svg?seed=${encodeURIComponent(data.name)}`;

        return { data };
      },
    },
  },
},
  plugins: [jwt()],
  advanced: {
    useCrossSubdomainCookie: true,
  },
  cookie: {
    secure: true,
    sameSite: "none",
  },
});