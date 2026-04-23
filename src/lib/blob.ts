import { put } from "@vercel/blob";
import { getDb } from "@/db/client";
import { postAssets, type NewPostAsset } from "@/db/schema/post-assets";

const ALLOWED_MIME = /^(image\/(png|jpeg|gif|webp|svg\+xml)|video\/(mp4|webm|quicktime))$/;

interface UploadInput {
  file: File;
  postId?: string | null;
  uploadedById: string;
  altText?: string | null;
}

interface UploadResult {
  url: string;
  mimeType: string;
  sizeBytes: number;
  kind: "image" | "video";
}

export async function uploadAsset({
  file,
  postId = null,
  uploadedById,
  altText = null,
}: UploadInput): Promise<UploadResult> {
  if (!ALLOWED_MIME.test(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}`);
  }

  const blob = await put(`hall/${Date.now()}-${file.name}`, file, {
    access: "public",
    contentType: file.type,
    addRandomSuffix: true,
  });

  const sizeBytes = file.size;
  const kind: "image" | "video" = file.type.startsWith("video/") ? "video" : "image";

  const record: NewPostAsset = {
    postId,
    url: blob.url,
    mimeType: file.type,
    sizeBytes,
    altText,
    uploadedById,
  };

  const db = getDb();
  await db.insert(postAssets).values(record);

  return { url: blob.url, mimeType: file.type, sizeBytes, kind };
}
