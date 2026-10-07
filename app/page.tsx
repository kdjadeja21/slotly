const primaryLinkClassName =
  "inline-flex items-center justify-center rounded-full bg-foreground px-5 py-3 text-base font-medium text-background outline-offset-4 focus-visible:outline-2 focus-visible:outline-foreground";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <main>
        <section className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center px-6 py-10">
          <p className="text-sm font-medium tracking-wide">Slotly</p>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Book a time without the email thread.
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-7 text-neutral-700 dark:text-neutral-300">
            You share one link. They pick an open slot. It lands on your
            calendar.
          </p>
          <a href="#how-it-works" className={`${primaryLinkClassName} mt-8 w-fit`}>
            See how it works
          </a>
        </section>

        <section className="border-y border-neutral-200 dark:border-neutral-800">
          <p className="mx-auto max-w-3xl px-6 py-8 text-lg leading-7 text-neutral-700 dark:text-neutral-300">
            It replaces the calendar back-and-forth.
          </p>
        </section>

        <section
          id="how-it-works"
          className="mx-auto w-full max-w-3xl scroll-mt-8 px-6 py-16"
        >
          <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
          <ol className="mt-8 grid gap-8 sm:grid-cols-3">
            <li>
              <h3 className="text-lg font-medium">Set your hours</h3>
              <p className="mt-2 text-neutral-700 dark:text-neutral-300">
                Choose when you can meet.
              </p>
            </li>
            <li>
              <h3 className="text-lg font-medium">Share the link</h3>
              <p className="mt-2 text-neutral-700 dark:text-neutral-300">
                Send one link instead of a thread.
              </p>
            </li>
            <li>
              <h3 className="text-lg font-medium">They book</h3>
              <p className="mt-2 text-neutral-700 dark:text-neutral-300">
                They pick an open slot.
              </p>
            </li>
          </ol>
        </section>

        <section className="border-t border-neutral-200 dark:border-neutral-800">
          <div className="mx-auto w-full max-w-3xl px-6 py-16">
            <h2 className="text-2xl font-semibold tracking-tight">The product</h2>
            <ul className="mt-8 grid gap-4">
              <li className="text-lg">A public booking page</li>
              <li className="text-lg">Your availability</li>
              <li className="text-lg">A calendar connection</li>
            </ul>
          </div>
        </section>

        <section className="border-t border-neutral-200 dark:border-neutral-800">
          <div className="mx-auto flex w-full max-w-3xl flex-col items-start px-6 py-16">
            <h2 className="text-2xl font-semibold tracking-tight">
              Share one link
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-7 text-neutral-700 dark:text-neutral-300">
              They pick an open slot, and it lands on your calendar.
            </p>
            <a
              href="#how-it-works"
              className={`${primaryLinkClassName} mt-8`}
            >
              See how it works
            </a>
          </div>
        </section>
      </main>
      <footer className="border-t border-neutral-200 px-6 py-8 dark:border-neutral-800">
        <p className="mx-auto max-w-3xl text-sm font-medium">Slotly</p>
      </footer>
    </div>
  );
}
