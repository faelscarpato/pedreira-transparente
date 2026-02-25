import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Upload, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

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

export default function ComplaintsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <CardTitle>Denúncia Registrada com Sucesso</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-600">
              Sua denúncia foi registrada e será analisada pela administração.
            </p>
            <p className="text-sm text-slate-500">
              Número de protocolo: <span className="font-mono font-bold">#2026-001</span>
            </p>
            <Button onClick={() => window.location.href = "/"} className="w-full">
              Voltar à Página Inicial
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
            Registrar Denúncia
          </h1>
          <p className="text-slate-600 mt-1">Denuncie irregularidades e atos suspeitos de forma segura</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-base">Denúncia Anônima</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Você pode fazer uma denúncia sem se identificar. Seus dados pessoais serão protegidos.
              </CardContent>
            </Card>
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-base">Evidências Seguras</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Anexe documentos e evidências. Todos os arquivos são criptografados e protegidos.
              </CardContent>
            </Card>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Formulário de Denúncia</CardTitle>
              <CardDescription>Preencha os campos abaixo para registrar sua denúncia</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Título */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Título da Denúncia *
                  </label>
                  <Input
                    placeholder="Ex: Irregularidade no Decreto 4340"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                {/* Descrição */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Descrição Detalhada *
                  </label>
                  <Textarea
                    placeholder="Descreva a irregularidade em detalhes. Inclua datas, valores, pessoas envolvidas e por que você acredita que há uma irregularidade."
                    rows={6}
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                {/* Severidade */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Nível de Severidade *
                  </label>
                  <Select defaultValue="media" onValueChange={(value) => register("severity").onChange({ target: { value } })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa - Questão menor ou administrativa</SelectItem>
                      <SelectItem value="media">Média - Irregularidade significativa</SelectItem>
                      <SelectItem value="alta">Alta - Irregularidade grave</SelectItem>
                      <SelectItem value="critica">Crítica - Possível crime ou fraude</SelectItem>
                    </SelectContent>
                  </Select>
                  {severity === "critica" && (
                    <p className="text-red-600 text-sm mt-2">
                      ⚠️ Denúncias críticas serão notificadas imediatamente à administração
                    </p>
                  )}
                </div>

                {/* Informações do Denunciante */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Informações do Denunciante (Opcional)</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Nome
                      </label>
                      <Input
                        placeholder="Seu nome (opcional)"
                        {...register("reporterName")}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">
                          Email
                        </label>
                        <Input
                          type="email"
                          placeholder="seu@email.com (opcional)"
                          {...register("reporterEmail")}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">
                          Telefone
                        </label>
                        <Input
                          placeholder="(19) 9999-9999 (opcional)"
                          {...register("reporterPhone")}
                        />
                      </div>
                    </div>

                    <p className="text-xs text-slate-500">
                      Deixe em branco para fazer uma denúncia anônima. Se preenchido, você poderá receber atualizações sobre sua denúncia.
                    </p>
                  </div>
                </div>

                {/* Evidências */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Evidências (Opcional)</h3>
                  
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition cursor-pointer">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">
                      Arraste arquivos aqui ou clique para selecionar
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Máximo 10MB. Aceita: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
                    </p>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={createComplaint.isPending}
                    className="flex-1"
                  >
                    {createComplaint.isPending ? "Registrando..." : "Registrar Denúncia"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.location.href = "/"}
                  >
                    Cancelar
                  </Button>
                </div>

                <p className="text-xs text-slate-500 text-center">
                  Ao registrar uma denúncia, você concorda com nossa Política de Privacidade e Termos de Uso.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
