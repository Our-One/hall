import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getDb } from "@/db/client";
import { postAssets, type NewPostAsset } from "@/db/schema/post-assets";
import { generateId } from "@/lib/id";

/**
 * Cloudflare R2 upload helper for Hall media.
 *
 * R2 is S3-compatible, so we use the AWS S3 SDK pointed at Cloudflare's
 * account endpoint. The bucket is shared across the Our.one portfolio
 * (user avatars, other products' assets) — we namespace Hall's uploads
 * under the `hall/` prefix to avoid key collisions.
 *
 * Public URL comes from R2_PUBLIC_URL (cdn.our.one) — the custom domain
 * bound to the bucket in Cloudflare.
 *
 * Required env vars:
 *  - R2_ACCOUNT_ID
 *  - R2_ACCESS_KEY_ID
 *  - R2_SECRET_ACCESS_KEY
 *  - R2_BUCKET_NAME
 *  - R2_PUBLIC_URL
 */

const ALLOWED_MIME = /^(image\/(png|jpe?g|gif|webp|svg\+xml)|video\/(mp4|webm|quicktime))$/;

const SANITIZE_FILENAME = /[^a-zA-Z0-9._-]+/g;

function sanitizeFilename(name: string): string {
  const cleaned = name.replace(SANITIZE_FILENAME, "-").slice(0, 80);
  return cleaned.length > 0 ? cleaned : "asset";
}

let _r2: S3Client | null = null;

function getR2Client(): S3Client {
  if (_r2) return _r2;
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "R2 env vars missing (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)",
    );
  }
  _r2 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
  return _r2;
}

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

  const bucket = process.env.R2_BUCKET_NAME;
  const publicBase = process.env.R2_PUBLIC_URL;
  if (!bucket || !publicBase) {
    throw new Error("R2_BUCKET_NAME and R2_PUBLIC_URL are required");
  }

  const key = `hall/posts/${generateId()}-${sanitizeFilename(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const r2 = getR2Client();
  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  const url = `${publicBase.replace(/\/$/, "")}/${key}`;
  const sizeBytes = file.size;
  const kind: "image" | "video" = file.type.startsWith("video/") ? "video" : "image";

  const record: NewPostAsset = {
    postId,
    url,
    mimeType: file.type,
    sizeBytes,
    altText,
    uploadedById,
  };

  const db = getDb();
  await db.insert(postAssets).values(record);

  return { url, mimeType: file.type, sizeBytes, kind };
}
