import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, CheckCircle, Clock, XCircle, Eye, EyeOff, LogOut, Menu, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";

const ADMIN_EMAIL = "capyops@gmail.com";

export default function AdminManagementPage() {
  const [, navigate] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"denuncias" | "relatorios" | "estatisticas">("denuncias");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch complaints
  const { data: complaintsData } = trpc.complaints.list.useQuery(
    { limit: 100, offset: 0 },
    { enabled: isAuthenticated }
  );
  const complaints = complaintsData?.complaints || [];

  // Update complaint mutation
  const updateComplaint = trpc.complaints.update.useMutation({
    onSuccess: () => {
      toast.success("Denúncia atualizada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar denúncia: " + error.message);
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email !== ADMIN_EMAIL) {
      toast.error("Email não autorizado");
      return;
    }

    // Simple password check (in production, use proper authentication)
    if (password !== "admin123") {
      toast.error("Senha incorreta");
      return;
    }

    setIsAuthenticated(true);
    toast.success("Autenticado com sucesso!");
    setPassword("");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
    navigate("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center py-6 sm:py-8 md:py-12 px-responsive">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl mb-2">
              <span className="text-red-600">BOCA</span>
              <span className="text-white ml-2">ABERTA</span>
            </h1>
            <p className="text-yellow-400 font-bold text-sm sm:text-base">Painel Administrativo</p>
          </div>

          {/* Login Card */}
          <div className="bg-gray-900 border-2 border-red-600 rounded-lg p-6 sm:p-8">
            <h2 className="font-headline text-2xl sm:text-3xl mb-6 text-center">ACESSO RESTRITO</h2>
            
            <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
              <div>
                <label className="form-label-responsive">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="form-input-responsive"
                  required
                />
              </div>

              <div>
                <label className="form-label-responsive">Senha</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="form-input-responsive pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="btn-primary-responsive w-full text-base sm:text-lg py-3 sm:py-4"
              >
                Entrar
              </Button>
            </form>

            <div className="mt-6 sm:mt-8 p-4 bg-blue-900 bg-opacity-30 border-l-4 border-blue-400 rounded text-xs sm:text-sm text-blue-100">
              <p className="font-bold mb-2">Credenciais de Teste:</p>
              <p>Email: {ADMIN_EMAIL}</p>
              <p>Senha: admin123</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header - Mobile First */}
      <header className="border-b-4 border-red-600 bg-black py-3 sm:py-4 md:py-6 sticky top-0 z-50 header-responsive">
        <div className="container mx-auto px-responsive">
          <div className="flex items-center justify-between">
            <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl">
              <span className="text-red-600">ADMIN</span>
              <span className="text-white ml-1 sm:ml-2">PANEL</span>
            </h1>
            
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm text-gray-400">{email}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut size={16} /> Sair
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-700 space-y-3">
              <p className="text-sm text-gray-400">{email}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2"
              >
                <LogOut size={16} /> Sair
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Navigation Tabs - Mobile First */}
      <nav className="border-b-4 border-yellow-400 bg-gray-900 sticky top-16 z-40">
        <div className="container mx-auto px-responsive">
          <div className="flex gap-2 sm:gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab("denuncias")}
              className={`px-3 sm:px-4 py-3 sm:py-4 font-bold text-xs sm:text-sm whitespace-nowrap border-b-4 transition-colors ${
                activeTab === "denuncias"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              Denúncias ({complaints.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("relatorios")}
              className={`px-3 sm:px-4 py-3 sm:py-4 font-bold text-xs sm:text-sm whitespace-nowrap border-b-4 transition-colors ${
                activeTab === "relatorios"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              Relatórios
            </button>
            <button
              onClick={() => setActiveTab("estatisticas")}
              className={`px-3 sm:px-4 py-3 sm:py-4 font-bold text-xs sm:text-sm whitespace-nowrap border-b-4 transition-colors ${
                activeTab === "estatisticas"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              Estatísticas
            </button>
          </div>
        </div>
      </nav>

      {/* Content Area - Mobile First */}
      <section className="py-6 sm:py-8 md:py-12 bg-black">
        <div className="container mx-auto px-responsive">
          
          {/* Denúncias Tab */}
          {activeTab === "denuncias" && (
            <div>
              <h2 className="section-header mb-6 sm:mb-8">GERENCIAR DENÚNCIAS</h2>
              
              {complaints.length === 0 ? (
                <div className="bg-gray-900 rounded-lg p-6 sm:p-8 text-center border-2 border-gray-700">
                  <AlertTriangle className="w-12 sm:w-16 h-12 sm:h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-sm sm:text-base">Nenhuma denúncia registrada ainda.</p>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {complaints && complaints.map((complaint) => (
                    <div key={complaint.id} className="bg-gray-900 border-2 border-gray-700 rounded-lg p-4 sm:p-6 hover:border-red-600 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-5">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 sm:gap-3 mb-2">
                            <h3 className="font-bold text-base sm:text-lg md:text-xl flex-1 break-words">{complaint.title}</h3>
                            <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold rounded flex-shrink-0 ${
                              complaint.severity === "critica" ? "bg-red-600" :
                              complaint.severity === "alta" ? "bg-orange-600" :
                              complaint.severity === "media" ? "bg-yellow-500" :
                              "bg-blue-600"
                            }`}>
                              {complaint.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-400">Protocolo: {complaint.protocolNumber}</p>
                        </div>
                      </div>

                      <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-5">{complaint.description}</p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-5 text-xs sm:text-sm">
                        <div className="bg-black bg-opacity-50 p-2 sm:p-3 rounded">
                          <p className="text-gray-400">Denunciante</p>
                          <p className="font-bold text-yellow-400">{complaint.reporterName || "Anônimo"}</p>
                        </div>
                        <div className="bg-black bg-opacity-50 p-2 sm:p-3 rounded">
                          <p className="text-gray-400">Email</p>
                          <p className="font-bold text-yellow-400 break-all">{complaint.reporterEmail || "N/A"}</p>
                        </div>
                        <div className="bg-black bg-opacity-50 p-2 sm:p-3 rounded">
                          <p className="text-gray-400">Status</p>
                          <p className="font-bold text-yellow-400">{complaint.status || "Pendente"}</p>
                        </div>
                        <div className="bg-black bg-opacity-50 p-2 sm:p-3 rounded">
                          <p className="text-gray-400">Data</p>
                          <p className="font-bold text-yellow-400">{new Date(complaint.createdAt).toLocaleDateString("pt-BR")}</p>
                        </div>
                      </div>

                      {/* Status Update Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <Button
                          size="sm"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm py-2 sm:py-3"
                          onClick={() => {
                            updateComplaint.mutate({
                              id: complaint.id,
                              status: "em_analise",
                            });
                          }}
                        >
                          <Clock size={16} className="mr-2" /> Analisando
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold text-xs sm:text-sm py-2 sm:py-3"
                          onClick={() => {
                            updateComplaint.mutate({
                              id: complaint.id,
                              status: "respondida",
                            });
                          }}
                        >
                          <CheckCircle size={16} className="mr-2" /> Respondida
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm py-2 sm:py-3"
                          onClick={() => {
                            updateComplaint.mutate({
                              id: complaint.id,
                              status: "arquivada",
                            });
                          }}
                        >
                          <XCircle size={16} className="mr-2" /> Arquivar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Relatórios Tab */}
          {activeTab === "relatorios" && (
            <div>
              <h2 className="section-header mb-6 sm:mb-8">GERENCIAR RELATÓRIOS</h2>
              <div className="bg-gray-900 rounded-lg p-6 sm:p-8 text-center border-2 border-gray-700">
                <p className="text-gray-400 text-sm sm:text-base">Funcionalidade em desenvolvimento...</p>
              </div>
            </div>
          )}

          {/* Estatísticas Tab */}
          {activeTab === "estatisticas" && (
            <div>
              <h2 className="section-header mb-6 sm:mb-8">ESTATÍSTICAS</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-gray-900 rounded-lg p-4 sm:p-6 border-l-4 border-red-600">
                  <p className="text-gray-400 text-xs sm:text-sm mb-2">Total de Denúncias</p>
                  <p className="big-number">{complaints.length || 0}</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 sm:p-6 border-l-4 border-yellow-400">
                  <p className="text-gray-400 text-xs sm:text-sm mb-2">Críticas</p>
                  <p className="big-number text-yellow-400">{complaints.filter((c: any) => c.severity === "critica").length || 0}</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 sm:p-6 border-l-4 border-orange-600">
                  <p className="text-gray-400 text-xs sm:text-sm mb-2">Altas</p>
                  <p className="big-number text-orange-400">{complaints.filter((c: any) => c.severity === "alta").length || 0}</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 sm:p-6 border-l-4 border-green-600">
                  <p className="text-gray-400 text-xs sm:text-sm mb-2">Verificadas</p>
                  <p className="big-number text-green-400">{complaints.filter((c: any) => c.status === "respondida").length || 0}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
