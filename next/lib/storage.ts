// Supabase Storage, driven straight off its REST API.
//
// Server-only: this module reads SUPABASE_SERVICE_ROLE_KEY, which grants full
// storage access and must never reach a client bundle. It is imported solely
// from "use server" action files. (The `server-only` package isn't installed
// here, so this is a convention — do not import this from a client component.)
//
// No @supabase/supabase-js dependency: the project already talks to Postgres
// through Prisma's pg adapter, and the three calls needed here (sign an upload,
// sign a download, delete) are a few lines of fetch each.
//
// The `cvs` bucket MUST be private. Nothing in this module ever produces a
// durable public URL — admins read CVs through short-lived signed links minted
// on the server after an auth check.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const CV_BUCKET = "cvs";

/** Max CV size. Also enforced client-side for a better error, but this is the real limit. */
export const MAX_CV_BYTES = 5 * 1024 * 1024;

export const ALLOWED_CV_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
};

function config() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set to upload or read CVs."
    );
  }
  return { url: SUPABASE_URL.replace(/\/$/, ""), key: SERVICE_ROLE_KEY };
}

function authHeaders(key: string) {
  return {
    Authorization: `Bearer ${key}`,
    apikey: key,
  };
}

/**
 * Mint a one-shot signed URL the browser can PUT the CV directly to.
 *
 * Uploading through a server action instead would hit two ceilings: Next's
 * 1MB server-action body cap and Vercel's 4.5MB request limit. Going straight
 * to storage also keeps the file out of the function's memory entirely.
 */
export async function createSignedUploadUrl(
  objectPath: string
): Promise<{ uploadUrl: string; token: string }> {
  const { url, key } = config();

  const res = await fetch(
    `${url}/storage/v1/object/upload/sign/${CV_BUCKET}/${objectPath}`,
    { method: "POST", headers: authHeaders(key) }
  );

  if (!res.ok) {
    throw new Error(
      `Failed to sign upload (${res.status}): ${await res.text()}`
    );
  }

  const data = (await res.json()) as { url?: string; token?: string };
  if (!data.url) throw new Error("Storage did not return a signed upload URL.");

  return {
    uploadUrl: `${url}/storage/v1${data.url}`,
    token: data.token ?? "",
  };
}

/**
 * Short-lived signed download URL. Callers MUST have verified the session is
 * staff before calling — this function does no auth checking of its own.
 */
export async function createSignedDownloadUrl(
  objectPath: string,
  expiresInSeconds = 60,
  /**
   * Filename to force a save-as instead of rendering in the browser.
   *
   * Storage serves the object with its real content type, so a PDF opens
   * inline by default — which is what you want for reading a CV. Passing a
   * name here adds Content-Disposition: attachment instead.
   */
  downloadAs?: string
): Promise<string> {
  const { url, key } = config();

  const res = await fetch(
    `${url}/storage/v1/object/sign/${CV_BUCKET}/${objectPath}`,
    {
      method: "POST",
      headers: { ...authHeaders(key), "Content-Type": "application/json" },
      body: JSON.stringify({ expiresIn: expiresInSeconds }),
    }
  );

  if (!res.ok) {
    throw new Error(
      `Failed to sign download (${res.status}): ${await res.text()}`
    );
  }

  const data = (await res.json()) as { signedURL?: string; signedUrl?: string };
  const signed = data.signedURL ?? data.signedUrl;
  if (!signed) throw new Error("Storage did not return a signed URL.");

  // The signed path already carries ?token=…, so the flag appends with &.
  const suffix = downloadAs
    ? `&download=${encodeURIComponent(downloadAs)}`
    : "";

  return `${url}/storage/v1${signed}${suffix}`;
}

/**
 * Real size and type of a stored object, read back from storage.
 *
 * The browser's reported file size and MIME type are hints, not facts — a
 * crafted request can claim a 1KB PDF and PUT a 300MB payload. Anything that
 * accepts an upload should confirm it against this.
 */
export async function getObjectInfo(
  objectPath: string
): Promise<{ sizeBytes: number; contentType: string } | null> {
  const { url, key } = config();

  const res = await fetch(`${url}/storage/v1/object/${CV_BUCKET}/${objectPath}`, {
    method: "HEAD",
    headers: authHeaders(key),
  });

  if (!res.ok) return null;

  return {
    sizeBytes: Number(res.headers.get("content-length") ?? 0),
    contentType: (res.headers.get("content-type") ?? "").split(";")[0].trim(),
  };
}

export async function deleteObject(objectPath: string): Promise<void> {
  const { url, key } = config();

  await fetch(`${url}/storage/v1/object/${CV_BUCKET}/${objectPath}`, {
    method: "DELETE",
    headers: authHeaders(key),
  });
}

/**
 * Build the storage key for a CV.
 *
 * The original filename is never used as the key — CV filenames routinely
 * contain the applicant's real name, and object keys leak more easily than
 * table rows. A random id keeps the path unguessable and collision-free; the
 * display name is kept separately in `job_applications.cv_filename`.
 */
export function buildCvPath(jobId: string, ext: string): string {
  const id = crypto.randomUUID();
  return `cv/${jobId}/${id}.${ext}`;
}
