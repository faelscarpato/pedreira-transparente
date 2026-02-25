import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock context para testes
function createMockContext(isAdmin: boolean = false): TrpcContext {
  return {
    user: isAdmin ? {
      id: 1,
      openId: "admin-user",
      email: "admin@example.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    } : {
      id: 2,
      openId: "regular-user",
      email: "user@example.com",
      name: "Regular User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as TrpcContext["res"],
  };
}

describe("Reports Router", () => {
  it("should list reports", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.reports.list({
      limit: 20,
      offset: 0,
    });

    expect(result).toHaveProperty("reports");
    expect(result).toHaveProperty("total");
    expect(Array.isArray(result.reports)).toBe(true);
  });

  it("should require admin role to create report", async () => {
    const ctx = createMockContext(false); // Non-admin user
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.reports.create({
        title: "Test Report",
        type: "diario_oficial",
        publishedDate: new Date(),
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect((error as Error).message).toBe("FORBIDDEN");
    }
  });

  it("should allow admin to create report", async () => {
    const ctx = createMockContext(true); // Admin user
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.reports.create({
      title: "Test Report",
      type: "diario_oficial",
      publishedDate: new Date(),
    });

    expect(result).toHaveProperty("success");
    expect(result.success).toBe(true);
  });
});

describe("Complaints Router", () => {
  it("should allow public users to create complaint", async () => {
    const ctx = createMockContext(false);
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.complaints.create({
      title: "Test Complaint",
      description: "This is a test complaint with sufficient detail",
      severity: "media",
    });

    expect(result).toHaveProperty("success");
    expect(result.success).toBe(true);
  });

  it("should require admin role to list complaints", async () => {
    const ctx = createMockContext(false); // Non-admin user
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.complaints.list({
        limit: 20,
        offset: 0,
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect((error as Error).message).toBe("FORBIDDEN");
    }
  });

  it("should allow admin to list complaints", async () => {
    const ctx = createMockContext(true); // Admin user
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.complaints.list({
      limit: 20,
      offset: 0,
    });

    expect(result).toHaveProperty("complaints");
    expect(result).toHaveProperty("total");
    expect(Array.isArray(result.complaints)).toBe(true);
  });
});

describe("Email Subscriptions Router", () => {
  it("should allow public users to subscribe", async () => {
    const ctx = createMockContext(false);
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.emailSubscriptions.subscribe({
      email: "subscriber@example.com",
      name: "Test Subscriber",
      subscribeToNewReports: true,
      subscribeToCriticalIssues: true,
    });

    expect(result).toHaveProperty("success");
    expect(result.success).toBe(true);
  });

  it("should validate email format", async () => {
    const ctx = createMockContext(false);
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.emailSubscriptions.subscribe({
        email: "invalid-email",
        subscribeToNewReports: true,
        subscribeToCriticalIssues: true,
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect((error as Error).message).toContain("email");
    }
  });
});

describe("Auth Router", () => {
  it("should return current user", async () => {
    const ctx = createMockContext(true); // Admin user
    const caller = appRouter.createCaller(ctx);
    
    const user = await caller.auth.me();
    
    expect(user).toBeDefined();
    expect(user?.email).toBe("admin@example.com");
  });

  it("should logout user", async () => {
    const ctx = createMockContext(true);
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.auth.logout();
    
    expect(result).toHaveProperty("success");
    expect(result.success).toBe(true);
  });
});
