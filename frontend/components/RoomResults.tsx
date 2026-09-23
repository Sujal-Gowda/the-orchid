"use client";

import { Check, Users, X } from "lucide-react";

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

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getRoomImage(room: Room) {
  const imageMap: Record<string, string> = {
    "courtyard-king": "/rooms/courtyard-king.jpg",
    "terrace-suite": "/rooms/terrace-suite.jpg",
    "garden-family-suite": "/rooms/garden-family-suite.jpg",
    "orchid-signature-suite": "/rooms/orchid-signature-suite.jpg",
  };

  return imageMap[room.id] ?? room.image;
}

export default function RoomResults({
  criteria,
  rooms,
  onClose,
}: RoomResultsProps) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/30 p-2 backdrop-blur-sm sm:p-4 lg:p-6">
      <div className="mx-auto flex h-full max-w-7xl flex-col overflow-hidden rounded-[1.25rem] border border-[var(--orchid-border)] bg-[var(--orchid-card)] shadow-2xl sm:rounded-[2rem]">
        {/* Header */}
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--orchid-border)] px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--orchid-muted)] sm:text-xs sm:tracking-[0.25em]">
              Your stay
            </p>

            <h2 className="mt-1 text-xl font-light sm:text-2xl lg:text-3xl">
              Available rooms
            </h2>

            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[var(--orchid-muted)] sm:mt-3 sm:gap-x-4 sm:text-xs">
              <span>
                {formatDate(criteria.check_in)} →{" "}
                {formatDate(criteria.check_out)}
              </span>

              <span>
                {criteria.nights}{" "}
                {criteria.nights === 1 ? "night" : "nights"}
              </span>

              <span className="flex items-center gap-1">
                <Users size={12} />
                {criteria.guests}{" "}
                {criteria.guests === 1 ? "guest" : "guests"}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close room results"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--orchid-border)] transition-colors hover:bg-black/5 sm:h-10 sm:w-10"
          >
            <X size={17} />
          </button>
        </header>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          {rooms.length === 0 ? (
            <div className="flex min-h-[360px] items-center justify-center">
              <div className="max-w-md text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--orchid-sage)]/15">
                  <X
                    size={22}
                    className="text-[var(--orchid-deep)]"
                    strokeWidth={1.5}
                  />
                </div>

                <p className="mt-6 text-xs uppercase tracking-[0.25em] text-[var(--orchid-muted)]">
                  No suitable rooms
                </p>

                <h3 className="mt-3 text-xl font-light sm:text-2xl">
                  Nothing available for this search
                </h3>

                <p className="mt-4 text-sm leading-6 text-[var(--orchid-muted)]">
                  We couldn&apos;t find a room that fits this guest count and
                  stay. Try different dates or a smaller number of guests.
                </p>

                <button
                  onClick={onClose}
                  className="mt-7 rounded-full bg-[var(--orchid-deep)] px-6 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
                >
                  Search again
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
              {rooms.map((room) => (
                <article
                  key={room.id}
                  className="overflow-hidden rounded-[1.25rem] border border-[var(--orchid-border)] bg-white shadow-[0_18px_50px_rgba(36,34,30,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(36,34,30,0.1)] sm:rounded-[1.5rem]"
                >
                  {/* Room image */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-[var(--orchid-cream)]">
                    <img
                      src={getRoomImage(room)}
                      alt={room.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                    />

                    <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.15em] text-[var(--orchid-deep)] backdrop-blur sm:right-4 sm:top-4 sm:text-[10px]">
                      Available
                    </div>
                  </div>

                  {/* Room information */}
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-lg font-medium sm:text-xl">
                          {room.name}
                        </h3>

                        <p className="mt-2 text-xs leading-5 text-[var(--orchid-muted)] sm:text-sm">
                          {room.size_sqm} m² · {room.bed} · {room.view} view
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-base font-medium sm:text-lg">
                          {formatCurrency(room.nightly_rate_inr)}
                        </p>

                        <p className="text-[10px] text-[var(--orchid-muted)] sm:text-[11px]">
                          per night
                        </p>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
                      {room.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="rounded-full bg-[var(--orchid-cream)] px-2.5 py-1.5 text-[10px] text-[var(--orchid-muted)] sm:px-3 sm:text-[11px]"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>

                    {/* Key details */}
                    <div className="mt-4 space-y-2 border-t border-[var(--orchid-border)] pt-4 text-xs sm:mt-5 sm:pt-5 sm:text-sm">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[var(--orchid-muted)]">
                          Guests
                        </span>

                        <span className="font-medium">
                          Up to {room.capacity}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[var(--orchid-muted)]">
                          Breakfast
                        </span>

                        <span className="flex items-center gap-1.5 font-medium">
                          {room.breakfast_included ? (
                            <>
                              <Check
                                size={14}
                                className="text-[var(--orchid-sage)]"
                              />
                              Included
                            </>
                          ) : (
                            "Not included"
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="mt-5 flex items-end justify-between gap-4 border-t border-[var(--orchid-border)] pt-4 sm:mt-6 sm:pt-5">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.16em] text-[var(--orchid-muted)] sm:text-[10px] sm:tracking-[0.18em]">
                          Total for {criteria.nights}{" "}
                          {criteria.nights === 1 ? "night" : "nights"}
                        </p>

                        <p className="mt-1 text-xl font-light sm:text-2xl">
                          {formatCurrency(room.stay_total_inr)}
                        </p>
                      </div>

                      <span className="text-right text-[9px] uppercase tracking-[0.13em] text-[var(--orchid-muted)] sm:text-[10px] sm:tracking-[0.15em]">
                        Powered by Simplotel
                      </span>
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