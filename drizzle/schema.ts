import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, longtext } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Tabela de Relatórios de Auditoria
export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: longtext("description"),
  type: mysqlEnum("type", ["diario_oficial", "plo", "emenda", "decreto", "outro"]).notNull(),
  publishedDate: timestamp("publishedDate").notNull(),
  fileUrl: varchar("fileUrl", { length: 500 }),
  fileKey: varchar("fileKey", { length: 500 }),
  summary: longtext("summary"), // Resumo gerado por LLM
  complianceIndicators: longtext("complianceIndicators"), // JSON com indicadores de conformidade
  keywords: text("keywords"), // Tags para busca
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;

// Tabela de Denúncias Cidadãs
export const complaints = mysqlTable("complaints", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: longtext("description").notNull(),
  severity: mysqlEnum("severity", ["baixa", "media", "alta", "critica"]).default("media").notNull(),
  status: mysqlEnum("status", ["aberta", "em_analise", "respondida", "resolvida", "arquivada"]).default("aberta").notNull(),
  reportedActId: int("reportedActId"), // Referência ao ato denunciado
  reporterName: varchar("reporterName", { length: 255 }),
  reporterEmail: varchar("reporterEmail", { length: 320 }),
  reporterPhone: varchar("reporterPhone", { length: 20 }),
  evidenceUrl: varchar("evidenceUrl", { length: 500 }),
  evidenceKey: varchar("evidenceKey", { length: 500 }),
  adminNotes: longtext("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Complaint = typeof complaints.$inferSelect;
export type InsertComplaint = typeof complaints.$inferInsert;

// Tabela de Inscrições em Notificações
export const emailSubscriptions = mysqlTable("emailSubscriptions", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  subscribeToNewReports: boolean("subscribeToNewReports").default(true).notNull(),
  subscribeToCriticalIssues: boolean("subscribeToCriticalIssues").default(true).notNull(),
  verificationToken: varchar("verificationToken", { length: 255 }),
  isVerified: boolean("isVerified").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EmailSubscription = typeof emailSubscriptions.$inferSelect;
export type InsertEmailSubscription = typeof emailSubscriptions.$inferInsert;

// Tabela de Histórico de Notificações Enviadas
export const sentNotifications = mysqlTable("sentNotifications", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["new_report", "critical_issue", "complaint_update"]).notNull(),
  relatedReportId: int("relatedReportId"),
  relatedComplaintId: int("relatedComplaintId"),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
});

export type SentNotification = typeof sentNotifications.$inferSelect;
export type InsertSentNotification = typeof sentNotifications.$inferInsert;