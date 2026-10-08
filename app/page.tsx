import Link from "next/link";
import { getCurrentUser } from "@/lib/current-user";

const sampleTimes = [
  { day: "Tuesday", time: "10:00", label: "10:00 AM" },
  { day: "Tuesday", time: "10:30", label: "10:30 AM" },
  { day: "Tuesday", time: "11:00", label: "11:00 AM" },
  { day: "Wednesday", time: "14:00", label: "2:00 PM" },
] as const;

const actionClassName =
  "ticket-action inline-flex h-12 items-center justify-center bg-claim px-6 font-display text-lg uppercase tracking-wide text-ticket hover:bg-ink";

function StartLink({ username }: { username: string | null }) {
  if (username) {
    return (
      <Link
        href={`/${encodeURIComponent(username)}`}
        className={actionClassName}
      >
        Your profile
      </Link>
    );
  }

  return (
    <Link href="/sign-up" className={actionClassName}>
      Get started
    </Link>
  );
}

export default async function Home() {
  const user = await getCurrentUser();
  const username = user?.username ?? null;

  return (
    <main className="counter-scene flex flex-1 flex-col text-cream">
      <section className="mx-auto flex w-full max-w-5xl flex-col px-5 pt-8 pb-16 sm:pt-12 lg:min-h-[calc(100svh-4.5rem)] lg:py-10">
        <article className="ticket grid flex-1 grid-cols-1 lg:h-full lg:grid-cols-[minmax(0,1.1fr)_1.35rem_minmax(0,0.9fr)] lg:grid-rows-[auto_1fr]">
          <div className="order-1 px-6 pt-7 sm:px-8 sm:pt-9 lg:col-start-1 lg:row-start-1 lg:px-10 lg:pt-11">
            <div className="h-2 w-16 bg-ink" aria-hidden="true" />
            <h1 className="mt-6 font-display text-[clamp(2.6rem,4.8vw,4.15rem)] leading-[0.92] font-medium tracking-[-0.02em] text-ink">
              <span className="block">Share a link.</span>
              <span className="block">They book the time.</span>
            </h1>
            <p className="mt-5 max-w-[36ch] text-lg leading-snug text-pretty text-ink">
              Slotly is a scheduling app. You share one link, and someone books
              a time with you.
            </p>
          </div>

          <div
            className="ticket-perf ticket-perf-x order-2 lg:hidden"
            aria-hidden="true"
          />
          <div
            className="ticket-perf ticket-perf-y hidden lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:block"
            aria-hidden="true"
          />

          <div className="claim-half order-3 px-6 py-6 sm:px-8 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:flex lg:h-full lg:flex-col lg:justify-center lg:px-8 lg:py-11">
            <p className="sample-stamp">Sample</p>
            <p className="mt-4 font-display text-4xl leading-none tracking-[-0.02em] text-ink">
              /your-name
            </p>
            <p className="mt-3 max-w-[28ch] text-base font-bold text-ink">
              Not a live calendar. These times are printed as a sample.
            </p>
            <ul className="mt-5">
              {sampleTimes.map((slot) => (
                <li
                  key={`${slot.day}-${slot.time}`}
                  className="flex items-baseline justify-between gap-4 border-b border-dashed border-ink/35 py-1.5 font-display text-xl tracking-[-0.02em] text-ink"
                >
                  <span>{slot.day}</span>
                  <time dateTime={slot.time} className="tabular-nums">
                    {slot.label}
                  </time>
                </li>
              ))}
            </ul>
          </div>

          <div className="order-4 flex flex-col items-start gap-3 px-6 pt-2 pb-7 sm:px-8 sm:pb-9 lg:col-start-1 lg:row-start-2 lg:h-full lg:justify-end lg:px-10 lg:pt-8 lg:pb-11">
            {username ? (
              <p className="max-w-[34ch] text-base break-words text-ink">
                Signed in as {username}.
              </p>
            ) : null}
            <StartLink username={username} />
          </div>
        </article>
      </section>

      <section className="mx-auto w-full max-w-5xl px-5 py-16 sm:py-20">
        <h2 className="max-w-[16ch] font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-[0.95] tracking-[-0.02em] text-balance">
          Leave the thread
        </h2>
        <p className="mt-4 max-w-[68ch] text-lg leading-relaxed text-pretty text-cream">
          Finding a time by writing back and forth takes another reply. One
          link replaces that thread.
        </p>
      </section>

      <section className="mx-auto w-full max-w-5xl px-5 pb-16 sm:pb-20">
        <div className="ticket px-6 py-8 sm:px-10 sm:py-12">
          <h2 className="font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-[0.95] tracking-[-0.02em] text-ink">
            How it works
          </h2>
          <ol className="mt-8 list-none">
            <li className="border-t border-dashed border-ink/35 py-5">
              <h3 className="font-display text-3xl leading-none tracking-[-0.02em] text-ink">
                Share your link
              </h3>
              <p className="mt-2 max-w-[68ch] text-lg text-ink">
                Send one link instead of a thread.
              </p>
            </li>
            <li className="border-t border-dashed border-ink/35 py-5">
              <h3 className="font-display text-3xl leading-none tracking-[-0.02em] text-ink">
                They pick a time
              </h3>
              <p className="mt-2 max-w-[68ch] text-lg text-ink">
                Someone opens the link and chooses a time with you.
              </p>
            </li>
            <li className="border-y border-dashed border-ink/35 py-5">
              <h3 className="font-display text-3xl leading-none tracking-[-0.02em] text-ink">
                The thread stops
              </h3>
              <p className="mt-2 max-w-[68ch] text-lg text-ink">
                The time is set, so there is no reply left to write.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-5 pt-4 pb-8 sm:pt-8">
        <div className="ticket flex flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[28ch]">
            <h2 className="font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-[0.95] tracking-[-0.02em] text-ink">
              Send the link
            </h2>
            <p className="mt-3 text-lg text-ink">They book a time with you.</p>
          </div>
          <StartLink username={username} />
        </div>
      </section>

      <footer className="mx-auto w-full max-w-5xl px-5 pt-10 pb-12">
        <p className="font-display text-3xl tracking-[-0.02em] text-cream">
          Slotly
        </p>
      </footer>
    </main>
  );
}
