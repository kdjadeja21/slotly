import Link from "next/link";
import { Button } from "@/components/ui/button";

const offer =
  "Slotly is a scheduling site where you share a link and someone books a time on your calendar.";

const primaryClassName = "min-h-11 rounded-full px-5 transition-colors";

function GetStarted() {
  return (
    <Button asChild className={primaryClassName}>
      <Link href="/sign-up">Get started</Link>
    </Button>
  );
}

export default function Home() {
  return (
    <>
      <main className="min-w-0">
        <section className="relative">
          <div
            aria-hidden="true"
            className="hero-wash pointer-events-none absolute inset-0"
          />
          <div className="relative mx-auto flex min-w-0 max-w-5xl flex-col items-start gap-6 px-6 pt-10 pb-12">
            <h1 className="max-w-xl text-balance text-4xl font-semibold tracking-tight">
              You share one link.
            </h1>
            <p className="max-w-xl text-pretty text-base leading-relaxed">
              {offer}
            </p>
            <GetStarted />
          </div>
        </section>

        <section className="border-y border-border bg-muted">
          <div className="mx-auto min-w-0 max-w-5xl px-6 py-8">
            <h2 className="text-balance text-2xl font-semibold tracking-tight">
              Calendar back-and-forth.
            </h2>
          </div>
        </section>

        <section className="mx-auto min-w-0 max-w-5xl px-6 py-16">
          <h2 className="text-balance text-2xl font-semibold tracking-tight">
            How it works
          </h2>
          <ol className="mt-8 grid min-w-0 gap-8 sm:grid-cols-3">
            <li className="min-w-0 border-t border-border pt-4">
              <h3 className="text-lg font-medium">Set your hours</h3>
            </li>
            <li className="min-w-0 border-t border-border pt-4">
              <h3 className="text-lg font-medium">Share the link</h3>
            </li>
            <li className="min-w-0 border-t border-border pt-4">
              <h3 className="text-lg font-medium">They book</h3>
              <p className="mt-2 text-pretty text-base leading-relaxed">
                The other person picks an open slot. It lands on your calendar.
              </p>
            </li>
          </ol>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto min-w-0 max-w-5xl px-6 py-16">
            <h2 className="text-balance text-2xl font-semibold tracking-tight">
              The product
            </h2>
            <ul className="mt-8 grid min-w-0 gap-8 sm:grid-cols-3">
              <li className="min-w-0 border-t border-border pt-4">
                <h3 className="text-lg font-medium">A public booking page</h3>
              </li>
              <li className="min-w-0 border-t border-border pt-4">
                <h3 className="text-lg font-medium">Your availability</h3>
              </li>
              <li className="min-w-0 border-t border-border pt-4">
                <h3 className="text-lg font-medium">A calendar connection</h3>
              </li>
            </ul>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto flex min-w-0 max-w-5xl flex-col items-start gap-6 px-6 py-16">
            <h2 className="text-balance text-2xl font-semibold tracking-tight">
              It lands on your calendar.
            </h2>
            <GetStarted />
          </div>
        </section>
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <p className="text-sm">Slotly</p>
        </div>
      </footer>
    </>
  );
}
