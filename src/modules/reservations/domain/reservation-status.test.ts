import { describe, expect, it } from "vitest";
import { canTransitionReservation } from "./reservation-status";

describe("reservation transitions", () => {
  it("allows a draft to be submitted for confirmation", () => {
    expect(canTransitionReservation("draft", "pending_confirmation")).toBe(
      true,
    );
  });

  it("does not allow a cancelled reservation to change state", () => {
    expect(canTransitionReservation("cancelled", "confirmed")).toBe(false);
  });
});
