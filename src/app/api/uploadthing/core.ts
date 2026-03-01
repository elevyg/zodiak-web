import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getSessionFromCookie } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1
    }
  })
    .middleware(async ({ req }) => {
      const cookieHeader = req.headers.get("cookie");
      const session = await getSessionFromCookie(cookieHeader);
      if (!session) throw new UploadThingError("Unauthorized");
      return {};
    })
    .onUploadComplete(async () => ({}))
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
