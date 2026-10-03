import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Slotly",
  description:
    "Slotly is a scheduling site where you share a link and someone books a time on your calendar.",
};

const steps = [
  {
    title: "Set your hours",
    body: "Choose the times you are free to meet.",
  },
  {
    title: "Share the link",
    body: "Send one link. There is no email thread to schedule.",
  },
  {
    title: "They book",
    body: "They pick an open slot, and it lands on your calendar.",
  },
] as const;

const productParts = [
  {
    title: "A public booking page",
    body: "One page, with your open times, that anyone with the link can use.",
  },
  {
    title: "Your availability",
    body: "The hours you set are the only hours they can pick.",
  },
  {
    title: "A calendar connection",
    body: "The slot they choose is added to your calendar.",
  },
] as const;

const openSlots = ["Tue · 10:00", "Tue · 10:30", "Tue · 11:00"] as const;

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-white font-sans text-[#171717]">
      <header className="mx-auto flex w-full max-w-6xl items-center px-6 py-5">
        <p className="text-base font-semibold tracking-tight">Slotly</p>
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-6xl items-start gap-10 px-6 pb-16 lg:grid-cols-[minmax(0,1fr)_320px] lg:pb-20">
          <div className="max-w-xl">
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl sm:leading-[1.1]">
              Book a time without the email thread.
            </h1>
            <p className="mt-4 max-w-md text-lg leading-7 text-[#292929]">
              You share one link, they pick an open slot, and it lands on your
              calendar.
            </p>
            <a
              href="#how-it-works"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#111111] px-6 text-base font-medium text-white"
            >
              See how it works
            </a>
          </div>

          <div
            aria-hidden="true"
            className="w-full rounded-2xl border border-[#e4e4e7] bg-[#fafafa] p-5"
          >
            <p className="text-sm font-medium text-[#3f3f46]">Booking page</p>
            <p className="mt-1 text-lg font-semibold tracking-tight">30 min</p>
            <p className="mt-4 text-xs font-medium tracking-wide text-[#3f3f46] uppercase">
              Open slots
            </p>
            <ul className="mt-2 space-y-2">
              {openSlots.map((slot, index) => (
                <li
                  key={slot}
                  className={
                    index === 0
                      ? "rounded-lg bg-[#111111] px-3 py-2 text-sm font-medium text-white"
                      : "rounded-lg border border-[#e4e4e7] bg-white px-3 py-2 text-sm text-[#171717]"
                  }
                >
                  {slot}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          aria-labelledby="problem-heading"
          className="border-y border-[#ececee] bg-[#f6f6f7]"
        >
          <div className="mx-auto w-full max-w-6xl px-6 py-10">
            <h2
              id="problem-heading"
              className="text-2xl font-semibold tracking-tight"
            >
              Replace the calendar back-and-forth.
            </h2>
            <p className="mt-2 max-w-2xl text-base leading-7 text-[#292929]">
              The messages that ask which day works, then which hour, then
              start over. One link takes their place.
            </p>
          </div>
        </section>

        <section
          id="how-it-works"
          aria-labelledby="steps-heading"
          className="mx-auto w-full max-w-6xl scroll-mt-6 px-6 py-16"
        >
          <h2
            id="steps-heading"
            className="text-2xl font-semibold tracking-tight"
          >
            How it works
          </h2>
          <ol className="mt-8 grid gap-8 sm:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title}>
                <p className="text-sm font-medium text-[#3f3f46]">
                  {index + 1}
                </p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-base leading-7 text-[#292929]">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-labelledby="product-heading"
          className="border-t border-[#ececee]"
        >
          <div className="mx-auto w-full max-w-6xl px-6 py-16">
            <h2
              id="product-heading"
              className="text-2xl font-semibold tracking-tight"
            >
              The product
            </h2>
            <ul className="mt-8 grid gap-8 sm:grid-cols-3">
              {productParts.map((part) => (
                <li key={part.title}>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {part.title}
                  </h3>
                  <p className="mt-2 text-base leading-7 text-[#292929]">
                    {part.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          aria-labelledby="close-heading"
          className="border-t border-[#ececee]"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start px-6 py-16">
            <h2
              id="close-heading"
              className="text-2xl font-semibold tracking-tight"
            >
              Share the link.
            </h2>
            <p className="mt-2 max-w-xl text-base leading-7 text-[#292929]">
              They pick an open slot, and it lands on your calendar.
            </p>
            <a
              href="#how-it-works"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#111111] px-6 text-base font-medium text-white"
            >
              See how it works
            </a>
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t border-[#ececee]">
        <div className="mx-auto w-full max-w-6xl px-6 py-8">
          <p className="text-base font-semibold tracking-tight">Slotly</p>
        </div>
      </footer>
    </div>
  );
}
