"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { deleteEvent } from "@/lib/events";

export async function deleteOwnEvent(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const eventId = formData.get("eventId");
  if (typeof eventId !== "string" || eventId === "") {
    return;
  }

  const result = deleteEvent(user.id, eventId);
  if (!result.ok) {
    return;
  }

  revalidatePath(`/${user.username}`);
}
