import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Upload, CheckCircle, Shield, Lock, ArrowLeft, Info } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";

const complaintSchema = z.object({
  title: z.string().min(10, "Título deve ter pelo menos 10 caracteres"),
  description: z.string().min(50, "Descrição deve ter pelo menos 50 caracteres"),
  severity: z.enum(["baixa", "media", "alta", "critica"]),
  reporterName: z.string().optional(),
  reporterEmail: z.string().email().optional().or(z.literal("")),
  reporterPhone: z.string().optional(),
  evidenceUrl: z.string().optional(),
});

type ComplaintFormData = z.infer<typeof complaintSchema>;

const severityConfig = {
  baixa: { label: "Baixa", color: "bg-blue-600", textColor: "text-blue-400", icon: "📋", description: "Pequenas irregularidades administrativas" },
  media: { label: "Média", color: "bg-yellow-500", textColor: "text-yellow-400", icon: "⚠️", description: "Irregularidades moderadas" },
  alta: { label: "Alta", color: "bg-orange-600", textColor: "text-orange-400", icon: "🔥", description: "Irregularidades graves" },
  critica: { label: "Crítica", color: "bg-red-600", textColor: "text-red-400", icon: "💥", description: "Irregularidades muito graves" },
};

export default function ComplaintsPage() {
  const [, navigate] = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [protocolNumber, setProtocolNumber] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<"baixa" | "media" | "alta" | "critica">("media");

  const createComplaint = trpc.complaints.create.useMutation({
    onSuccess: (data) => {
      setProtocolNumber(data.protocolNumber);
      setSubmitted(true);
      toast.success("Denúncia registrada com sucesso!");
      reset();
    },
    onError: (error) => {
      toast.error("Erro ao registrar denúncia: " + error.message);
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
    defaultValues: { severity: "media" },
  });

  const severity = watch("severity");

  const onSubmit = async (data: ComplaintFormData) => {
    await createComplaint.mutateAsync({
      title: data.title,
      description: data.description,
      severity: data.severity,
      reporterName: data.reporterName,
      reporterEmail: data.reporterEmail || undefined,
      reporterPhone: data.reporterPhone,
      evidenceUrl: data.evidenceUrl,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        {/* Header */}
        <header className="border-b-4 border-red-600 bg-black py-3 sm:py-4 md:py-6 sticky top-0 z-50">
          <div className="container mx-auto px-responsive">
            <button 
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-bold text-sm sm:text-base"
            >
              <ArrowLeft size={20} /> Voltar
            </button>
          </div>
        </header>

        {/* Success Card - Mobile First */}
        <div className="flex-1 flex items-center justify-center py-6 sm:py-8 md:py-12 px-responsive">
          <div className="w-full max-w-md">
            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg border-2 border-green-400 p-4 sm:p-6 md:p-8 text-center">
              <CheckCircle className="w-16 sm:w-20 h-16 sm:h-20 text-green-300 mx-auto mb-4 sm:mb-6" />
              <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4">DENÚNCIA REGISTRADA!</h2>
              <p className="text-base sm:text-lg text-gray-100 mb-4 sm:mb-6">
                Sua denúncia foi recebida e será analisada pela administração em breve.
              </p>
              
              <div className="bg-black bg-opacity-50 rounded p-3 sm:p-4 mb-4 sm:mb-6 border-2 border-green-400">
                <p className="text-xs sm:text-sm text-gray-300 mb-2">Número de Protocolo</p>
                <p className="font-headline text-2xl sm:text-3xl text-yellow-400 break-all">{protocolNumber}</p>
              </div>
              
              <div className="bg-green-900 bg-opacity-50 rounded p-3 sm:p-4 mb-4 sm:mb-6 border-l-4 border-green-400">
                <p className="text-xs sm:text-sm text-gray-200">
                  Guarde este número para acompanhar sua denúncia. Você pode rastreá-la a qualquer momento usando o número de protocolo.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  onClick={() => navigate("/track")}
                  className="btn-primary-responsive flex-1"
                >
                  Rastrear Denúncia
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  className="btn-secondary-responsive flex-1"
                >
                  Voltar ao Início
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header - Mobile First */}
      <header className="border-b-4 border-red-600 bg-black py-3 sm:py-4 md:py-6 sticky top-0 z-50 header-responsive">
        <div className="container mx-auto px-responsive">
          <div className="flex items-center justify-between">
            <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl cursor-pointer" onClick={() => navigate("/")}>
              <span className="text-red-600">BOCA</span>
              <span className="text-white ml-1 sm:ml-2">ABERTA</span>
            </h1>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/")}
              className="text-xs sm:text-sm"
            >
              ← Voltar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - Mobile First */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 py-6 sm:py-8 md:py-12 border-b-4 border-yellow-400">
        <div className="container mx-auto px-responsive">
          <div className="flex items-start gap-3 sm:gap-4">
            <AlertTriangle className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-yellow-400 flex-shrink-0 mt-1 sm:mt-2" />
            <div>
              <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">ENCONTROU UMA IRREGULARIDADE?</h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-100">
                Denuncie gastos suspeitos, contratos irregulares e atos públicos questionáveis. Sua denúncia é analisada e pode resultar em investigação.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section - Mobile First */}
      <section className="py-6 sm:py-8 md:py-12 bg-black">
        <div className="container mx-auto px-responsive max-w-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
            
            {/* Info Box */}
            <div className="bg-blue-900 bg-opacity-30 border-l-4 border-blue-400 p-3 sm:p-4 rounded-lg flex gap-3 sm:gap-4">
              <Info className="w-5 sm:w-6 h-5 sm:h-6 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-blue-100">
                <p className="font-bold mb-1">Dicas para uma denúncia eficaz:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Seja específico e claro sobre o que está denunciando</li>
                  <li>Inclua datas, valores e nomes quando possível</li>
                  <li>Forneça evidências ou documentos relevantes</li>
                  <li>Sua identidade será protegida se desejar</li>
                </ul>
              </div>
            </div>

            {/* Title Field */}
            <div>
              <label className="form-label-responsive">
                Título da Denúncia *
              </label>
              <Input
                {...register("title")}
                placeholder="Ex: Gasto suspeito em eventos municipais"
                className="form-input-responsive"
              />
              {errors.title && <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.title.message}</p>}
            </div>

            {/* Description Field */}
            <div>
              <label className="form-label-responsive">
                Descrição Detalhada *
              </label>
              <Textarea
                {...register("description")}
                placeholder="Descreva a irregularidade em detalhes. Inclua datas, valores, nomes de pessoas envolvidas, etc."
                className="form-input-responsive min-h-24 sm:min-h-32"
              />
              {errors.description && <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.description.message}</p>}
            </div>

            {/* Severity Selection - Mobile First */}
            <div>
              <label className="form-label-responsive">
                Nível de Severidade *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {(Object.entries(severityConfig) as Array<[keyof typeof severityConfig, typeof severityConfig["baixa"]]>).map(([key, config]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedSeverity(key)}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-center ${
                      selectedSeverity === key
                        ? `${config.color} border-white scale-105`
                        : "border-gray-600 hover:border-gray-400"
                    }`}
                  >
                    <div className="text-2xl sm:text-3xl mb-1">{config.icon}</div>
                    <div className="font-bold text-xs sm:text-sm">{config.label}</div>
                    <div className="text-xs text-gray-300 mt-1 hidden sm:block">{config.description}</div>
                  </button>
                ))}
              </div>
              <input type="hidden" {...register("severity")} value={selectedSeverity} />
            </div>

            {/* Reporter Info */}
            <div className="bg-gray-900 rounded-lg p-4 sm:p-6 border border-gray-700">
              <h3 className="font-bold text-sm sm:text-base mb-4 flex items-center gap-2">
                <Shield size={18} /> Informações do Denunciante (Opcional)
              </h3>
              
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="form-label-responsive">
                    Nome
                  </label>
                  <Input
                    {...register("reporterName")}
                    placeholder="Seu nome (opcional)"
                    className="form-input-responsive"
                  />
                </div>

                <div>
                  <label className="form-label-responsive">
                    Email
                  </label>
                  <Input
                    {...register("reporterEmail")}
                    type="email"
                    placeholder="seu@email.com (opcional)"
                    className="form-input-responsive"
                  />
                  {errors.reporterEmail && <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.reporterEmail.message}</p>}
                </div>

                <div>
                  <label className="form-label-responsive">
                    Telefone
                  </label>
                  <Input
                    {...register("reporterPhone")}
                    type="tel"
                    placeholder="(19) 9999-9999 (opcional)"
                    className="form-input-responsive"
                  />
                </div>
              </div>

              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-black bg-opacity-50 rounded border-l-4 border-blue-400 text-xs sm:text-sm text-blue-100 flex gap-2">
                <Lock size={16} className="flex-shrink-0 mt-0.5" />
                <p>Suas informações pessoais serão protegidas e não serão divulgadas publicamente.</p>
              </div>
            </div>

            {/* Evidence URL */}
            <div>
              <label className="form-label-responsive">
                URL de Evidência (Opcional)
              </label>
              <Input
                {...register("evidenceUrl")}
                type="url"
                placeholder="https://exemplo.com/documento.pdf"
                className="form-input-responsive"
              />
              <p className="text-xs sm:text-sm text-gray-400 mt-2">Você pode fornecer um link para documentos, imagens ou vídeos que comprovem a irregularidade.</p>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
              <Button
                type="submit"
                disabled={createComplaint.isPending}
                className="btn-primary-responsive flex-1 text-base sm:text-lg py-3 sm:py-4"
              >
                {createComplaint.isPending ? "Enviando..." : "Enviar Denúncia"}
              </Button>
              <Button
                type="button"
                onClick={() => navigate("/")}
                className="btn-secondary-responsive flex-1 text-base sm:text-lg py-3 sm:py-4"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t-4 border-red-600 py-6 sm:py-8 md:py-10">
        <div className="container mx-auto px-responsive">
          <p className="text-xs sm:text-sm text-gray-400 text-center">
            © 2026 Boca Aberta - Plataforma de Transparência e Auditoria Cidadã
          </p>
        </div>
      </footer>
    </div>
  );
}
