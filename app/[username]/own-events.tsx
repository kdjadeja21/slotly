import { deleteOwnEvent } from "@/app/actions/events";
import { getCurrentUser } from "@/lib/current-user";
import { listManagedEvents } from "@/lib/events";

export async function OwnEvents() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const result = listManagedEvents(user.id, user.id);
  if (!result.ok || result.events.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold">Events</h2>
      <ul className="flex flex-col gap-2">
        {result.events.map((event) => (
          <li key={event.id}>
            <form action={deleteOwnEvent}>
              <input type="hidden" name="eventId" value={event.id} />
              <button type="submit">Delete</button>
            </form>
          </li>
        ))}
      </ul>
    </section>
  );
}
