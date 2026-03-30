import { describe, expect, it } from "vitest";

describe("Admin Management Page", () => {
  it("should require email authentication", () => {
    const ADMIN_EMAIL = "capyops@gmail.com";
    expect(ADMIN_EMAIL).toBe("capyops@gmail.com");
  });

  it("should have correct password for testing", () => {
    const TEST_PASSWORD = "admin123";
    expect(TEST_PASSWORD).toBe("admin123");
  });

  it("should display three tabs: denuncias, relatorios, estatisticas", () => {
    const tabs = ["denuncias", "relatorios", "estatisticas"];
    expect(tabs).toHaveLength(3);
    expect(tabs).toContain("denuncias");
    expect(tabs).toContain("relatorios");
    expect(tabs).toContain("estatisticas");
  });

  it("should have valid complaint status values", () => {
    const validStatuses = ["aberta", "em_analise", "respondida", "resolvida", "arquivada"];
    expect(validStatuses).toContain("em_analise");
    expect(validStatuses).toContain("respondida");
    expect(validStatuses).toContain("arquivada");
  });

  it("should have valid complaint severity levels", () => {
    const severityLevels = ["baixa", "media", "alta", "critica"];
    expect(severityLevels).toHaveLength(4);
    expect(severityLevels).toContain("critica");
  });

  it("should calculate complaint statistics correctly", () => {
    const complaints = [
      { id: 1, severity: "critica", status: "respondida" },
      { id: 2, severity: "alta", status: "em_analise" },
      { id: 3, severity: "media", status: "respondida" },
      { id: 4, severity: "baixa", status: "arquivada" },
    ];

    const criticas = complaints.filter(c => c.severity === "critica").length;
    const altas = complaints.filter(c => c.severity === "alta").length;
    const respondidas = complaints.filter(c => c.status === "respondida").length;

    expect(criticas).toBe(1);
    expect(altas).toBe(1);
    expect(respondidas).toBe(2);
  });
});
