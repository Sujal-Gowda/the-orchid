"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

import ConciergeChat from "@/components/ConciergeChat";
import AvailabilityForm from "@/components/AvailabilityForm";

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);

  function openConcierge() {
    setChatOpen(true);
  }

  function openAvailability() {
    setAvailabilityOpen(true);
  }

  return (
    <>
      <main className="min-h-screen overflow-x-hidden bg-[var(--orchid-cream)] text-[var(--foreground)]">
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(185,154,98,0.16),transparent_32%),radial-gradient(circle_at_80%_70%,rgba(127,141,120,0.16),transparent_35%)]" />

          <div className="relative z-10 mx-auto w-full max-w-6xl">
            {/* Navigation */}
            <nav className="mb-14 flex items-start justify-between sm:mb-18 lg:mb-20">
              <div>
                <p className="font-serif text-2xl tracking-[-0.03em] text-[var(--orchid-deep)] sm:text-3xl">
                  The Orchid
                </p>

                <p className="mt-1 text-xs tracking-[0.12em] text-[var(--orchid-muted)] sm:text-sm">
                  Bengaluru
                </p>
              </div>

              <span className="rounded-full border border-[var(--orchid-border)] bg-white/50 px-3 py-2 text-[9px] uppercase tracking-[0.16em] text-[var(--orchid-muted)] backdrop-blur sm:px-4 sm:text-xs sm:tracking-[0.2em]">
                Guest Experience
              </span>
            </nav>

            {/* Hero */}
            <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
              <div>
                <p className="mb-5 text-xs uppercase tracking-[0.28em] text-[var(--orchid-gold)] sm:mb-6 sm:text-sm sm:tracking-[0.3em]">
                  Welcome to The Orchid
                </p>

                <h1 className="max-w-4xl text-[3.5rem] font-light leading-[0.92] tracking-[-0.045em] sm:text-6xl md:text-7xl lg:text-8xl">
                  Stay curious.
                  <br />
                  <span className="text-[var(--orchid-sage)]">
                    We&apos;ll handle the rest.
                  </span>
                </h1>

                <p className="mt-7 max-w-xl text-sm leading-6 text-[var(--orchid-muted)] sm:mt-8 sm:text-base sm:leading-7 lg:text-lg">
                  Discover your stay, explore the hotel, and ask anything
                  before you arrive.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap">
                  <button
                    onClick={openConcierge}
                    className="rounded-full bg-[var(--orchid-deep)] px-7 py-4 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    Meet Simp&apos;AI&apos;otel
                  </button>

                  <button
                    onClick={openAvailability}
                    className="rounded-full border border-[var(--orchid-border)] bg-white/50 px-7 py-4 text-sm font-medium backdrop-blur transition-colors hover:bg-white"
                  >
                    Check availability
                  </button>
                </div>
              </div>

              {/* Interactive Concierge Preview */}
              <div
                role="button"
                tabIndex={0}
                aria-label="Open Simp’AI’otel concierge"
                onClick={openConcierge}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openConcierge();
                  }
                }}
                className="group w-full cursor-pointer rounded-[1.75rem] border border-[var(--orchid-border)] bg-[var(--orchid-card)]/80 p-5 shadow-[0_25px_70px_rgba(36,34,30,0.08)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_35px_90px_rgba(36,34,30,0.13)] focus:outline-none focus:ring-2 focus:ring-[var(--orchid-gold)]/50 sm:rounded-[2rem] sm:p-7"
              >
                <div className="mb-6 flex items-center justify-between sm:mb-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.23em] text-[var(--orchid-muted)] sm:text-xs sm:tracking-[0.25em]">
                      Your concierge
                    </p>

                    <h2 className="mt-2 text-xl font-light sm:text-2xl">
                      Simp&apos;AI&apos;otel
                    </h2>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--orchid-sage)]/15 sm:h-10 sm:w-10">
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--orchid-sage)]" />
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-[var(--orchid-cream)] px-4 py-3 sm:px-5 sm:py-4">
                    <p className="text-xs leading-5 text-[var(--orchid-muted)] sm:text-sm sm:leading-6">
                      Hello. I&apos;m here to help you discover The Orchid. Ask
                      me about rooms, dining, amenities, policies, or your
                      stay.
                    </p>
                  </div>

                  <div className="ml-auto max-w-[78%] rounded-2xl rounded-tr-sm bg-[var(--orchid-deep)] px-4 py-3 text-white sm:px-5 sm:py-4">
                    <p className="text-xs leading-5 sm:text-sm sm:leading-6">
                      What makes the stay special?
                    </p>
                  </div>

                  <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-[var(--orchid-cream)] px-4 py-3 sm:px-5 sm:py-4">
                    <p className="text-xs leading-5 text-[var(--orchid-muted)] sm:text-sm sm:leading-6">
                      Let&apos;s find out together.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-[var(--orchid-border)] pt-4 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:pt-5">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-[var(--orchid-muted)] sm:text-[10px] sm:tracking-[0.2em]">
                    Powered by Simplotel
                  </p>

                  <span className="flex items-center gap-1 text-xs font-medium text-[var(--orchid-deep)] opacity-80 transition-opacity duration-200 group-hover:opacity-100">
                    Ask Simp&apos;AI&apos;otel
                    <ArrowUpRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ConciergeChat
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        onAvailabilityRequest={openAvailability}
      />

      <AvailabilityForm
        open={availabilityOpen}
        onClose={() => setAvailabilityOpen(false)}
      />
    </>
  );
}