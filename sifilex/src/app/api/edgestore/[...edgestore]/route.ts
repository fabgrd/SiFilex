import { initEdgeStore } from "@edgestore/server";
import {
  CreateContextOptions,
  createEdgeStoreNextHandler,
} from "@edgestore/server/adapters/next/app";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/authOptions";
import { z } from "zod";
import { createHash } from "crypto";

type Context = {
  userId: string;
  userEmail: string;
};

const hashEmail = (email: string) => {
  return createHash("sha256").update(email, "utf-8").digest("hex");
};

async function createContext({ req }: CreateContextOptions): Promise<Context> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Unauthorized: No session found");
  }

  return {
    userId: hashEmail(session.user.email),
    userEmail: session.user.email,
  };
}

const es = initEdgeStore.context<Context>().create();

const edgeStoreRouter = es.router({
  userFiles: es
    .fileBucket({
      maxSize: 1024 * 1024 * 10, // 10MB
      accept: ['image/*', 'application/pdf', '.doc', '.docx', '.txt', '.md'],
    })
    .input(
      z.object({
        type: z.enum(["image", "document", "other"]),
        name: z.string(),
      })
    )
    .path(({ ctx, input }) => [
      { userId: ctx.userId },
      { type: input.type },
    ])
    .metadata(({ ctx, input }) => ({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      originalName: input.name,
      fileType: input.type,
      uploadedAt: new Date().toISOString(),
    }))
    .accessControl({
      OR: [
        {
          userId: { path: "userId" },
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