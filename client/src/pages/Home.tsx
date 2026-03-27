import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, TrendingUp, AlertTriangle, DollarSign, FileText, MessageCircle, Menu, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useState } from "react";

export default function Home() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: reports } = trpc.reports.list.useQuery({ limit: 6, offset: 0 });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header do Jornal - Mobile First */}
      <header className="border-b-4 border-red-600 bg-black py-3 sm:py-4 md:py-6 header-responsive" role="banner">
        <div className="container mx-auto">
          {/* Logo e Menu Toggle */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl">
                <span className="text-red-600">BOCA</span>
                <span className="text-white ml-1 sm:ml-2">ABERTA</span>
              </h1>
              <div className="hidden md:block border-l-4 border-yellow-400 pl-4">
                <p className="text-yellow-400 font-bold text-xs sm:text-sm">O DESTINO DO SEU DINHEIRO NA CARA!</p>
              </div>
            </div>
            
            {/* Menu Mobile Toggle */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Desktop Buttons */}
            <div className="hidden md:flex gap-2">
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

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex gap-4 lg:gap-6 border-t border-gray-700 pt-4 text-xs sm:text-sm font-bold">
            <a href="/" className="text-yellow-400 hover:text-yellow-300">INÍCIO</a>
            <a href="/reports" className="text-white hover:text-yellow-400">LICITAÇÕES</a>
            <a href="/reports" className="text-white hover:text-yellow-400">GASTOS</a>
            <a href="/reports" className="text-white hover:text-yellow-400">INVESTIGAÇÕES</a>
            <a href="/statistics" className="text-white hover:text-yellow-400">TRANSPARÊNCIA</a>
            <a href="#" className="text-white hover:text-yellow-400">CONTATO</a>
          </nav>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-700 space-y-2">
              <nav className="flex flex-col gap-2 text-sm font-bold mb-4">
                <a href="/" className="text-yellow-400 hover:text-yellow-300 py-2">INÍCIO</a>
                <a href="/reports" className="text-white hover:text-yellow-400 py-2">LICITAÇÕES</a>
                <a href="/reports" className="text-white hover:text-yellow-400 py-2">GASTOS</a>
                <a href="/reports" className="text-white hover:text-yellow-400 py-2">INVESTIGAÇÕES</a>
                <a href="/statistics" className="text-white hover:text-yellow-400 py-2">TRANSPARÊNCIA</a>
                <a href="#" className="text-white hover:text-yellow-400 py-2">CONTATO</a>
              </nav>
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate("/statistics")}>
                  Estatísticas
                </Button>
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate("/reports")}>
                  Relatórios
                </Button>
                {user ? (
                  <Button size="sm" className="w-full" onClick={() => navigate("/admin")}>
                    Painel Admin
                  </Button>
                ) : (
                  <Button size="sm" className="w-full" onClick={() => navigate("/subscribe")}>
                    Inscrever-se
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Manchete Principal - Mobile First */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 py-6 sm:py-8 md:py-12 border-b-4 border-yellow-400" role="main">
        <div className="container mx-auto px-responsive">
          <h2 className="main-headline mb-3 sm:mb-4 md:mb-6">
            FISCALIZE O EXECUTIVO E O LEGISLATIVO
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 mb-6 sm:mb-8 max-w-3xl leading-relaxed">
            Acesse relatórios de auditoria, projetos de lei e denúncias de forma clara e acessível. 
            Cobre o governo com informações confiáveis e verificadas.
          </p>
          <div className="flex-responsive">
            <Button 
              size="lg" 
              className="btn-primary-responsive w-full sm:w-auto"
              onClick={() => navigate("/reports")}
            >
              Consultar Relatórios <ArrowRight className="ml-2 hidden sm:inline" />
            </Button>
            <Button 
              size="lg" 
              className="btn-secondary-responsive w-full sm:w-auto"
              onClick={() => navigate("/complaints/new")}
            >
              Fazer Denúncia
            </Button>
          </div>
        </div>
      </section>

      {/* Destaques do Dia - Mobile First */}
      <section className="py-6 sm:py-8 md:py-12 bg-black border-b-4 border-red-600 section-spacing" aria-labelledby="destaques-heading">
        <div className="container mx-auto px-responsive">
          <h2 id="destaques-heading" className="section-header mb-6 sm:mb-8">DESTAQUES DO DIA</h2>
          
          <div className="grid-responsive">
            {/* Card 1 */}
            <article className="investigation-card card-spacing">
              <div className="mb-3 sm:mb-4">
                <span className="bg-red-600 text-white px-2 sm:px-3 py-1 text-xs font-bold rounded">GASTOS</span>
              </div>
              <h3 className="font-headline text-base sm:text-lg md:text-xl mb-2 sm:mb-3">R$ 5 MILHÕES EM FESTAS?</h3>
              <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">Prefeitura gastou uma fortuna em eventos. Veja os detalhes.</p>
              <Button variant="outline" size="sm" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black w-full sm:w-auto">
                Ver Mais →
              </Button>
            </article>

            {/* Card 2 */}
            <article className="investigation-card card-spacing">
              <div className="mb-3 sm:mb-4">
                <span className="bg-red-600 text-white px-2 sm:px-3 py-1 text-xs font-bold rounded">LICITAÇÃO</span>
              </div>
              <h3 className="font-headline text-base sm:text-lg md:text-xl mb-2 sm:mb-3">CONTRATO SUSPEITO DE R$ 800 MIL</h3>
              <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">Material de papelaria adquirido sem licitação aberta.</p>
              <Button variant="outline" size="sm" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black w-full sm:w-auto">
                Investigar →
              </Button>
            </article>

            {/* Card 3 */}
            <article className="investigation-card card-spacing">
              <div className="mb-3 sm:mb-4">
                <span className="bg-red-600 text-white px-2 sm:px-3 py-1 text-xs font-bold rounded">OBRAS</span>
              </div>
              <h3 className="font-headline text-base sm:text-lg md:text-xl mb-2 sm:mb-3">OBRAS PARADAS - R$ 2 MILHÕES</h3>
              <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">Projetos de infraestrutura paralisados há 6 meses.</p>
              <Button variant="outline" size="sm" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black w-full sm:w-auto">
                Denunciar →
              </Button>
            </article>
          </div>
        </div>
      </section>

      {/* Onde está o dinheiro? - Mobile First */}
      <section className="py-6 sm:py-8 md:py-12 bg-black border-b-4 border-red-600 section-spacing" aria-labelledby="money-heading">
        <div className="container mx-auto px-responsive">
          <h2 id="money-heading" className="section-header mb-6 sm:mb-8">ONDE ESTÁ O DINHEIRO?</h2>
          
          <div className="grid-responsive">
            <div className="bg-gray-900 rounded-lg p-4 sm:p-5 md:p-6 border-l-4 border-yellow-400">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <DollarSign className="text-yellow-400 flex-shrink-0" size={24} />
                <h3 className="font-headline text-base sm:text-lg md:text-xl">RECEITAS</h3>
              </div>
              <p className="big-number mb-2">R$ 235 MI</p>
              <p className="text-gray-400 text-xs sm:text-sm">Arrecadação total 2025</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 sm:p-5 md:p-6 border-l-4 border-red-600">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <TrendingUp className="text-red-600 flex-shrink-0" size={24} />
                <h3 className="font-headline text-base sm:text-lg md:text-xl">DESPESAS</h3>
              </div>
              <p className="big-number mb-2">R$ 278 MI</p>
              <p className="text-gray-400 text-xs sm:text-sm">Gastos totais 2025</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 sm:p-5 md:p-6 border-l-4 border-red-600">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <AlertTriangle className="text-red-600 flex-shrink-0" size={24} />
                <h3 className="font-headline text-base sm:text-lg md:text-xl">DENÚNCIAS</h3>
              </div>
              <p className="big-number mb-2">127</p>
              <p className="text-gray-400 text-xs sm:text-sm">Irregularidades reportadas</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final - Mobile First */}
      <section className="py-6 sm:py-8 md:py-12 bg-gradient-to-r from-red-600 to-red-800 section-spacing" aria-labelledby="cta-heading">
        <div className="container mx-auto px-responsive text-center">
          <h2 id="cta-heading" className="font-headline text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4 md:mb-6">
            ENCONTROU UMA IRREGULARIDADE?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Denuncie gastos suspeitos, contratos irregulares e obras paradas. Suas denúncias são analisadas e publicadas com segurança.
          </p>
          <Button 
            size="lg" 
            className="btn-secondary-responsive"
            onClick={() => navigate("/complaints/new")}
          >
            Fazer Denúncia Agora →
          </Button>
        </div>
      </section>

      {/* Footer - Mobile First */}
      <footer className="bg-gray-900 border-t-4 border-red-600 py-6 sm:py-8 md:py-10" role="contentinfo">
        <div className="container mx-auto px-responsive">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <h3 className="font-headline text-base sm:text-lg mb-3 sm:mb-4">BOCA ABERTA</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Plataforma de transparência e auditoria cidadã para Pedreira/SP</p>
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base mb-3 sm:mb-4">LINKS RÁPIDOS</h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><a href="/reports" className="text-gray-400 hover:text-yellow-400">Relatórios</a></li>
                <li><a href="/statistics" className="text-gray-400 hover:text-yellow-400">Estatísticas</a></li>
                <li><a href="/complaints/new" className="text-gray-400 hover:text-yellow-400">Denunciar</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base mb-3 sm:mb-4">CONTATO</h4>
              <p className="text-gray-400 text-xs sm:text-sm">Email: contato@bocaaberta.local</p>
              <p className="text-gray-400 text-xs sm:text-sm">Telefone: (19) 9999-9999</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm">
            <p>© 2026 Boca Aberta - Todos os direitos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
