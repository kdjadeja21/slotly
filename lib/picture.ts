const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_BYTES = 1_000_000;

export type ProfilePicture = {
  bytes: Uint8Array;
  type: string;
};

export function isAllowedPictureType(type: string) {
  return ALLOWED_TYPES.has(type);
}

export async function readPicture(
  value: FormDataEntryValue | null,
): Promise<
  { ok: true; picture: ProfilePicture | null } | { ok: false; error: string }
> {
  if (!(value instanceof File) || value.size === 0) {
    return { ok: true, picture: null };
  }

  if (value.size > MAX_BYTES) {
    return { ok: false, error: "Profile picture is too large." };
  }

  if (!isAllowedPictureType(value.type)) {
    return { ok: false, error: "Profile picture must be an image." };
  }

  return {
    ok: true,
    picture: {
      bytes: new Uint8Array(await value.arrayBuffer()),
      type: value.type,
    },
  };
}
