"use client";

import { Check, X } from "lucide-react";

type Room = {
  id: string;
  name: string;
  capacity: number;
  bed: string;
  size_sqm: number;
  view: string;
  nightly_rate_inr: number;
  stay_total_inr: number;
  breakfast_included: boolean;
  highlights: string[];
  image: string;
  available: boolean;
};

type AvailabilityCriteria = {
  check_in: string;
  check_out: string;
  guests: number;
  nights: number;
};

type RoomResultsProps = {
  criteria: AvailabilityCriteria;
  rooms: Room[];
  onClose: () => void;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN").format(amount);
}

export default function RoomResults({
  criteria,
  rooms,
  onClose,
}: RoomResultsProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/20 p-4 backdrop-blur-sm sm:items-center">
      <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-[var(--orchid-border)] bg-[var(--orchid-card)] shadow-2xl">
        <header className="flex items-center justify-between border-b border-[var(--orchid-border)] px-6 py-5 sm:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--orchid-muted)]">
              Your stay
            </p>

            <h2 className="mt-2 text-2xl font-light sm:text-3xl">
              Available rooms
            </h2>

            <p className="mt-2 text-sm text-[var(--orchid-muted)]">
              {formatDate(criteria.check_in)} —{" "}
              {formatDate(criteria.check_out)} · {criteria.guests}{" "}
              {criteria.guests === 1 ? "guest" : "guests"} ·{" "}
              {criteria.nights}{" "}
              {criteria.nights === 1 ? "night" : "nights"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full border border-[var(--orchid-border)] px-4 py-2 text-sm transition-colors hover:bg-white"
          >
            Close
          </button>
        </header>

        <div className="overflow-y-auto p-5 sm:p-8">
          {rooms.length === 0 ? (
            <div className="rounded-2xl border border-[var(--orchid-border)] bg-[var(--orchid-cream)] p-8 text-center">
              <h3 className="text-xl font-light">
                No rooms available
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--orchid-muted)]">
                We couldn&apos;t find a suitable room for these dates and
                number of guests. Try different dates or a different guest
                count.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {rooms.map((room) => (
                <article
                  key={room.id}
                  className="overflow-hidden rounded-[1.5rem] border border-[var(--orchid-border)] bg-white"
                >
                  <div className="flex h-48 items-center justify-center bg-[var(--orchid-cream)]">
                    <div className="text-center">
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--orchid-muted)]">
                        The Orchid
                      </p>
                      <p className="mt-2 text-sm text-[var(--orchid-muted)]">
                        {room.view} view
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-light">
                          {room.name}
                        </h3>

                        <p className="mt-2 text-sm text-[var(--orchid-muted)]">
                          {room.size_sqm} m² · {room.bed} · Sleeps{" "}
                          {room.capacity}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-[var(--orchid-sage)]/15 px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-[var(--orchid-deep)]">
                        Available
                      </span>
                    </div>

                    <ul className="mt-5 space-y-2">
                      {room.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-2 text-sm text-[var(--orchid-muted)]"
                        >
                          <Check
                            size={15}
                            className="mt-0.5 shrink-0 text-[var(--orchid-sage)]"
                          />
                          {highlight}
                        </li>
                      ))}

                      <li className="flex items-start gap-2 text-sm text-[var(--orchid-muted)]">
                        {room.breakfast_included ? (
                          <Check
                            size={15}
                            className="mt-0.5 shrink-0 text-[var(--orchid-sage)]"
                          />
                        ) : (
                          <X
                            size={15}
                            className="mt-0.5 shrink-0 text-[var(--orchid-muted)]"
                          />
                        )}

                        {room.breakfast_included
                          ? "Breakfast included"
                          : "Breakfast not included"}
                      </li>
                    </ul>

                    <div className="mt-6 border-t border-[var(--orchid-border)] pt-5">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <p className="text-xs text-[var(--orchid-muted)]">
                            ₹{formatPrice(room.nightly_rate_inr)} / night
                          </p>

                          <p className="mt-1 text-lg font-medium">
                            ₹{formatPrice(room.stay_total_inr)}
                          </p>

                          <p className="text-xs text-[var(--orchid-muted)]">
                            total for {criteria.nights}{" "}
                            {criteria.nights === 1 ? "night" : "nights"}
                          </p>
                        </div>

                        <span className="rounded-full border border-[var(--orchid-border)] px-4 py-2 text-xs text-[var(--orchid-muted)]">
                          Capacity {room.capacity}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}