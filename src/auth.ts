import { cookies } from "next/headers";
import { cache } from "react";

import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Lucia, Session, User } from "lucia";
import { env } from "process";

import prisma from "./lib/prisma";

// Set up the Prisma adapter for Lucia
const adapter = new PrismaAdapter(prisma.session, prisma.user);
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false, // Keep session cookies alive indefinitely
    attributes: {
      secure: env.NODE_ENV === "production", // Set secure attribute based on environment
    },
  },
  getUserAttributes(databaseUserAttributes) {
    return {
      id: databaseUserAttributes.id,
      userName: databaseUserAttributes.userName,
      displayName: databaseUserAttributes.displayName,
      avatarUrl: databaseUserAttributes.avatarUrl,
      googleId: databaseUserAttributes.googleId,
    };
  },
});

// Extend Lucia's type definitions
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

// Define the shape of user attributes in the database
interface DatabaseUserAttributes {
  id: string;
  userName: string;
  displayName: string;
  avatarUrl: String | null;
  googleId: String | null;
}

// Validate the request and manage session cookies
export const validateRequest = cache(
  async (): Promise<
    | {
        user: User;
        session: Session;
      }
    | {
        user: null;
        session: null;
      }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);

    // next.js throws when you attempt to set cookie when rendering page
    try {
      // Refresh the session if it's fresh
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }

      // Create a blank session cookie if the session is invalid
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {}

    return result;
  }
);

// expires: false, - Keep the session cookies alive indefinitely. With JWTs, this could be problematic because they cannot be invalidated easily. For example, if a user forgets their password or has been compromised, we can still invalidate their session in the database, effectively logging them out, even if the session cookie remains valid.

// getUserAttributes(databaseUserAttributes) {} - By default, we will only get the user ID from the database. This method allows us to return additional fields that we want, such as userName, displayName, avatarUrl, and googleId.
