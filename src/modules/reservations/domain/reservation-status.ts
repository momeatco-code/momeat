export const reservationStatuses = [
  "draft",
  "pending_confirmation",
  "confirmed",
  "cancelled",
] as const;

export type ReservationStatus = (typeof reservationStatuses)[number];

const allowedTransitions: Record<
  ReservationStatus,
  readonly ReservationStatus[]
> = {
  draft: ["pending_confirmation", "cancelled"],
  pending_confirmation: ["confirmed", "cancelled"],
  confirmed: ["cancelled"],
  cancelled: [],
};

export function canTransitionReservation(
  from: ReservationStatus,
  to: ReservationStatus,
): boolean {
  return allowedTransitions[from].includes(to);
}
