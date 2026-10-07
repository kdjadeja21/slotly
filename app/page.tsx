const steps = [
  {
    title: "Set your hours",
    body: "Choose the days and times you are open to be booked.",
  },
  {
    title: "Share the link",
    body: "Send one link instead of a list of times.",
  },
  {
    title: "They book",
    body: "They pick an open slot and it lands on your calendar.",
  },
];

const product = [
  {
    title: "A public booking page",
    body: "One link where anyone can see your open slots and pick one.",
  },
  {
    title: "Your availability",
    body: "Set the hours you can be booked. Only open times are shown.",
  },
  {
    title: "A calendar connection",
    body: "Booked times land on your calendar.",
  },
];

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700";

const primaryButton = `inline-flex h-12 items-center justify-center rounded-lg bg-indigo-700 px-6 text-base font-semibold text-white transition-colors hover:bg-indigo-800 ${focusRing}`;

export default function Home() {
  return (
    <>
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <a
          href="#top"
          className={`rounded text-lg font-bold tracking-tight text-zinc-900 ${focusRing}`}
        >
          Slotly
        </a>
      </header>

      <main id="top" className="flex-1 text-zinc-900">
        <section className="mx-auto w-full max-w-5xl px-6 pb-16 pt-10 sm:pt-16">
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Book a time without the email thread.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-700">
            Share one link. They pick an open slot. It lands on your calendar.
          </p>
          <div className="mt-8">
            <a href="#how-it-works" className={primaryButton}>
              See how it works
            </a>
          </div>
        </section>

        <section className="bg-zinc-100">
          <div className="mx-auto w-full max-w-5xl px-6 py-14">
            <h2 className="max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
              Scheduling should not take ten emails.
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-700">
              &ldquo;Does Tuesday work?&rdquo; &ldquo;How about Thursday
              instead?&rdquo; Calendar back-and-forth is what Slotly replaces.
            </p>
          </div>
        </section>

        <section
          id="how-it-works"
          className="mx-auto w-full max-w-5xl scroll-mt-4 px-6 py-16"
        >
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            How it works
          </h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-xl border border-zinc-300 p-6"
              >
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-700 text-sm font-bold text-white"
                >
                  {index + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-zinc-700">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="bg-zinc-100">
          <div className="mx-auto w-full max-w-5xl px-6 py-16">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              The product
            </h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-3">
              {product.map((item) => (
                <li
                  key={item.title}
                  className="rounded-xl border border-zinc-300 bg-white p-6"
                >
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-zinc-700">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl px-6 py-20">
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Share one link. Get booked.
          </h2>
          <div className="mt-8">
            <a href="#how-it-works" className={primaryButton}>
              See how it works
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-300">
        <div className="mx-auto w-full max-w-5xl px-6 py-8 text-sm text-zinc-700">
          <p className="font-semibold text-zinc-900">Slotly</p>
          <p className="mt-1">Share a link. Get booked.</p>
        </div>
      </footer>
    </>
  );
}
