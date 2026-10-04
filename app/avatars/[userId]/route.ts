import { getPicture } from "@/lib/users";

export async function GET(
  _request: Request,
  context: { params: Promise<{ userId: string }> },
) {
  const { userId } = await context.params;
  const picture = getPicture(userId);
  if (!picture) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(Buffer.from(picture.bytes), {
    headers: {
      "Content-Type": picture.type,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
