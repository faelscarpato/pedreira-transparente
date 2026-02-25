import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, TrendingUp, AlertTriangle, DollarSign, FileText, MessageCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function Home() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { data: reports } = trpc.reports.list.useQuery({ limit: 6, offset: 0 });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header do Jornal */}
      <header className="border-b-4 border-red-600 bg-black py-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-black">
                <span className="text-red-600">BOCA</span>
                <span className="text-white ml-2">ABERTA</span>
              </div>
              <div className="hidden md:block border-l-4 border-yellow-400 pl-4">
                <p className="text-yellow-400 font-bold text-sm">O DESTINO DO SEU DINHEIRO NA CARA!</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate("/statistics")}>
                Estatísticas
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/reports")}>
                Relatórios
              </Button>
              {user ? (
                <Button size="sm" onClick={() => navigate("/admin")}>
                  Painel Admin
                </Button>
              ) : (
                <Button size="sm" onClick={() => navigate("/subscribe")}>
                  Inscrever-se
                </Button>
              )}
            </div>
          </div>
          <nav className="flex gap-6 border-t border-gray-700 pt-4 text-sm font-bold">
            <a href="#" className="text-yellow-400 hover:text-yellow-300">INÍCIO</a>
            <a href="#" className="text-white hover:text-yellow-400">LICITAÇÕES</a>
            <a href="#" className="text-white hover:text-yellow-400">GASTOS</a>
            <a href="#" className="text-white hover:text-yellow-400">INVESTIGAÇÕES</a>
            <a href="#" className="text-white hover:text-yellow-400">TRANSPARÊNCIA</a>
            <a href="#" className="text-white hover:text-yellow-400">CONTATO</a>
          </nav>
        </div>
      </header>

      {/* Manchete Principal */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 py-12 border-b-4 border-yellow-400">
        <div className="container mx-auto">
          <h1 className="main-headline mb-4">
            FISCALIZE O EXECUTIVO E O LEGISLATIVO
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl">
            Acesse relatórios de auditoria, projetos de lei e denúncias de forma clara e acessível. 
            Cobre o governo com informações confiáveis e verificadas.
          </p>
          <div className="flex gap-4">
            <Button 
              size="lg" 
              className="bg-yellow-400 text-black font-bold hover:bg-yellow-300"
              onClick={() => navigate("/reports")}
            >
              Consultar Relatórios <ArrowRight className="ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
              onClick={() => navigate("/complaints/new")}
            >
              Fazer Denúncia
            </Button>
          </div>
        </div>
      </section>

      {/* Destaques do Dia */}
      <section className="py-12 bg-black border-b-4 border-red-600">
        <div className="container mx-auto">
          <div className="section-header mb-8">DESTAQUES DO DIA</div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="investigation-card">
              <div className="mb-4">
                <span className="bg-red-600 text-white px-3 py-1 text-xs font-bold rounded">GASTOS</span>
              </div>
              <h3 className="text-2xl font-black mb-3">R$ 5 MILHÕES EM FESTAS?</h3>
              <p className="text-gray-300 mb-4">Prefeitura gastou uma fortuna em eventos. Veja os detalhes.</p>
              <Button variant="outline" size="sm" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
                Saiba Mais
              </Button>
            </div>

            {/* Card 2 */}
            <div className="investigation-card">
              <div className="mb-4">
                <span className="bg-red-600 text-white px-3 py-1 text-xs font-bold rounded">LICITAÇÃO</span>
              </div>
              <h3 className="text-2xl font-black mb-3">CONTRATO SUSPEITO</h3>
              <p className="text-gray-300 mb-4">R$ 800 mil em material de papelaria sem licitação aberta.</p>
              <Button variant="outline" size="sm" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
                Analise o Caso
              </Button>
            </div>

            {/* Card 3 */}
            <div className="investigation-card">
              <div className="mb-4">
                <span className="bg-red-600 text-white px-3 py-1 text-xs font-bold rounded">OBRAS</span>
              </div>
              <h3 className="text-2xl font-black mb-3">OBRAS PARADAS</h3>
              <p className="text-gray-300 mb-4">R$ 2 milhões investidos em projetos abandonados.</p>
              <Button variant="outline" size="sm" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
                Ver Reportagem
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Onde está o dinheiro? */}
      <section className="py-12 bg-gray-900 border-b-4 border-yellow-400">
        <div className="container mx-auto">
          <div className="section-header mb-8">ONDE ESTÁ O DINHEIRO?</div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Receitas */}
            <div className="bg-black border-2 border-green-600 rounded-lg p-6">
              <h3 className="text-2xl font-black text-green-400 mb-4">RECEITAS MUNICIPAIS</h3>
              <div className="text-5xl font-black text-green-400 mb-2">R$ 235 MILHÕES</div>
              <p className="text-gray-400 text-sm">Arrecadação total do município em 2025</p>
              <Button variant="outline" size="sm" className="mt-4 border-green-400 text-green-400">
                Acessar Painel
              </Button>
            </div>

            {/* Despesas */}
            <div className="bg-black border-2 border-red-600 rounded-lg p-6">
              <h3 className="text-2xl font-black text-red-600 mb-4">DESPESAS MUNICIPAIS</h3>
              <div className="text-5xl font-black text-red-600 mb-2">R$ 278 MILHÕES</div>
              <p className="text-gray-400 text-sm">Gastos totais do município em 2025</p>
              <Button variant="outline" size="sm" className="mt-4 border-red-600 text-red-600">
                Acessar Painel
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Relatórios Recentes */}
      <section className="py-12 bg-black border-b-4 border-red-600">
        <div className="container mx-auto">
          <div className="section-header mb-8">RELATÓRIOS RECENTES</div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {reports?.reports?.slice(0, 4).map((report) => (
              <Card key={report.id} className="bg-gray-900 border-gray-700 p-6 hover:border-red-600 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">
                      {report.type.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-500 text-sm">
                    {new Date(report.publishedDate).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{report.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{report.description}</p>
                <Button variant="outline" size="sm" className="border-yellow-400 text-yellow-400">
                  Ler Relatório
                </Button>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => navigate("/reports")}
            >
              Ver Todos os Relatórios <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA - Denúncias */}
      <section className="py-12 bg-gradient-to-r from-red-600 to-red-800 border-b-4 border-yellow-400">
        <div className="container mx-auto text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
          <h2 className="text-4xl font-black mb-4">ENCONTROU UMA IRREGULARIDADE?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Denuncie gastos suspeitos, contratos irregulares e obras paradas. 
            Suas denúncias são analisadas e publicadas com segurança.
          </p>
          <Button 
            size="lg" 
            className="bg-yellow-400 text-black font-bold hover:bg-yellow-300"
            onClick={() => navigate("/complaints/new")}
          >
            Fazer Denúncia Agora
          </Button>
        </div>
      </section>

      {/* CTA - Inscrição */}
      <section className="py-12 bg-black border-b-4 border-red-600">
        <div className="container mx-auto text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
          <h2 className="text-4xl font-black mb-4">RECEBA NOTIFICAÇÕES</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Seja notificado quando novos relatórios forem publicados e quando denúncias críticas forem registradas.
          </p>
          <Button 
            size="lg" 
            className="bg-yellow-400 text-black font-bold hover:bg-yellow-300"
            onClick={() => navigate("/subscribe")}
          >
            Inscrever-se por Email
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 py-8">
        <div className="container mx-auto text-center text-gray-400">
          <p className="mb-4">Boca Aberta - Plataforma de Transparência e Auditoria Cidadã</p>
          <p className="text-sm">Desenvolvido para fiscalizar o executivo e o legislativo municipal</p>
          <p className="text-xs mt-4">© 2026 - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
}
