import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bell, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function SubscribePage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const subscribe = trpc.emailSubscriptions.subscribe.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Inscrição realizada! Verifique seu email.");
      setEmail("");
      setName("");
    },
    onError: (error) => {
      toast.error("Erro ao se inscrever: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Por favor, insira seu email");
      return;
    }
    subscribe.mutate({
      email,
      name: name || undefined,
      subscribeToNewReports: true,
      subscribeToCriticalIssues: true,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <CardTitle>Inscrição Realizada</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-600">
              Um email de confirmação foi enviado para sua caixa de entrada.
            </p>
            <p className="text-sm text-slate-500">
              Clique no link de verificação para ativar suas notificações.
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
            <Bell className="w-6 h-6 text-blue-600" />
            Receba Notificações
          </h1>
          <p className="text-slate-600 mt-1">Fique informado sobre novos relatórios e irregularidades</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-base">📊 Novos Relatórios</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Receba alertas quando novos relatórios de auditoria forem publicados.
              </CardContent>
            </Card>
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-base">⚠️ Irregularidades</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Seja notificado imediatamente sobre denúncias críticas e problemas graves.
              </CardContent>
            </Card>
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-base">🔒 Privacidade</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Seus dados são protegidos e você pode desinscrever-se a qualquer momento.
              </CardContent>
            </Card>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Inscrever-se em Notificações</CardTitle>
              <CardDescription>Preencha seus dados para receber atualizações por email</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Email *
                  </label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Nome */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Nome (Opcional)
                  </label>
                  <Input
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    ✓ Você receberá alertas sobre novos relatórios de auditoria<br/>
                    ✓ Notificações imediatas sobre irregularidades críticas<br/>
                    ✓ Resumo semanal de atividades<br/>
                    ✓ Pode desinscrever-se a qualquer momento
                  </p>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={subscribe.isPending}
                    className="flex-1"
                  >
                    {subscribe.isPending ? "Inscrevendo..." : "Inscrever-se"}
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
                  Ao se inscrever, você concorda com nossa Política de Privacidade.
                  Você receberá um email de confirmação antes de ativar as notificações.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
