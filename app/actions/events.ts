"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/current-user";
import { deleteEvent } from "@/lib/events";

export async function deleteOwnEvent(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    return;
  }

  const eventId = formData.get("eventId");
  if (typeof eventId !== "string" || !eventId) {
    return;
  }

  deleteEvent(user.id, eventId);
  revalidatePath(`/${encodeURIComponent(user.username)}`);
}
