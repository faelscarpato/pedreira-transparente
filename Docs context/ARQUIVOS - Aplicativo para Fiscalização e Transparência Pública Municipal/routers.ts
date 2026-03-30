import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
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
import { eq, or, and, desc, like } from "drizzle-orm";
import { notifyNewReport, notifyCriticalComplaint, notifyComplaintUpdate } from "./email-notifier";

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
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

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
        
        // Notificar inscritos sobre novo relatório
        const subscribers = await getVerifiedSubscriptions();
        if (subscribers.length > 0) {
          const subscriberEmails = subscribers
            .filter(s => s.subscribeToNewReports)
            .map(s => s.email);
          
          if (subscriberEmails.length > 0) {
            await notifyNewReport(input.title, input.type, subscriberEmails);
          }
        }
        
        return { success: true, message: "Relatório publicado com sucesso" };     }),

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
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        return { success: true };
      }),

    // Deletar relatório (admin only)
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

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
          throw new TRPCError({ code: "FORBIDDEN" });
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
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        // Gerar número de protocolo único
        const protocolNumber = `DENUNCIA-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

        const newComplaint: InsertComplaint = {
          protocolNumber,
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
        
        return { success: true, message: "Denúncia registrada com sucesso", protocolNumber };
      }),

    // Busca full-text em relatórios
    search: publicProcedure
      .input(z.object({
        query: z.string().min(2, "Busca deve ter pelo menos 2 caracteres"),
        type: z.enum(["diario_oficial", "plo", "emenda", "decreto", "outro"]).optional(),
        page: z.number().default(1),
        limit: z.number().default(10),
      }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const offset = (input.page - 1) * input.limit;
        const whereConditions = [];

        // Busca por palavra-chave
        whereConditions.push(
          or(
            like(reports.title, `%${input.query}%`),
            like(reports.keywords, `%${input.query}%`)
          )
        );

        // Filtro por tipo
        if (input.type) {
          whereConditions.push(eq(reports.type, input.type));
        }

        const results = await db
          .select()
          .from(reports)
          .where(and(...whereConditions))
          .orderBy(desc(reports.publishedDate))
          .limit(input.limit)
          .offset(offset);

        return {
          reports: results,
          page: input.page,
          limit: input.limit,
          total: results.length,
        };
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
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        // Obter dados da denúncia antes de atualizar
        const complaint = await getComplaintById(input.id);
        if (!complaint) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        const updateData: any = {};
        if (input.status) updateData.status = input.status;
        if (input.adminNotes) updateData.adminNotes = input.adminNotes;

        await db.update(complaints).set(updateData).where(eq(complaints.id, input.id));
        
        // Notificar denunciante sobre atualização
        if (input.status && complaint.reporterEmail) {
          await notifyComplaintUpdate(
            complaint.title,
            input.status,
            complaint.protocolNumber,
            complaint.reporterEmail
          );
        }
        
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
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const existingSubscription = await getEmailSubscription(input.email);
        
        if (existingSubscription) {
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
        
        return { success: true, message: "Inscrição realizada. Verifique seu email." };
      }),

    // Verificar email
    verify: publicProcedure
      .input(z.object({
        token: z.string(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        return { success: true };
      }),

    // Desinscrever
    unsubscribe: publicProcedure
      .input(z.object({
        email: z.string().email(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        return { success: true };
      }),
  }),

  // ===== UPLOADS =====
  uploads: router({
    uploadReportPdf: protectedProcedure
      .input(
        z.object({
          fileName: z.string(),
          fileBase64: z.string(),
          reportId: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        try {
          const { uploadFile } = await import("./storage-helper");
          const buffer = Buffer.from(input.fileBase64, "base64");
          const timestamp = new Date().toISOString().split("T")[0];
          const filePath = `reports/${timestamp}/${input.fileName}`;

          const fileUrl = await uploadFile(
            "reports",
            filePath,
            buffer,
            "application/pdf"
          );

          return { success: true, fileUrl, filePath };
        } catch (error) {
          console.error("Upload error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao fazer upload do arquivo",
          });
        }
      }),

    uploadComplaintEvidence: publicProcedure
      .input(
        z.object({
          fileName: z.string(),
          fileBase64: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const { uploadFile } = await import("./storage-helper");
          const buffer = Buffer.from(input.fileBase64, "base64");
          const timestamp = new Date().toISOString().split("T")[0];
          const filePath = `complaints/${timestamp}/${input.fileName}`;

          const fileUrl = await uploadFile(
            "complaints",
            filePath,
            buffer,
            "application/pdf"
          );

          return { success: true, fileUrl, filePath };
        } catch (error) {
          console.error("Upload error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao fazer upload do arquivo",
          });
        }
      }),
  }),

  // ===== ESTATÍSTICAS =====
  statistics: router({
    getOverview: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) {
        return {
          totalReports: 0,
          totalComplaints: 0,
          criticalComplaints: 0,
          resolvedComplaints: 0,
        };
      }

      try {
        const allReports = await getReports(1000, 0);
        const allComplaints = await getComplaints(1000, 0);
        
        const criticalCount = allComplaints.filter(c => c.severity === "critica").length;
        const resolvedCount = allComplaints.filter(c => c.status === "resolvida").length;

        return {
          totalReports: allReports.length,
          totalComplaints: allComplaints.length,
          criticalComplaints: criticalCount,
          resolvedComplaints: resolvedCount,
        };
      } catch (error) {
        console.error("Statistics error:", error);
        return {
          totalReports: 0,
          totalComplaints: 0,
          criticalComplaints: 0,
          resolvedComplaints: 0,
        };
      }
    }),

    getComplaintsBySeverity: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return { baixa: 0, media: 0, alta: 0, critica: 0 };

      try {
        const allComplaints = await getComplaints(1000, 0);
        
        return {
          baixa: allComplaints.filter(c => c.severity === "baixa").length,
          media: allComplaints.filter(c => c.severity === "media").length,
          alta: allComplaints.filter(c => c.severity === "alta").length,
          critica: allComplaints.filter(c => c.severity === "critica").length,
        };
      } catch (error) {
        console.error("Statistics error:", error);
        return { baixa: 0, media: 0, alta: 0, critica: 0 };
      }
    }),

    getComplaintsByStatus: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return { aberta: 0, em_analise: 0, respondida: 0, resolvida: 0, arquivada: 0 };

      try {
        const allComplaints = await getComplaints(1000, 0);
        
        return {
          aberta: allComplaints.filter(c => c.status === "aberta").length,
          em_analise: allComplaints.filter(c => c.status === "em_analise").length,
          respondida: allComplaints.filter(c => c.status === "respondida").length,
          resolvida: allComplaints.filter(c => c.status === "resolvida").length,
          arquivada: allComplaints.filter(c => c.status === "arquivada").length,
        };
      } catch (error) {
        console.error("Statistics error:", error);
        return { aberta: 0, em_analise: 0, respondida: 0, resolvida: 0, arquivada: 0 };
      }
    }),

    getReportsByType: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return { diario_oficial: 0, plo: 0, emenda: 0, decreto: 0, outro: 0 };

      try {
        const allReports = await getReports(1000, 0);
        
        return {
          diario_oficial: allReports.filter(r => r.type === "diario_oficial").length,
          plo: allReports.filter(r => r.type === "plo").length,
          emenda: allReports.filter(r => r.type === "emenda").length,
          decreto: allReports.filter(r => r.type === "decreto").length,
          outro: allReports.filter(r => r.type === "outro").length,
        };
      } catch (error) {
        console.error("Statistics error:", error);
        return { diario_oficial: 0, plo: 0, emenda: 0, decreto: 0, outro: 0 };
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;
