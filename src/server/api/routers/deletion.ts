import { currentUser } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server"; // 🔁 updated import
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const deletionRouter = createTRPCRouter({
  deleteAccount: protectedProcedure.mutation(async () => {
    const user = await currentUser();

    if (!user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Email not found" });
    }

    try {
      await db.user.delete({ where: { email } });
      await fetch(`https://api.clerk.com/v1/users/${user.id}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

    } catch (err) {
      console.error("Deletion error:", err);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }

    return { success: true };
  }),
});
