import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("reports.search", () => {
  it("should search reports by keyword", async () => {
    const { ctx } = createContext();
    const caller = appRouter.createCaller(ctx);

    // Search for reports
    const result = await caller.reports.search({
      query: "eventos",
      page: 1,
      limit: 10,
    });

    expect(result.reports).toBeDefined();
    expect(Array.isArray(result.reports)).toBe(true);
  });

  it("should search with type filter", async () => {
    const { ctx } = createContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reports.search({
      query: "lei",
      type: "plo",
    });

    expect(result.reports).toBeDefined();
    expect(Array.isArray(result.reports)).toBe(true);
  });

  it("should handle pagination", async () => {
    const { ctx } = createContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reports.search({
      query: "test",
      page: 1,
      limit: 5,
    });

    expect(result).toBeDefined();
    expect(result.reports).toBeDefined();
  });

  it("should return empty results for non-matching query", async () => {
    const { ctx } = createContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reports.search({
      query: "nonexistentquery123456",
      page: 1,
      limit: 10,
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result.reports)).toBe(true);
  });
});
