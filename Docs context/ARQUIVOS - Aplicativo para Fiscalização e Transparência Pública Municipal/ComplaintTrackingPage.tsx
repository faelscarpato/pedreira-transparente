import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Clock, AlertCircle, FileText, ArrowLeft } from "lucide-react";

export default function ComplaintTrackingPage() {
  const [, navigate] = useLocation();
  const [protocolNumber, setProtocolNumber] = useState("");
  const [searching, setSearching] = useState(false);

  const { data: complaint, isLoading, error } = trpc.complaints.getById.useQuery(
    { id: parseInt(protocolNumber.split("-")[1] || "0") },
    { enabled: !!protocolNumber && protocolNumber.includes("-") }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolvida":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "respondida":
        return <CheckCircle className="w-6 h-6 text-blue-500" />;
      case "em_analise":
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case "aberta":
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <FileText className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      aberta: "Aberta",
      em_analise: "Em Análise",
      respondida: "Respondida",
      resolvida: "Resolvida",
      arquivada: "Arquivada",
    };
    return labels[status] || status;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critica":
        return "bg-red-600 text-white";
      case "alta":
        return "bg-orange-600 text-white";
      case "media":
        return "bg-yellow-600 text-white";
      case "baixa":
        return "bg-blue-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
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
          <h2 className="text-4xl font-black mb-3">RASTREIE SUA DENÚNCIA</h2>
          <p className="text-xl text-gray-100">
            Acompanhe o status de sua denúncia em tempo real. Insira seu número de protocolo abaixo.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <div className="container mx-auto py-12">
        <Card className="bg-gray-900 border-2 border-red-600 p-8 mb-12">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              placeholder="Ex: DENUNCIA-1740506400000-ABC123"
              value={protocolNumber}
              onChange={(e) => setProtocolNumber(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded text-white placeholder-gray-500 focus:border-red-600 focus:outline-none"
            />
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8"
            >
              Rastrear
            </Button>
          </form>
        </Card>

        {/* Results */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-400">Buscando denúncia...</p>
          </div>
        )}

        {error && (
          <Card className="bg-red-900 border-2 border-red-600 p-8 mb-12">
            <p className="text-red-200">
              Denúncia não encontrada. Verifique o número de protocolo e tente novamente.
            </p>
          </Card>
        )}

        {complaint && (
          <div className="space-y-8">
            {/* Complaint Overview */}
            <Card className="bg-gray-900 border-2 border-yellow-400 p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">Protocolo</h3>
                  <p className="text-2xl font-black text-yellow-400">{complaint.protocolNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">Status</h3>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(complaint.status)}
                    <span className="text-2xl font-black text-white">
                      {getStatusLabel(complaint.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-8">
                <h4 className="text-xl font-black text-white mb-4">{complaint.title}</h4>
                <p className="text-gray-300 mb-6">{complaint.description}</p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Severidade</p>
                    <span className={`inline-block px-3 py-1 rounded font-bold mt-2 ${getSeverityColor(complaint.severity)}`}>
                      {complaint.severity.charAt(0).toUpperCase() + complaint.severity.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Data de Submissão</p>
                    <p className="text-white mt-2">
                      {new Date(complaint.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Última Atualização</p>
                    <p className="text-white mt-2">
                      {new Date(complaint.updatedAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Timeline */}
            <Card className="bg-gray-900 border-2 border-red-600 p-8">
              <h3 className="text-2xl font-black text-yellow-400 mb-8">HISTÓRICO DE ATUALIZAÇÕES</h3>

              <div className="space-y-6">
                {/* Status Timeline Items */}
                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                    <div className="w-1 h-16 bg-gray-700"></div>
                  </div>
                  <div>
                    <p className="font-bold text-white">Denúncia Recebida</p>
                    <p className="text-sm text-gray-400">
                      {new Date(complaint.createdAt).toLocaleDateString("pt-BR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {complaint.status !== "aberta" && (
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <div className="w-1 h-16 bg-gray-700"></div>
                    </div>
                    <div>
                      <p className="font-bold text-white">Em Análise</p>
                      <p className="text-sm text-gray-400">
                        {new Date(complaint.updatedAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                )}

                {(complaint.status === "respondida" || complaint.status === "resolvida") && (
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <div className="w-1 h-16 bg-gray-700"></div>
                    </div>
                    <div>
                      <p className="font-bold text-white">Respondida</p>
                      <p className="text-sm text-gray-400">
                        {new Date(complaint.updatedAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                )}

                {complaint.status === "resolvida" && (
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    </div>
                    <div>
                      <p className="font-bold text-white">Resolvida</p>
                      <p className="text-sm text-gray-400">
                        {new Date(complaint.updatedAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {complaint.adminNotes && (
                <div className="mt-8 pt-8 border-t border-gray-700">
                  <p className="text-sm font-bold text-gray-400 uppercase mb-3">Notas do Administrador</p>
                  <p className="text-gray-300">{complaint.adminNotes}</p>
                </div>
              )}
            </Card>

            {/* Contact Info */}
            {complaint.reporterEmail && (
              <Card className="bg-gray-900 border-2 border-blue-600 p-8">
                <h3 className="text-xl font-black text-white mb-4">INFORMAÇÕES DE CONTATO</h3>
                <p className="text-gray-300">
                  Você receberá atualizações sobre esta denúncia no email:{" "}
                  <span className="font-bold text-white">{complaint.reporterEmail}</span>
                </p>
              </Card>
            )}
          </div>
        )}

        {!searching && !complaint && !isLoading && (
          <Card className="bg-gray-900 border-2 border-gray-700 p-12 text-center">
            <p className="text-gray-400 text-lg">
              Insira seu número de protocolo acima para rastrear sua denúncia
            </p>
          </Card>
        )}
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
