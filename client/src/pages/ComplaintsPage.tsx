import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Upload, CheckCircle, Shield, Lock } from "lucide-react";
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
  baixa: { label: "Baixa", color: "bg-blue-600", textColor: "text-blue-400", icon: "📋" },
  media: { label: "Média", color: "bg-yellow-500", textColor: "text-yellow-400", icon: "⚠️" },
  alta: { label: "Alta", color: "bg-orange-600", textColor: "text-orange-400", icon: "🔥" },
  critica: { label: "Crítica", color: "bg-red-600", textColor: "text-red-400", icon: "💥" },
};

export default function ComplaintsPage() {
  const [, navigate] = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<"baixa" | "media" | "alta" | "critica">("media");

  const createComplaint = trpc.complaints.create.useMutation({
    onSuccess: () => {
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 border-b-4 border-red-600 bg-black py-6">
          <div className="container mx-auto">
            <h1 className="text-3xl font-black cursor-pointer" onClick={() => navigate("/")}>
              <span className="text-red-600">BOCA</span>
              <span className="text-white ml-2">ABERTA</span>
            </h1>
          </div>
        </header>

        {/* Success Card */}
        <div className="max-w-md w-full mt-20">
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg border-2 border-green-400 p-8 text-center">
            <CheckCircle className="w-20 h-20 text-green-300 mx-auto mb-6" />
            <h2 className="text-3xl font-black mb-4">DENÚNCIA REGISTRADA!</h2>
            <p className="text-lg mb-6">
              Sua denúncia foi recebida e será analisada pela administração.
            </p>
            <div className="bg-black bg-opacity-50 rounded p-4 mb-6">
              <p className="text-sm text-gray-300 mb-2">Número de Protocolo</p>
              <p className="text-2xl font-black text-yellow-400">#2026-{Math.random().toString().slice(2, 6)}</p>
            </div>
            <p className="text-sm text-gray-200 mb-6">
              Guarde este número para acompanhar sua denúncia.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="w-full bg-yellow-400 text-black font-bold hover:bg-yellow-300 text-lg py-6"
            >
              Voltar à Página Inicial
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b-4 border-red-600 bg-black py-6 sticky top-0 z-50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-black cursor-pointer" onClick={() => navigate("/")}>
              <span className="text-red-600">BOCA</span>
              <span className="text-white ml-2">ABERTA</span>
            </h1>
            <Button variant="outline" onClick={() => navigate("/")}>
              ← Voltar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 py-12 border-b-4 border-yellow-400">
        <div className="container mx-auto">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-12 h-12 text-yellow-400 flex-shrink-0 mt-2" />
            <div>
              <h2 className="text-4xl font-black mb-3">ENCONTROU UMA IRREGULARIDADE?</h2>
              <p className="text-xl text-gray-100 mb-4">
                Denuncie gastos suspeitos, contratos irregulares e atos públicos questionáveis. 
                Sua denúncia é analisada e pode resultar em investigação.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto py-12">
        <div className="max-w-3xl mx-auto">
          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Anonimato */}
            <div className="bg-gray-900 border-2 border-green-600 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-black text-green-400">DENÚNCIA ANÔNIMA</h3>
              </div>
              <p className="text-gray-300">
                Você pode denunciar sem se identificar. Seus dados pessoais serão protegidos e não divulgados.
              </p>
            </div>

            {/* Segurança */}
            <div className="bg-gray-900 border-2 border-blue-600 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Lock className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-black text-blue-400">EVIDÊNCIAS SEGURAS</h3>
              </div>
              <p className="text-gray-300">
                Anexe documentos e evidências. Todos os arquivos são criptografados e protegidos.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-gray-900 border-2 border-red-600 rounded-lg p-8">
            <h3 className="text-3xl font-black mb-2 text-white">FORMULÁRIO DE DENÚNCIA</h3>
            <p className="text-gray-400 mb-8 border-b border-gray-700 pb-4">
              Preencha os campos abaixo para registrar sua denúncia. Quanto mais detalhes, melhor a análise.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Título */}
              <div>
                <label className="text-sm font-black text-yellow-400 mb-3 block uppercase">
                  Título da Denúncia *
                </label>
                <Input
                  placeholder="Ex: Gasto suspeito em Decreto 4340"
                  {...register("title")}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 text-lg py-3"
                />
                {errors.title && (
                  <p className="text-red-400 text-sm mt-2 font-bold">{errors.title.message}</p>
                )}
              </div>

              {/* Descrição */}
              <div>
                <label className="text-sm font-black text-yellow-400 mb-3 block uppercase">
                  Descrição Detalhada *
                </label>
                <Textarea
                  placeholder="Descreva a irregularidade em detalhes. Inclua datas, valores, pessoas envolvidas e por que você acredita que há uma irregularidade."
                  rows={8}
                  {...register("description")}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 text-base"
                />
                {errors.description && (
                  <p className="text-red-400 text-sm mt-2 font-bold">{errors.description.message}</p>
                )}
              </div>

              {/* Severidade */}
              <div>
                <label className="text-sm font-black text-yellow-400 mb-4 block uppercase">
                  Nível de Severidade *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(severityConfig).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSelectedSeverity(key as any);
                        register("severity").onChange({ target: { value: key } });
                      }}
                      className={`p-4 rounded-lg border-2 transition-all font-black text-center ${
                        severity === key
                          ? `${config.color} border-yellow-400 text-white`
                          : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                      }`}
                    >
                      <div className="text-2xl mb-2">{config.icon}</div>
                      <div className="text-sm">{config.label}</div>
                    </button>
                  ))}
                </div>
                {severity === "critica" && (
                  <div className="mt-4 bg-red-600 bg-opacity-20 border-l-4 border-red-600 p-4 rounded">
                    <p className="text-red-400 font-bold">
                      ⚠️ ATENÇÃO: Denúncias críticas serão notificadas imediatamente à administração e podem resultar em investigação urgente.
                    </p>
                  </div>
                )}
              </div>

              {/* Informações do Denunciante */}
              <div className="border-t border-gray-700 pt-8">
                <h4 className="text-lg font-black text-yellow-400 mb-6 uppercase">
                  Informações do Denunciante (Opcional)
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-gray-400 mb-2 block">Nome</label>
                    <Input
                      placeholder="Seu nome (opcional)"
                      {...register("reporterName")}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-gray-400 mb-2 block">Email</label>
                      <Input
                        type="email"
                        placeholder="seu@email.com (opcional)"
                        {...register("reporterEmail")}
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-gray-400 mb-2 block">Telefone</label>
                      <Input
                        placeholder="(19) 9999-9999 (opcional)"
                        {...register("reporterPhone")}
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 italic">
                    Deixe em branco para fazer uma denúncia anônima. Se preenchido, você poderá receber atualizações sobre sua denúncia.
                  </p>
                </div>
              </div>

              {/* Evidências */}
              <div className="border-t border-gray-700 pt-8">
                <h4 className="text-lg font-black text-yellow-400 mb-6 uppercase">Evidências (Opcional)</h4>

                <div className="border-2 border-dashed border-yellow-400 rounded-lg p-8 text-center hover:border-yellow-300 transition cursor-pointer bg-gray-800 bg-opacity-50">
                  <Upload className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
                  <p className="text-base text-gray-200 font-bold">
                    Arraste arquivos aqui ou clique para selecionar
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Máximo 10MB. Aceita: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
                  </p>
                </div>
              </div>

              {/* Submit */}
              <div className="border-t border-gray-700 pt-8 flex gap-4">
                <Button
                  type="submit"
                  disabled={createComplaint.isPending}
                  className="flex-1 bg-yellow-400 text-black font-black hover:bg-yellow-300 text-lg py-6"
                >
                  {createComplaint.isPending ? "REGISTRANDO..." : "REGISTRAR DENÚNCIA"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold text-lg py-6"
                  onClick={() => navigate("/")}
                >
                  CANCELAR
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center italic">
                Ao registrar uma denúncia, você concorda com nossa Política de Privacidade e Termos de Uso.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 py-8 mt-12">
        <div className="container mx-auto text-center text-gray-400">
          <p>Boca Aberta - Plataforma de Transparência e Auditoria Cidadã</p>
        </div>
      </footer>
    </div>
  );
}
