import { BookingDemo } from "@/app/booking-demo";
import Link from "next/link";
import { getCurrentUser } from "@/lib/current-user";

const actionClassName =
  "inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 text-base font-semibold text-on-accent hover:bg-accent-strong";

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
  const today = new Date();

  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto grid w-full max-w-5xl items-center gap-6 px-5 pt-8 pb-4 sm:gap-10 sm:py-14 lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-12 lg:py-8">
        <div className="max-w-[38rem]">
          <h1 className="text-[clamp(2.5rem,4.6vw,3.75rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-foreground">
            Share a link. They book the time.
          </h1>
          <p className="mt-4 max-w-[42ch] text-lg leading-relaxed text-pretty text-muted">
            Slotly is a scheduling app. You share one link, and someone books a
            time with you.
          </p>
          <div className="mt-7 flex flex-col items-start gap-3">
            {username ? (
              <p className="max-w-[34ch] text-base break-words text-muted">
                Signed in as {username}.
              </p>
            ) : null}
            <StartLink username={username} />
          </div>
        </div>
        <BookingDemo
          year={today.getFullYear()}
          month={today.getMonth() + 1}
          day={today.getDate()}
        />
      </section>

      <section className="mx-auto w-full max-w-5xl px-5 py-16 sm:py-20">
        <h2 className="max-w-[16ch] text-[clamp(2rem,3.4vw,2.75rem)] leading-[1.1] font-semibold tracking-[-0.03em] text-balance">
          Leave the thread
        </h2>
        <p className="mt-4 max-w-[68ch] text-lg leading-relaxed text-pretty text-muted">
          Finding a time by writing back and forth takes another reply. One
          link replaces that thread.
        </p>
      </section>

      <section className="mx-auto w-full max-w-5xl px-5 pb-16 sm:pb-20">
        <h2 className="text-[clamp(2rem,3.4vw,2.75rem)] leading-[1.1] font-semibold tracking-[-0.03em]">
          How it works
        </h2>
        <ol className="mt-8 list-decimal pl-6">
          <li className="border-t border-line py-5 pl-2">
            <h3 className="text-2xl font-semibold tracking-tight">
              Share your link
            </h3>
            <p className="mt-2 max-w-[68ch] text-lg text-muted">
              Send one link instead of a thread.
            </p>
          </li>
          <li className="border-t border-line py-5 pl-2">
            <h3 className="text-2xl font-semibold tracking-tight">
              They pick a time
            </h3>
            <p className="mt-2 max-w-[68ch] text-lg text-muted">
              Someone opens the link and chooses a time with you.
            </p>
          </li>
          <li className="border-y border-line py-5 pl-2">
            <h3 className="text-2xl font-semibold tracking-tight">
              The thread stops
            </h3>
            <p className="mt-2 max-w-[68ch] text-lg text-muted">
              The time is set, so there is no reply left to write.
            </p>
          </li>
        </ol>
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col items-start gap-6 px-5 pt-4 pb-8 sm:pt-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-[clamp(2rem,3.4vw,2.75rem)] leading-[1.1] font-semibold tracking-[-0.03em]">
            Send the link
          </h2>
          <p className="mt-3 max-w-[36ch] text-lg text-muted">
            They book a time with you.
          </p>
        </div>
        <StartLink username={username} />
      </section>

      <footer className="mx-auto w-full max-w-5xl border-t border-line px-5 pt-8 pb-12">
        <p className="text-lg font-semibold tracking-tight">Slotly</p>
      </footer>
    </main>
  );
}
