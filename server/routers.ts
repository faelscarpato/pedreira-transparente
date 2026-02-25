import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { 
  getReports, 
  getReportById, 
  getComplaints, 
  getComplaintById,
  getEmailSubscription,
  getVerifiedSubscriptions,
  getDb,
  getUserById
} from "./db";
import { reports, complaints, emailSubscriptions, InsertReport, InsertComplaint, InsertEmailSubscription } from "../drizzle/schema";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ===== RELATÓRIOS =====
  reports: router({
    // Listar relatórios com paginação
    list: publicProcedure
      .input(z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
        type: z.enum(["diario_oficial", "plo", "emenda", "decreto", "outro"]).optional(),
        sortBy: z.enum(["date_desc", "date_asc"]).default("date_desc"),
      }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return { reports: [], total: 0 };
        
        // TODO: Implementar filtros por tipo e ordenação
        const data = await getReports(input.limit, input.offset);
        return { reports: data, total: data.length };
      }),

    // Obter relatório por ID
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getReportById(input.id);
      }),

    // Buscar relatórios por palavra-chave
    search: publicProcedure
      .input(z.object({
        query: z.string().min(1),
        limit: z.number().default(20),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return { reports: [], total: 0 };
        
        // TODO: Implementar busca full-text
        const data = await getReports(input.limit, input.offset);
        return { reports: data, total: data.length };
      }),

    // Criar novo relatório (admin only)
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        type: z.enum(["diario_oficial", "plo", "emenda", "decreto", "outro"]),
        publishedDate: z.date(),
        fileUrl: z.string().optional(),
        fileKey: z.string().optional(),
        keywords: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const newReport: InsertReport = {
          title: input.title,
          description: input.description,
          type: input.type,
          publishedDate: input.publishedDate,
          fileUrl: input.fileUrl,
          fileKey: input.fileKey,
          keywords: input.keywords,
          createdBy: ctx.user.id,
        };

        const result = await db.insert(reports).values(newReport);
        
        // Notificar subscritores sobre novo relatório
        // TODO: Implementar envio de email
        
        return { success: true, message: "Relatório criado com sucesso" };
      }),

    // Atualizar relatório (admin only)
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        summary: z.string().optional(),
        complianceIndicators: z.string().optional(),
        keywords: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // TODO: Implementar atualização
        return { success: true };
      }),

    // Deletar relatório (admin only)
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // TODO: Implementar deleção
        return { success: true };
      }),
  }),

  // ===== DENÚNCIAS =====
  complaints: router({
    // Listar denúncias (admin only)
    list: protectedProcedure
      .input(z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
        status: z.enum(["aberta", "em_analise", "respondida", "resolvida", "arquivada"]).optional(),
      }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const data = await getComplaints(input.limit, input.offset);
        return { complaints: data, total: data.length };
      }),

    // Obter denúncia por ID
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getComplaintById(input.id);
      }),

    // Criar nova denúncia (público)
    create: publicProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        severity: z.enum(["baixa", "media", "alta", "critica"]).default("media"),
        reportedActId: z.number().optional(),
        reporterName: z.string().optional(),
        reporterEmail: z.string().email().optional(),
        reporterPhone: z.string().optional(),
        evidenceUrl: z.string().optional(),
        evidenceKey: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const newComplaint: InsertComplaint = {
          title: input.title,
          description: input.description,
          severity: input.severity,
          reportedActId: input.reportedActId,
          reporterName: input.reporterName,
          reporterEmail: input.reporterEmail,
          reporterPhone: input.reporterPhone,
          evidenceUrl: input.evidenceUrl,
          evidenceKey: input.evidenceKey,
        };

        const result = await db.insert(complaints).values(newComplaint);
        
        // Notificar admin sobre nova denúncia crítica
        if (input.severity === "critica") {
          await notifyOwner({
            title: "Denúncia Crítica Recebida",
            content: `Nova denúncia crítica: ${input.title}`,
          });
        }
        
        return { success: true, message: "Denúncia registrada com sucesso" };
      }),

    // Atualizar denúncia (admin only)
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["aberta", "em_analise", "respondida", "resolvida", "arquivada"]).optional(),
        adminNotes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // TODO: Implementar atualização
        return { success: true };
      }),
  }),

  // ===== EMAIL SUBSCRIPTIONS =====
  emailSubscriptions: router({
    // Inscrever em notificações
    subscribe: publicProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string().optional(),
        subscribeToNewReports: z.boolean().default(true),
        subscribeToCriticalIssues: z.boolean().default(true),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const existingSubscription = await getEmailSubscription(input.email);
        
        if (existingSubscription) {
          // TODO: Atualizar inscrição existente
          return { success: true, message: "Inscrição atualizada" };
        }

        const newSubscription: InsertEmailSubscription = {
          email: input.email,
          name: input.name,
          subscribeToNewReports: input.subscribeToNewReports,
          subscribeToCriticalIssues: input.subscribeToCriticalIssues,
          isVerified: false,
          verificationToken: Math.random().toString(36).substring(2, 15),
        };

        await db.insert(emailSubscriptions).values(newSubscription);
        
        // TODO: Enviar email de verificação
        
        return { success: true, message: "Inscrição realizada. Verifique seu email." };
      }),

    // Verificar email
    verify: publicProcedure
      .input(z.object({
        token: z.string(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // TODO: Implementar verificação de token
        return { success: true };
      }),

    // Desinscrever
    unsubscribe: publicProcedure
      .input(z.object({
        email: z.string().email(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // TODO: Implementar desinscrição
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
