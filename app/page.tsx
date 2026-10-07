const primaryControlClassName =
  "inline-flex min-h-11 w-fit items-center justify-center rounded-full bg-primary px-6 text-[0.9375rem] font-medium text-on-primary motion-safe:transition-[background-color] motion-safe:duration-150 motion-safe:ease-out hover:bg-primary-hover";

const containerClassName = "mx-auto w-full min-w-0 max-w-6xl px-6";

const steps = [
  {
    title: "Set your hours",
    body: "Choose the times you can meet.",
  },
  {
    title: "Share the link",
    body: "Send one link instead of a thread of emails.",
  },
  {
    title: "They book",
    body: "They pick an open slot, and it lands on your calendar.",
  },
] as const;

const products = [
  {
    title: "A public booking page",
    body: "One page lists your open slots.",
  },
  {
    title: "Your availability",
    body: "The hours you set are the slots they can pick.",
  },
  {
    title: "A calendar connection",
    body: "The booked time lands on your calendar.",
  },
] as const;

const problemLabels = ["Pick a day", "Lose the time", "Write again"] as const;

const bookingDays = [
  {
    day: "Mon",
    slots: [
      { time: "9:00", dateTime: "09:00", open: false },
      { time: "9:30", dateTime: "09:30", open: true },
    ],
  },
  {
    day: "Tue",
    slots: [
      { time: "9:00", dateTime: "09:00", open: false },
      { time: "9:30", dateTime: "09:30", open: false },
    ],
  },
  {
    day: "Wed",
    slots: [
      { time: "9:00", dateTime: "09:00", open: false },
      { time: "9:30", dateTime: "09:30", open: false },
    ],
  },
] as const;

function PrimaryControl() {
  return (
    <a href="#how-it-works" className={primaryControlClassName}>
      See how it works
    </a>
  );
}

function BookingFigure() {
  return (
    <figure className="min-w-0 w-full max-w-full">
      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_1px_1px_rgba(28,25,23,0.04),0_20px_40px_-24px_rgba(28,25,23,0.28)]">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-5">
          <p className="text-sm font-medium text-headline">Your booking page</p>
          <span
            className="size-2 shrink-0 rounded-full bg-slot"
            aria-hidden="true"
          />
        </div>
        <div className="grid grid-cols-3 gap-2 p-4 sm:gap-3 sm:p-5">
          {bookingDays.map((column) => (
            <div key={column.day} className="min-w-0">
              <p className="border-b border-line pb-2 text-center text-xs font-medium text-foreground">
                {column.day}
              </p>
              <div className="mt-2 flex flex-col gap-2">
                {column.slots.map((slot) => (
                  <div
                    key={`${column.day}-${slot.time}`}
                    className={
                      slot.open
                        ? "flex min-h-16 flex-col items-center justify-center rounded-lg border-2 border-slot bg-background px-1 py-2 text-center"
                        : "flex min-h-16 flex-col items-center justify-center rounded-lg border-2 border-line bg-surface px-1 py-2 text-center"
                    }
                  >
                    <time
                      dateTime={slot.dateTime}
                      className="text-sm font-medium tabular-nums text-headline"
                    >
                      {slot.time}
                    </time>
                    {slot.open ? (
                      <span className="text-xs font-medium text-headline">
                        Open
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="border-t border-line px-4 py-3.5 text-sm text-foreground sm:px-5">
          Lands on your calendar
        </p>
      </div>
      <figcaption className="mt-3 text-sm leading-6 text-foreground">
        A public booking page showing open slots on your calendar.
      </figcaption>
    </figure>
  );
}

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="absolute left-6 top-4 z-10 inline-flex min-h-11 w-fit -translate-y-[calc(100%+2rem)] items-center rounded-full bg-primary px-4 text-sm font-medium text-on-primary focus-visible:static focus-visible:m-4 focus-visible:w-fit focus-visible:self-start focus-visible:translate-none"
      >
        Skip to content
      </a>
      <main id="main" className="flex-1">
        <section className={`${containerClassName} pb-20 pt-10 xl:pb-28 xl:pt-14`}>
          <div className="grid min-w-0 grid-cols-1 items-start gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] xl:gap-x-16">
            <div className="min-w-0 max-w-xl">
              <p className="text-sm font-semibold tracking-tight text-headline">
                Slotly
              </p>
              <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight text-balance text-headline xl:text-6xl">
                Book a time without the email thread.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-7 text-foreground">
                You share one link. They pick an open slot. It lands on your
                calendar.
              </p>
              <div className="mt-8">
                <PrimaryControl />
              </div>
            </div>
            <BookingFigure />
          </div>
        </section>

        <section className="border-t border-line" aria-labelledby="problem-title">
          <div className={`${containerClassName} py-20 xl:py-28`}>
            <div className="grid gap-8 xl:grid-cols-12 xl:gap-16">
              <h2
                id="problem-title"
                className="text-3xl font-medium leading-tight tracking-tight text-balance text-headline xl:col-span-5 xl:text-4xl"
              >
                Calendar back-and-forth.
              </h2>
              <div className="min-w-0 xl:col-span-7">
                <p className="max-w-xl text-lg leading-7 text-foreground xl:pt-1">
                  Scheduling turns into a chain of messages about which day and
                  which time still works.
                </p>
                <ul className="mt-10 grid grid-cols-1 border-t border-line sm:grid-cols-3">
                  {problemLabels.map((label) => (
                    <li
                      key={label}
                      className="border-b border-line py-4 text-sm font-medium text-headline sm:border-b-0 sm:border-r sm:px-4 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0"
                    >
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="scroll-mt-8 border-t border-line"
          aria-labelledby="how-it-works-title"
        >
          <div className={`${containerClassName} py-20 xl:py-28`}>
            <h2
              id="how-it-works-title"
              className="text-3xl font-medium tracking-tight text-headline xl:text-4xl"
            >
              How it works
            </h2>
            <ol className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
              {steps.map((step) => (
                <li key={step.title} className="min-w-0 border-t-2 border-headline pt-6">
                  <h3 className="text-xl font-medium tracking-tight text-headline">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-xs text-base leading-7 text-foreground">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-line" aria-labelledby="product-title">
          <div className={`${containerClassName} py-20 xl:py-28`}>
            <h2
              id="product-title"
              className="text-3xl font-medium tracking-tight text-headline xl:text-4xl"
            >
              The product
            </h2>
            <ul className="mt-14 border-t border-line">
              {products.map((item) => (
                <li
                  key={item.title}
                  className="grid gap-3 border-b border-line py-8 md:grid-cols-12 md:items-baseline md:gap-8"
                >
                  <h3 className="text-xl font-medium tracking-tight text-headline md:col-span-5">
                    {item.title}
                  </h3>
                  <p className="max-w-xl text-base leading-7 text-foreground md:col-span-7">
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-line" aria-labelledby="closing-title">
          <div className={`${containerClassName} py-20 xl:py-28`}>
            <h2
              id="closing-title"
              className="max-w-3xl text-4xl font-medium leading-[1.1] tracking-tight text-balance text-headline xl:text-5xl"
            >
              Share one link.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-7 text-foreground">
              They pick an open slot. It lands on your calendar.
            </p>
            <div className="mt-8">
              <PrimaryControl />
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-line">
        <div className={`${containerClassName} py-8`}>
          <p className="text-sm font-medium text-headline">Slotly</p>
        </div>
      </footer>
    </>
  );
}
