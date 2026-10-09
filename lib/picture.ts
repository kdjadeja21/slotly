const MAX_BYTES = 2 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export type Picture = {
  bytes: Buffer;
  type: string;
};

export type PictureResult =
  | { ok: true; picture: Picture | null }
  | { ok: false; error: string };

export function pictureTypeError(): string {
  return "Profile picture must be a JPEG, PNG, WebP, or GIF.";
}

export function pictureSizeError(): string {
  return "Profile picture must be 2 MB or smaller.";
}

export async function readPicture(formData: FormData): Promise<PictureResult> {
  const value = formData.get("picture");
  if (!(value instanceof File) || value.size === 0) {
    return { ok: true, picture: null };
  }

  if (!ALLOWED_TYPES.has(value.type)) {
    return { ok: false, error: pictureTypeError() };
  }

  if (value.size > MAX_BYTES) {
    return { ok: false, error: pictureSizeError() };
  }

  const bytes = Buffer.from(await value.arrayBuffer());
  return { ok: true, picture: { bytes, type: value.type } };
}
