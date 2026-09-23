"use client";

import { useState } from "react";
import { ArrowRight, CalendarDays, Loader2, Users } from "lucide-react";
import RoomResults from "./RoomResults";

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

type AvailabilityFormProps = {
  open: boolean;
  onClose: () => void;
};

export default function AvailabilityForm({
  open,
  onClose,
}: AvailabilityFormProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [resultsOpen, setResultsOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [criteria, setCriteria] =
    useState<AvailabilityCriteria | null>(null);

  if (!open) {
    return null;
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (!checkIn || !checkOut) {
      setError("Please select both check-in and check-out dates.");
      return;
    }

    if (checkOut <= checkIn) {
      setError("Check-out must be after check-in.");
      return;
    }

    setLoading(true);

    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";
      const response = await fetch(
        `${apiBaseUrl}/api/availability`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            check_in: checkIn,
            check_out: checkOut,
            guests: Number(guests),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to check availability.",
        );
      }

      setRooms(data.rooms ?? []);
      setCriteria(data.criteria);
      setResultsOpen(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to check availability right now.",
      );
    } finally {
      setLoading(false);
    }
  }

  function closeResults() {
    setResultsOpen(false);
    onClose();
  }

  return (
    <>
      {!resultsOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-xl rounded-[2rem] border border-[var(--orchid-border)] bg-[var(--orchid-card)] p-6 shadow-2xl sm:p-8">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--orchid-muted)]">
                The Orchid
              </p>

              <h2 className="mt-2 text-3xl font-light">
                Find your stay
              </h2>

              <p className="mt-3 text-sm leading-6 text-[var(--orchid-muted)]">
                Tell us when you&apos;re staying and we&apos;ll show you
                the available rooms.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[var(--orchid-muted)]">
                    <CalendarDays size={15} />
                    Check-in
                  </span>

                  <input
                    type="date"
                    value={checkIn}
                    onChange={(event) =>
                      setCheckIn(event.target.value)
                    }
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-[var(--orchid-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--orchid-gold)] disabled:opacity-50"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[var(--orchid-muted)]">
                    <CalendarDays size={15} />
                    Check-out
                  </span>

                  <input
                    type="date"
                    value={checkOut}
                    onChange={(event) =>
                      setCheckOut(event.target.value)
                    }
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-[var(--orchid-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--orchid-gold)] disabled:opacity-50"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[var(--orchid-muted)]">
                  <Users size={15} />
                  Guests
                </span>

                <select
                  value={guests}
                  onChange={(event) =>
                    setGuests(event.target.value)
                  }
                  disabled={loading}
                  className="w-full rounded-xl border border-[var(--orchid-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--orchid-gold)] disabled:opacity-50"
                >
                  {Array.from(
                    { length: 10 },
                    (_, index) => index + 1,
                  ).map((number) => (
                    <option key={number} value={number}>
                      {number}{" "}
                      {number === 1 ? "guest" : "guests"}
                    </option>
                  ))}
                </select>
              </label>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                  {error}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="rounded-full border border-[var(--orchid-border)] px-6 py-3 text-sm transition-colors hover:bg-white disabled:opacity-50"
                >
                  Close
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-full bg-[var(--orchid-deep)] px-6 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                      Checking...
                    </>
                  ) : (
                    <>
                      Find rooms
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {criteria && resultsOpen && (
        <RoomResults
          criteria={criteria}
          rooms={rooms}
          onClose={closeResults}
        />
      )}
    </>
  );
}