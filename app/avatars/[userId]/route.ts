import { isAllowedPictureType } from "@/lib/picture";
import { getProfileImage } from "@/lib/users";

export async function GET(
  _request: Request,
  context: { params: Promise<{ userId: string }> },
) {
  const { userId } = await context.params;
  const image = getProfileImage(userId);
  if (!image || !isAllowedPictureType(image.type)) {
    return new Response(null, { status: 404 });
  }

  return new Response(Buffer.from(image.bytes), {
    headers: {
      "Content-Type": image.type,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-cache",
    },
  });
}
