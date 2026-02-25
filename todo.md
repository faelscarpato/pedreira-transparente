# Pedreira Transparente - TODO

## Fase 1: Arquitetura e Banco de Dados
- [x] Definir schema do banco de dados
- [x] Criar migrations do Drizzle ORM
- [x] Configurar tipos TypeScript

## Fase 2: Backend com tRPC
- [x] Implementar procedures para CRUD de relatórios
- [x] Implementar procedures para CRUD de denúncias
- [x] Implementar procedures para consulta de relatórios
- [x] Implementar autenticação admin
- [x] Implementar notificação ao admin

## Fase 3: Painel Administrativo
- [x] Criar layout do painel admin com sidebar
- [ ] Implementar página de upload de relatórios
- [ ] Implementar página de gestão de relatórios
- [ ] Implementar página de gerenciamento de denúncias
- [x] Implementar dashboard admin com estatísticas
- [x] Adicionar autenticação e controle de acesso

## Fase 4: Interface Pública
- [x] Criar layout público com navegação clara
- [x] Implementar página inicial com destaque
- [x] Implementar página de consulta de relatórios
- [x] Implementar filtros por data, tipo e palavra-chave
- [ ] Implementar visualização de relatório individual
- [x] Implementar paginação eficiente

## Fase 5: Sistema de Denúncias
- [x] Criar formulário de denúncia
- [x] Implementar validação de formulário
- [ ] Implementar upload de evidências
- [x] Implementar notificação por email ao admin
- [x] Criar página de confirmação de denúncia

## Fase 6: Integração com LLM
- [x] Implementar geração automática de resumos
- [x] Implementar extração de indicadores-chave
- [ ] Criar pipeline de processamento
- [ ] Implementar cache de resumos

## Fase 7: Notificações e Email
- [x] Configurar sistema de notificações por email
- [x] Implementar envio de email para novos relatórios
- [x] Implementar envio de email para denúncias críticas
- [x] Criar templates de email profissionais
- [x] Implementar sistema de inscrição em notificações

## Fase 8: Redesign para Jornal de Investigação
- [x] Integrar logo "Boca Aberta" no header
- [x] Redesenhar homepage como jornal com manchetes
- [x] Criar componentes de cards de investigação
- [x] Implementar paleta vermelho/preto/amarelo
- [x] Criar seção "Destaques do Dia"
- [x] Criar seção "Onde está o dinheiro?"
- [x] Redesenhar página de relatórios com filtros visuais
- [x] Implementar página de denúncias com visual impactante
- [x] Implementar upload de PDFs com Supabase Storage
- [x] Criar página de estatísticas com gráficos
- [x] Conectar ao Supabase (banco de dados + storage)
- [x] Testar responsividade mobile
- [x] Validar acessibilidade

## Fase 9: Testes e Otimização
- [x] Testar fluxo completo de publicação
- [x] Testar fluxo de denúncia
- [x] Testar busca e filtros
- [x] Otimizar performance de queries
- [x] Executar 13 testes unitários (todos passando)
- [x] Validar credenciais Supabase
- [x] Testar APIs de upload

## Funcionalidades Extras (Backlog)
- [ ] Exportar relatórios em CSV/Excel
- [ ] Gráficos de tendências de conformidade
- [ ] Integração com redes sociais
- [ ] Sistema de comentários em relatórios
- [ ] API pública para terceiros
