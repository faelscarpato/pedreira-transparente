import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, FileText, AlertTriangle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function ReportsPage() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<"diario_oficial" | "plo" | "emenda" | "decreto" | "outro" | null>(null);
  const [offset, setOffset] = useState(0);
  const limit = 12;

  const { data: reports, isLoading } = trpc.reports.list.useQuery({
    limit,
    offset,
    type: selectedType || undefined,
  });

  const reportTypes = [
    { id: "diario_oficial" as const, label: "Diário Oficial", icon: "📰" },
    { id: "plo" as const, label: "Projetos de Lei", icon: "⚖️" },
    { id: "emenda" as const, label: "Emendas", icon: "✏️" },
    { id: "decreto" as const, label: "Decretos", icon: "📋" },
    { id: "outro" as const, label: "Outros", icon: "📄" },
  ];

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

      {/* Seção de Busca */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 py-8 border-b-4 border-yellow-400">
        <div className="container mx-auto">
          <h2 className="text-4xl font-black mb-6">CONSULTE OS RELATÓRIOS</h2>
          
          {/* Barra de Busca */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por título, descrição ou palavra-chave..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setOffset(0);
              }}
              className="pl-12 py-3 text-black"
              disabled
            />
            <p className="text-xs text-gray-200 mt-2">Busca por texto em desenvolvimento</p>
          </div>

          {/* Filtros por Tipo */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSelectedType(null);
                setOffset(0);
              }}
              className={`px-4 py-2 rounded font-bold transition-colors ${
                selectedType === null
                  ? "bg-yellow-400 text-black"
                  : "bg-black border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
              }`}
            >
              Todos
            </button>
            {reportTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => {
                  setSelectedType(type.id);
                  setOffset(0);
                }}
                className={`px-4 py-2 rounded font-bold transition-colors flex items-center gap-2 ${
                  selectedType === type.id
                    ? "bg-yellow-400 text-black"
                    : "bg-black border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                }`}
              >
                <span>{type.icon}</span>
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Resultados */}
      <section className="py-12 bg-black">
        <div className="container mx-auto">
          <div className="mb-8">
            <p className="text-gray-400">
              {reports?.total ? `Encontrados ${reports.total} relatórios` : "Nenhum relatório encontrado"}
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Carregando relatórios...</p>
            </div>
          ) : reports?.reports && reports.reports.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {reports.reports.map((report) => (
                  <Card
                    key={report.id}
                    className="bg-gray-900 border-gray-700 overflow-hidden hover:border-red-600 transition-all hover:shadow-lg hover:shadow-red-600/50 cursor-pointer group"
                  >
                    {/* Top Bar */}
                    <div className="h-1 bg-gradient-to-r from-red-600 via-yellow-400 to-red-600 group-hover:h-2 transition-all" />

                    <div className="p-6">
                      {/* Tipo e Data */}
                      <div className="flex items-start justify-between mb-3">
                        <span className="bg-red-600 text-white px-3 py-1 text-xs font-black rounded uppercase">
                          {report.type}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {new Date(report.publishedDate).toLocaleDateString("pt-BR")}
                        </span>
                      </div>

                      {/* Título */}
                      <h3 className="text-lg font-black text-white mb-3 group-hover:text-yellow-400 transition-colors line-clamp-2">
                        {report.title}
                      </h3>

                      {/* Descrição */}
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {report.description}
                      </p>

                      {/* Resumo (se gerado por LLM) */}
                      {report.summary && (
                        <div className="bg-gray-800 border-l-2 border-yellow-400 p-3 mb-4 text-xs text-gray-300 line-clamp-2">
                          <p className="font-bold text-yellow-400 mb-1">Resumo:</p>
                          {report.summary}
                        </div>
                      )}



                      {/* CTA */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold"
                      >
                        Ler Relatório <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Paginação */}
              <div className="flex justify-center gap-4 mt-12">
                <Button
                  variant="outline"
                  disabled={offset === 0}
                  onClick={() => setOffset(Math.max(0, offset - limit))}
                  className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                >
                  ← Anterior
                </Button>
                <div className="flex items-center gap-2 text-gray-400">
                  <span>Página {Math.floor(offset / limit) + 1}</span>
                </div>
                <Button
                  variant="outline"
                  disabled={!reports || reports.reports.length < limit}
                  onClick={() => setOffset(offset + limit)}
                  className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                >
                  Próxima →
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">Nenhum relatório encontrado com esses critérios</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA - Denúncia */}
      <section className="py-12 bg-gradient-to-r from-red-600 to-red-800 border-t-4 border-yellow-400">
        <div className="container mx-auto text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
          <h2 className="text-4xl font-black mb-4">ENCONTROU UMA IRREGULARIDADE?</h2>
          <p className="text-xl mb-8">Denuncie gastos suspeitos e contratos irregulares</p>
          <Button
            size="lg"
            className="bg-yellow-400 text-black font-bold hover:bg-yellow-300"
            onClick={() => navigate("/complaints/new")}
          >
            Fazer Denúncia Agora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 py-8">
        <div className="container mx-auto text-center text-gray-400">
          <p>Boca Aberta - Plataforma de Transparência e Auditoria Cidadã</p>
        </div>
      </footer>
    </div>
  );
}
