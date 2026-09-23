"use client";

import { useState } from "react";
import ConciergeChat from "@/components/ConciergeChat";
import AvailabilityForm from "@/components/AvailabilityForm";

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);

  return (
    <>
      <main className="min-h-screen bg-[var(--orchid-cream)] text-[var(--foreground)]">
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(185,154,98,0.16),transparent_32%),radial-gradient(circle_at_80%_70%,rgba(127,141,120,0.16),transparent_35%)]" />

          <div className="relative z-10 mx-auto w-full max-w-6xl">
            <nav className="mb-20 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[var(--orchid-muted)]">
                  The Orchid
                </p>

                <p className="mt-1 text-sm text-[var(--orchid-muted)]">
                  Bengaluru
                </p>
              </div>

              <span className="rounded-full border border-[var(--orchid-border)] bg-white/50 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[var(--orchid-muted)] backdrop-blur">
                Guest Experience
              </span>
            </nav>

            <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <p className="mb-6 text-sm uppercase tracking-[0.3em] text-[var(--orchid-gold)]">
                  Welcome to The Orchid
                </p>

                <h1 className="max-w-4xl text-6xl font-light leading-[0.95] tracking-[-0.04em] sm:text-7xl lg:text-8xl">
                  Stay curious.
                  <br />
                  <span className="text-[var(--orchid-sage)]">
                    We&apos;ll handle the rest.
                  </span>
                </h1>

                <p className="mt-8 max-w-xl text-base leading-7 text-[var(--orchid-muted)] sm:text-lg">
                  Discover your stay, explore the hotel, and ask anything
                  before you arrive.
                </p>

                <div className="mt-10 flex flex-wrap gap-4">
                  <button
                    onClick={() => setChatOpen(true)}
                    className="rounded-full bg-[var(--orchid-deep)] px-7 py-4 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    Meet Simp&apos;AI&apos;otel
                  </button>

                  <button
                    onClick={() => setAvailabilityOpen(true)}
                    className="rounded-full border border-[var(--orchid-border)] bg-white/50 px-7 py-4 text-sm font-medium backdrop-blur transition-colors hover:bg-white"
                  >
                    Check availability
                  </button>
                </div>
              </div>

              <div className="rounded-[2rem] border border-[var(--orchid-border)] bg-[var(--orchid-card)]/80 p-7 shadow-[0_30px_80px_rgba(36,34,30,0.08)] backdrop-blur">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-[var(--orchid-muted)]">
                      Your concierge
                    </p>

                    <h2 className="mt-2 text-2xl font-light">
                      Simp&apos;AI&apos;otel
                    </h2>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--orchid-sage)]/15">
                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--orchid-sage)]" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-[var(--orchid-cream)] px-5 py-4">
                    <p className="text-sm leading-6 text-[var(--orchid-muted)]">
                      Hello. I&apos;m here to help you discover The Orchid. Ask
                      me about rooms, dining, amenities, policies, or your
                      stay.
                    </p>
                  </div>

                  <div className="ml-auto max-w-[75%] rounded-2xl rounded-tr-sm bg-[var(--orchid-deep)] px-5 py-4 text-white">
                    <p className="text-sm leading-6">
                      What makes the stay special?
                    </p>
                  </div>

                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-[var(--orchid-cream)] px-5 py-4">
                    <p className="text-sm leading-6 text-[var(--orchid-muted)]">
                      Let&apos;s find out together.
                    </p>
                  </div>
                </div>

                <div className="mt-8 border-t border-[var(--orchid-border)] pt-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--orchid-muted)]">
                    Powered by your hotel knowledge
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ConciergeChat
        open={chatOpen}
        onClose={() => setChatOpen(false)}
      />

      <AvailabilityForm
        open={availabilityOpen}
        onClose={() => setAvailabilityOpen(false)}
      />
    </>
  );
}