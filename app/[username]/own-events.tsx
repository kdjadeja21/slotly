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
    <section className="rounded-[28px] border border-line bg-card p-6 shadow-[var(--shadow)] sm:p-8">
      <h2 className="font-display text-3xl tracking-tight text-ink">Events</h2>
      <ul className="mt-5 flex flex-col gap-3">
        {result.events.map((event) => (
          <li
            key={event.id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-paper px-4 py-3"
          >
            <span className="truncate font-mono text-sm text-ink">{event.id}</span>
            <form action={deleteOwnEvent}>
              <input type="hidden" name="eventId" value={event.id} />
              <button
                type="submit"
                className="inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-sm font-medium text-ink transition hover:border-danger/40 hover:text-danger"
              >
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
    </section>
  );
}
