import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function StatisticsPage() {
  const [, navigate] = useLocation();
  const [chartData, setChartData] = useState<any>(null);

  // Fetch statistics
  const overview = trpc.statistics.getOverview.useQuery();
  const complaintsBySeverity = trpc.statistics.getComplaintsBySeverity.useQuery();
  const complaintsByStatus = trpc.statistics.getComplaintsByStatus.useQuery();
  const reportsByType = trpc.statistics.getReportsByType.useQuery();

  useEffect(() => {
    if (complaintsBySeverity.data) {
      const data = [
        { name: "Baixa", value: complaintsBySeverity.data.baixa, fill: "#3b82f6" },
        { name: "Média", value: complaintsBySeverity.data.media, fill: "#f59e0b" },
        { name: "Alta", value: complaintsBySeverity.data.alta, fill: "#f97316" },
        { name: "Crítica", value: complaintsBySeverity.data.critica, fill: "#dc2626" },
      ];
      setChartData(data);
    }
  }, [complaintsBySeverity.data]);

  const severityColors: Record<string, string> = {
    baixa: "#3b82f6",
    media: "#f59e0b",
    alta: "#f97316",
    critica: "#dc2626",
  };

  const statusColors: Record<string, string> = {
    aberta: "#ef4444",
    em_analise: "#f59e0b",
    respondida: "#3b82f6",
    resolvida: "#10b981",
    arquivada: "#6b7280",
  };

  const typeColors: Record<string, string> = {
    diario_oficial: "#8b5cf6",
    plo: "#06b6d4",
    emenda: "#ec4899",
    decreto: "#14b8a6",
    outro: "#64748b",
  };

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
          <h2 className="text-4xl font-black mb-3">ESTATÍSTICAS DE TRANSPARÊNCIA</h2>
          <p className="text-xl text-gray-100">
            Acompanhe em tempo real os indicadores de conformidade, denúncias e relatórios publicados.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto py-12">
        {/* Overview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Reports */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg border-2 border-purple-400 p-6">
            <div className="text-5xl font-black text-purple-300 mb-2">
              {overview.data?.totalReports || 0}
            </div>
            <div className="text-sm font-bold text-gray-200 uppercase">Relatórios Publicados</div>
            <p className="text-xs text-gray-400 mt-2">Diários Oficiais, PLOs, Emendas e Decretos</p>
          </div>

          {/* Total Complaints */}
          <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-lg border-2 border-red-400 p-6">
            <div className="text-5xl font-black text-red-300 mb-2">
              {overview.data?.totalComplaints || 0}
            </div>
            <div className="text-sm font-bold text-gray-200 uppercase">Denúncias Recebidas</div>
            <p className="text-xs text-gray-400 mt-2">De cidadãos vigilantes</p>
          </div>

          {/* Critical Complaints */}
          <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg border-2 border-orange-400 p-6">
            <div className="text-5xl font-black text-orange-300 mb-2">
              {overview.data?.criticalComplaints || 0}
            </div>
            <div className="text-sm font-bold text-gray-200 uppercase">Denúncias Críticas</div>
            <p className="text-xs text-gray-400 mt-2">Requerem ação imediata</p>
          </div>

          {/* Resolved Complaints */}
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg border-2 border-green-400 p-6">
            <div className="text-5xl font-black text-green-300 mb-2">
              {overview.data?.resolvedComplaints || 0}
            </div>
            <div className="text-sm font-bold text-gray-200 uppercase">Denúncias Resolvidas</div>
            <p className="text-xs text-gray-400 mt-2">Ações tomadas</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Complaints by Severity */}
          <div className="bg-gray-900 border-2 border-red-600 rounded-lg p-8">
            <h3 className="text-2xl font-black text-yellow-400 mb-6">DENÚNCIAS POR SEVERIDADE</h3>
            {complaintsBySeverity.data && (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Baixa", value: complaintsBySeverity.data.baixa },
                      { name: "Média", value: complaintsBySeverity.data.media },
                      { name: "Alta", value: complaintsBySeverity.data.alta },
                      { name: "Crítica", value: complaintsBySeverity.data.critica },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#3b82f6" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#f97316" />
                    <Cell fill="#dc2626" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Complaints by Status */}
          <div className="bg-gray-900 border-2 border-red-600 rounded-lg p-8">
            <h3 className="text-2xl font-black text-yellow-400 mb-6">DENÚNCIAS POR STATUS</h3>
            {complaintsByStatus.data && (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: "Aberta", value: complaintsByStatus.data.aberta },
                    { name: "Em Análise", value: complaintsByStatus.data.em_analise },
                    { name: "Respondida", value: complaintsByStatus.data.respondida },
                    { name: "Resolvida", value: complaintsByStatus.data.resolvida },
                    { name: "Arquivada", value: complaintsByStatus.data.arquivada },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #dc2626" }} />
                  <Bar dataKey="value" fill="#dc2626" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Reports by Type */}
          <div className="bg-gray-900 border-2 border-red-600 rounded-lg p-8 lg:col-span-2">
            <h3 className="text-2xl font-black text-yellow-400 mb-6">RELATÓRIOS POR TIPO</h3>
            {reportsByType.data && (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: "Diário Oficial", value: reportsByType.data.diario_oficial },
                    { name: "PLO", value: reportsByType.data.plo },
                    { name: "Emenda", value: reportsByType.data.emenda },
                    { name: "Decreto", value: reportsByType.data.decreto },
                    { name: "Outro", value: reportsByType.data.outro },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #dc2626" }} />
                  <Bar dataKey="value" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-gray-900 border-2 border-yellow-400 rounded-lg p-8">
          <h3 className="text-2xl font-black text-yellow-400 mb-6">RESUMO EXECUTIVO</h3>
          <div className="grid md:grid-cols-2 gap-6 text-gray-200">
            <div>
              <p className="font-bold text-yellow-400 mb-2">Taxa de Resolução</p>
              <p className="text-3xl font-black text-green-400">
                {overview.data && overview.data.totalComplaints > 0
                  ? Math.round((overview.data.resolvedComplaints / overview.data.totalComplaints) * 100)
                  : 0}%
              </p>
              <p className="text-sm text-gray-400">Das denúncias recebidas foram resolvidas</p>
            </div>
            <div>
              <p className="font-bold text-yellow-400 mb-2">Conformidade Crítica</p>
              <p className="text-3xl font-black text-red-400">
                {overview.data && overview.data.totalComplaints > 0
                  ? Math.round((overview.data.criticalComplaints / overview.data.totalComplaints) * 100)
                  : 0}%
              </p>
              <p className="text-sm text-gray-400">Denúncias críticas do total</p>
            </div>
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
