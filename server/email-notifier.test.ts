import { describe, expect, it } from "vitest";
import {
  newReportTemplate,
  criticalComplaintTemplate,
  complaintUpdateTemplate,
  notifyNewReport,
  notifyCriticalComplaint,
  notifyComplaintUpdate,
} from "./email-notifier";

describe("email-notifier", () => {
  describe("Templates", () => {
    it("should generate new report template", () => {
      const template = newReportTemplate("Gasto em Eventos", "diario_oficial");

      expect(template.subject).toContain("Novo Relatório");
      expect(template.html).toContain("Gasto em Eventos");
      expect(template.html).toContain("BOCA ABERTA");
    });

    it("should generate critical complaint template", () => {
      const template = criticalComplaintTemplate("Corrupção em Licitação", "critica");

      expect(template.subject).toContain("DENÚNCIA CRÍTICA");
      expect(template.html).toContain("Corrupção em Licitação");
      expect(template.html).toContain("⚠️");
    });

    it("should generate complaint update template", () => {
      const template = complaintUpdateTemplate(
        "Gasto Suspeito",
        "respondida",
        "DENUNCIA-123-ABC"
      );

      expect(template.subject).toContain("Atualização");
      expect(template.html).toContain("DENUNCIA-123-ABC");
      expect(template.html).toContain("RESPONDIDA"); // Status é convertido para maiúsculas
    });
  });

  describe("Notification Functions", () => {
    it("should notify new report to subscribers", async () => {
      const result = await notifyNewReport(
        "Novo Decreto",
        "decreto",
        ["citizen1@example.com", "citizen2@example.com"]
      );

      expect(result).toBe(true);
    });

    it("should notify critical complaint to admin", async () => {
      const result = await notifyCriticalComplaint(
        "Desvio de Verba",
        "critica",
        "admin@example.com"
      );

      expect(result).toBe(true);
    });

    it("should notify complaint update to reporter", async () => {
      const result = await notifyComplaintUpdate(
        "Gasto em Eventos",
        "em_analise",
        "DENUNCIA-456-XYZ",
        "reporter@example.com"
      );

      expect(result).toBe(true);
    });

    it("should handle empty subscriber list", async () => {
      const result = await notifyNewReport("Test Report", "plo", []);

      expect(result).toBe(true);
    });
  });

  describe("Email Content Validation", () => {
    it("should include CTA buttons in templates", () => {
      const newReportTpl = newReportTemplate("Test", "diario_oficial");
      expect(newReportTpl.html).toContain("Consultar Relatórios");

      const criticalTpl = criticalComplaintTemplate("Test", "critica");
      expect(criticalTpl.html).toContain("Acessar Painel Admin");

      const updateTpl = complaintUpdateTemplate("Test", "resolvida", "PROTO-123");
      expect(updateTpl.html).toContain("Rastrear Denúncia");
    });

    it("should include branding in all templates", () => {
      const templates = [
        newReportTemplate("Test", "diario_oficial"),
        criticalComplaintTemplate("Test", "critica"),
        complaintUpdateTemplate("Test", "respondida", "PROTO-123"),
      ];

      templates.forEach((tpl) => {
        expect(tpl.html).toContain("BOCA ABERTA");
        expect(tpl.html).toContain("O Destino do Seu Dinheiro na Cara!");
      });
    });
  });
});
