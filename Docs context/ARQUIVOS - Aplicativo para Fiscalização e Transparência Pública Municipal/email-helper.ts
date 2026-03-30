import { invokeLLM } from "./_core/llm";
import type { Report, Complaint } from "../drizzle/schema";

/**
 * Envia email de notificação sobre novo relatório
 */
export async function sendNewReportNotification(
  email: string,
  report: Report
): Promise<boolean> {
  try {
    const subject = `Novo Relatório: ${report.title}`;
    const htmlContent = `
      <h2>${report.title}</h2>
      <p><strong>Tipo:</strong> ${report.type}</p>
      <p><strong>Data:</strong> ${new Date(report.publishedDate).toLocaleDateString("pt-BR")}</p>
      ${report.summary ? `<p><strong>Resumo:</strong> ${report.summary}</p>` : ""}
      <a href="https://pedreiratransparente.gov.br/reports/${report.id}">Ver Relatório Completo</a>
    `;

    // TODO: Implementar envio real de email via SMTP ou serviço de email
    console.log(`[EMAIL] Enviando notificação para ${email}: ${subject}`);
    
    return true;
  } catch (error) {
    console.error("[EMAIL] Erro ao enviar notificação:", error);
    return false;
  }
}

/**
 * Envia email de notificação sobre denúncia crítica
 */
export async function sendCriticalComplaintNotification(
  adminEmail: string,
  complaint: Complaint
): Promise<boolean> {
  try {
    const subject = `⚠️ DENÚNCIA CRÍTICA: ${complaint.title}`;
    const htmlContent = `
      <h2 style="color: red;">DENÚNCIA CRÍTICA RECEBIDA</h2>
      <p><strong>Título:</strong> ${complaint.title}</p>
      <p><strong>Severidade:</strong> ${complaint.severity}</p>
      <p><strong>Descrição:</strong> ${complaint.description}</p>
      ${complaint.reporterName ? `<p><strong>Denunciante:</strong> ${complaint.reporterName}</p>` : ""}
      ${complaint.reporterEmail ? `<p><strong>Email:</strong> ${complaint.reporterEmail}</p>` : ""}
      <a href="https://pedreiratransparente.gov.br/admin/complaints/${complaint.id}">Analisar Denúncia</a>
    `;

    // TODO: Implementar envio real de email
    console.log(`[EMAIL] Enviando notificação crítica para ${adminEmail}: ${subject}`);
    
    return true;
  } catch (error) {
    console.error("[EMAIL] Erro ao enviar notificação crítica:", error);
    return false;
  }
}

/**
 * Envia email de confirmação de denúncia
 */
export async function sendComplaintConfirmation(
  email: string,
  complaintId: number,
  complaintTitle: string
): Promise<boolean> {
  try {
    const subject = "Sua denúncia foi registrada com sucesso";
    const htmlContent = `
      <h2>Denúncia Registrada</h2>
      <p>Obrigado por contribuir com a transparência pública!</p>
      <p><strong>Número de Protocolo:</strong> #2026-${complaintId}</p>
      <p><strong>Título:</strong> ${complaintTitle}</p>
      <p>Sua denúncia será analisada pela administração. Você pode acompanhar o status em:</p>
      <a href="https://pedreiratransparente.gov.br/complaints/${complaintId}">Acompanhar Denúncia</a>
    `;

    // TODO: Implementar envio real de email
    console.log(`[EMAIL] Enviando confirmação para ${email}`);
    
    return true;
  } catch (error) {
    console.error("[EMAIL] Erro ao enviar confirmação:", error);
    return false;
  }
}

/**
 * Envia email de verificação de inscrição
 */
export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<boolean> {
  try {
    const verificationUrl = `https://pedreiratransparente.gov.br/verify?token=${token}`;
    const subject = "Confirme sua inscrição - Pedreira Transparente";
    const htmlContent = `
      <h2>Confirme sua Inscrição</h2>
      <p>Obrigado por se inscrever para receber notificações sobre relatórios e irregularidades!</p>
      <p>Clique no link abaixo para confirmar seu email:</p>
      <a href="${verificationUrl}" style="background: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Confirmar Email
      </a>
      <p>Ou copie e cole este link no seu navegador:</p>
      <p>${verificationUrl}</p>
    `;

    // TODO: Implementar envio real de email
    console.log(`[EMAIL] Enviando email de verificação para ${email}`);
    
    return true;
  } catch (error) {
    console.error("[EMAIL] Erro ao enviar email de verificação:", error);
    return false;
  }
}

/**
 * Envia email de resumo semanal
 */
export async function sendWeeklySummary(
  email: string,
  reports: Report[],
  complaints: Complaint[]
): Promise<boolean> {
  try {
    const subject = "Resumo Semanal - Pedreira Transparente";
    
    let reportsHtml = "<h3>Novos Relatórios</h3>";
    if (reports.length > 0) {
      reportsHtml += "<ul>";
      reports.forEach(r => {
        reportsHtml += `<li><strong>${r.title}</strong> (${r.type})</li>`;
      });
      reportsHtml += "</ul>";
    } else {
      reportsHtml += "<p>Nenhum novo relatório esta semana.</p>";
    }

    let complaintsHtml = "<h3>Denúncias Críticas</h3>";
    const criticalComplaints = complaints.filter(c => c.severity === "critica");
    if (criticalComplaints.length > 0) {
      complaintsHtml += "<ul>";
      criticalComplaints.forEach(c => {
        complaintsHtml += `<li><strong>${c.title}</strong> - ${c.severity}</li>`;
      });
      complaintsHtml += "</ul>";
    } else {
      complaintsHtml += "<p>Nenhuma denúncia crítica esta semana.</p>";
    }

    const htmlContent = `
      <h2>Resumo Semanal - Pedreira Transparente</h2>
      ${reportsHtml}
      ${complaintsHtml}
      <p><a href="https://pedreiratransparente.gov.br">Acessar Plataforma</a></p>
    `;

    // TODO: Implementar envio real de email
    console.log(`[EMAIL] Enviando resumo semanal para ${email}`);
    
    return true;
  } catch (error) {
    console.error("[EMAIL] Erro ao enviar resumo semanal:", error);
    return false;
  }
}
