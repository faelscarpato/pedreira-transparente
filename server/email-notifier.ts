import { getDb } from "./db";
import { sentNotifications, InsertSentNotification } from "../drizzle/schema";

/**
 * Template de email para novo relatório publicado
 */
export const newReportTemplate = (reportTitle: string, reportType: string) => ({
  subject: `📋 Novo Relatório Publicado: ${reportTitle}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">BOCA ABERTA</h1>
        <p style="margin: 5px 0; font-size: 14px;">O Destino do Seu Dinheiro na Cara!</p>
      </div>
      
      <div style="padding: 20px; background-color: #f9fafb;">
        <h2 style="color: #1f2937;">Novo Relatório Publicado</h2>
        
        <div style="background-color: white; border-left: 4px solid #dc2626; padding: 15px; margin: 15px 0;">
          <h3 style="margin-top: 0; color: #dc2626;">${reportTitle}</h3>
          <p><strong>Tipo:</strong> ${reportType}</p>
          <p><strong>Data:</strong> ${new Date().toLocaleDateString("pt-BR")}</p>
        </div>
        
        <p style="color: #4b5563;">
          Este é um novo relatório de auditoria que foi publicado em nossa plataforma. 
          Clique no botão abaixo para consultar os detalhes completos.
        </p>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="https://bocaaberta.local/reports" style="background-color: #fbbf24; color: black; padding: 12px 30px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
            Consultar Relatórios
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        
        <p style="color: #6b7280; font-size: 12px;">
          Você recebeu este email porque está inscrito para receber notificações de novos relatórios.
          <br>
          <a href="https://bocaaberta.local/subscribe" style="color: #dc2626; text-decoration: none;">Gerenciar preferências de notificação</a>
        </p>
      </div>
    </div>
  `,
});

/**
 * Template de email para denúncia crítica
 */
export const criticalComplaintTemplate = (complaintTitle: string, severity: string) => ({
  subject: `🚨 DENÚNCIA CRÍTICA RECEBIDA: ${complaintTitle}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">BOCA ABERTA</h1>
        <p style="margin: 5px 0; font-size: 14px;">O Destino do Seu Dinheiro na Cara!</p>
      </div>
      
      <div style="padding: 20px; background-color: #f9fafb;">
        <div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 15px 0;">
          <h2 style="margin-top: 0; color: #dc2626;">⚠️ DENÚNCIA CRÍTICA RECEBIDA</h2>
          <h3 style="margin: 10px 0; color: #1f2937;">${complaintTitle}</h3>
          <p><strong>Severidade:</strong> <span style="background-color: #dc2626; color: white; padding: 2px 8px; border-radius: 3px;">${severity.toUpperCase()}</span></p>
          <p><strong>Data:</strong> ${new Date().toLocaleDateString("pt-BR")}</p>
        </div>
        
        <p style="color: #4b5563;">
          Uma denúncia de severidade crítica foi registrada em nossa plataforma. 
          Esta denúncia requer atenção imediata da administração.
        </p>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="https://bocaaberta.local/admin" style="background-color: #dc2626; color: white; padding: 12px 30px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
            Acessar Painel Admin
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        
        <p style="color: #6b7280; font-size: 12px;">
          Esta é uma notificação automática do sistema Boca Aberta.
        </p>
      </div>
    </div>
  `,
});

/**
 * Template de email para atualização de denúncia
 */
export const complaintUpdateTemplate = (complaintTitle: string, newStatus: string, protocolNumber: string) => ({
  subject: `📌 Atualização em sua denúncia: ${complaintTitle}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">BOCA ABERTA</h1>
        <p style="margin: 5px 0; font-size: 14px;">O Destino do Seu Dinheiro na Cara!</p>
      </div>
      
      <div style="padding: 20px; background-color: #f9fafb;">
        <h2 style="color: #1f2937;">Sua Denúncia Foi Atualizada</h2>
        
        <div style="background-color: white; border-left: 4px solid #fbbf24; padding: 15px; margin: 15px 0;">
          <h3 style="margin-top: 0; color: #1f2937;">${complaintTitle}</h3>
          <p><strong>Protocolo:</strong> <code style="background-color: #f3f4f6; padding: 5px 10px; border-radius: 3px;">${protocolNumber}</code></p>
          <p><strong>Novo Status:</strong> <span style="background-color: #fbbf24; color: black; padding: 2px 8px; border-radius: 3px; font-weight: bold;">${newStatus.toUpperCase()}</span></p>
          <p><strong>Data da Atualização:</strong> ${new Date().toLocaleDateString("pt-BR")}</p>
        </div>
        
        <p style="color: #4b5563;">
          Sua denúncia foi atualizada. Clique no botão abaixo para acompanhar o progresso em tempo real.
        </p>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="https://bocaaberta.local/track" style="background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
            Rastrear Denúncia
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        
        <p style="color: #6b7280; font-size: 12px;">
          Você recebeu este email porque é o denunciante desta solicitação.
        </p>
      </div>
    </div>
  `,
});

/**
 * Enviar notificação de novo relatório para inscritos
 */
export async function notifyNewReport(
  reportTitle: string,
  reportType: string,
  subscriberEmails: string[]
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Email] Database not available");
    return false;
  }

  try {
    const template = newReportTemplate(reportTitle, reportType);
    
    // Simular envio de email (em produção, usar SendGrid, AWS SES, etc.)
    console.log(`[Email] Enviando notificação de novo relatório para ${subscriberEmails.length} inscritos`);
    
    // Registrar no histórico de notificações
    for (const email of subscriberEmails) {
      await db.insert(sentNotifications).values({
        email,
        subject: template.subject,
        type: "new_report",
      });
    }
    
    return true;
  } catch (error) {
    console.error("[Email] Erro ao enviar notificações:", error);
    return false;
  }
}

/**
 * Enviar notificação de denúncia crítica para admin
 */
export async function notifyCriticalComplaint(
  complaintTitle: string,
  severity: string,
  adminEmail: string
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Email] Database not available");
    return false;
  }

  try {
    const template = criticalComplaintTemplate(complaintTitle, severity);
    
    console.log(`[Email] Enviando notificação de denúncia crítica para ${adminEmail}`);
    
    // Registrar no histórico
    await db.insert(sentNotifications).values({
      email: adminEmail,
      subject: template.subject,
      type: "critical_issue",
    });
    
    return true;
  } catch (error) {
    console.error("[Email] Erro ao enviar notificação crítica:", error);
    return false;
  }
}

/**
 * Enviar notificação de atualização de denúncia para denunciante
 */
export async function notifyComplaintUpdate(
  complaintTitle: string,
  newStatus: string,
  protocolNumber: string,
  reporterEmail: string
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Email] Database not available");
    return false;
  }

  try {
    const template = complaintUpdateTemplate(complaintTitle, newStatus, protocolNumber);
    
    console.log(`[Email] Enviando atualização de denúncia para ${reporterEmail}`);
    
    // Registrar no histórico
    await db.insert(sentNotifications).values({
      email: reporterEmail,
      subject: template.subject,
      type: "complaint_update",
    });
    
    return true;
  } catch (error) {
    console.error("[Email] Erro ao enviar atualização:", error);
    return false;
  }
}
