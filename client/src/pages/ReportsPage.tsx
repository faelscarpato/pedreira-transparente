import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Filter, Calendar } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [page, setPage] = useState(1);

  const { data: reportsData, isLoading } = trpc.reports.list.useQuery({
    limit: 20,
    offset: (page - 1) * 20,
    type: filterType !== "all" ? (filterType as any) : undefined,
    sortBy: sortBy as any,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-slate-900">Relatórios de Auditoria</h1>
          <p className="text-slate-600 mt-1">Consulte Diário Oficial, Projetos de Lei e análises jurídicas</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Buscar por título, descrição ou palavra-chave..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Tipo de Ato</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="diario_oficial">Diário Oficial</SelectItem>
                    <SelectItem value="plo">Projeto de Lei</SelectItem>
                    <SelectItem value="emenda">Emenda</SelectItem>
                    <SelectItem value="decreto">Decreto</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Ordenar por</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date_desc">Mais Recentes</SelectItem>
                    <SelectItem value="date_asc">Mais Antigos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button className="w-full gap-2">
                  <Filter className="w-4 h-4" />
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-slate-600 mt-4">Carregando relatórios...</p>
            </div>
          ) : reportsData?.reports && reportsData.reports.length > 0 ? (
            <>
              {reportsData.reports.map((report) => (
                <Card key={report.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-semibold text-blue-600 uppercase">
                            {report.type === "diario_oficial" && "Diário Oficial"}
                            {report.type === "plo" && "Projeto de Lei"}
                            {report.type === "emenda" && "Emenda"}
                            {report.type === "decreto" && "Decreto"}
                            {report.type === "outro" && "Outro"}
                          </span>
                        </div>
                        <CardTitle className="text-lg">{report.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(report.publishedDate).toLocaleDateString("pt-BR")}
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">Ver Detalhes</Button>
                    </div>
                  </CardHeader>
                  {report.description && (
                    <CardContent>
                      <p className="text-slate-600 text-sm line-clamp-2">{report.description}</p>
                    </CardContent>
                  )}
                  {report.summary && (
                    <CardContent>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                        <p className="text-xs font-semibold text-blue-900 mb-1">Resumo IA</p>
                        <p className="text-sm text-blue-800 line-clamp-2">{report.summary}</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}

              {/* Pagination */}
              <div className="flex items-center justify-between mt-8">
                <p className="text-sm text-slate-600">
                  Mostrando {(page - 1) * 20 + 1} a {Math.min(page * 20, reportsData.total)} de {reportsData.total} relatórios
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    disabled={page * 20 >= reportsData.total}
                    onClick={() => setPage(page + 1)}
                  >
                    Próximo
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">Nenhum relatório encontrado</p>
                <p className="text-sm text-slate-500 mt-2">Tente ajustar seus filtros de busca</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
