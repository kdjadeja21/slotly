function PrimaryLink({
  children,
  tone,
}: {
  children: string;
  tone: "ink" | "paper";
}) {
  const toneClassName =
    tone === "ink"
      ? "focus-tone-ink bg-foreground text-background hover:bg-[#2c2924]"
      : "focus-tone-paper bg-background text-foreground hover:bg-[#fffdf8]";

  return (
    <a
      href="#how-it-works"
      className={`inline-flex h-12 w-fit items-center self-start rounded-full px-6 text-[15px] font-medium transition-colors ${toneClassName}`}
    >
      {children}
    </a>
  );
}

const steps = [
  {
    number: "01",
    title: "Set your hours",
    body: "You decide which times can be booked.",
  },
  {
    number: "02",
    title: "Share the link",
    body: "One URL. Send it the way you already talk to them.",
  },
  {
    number: "03",
    title: "They book",
    body: "They pick an open slot. It lands on your calendar.",
  },
] as const;

const thread = [
  "Does Tuesday at 2 still work?",
  "I can do Thursday after 3.",
  "Sorry, that slot just went.",
] as const;

const slots = ["9:00", "9:30", "10:00", "10:30", "11:00", "1:00"] as const;

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <main className="flex-1">
        <section className="border-b border-line">
          <div className="mx-auto flex max-w-5xl flex-col px-5 pt-14 pb-16 sm:pt-20 sm:pb-20">
            <p className="text-sm font-medium tracking-wide text-accent">
              Slotly
            </p>
            <h1 className="mt-5 max-w-[12ch] text-[2.6rem] leading-[1.02] font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              Book the meeting without the email thread.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-7 text-muted">
              You share one link. They pick an open slot. It lands on your
              calendar.
            </p>
            <div className="mt-8">
              <PrimaryLink tone="ink">See how it works</PrimaryLink>
            </div>
          </div>
        </section>

        <section className="border-b border-line" aria-labelledby="problem">
          <div className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
            <h2
              id="problem"
              className="max-w-xl text-3xl leading-tight font-semibold tracking-tight sm:text-4xl"
            >
              The calendar back-and-forth.
            </h2>
            <ul className="mt-8 grid gap-3 sm:grid-cols-3">
              {thread.map((line) => (
                <li
                  key={line}
                  className="rounded-2xl border border-line bg-card px-4 py-4 text-base leading-6 text-muted"
                >
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="how-it-works"
          className="scroll-mt-8 border-b border-line"
          aria-labelledby="how"
        >
          <div className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
            <h2
              id="how"
              className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl"
            >
              How it works
            </h2>
            <ol className="mt-10 grid gap-10 sm:grid-cols-3">
              {steps.map((step) => (
                <li key={step.number}>
                  <p className="text-sm font-medium tracking-widest text-accent">
                    {step.number}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-base leading-7 text-muted">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-b border-line" aria-labelledby="product">
          <div className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
            <h2
              id="product"
              className="max-w-xl text-3xl leading-tight font-semibold tracking-tight sm:text-4xl"
            >
              A public page, your hours, your calendar.
            </h2>
            <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <article className="rounded-3xl border border-line bg-card p-5 sm:p-6">
                <h3 className="text-lg font-semibold tracking-tight">
                  Public booking page
                </h3>
                <p className="mt-1 text-sm leading-6 text-muted">30 minutes</p>
                <div
                  className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3"
                  aria-hidden="true"
                >
                  {slots.map((slot) => (
                    <span
                      key={slot}
                      className="rounded-xl border border-line px-3 py-3 text-center text-sm"
                    >
                      {slot}
                    </span>
                  ))}
                </div>
              </article>
              <div className="grid gap-4">
                <article className="rounded-3xl border border-line bg-card p-5 sm:p-6">
                  <h3 className="text-lg font-semibold tracking-tight">
                    Your availability
                  </h3>
                  <p className="mt-2 text-base leading-7 text-muted">
                    Weekdays, 9:00 to 5:00. You set the hours.
                  </p>
                </article>
                <article className="rounded-3xl border border-line bg-card p-5 sm:p-6">
                  <h3 className="text-lg font-semibold tracking-tight">
                    Calendar connection
                  </h3>
                  <p className="mt-2 text-base leading-7 text-muted">
                    The open slot they pick lands on your calendar.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-foreground text-background" aria-labelledby="close">
          <div className="mx-auto flex max-w-5xl flex-col gap-8 px-5 py-16 sm:py-20">
            <h2
              id="close"
              className="max-w-[14ch] text-3xl leading-tight font-semibold tracking-tight sm:text-5xl"
            >
              Share one link.
            </h2>
            <PrimaryLink tone="paper">See how it works</PrimaryLink>
          </div>
        </section>
      </main>
      <footer className="border-t border-line">
        <p className="mx-auto max-w-5xl px-5 py-6 text-sm font-medium">
          Slotly
        </p>
      </footer>
    </div>
  );
}
