import { initEdgeStore } from "@edgestore/server";
import {
  CreateContextOptions,
  createEdgeStoreNextHandler,
} from "@edgestore/server/adapters/next/app";
import { z } from "zod";
import { authOptions } from "../../../../../lib/authOptions";
import { getServerSession } from "next-auth";
import { createHash } from "crypto";

type Context = {
  userId: string;
  userRole: "admin" | "user";
};

async function createContext({ req }: CreateContextOptions): Promise<Context> {
  const session = await getServerSession(authOptions);
  console.log("EMAIL : ", session?.user?.email);

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const hashedEmail = createHash("sha256").update(session.user.email, "utf-8").digest("hex");
  console.log("HASHED EMAIL : ", hashedEmail);

  return {
    userId: hashedEmail,
    userRole: "admin",
  };
}

const es = initEdgeStore.context<Context>().create();

const edgeStoreRouter = es.router({
  myPublicImages: es
    .imageBucket({
      maxSize: 1024 * 1024 * 1, // 1MB
    })
    .input(
      z.object({
        type: z.enum(["post", "profile"]),
      })
    )
    // e.g. /post/my-file.jpg
    .path(({ input }) => [{ type: input.type }]),

  myProtectedFiles: es
    .fileBucket()
    // e.g. /123/my-file.pdf
    .path(({ ctx }) => [{ owner: ctx.userId }])
    .accessControl({
      OR: [
        {
          userId: { path: "owner" },
        },
        {
          userRole: { eq: "admin" },
        },
      ],
    }),
});

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  createContext,
});

export { handler as GET, handler as POST };

export type EdgeStoreRouter = typeof edgeStoreRouter;
export { edgeStoreRouter };