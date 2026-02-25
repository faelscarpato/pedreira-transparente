import { invokeLLM } from "./_core/llm";
import type { Report } from "../drizzle/schema";

/**
 * Gera um resumo em linguagem simples de um relatório jurídico complexo
 */
export async function generateReportSummary(report: Report): Promise<string> {
  try {
    const prompt = `Você é um especialista em legislação municipal. Analise o seguinte relatório jurídico e gere um resumo em linguagem simples e acessível para cidadãos comuns.

Título: ${report.title}
Tipo: ${report.type}
Descrição: ${report.description || ""}

Gere um resumo de 2-3 parágrafos que:
1. Explique o que é o ato em linguagem simples
2. Destaque os pontos principais
3. Indique se há potenciais irregularidades ou pontos de atenção

Resumo:`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "Você é um especialista em legislação municipal que explica documentos jurídicos em linguagem simples e acessível para cidadãos comuns.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const summaryContent = response.choices[0]?.message?.content || "";
    const summary = typeof summaryContent === "string" ? summaryContent : "";
    return summary.substring(0, 1000); // Limitar a 1000 caracteres
  } catch (error) {
    console.error("[LLM] Erro ao gerar resumo:", error);
    return "Resumo não disponível no momento.";
  }
}

/**
 * Extrai indicadores de conformidade de um relatório
 */
export async function extractComplianceIndicators(report: Report): Promise<{
  conformityScore: number;
  issues: string[];
  recommendations: string[];
}> {
  try {
    const prompt = `Você é um auditor jurídico especializado em legislação municipal. Analise o seguinte relatório e identifique potenciais problemas de conformidade.

Título: ${report.title}
Tipo: ${report.type}
Descrição: ${report.description || ""}

Responda em JSON com a seguinte estrutura:
{
  "conformityScore": <número de 0 a 100>,
  "issues": [<lista de problemas identificados>],
  "recommendations": [<lista de recomendações>]
}

Considere:
- Conformidade com CF/88
- Conformidade com Lei Orgânica Municipal
- Transparência e publicidade
- Legalidade e legitimidade
- Impacto fiscal

Responda APENAS com JSON válido.`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "Você é um auditor jurídico especializado em legislação municipal. Responda sempre em JSON válido.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = typeof response.choices[0]?.message?.content === "string" 
      ? response.choices[0].message.content 
      : "{}";
    
    try {
      const parsed = JSON.parse(content);
      return {
        conformityScore: Math.min(100, Math.max(0, parsed.conformityScore || 50)),
        issues: Array.isArray(parsed.issues) ? parsed.issues.slice(0, 5) : [],
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations.slice(0, 5) : [],
      };
    } catch {
      return {
        conformityScore: 50,
        issues: ["Análise de conformidade não disponível"],
        recommendations: ["Revisar manualmente"],
      };
    }
  } catch (error) {
    console.error("[LLM] Erro ao extrair indicadores:", error);
    return {
      conformityScore: 0,
      issues: ["Erro na análise"],
      recommendations: [],
    };
  }
}

/**
 * Gera um resumo executivo de uma denúncia para notificação ao admin
 */
export async function generateComplaintSummary(title: string, description: string): Promise<string> {
  try {
    const prompt = `Gere um resumo executivo de uma denúncia cidadã em máximo 2 parágrafos.

Título: ${title}
Descrição: ${description}

Resumo:`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "Você é um analista de denúncias. Gere resumos executivos concisos e profissionais.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const contentResp = response.choices[0]?.message?.content || "Resumo não disponível.";
    return typeof contentResp === "string" ? contentResp : "Resumo não disponível.";
  } catch (error) {
    console.error("[LLM] Erro ao gerar resumo de denúncia:", error);
    return "Resumo não disponível.";
  }
}

/**
 * Detecta automaticamente a severidade de uma denúncia baseado no conteúdo
 */
export async function detectComplaintSeverity(title: string, description: string): Promise<"baixa" | "media" | "alta" | "critica"> {
  try {
    const prompt = `Analise a seguinte denúncia e determine seu nível de severidade.

Título: ${title}
Descrição: ${description}

Responda com APENAS uma palavra: "baixa", "media", "alta" ou "critica".

Critérios:
- baixa: questão menor ou administrativa
- media: irregularidade significativa
- alta: irregularidade grave
- critica: possível crime ou fraude

Resposta:`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "Você é um analista de denúncias. Responda com apenas uma palavra.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const contentStr = typeof response.choices[0]?.message?.content === "string" 
      ? response.choices[0].message.content 
      : "media";
    const content = contentStr.toLowerCase().trim();
    
    if (["baixa", "media", "alta", "critica"].includes(content)) {
      return content as "baixa" | "media" | "alta" | "critica";
    }
    
    return "media";
  } catch (error) {
    console.error("[LLM] Erro ao detectar severidade:", error);
    return "media";
  }
}
