import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { ArrowRight, FileText, AlertCircle, TrendingUp, Shield, Bell } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">Pedreira Transparente</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 hover:text-slate-900 transition">Funcionalidades</a>
            <a href="#reports" className="text-slate-600 hover:text-slate-900 transition">Relatórios</a>
            <a href="#contact" className="text-slate-600 hover:text-slate-900 transition">Contato</a>
            {isAuthenticated ? (
              <Button onClick={() => navigate("/admin")} variant="default">
                Painel Admin
              </Button>
            ) : (
              <Button asChild variant="default">
                <a href={getLoginUrl()}>Entrar</a>
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Transparência Pública ao Alcance de Todos
          </h2>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Acesse relatórios de auditoria, projetos de lei e denúncias de forma clara e acessível. 
            Cobre o executivo e o legislativo com informações confiáveis e verificadas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <a href="#reports">
                Consultar Relatórios <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#complaints">Fazer Denúncia</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Como Funciona
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: "Relatórios Diários",
                description: "Acesse Diário Oficial, Projetos de Lei e Emendas publicados diariamente com análise jurídica completa."
              },
              {
                icon: TrendingUp,
                title: "Indicadores de Conformidade",
                description: "Visualize automaticamente indicadores de conformidade com legislação municipal e federal."
              },
              {
                icon: AlertCircle,
                title: "Denúncias Cidadãs",
                description: "Registre irregularidades e denuncie atos públicos suspeitos de forma segura e anônima."
              },
              {
                icon: Bell,
                title: "Notificações",
                description: "Receba alertas por email sobre novos relatórios e irregularidades críticas detectadas."
              },
              {
                icon: Shield,
                title: "Análise Especializada",
                description: "Resumos em linguagem acessível gerados por IA para facilitar compreensão de documentos complexos."
              },
              {
                icon: TrendingUp,
                title: "Histórico Completo",
                description: "Acesse todo o histórico de atos públicos com busca avançada e filtros por tipo e data."
              }
            ].map((feature, idx) => (
              <Card key={idx} className="border-slate-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="w-8 h-8 text-blue-600 mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reports Preview Section */}
      <section id="reports" className="py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Últimos Relatórios
          </h3>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {[
              {
                type: "Diário Oficial",
                title: "Edição 1950 - 11/02/2026",
                date: "11 de fevereiro de 2026",
                issues: 3
              },
              {
                type: "Projeto de Lei",
                title: "PLO 45/2025 - Programa É Tempo de Leitura",
                date: "26 de junho de 2025",
                issues: 0
              },
              {
                type: "Decreto",
                title: "Decreto 4.379/2026 - SAAE",
                date: "10 de fevereiro de 2026",
                issues: 1
              },
              {
                type: "Emenda",
                title: "Emenda ao Decreto 4.340/2026",
                date: "03 de dezembro de 2025",
                issues: 2
              }
            ].map((report, idx) => (
              <Card key={idx} className="border-slate-200 hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-semibold text-blue-600 mb-1">{report.type}</div>
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <CardDescription>{report.date}</CardDescription>
                    </div>
                    {report.issues > 0 && (
                      <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {report.issues} {report.issues === 1 ? "achado" : "achados"}
                      </div>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <a href="/reports">Ver Todos os Relatórios</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Complaints Section */}
      <section id="complaints" className="bg-white py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <h3 className="text-3xl font-bold text-center text-slate-900 mb-6">
            Denuncie Irregularidades
          </h3>
          <p className="text-center text-slate-600 mb-8">
            Sua denúncia é importante para manter a transparência pública. 
            Você pode denunciar de forma anônima ou identificada.
          </p>
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Registrar Denúncia</CardTitle>
              <CardDescription>
                Descreva a irregularidade detectada e anexe evidências
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" size="lg">
                <a href="/complaints/new">Abrir Formulário de Denúncia</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Receba Notificações de Novos Relatórios
          </h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Inscreva-se para receber alertas por email quando novos relatórios forem publicados 
            ou irregularidades críticas forem detectadas.
          </p>
          <Button asChild variant="secondary" size="lg">
            <a href="/subscribe">Inscrever-se Agora</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4">Sobre</h4>
              <p className="text-sm">
                Plataforma de transparência e auditoria cidadã para o município de Pedreira/SP.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Links</h4>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition">Relatórios</a></li>
                <li><a href="#" className="hover:text-white transition">Denúncias</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition">Termos</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contato</h4>
              <p className="text-sm">
                Email: contato@pedreiratransparente.gov.br<br/>
                Tel: (19) 3000-0000
              </p>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-sm">
            <p>&copy; 2026 Pedreira Transparente. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
