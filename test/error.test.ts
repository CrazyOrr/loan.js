import { describe, expect, it } from "vitest";
import { IllegalArgumentException } from "../src/error";

describe("IllegalArgumentException", () => {
  it("construct with error message", () => {
    const message = "Illegal argument";
    expect(new IllegalArgumentException(message).message).toBe(message);
  });
});
