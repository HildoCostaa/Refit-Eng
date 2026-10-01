# Requisitos Funcionais — Plataforma de Gestão de Obras

**Projeto:** Plataforma de Gestão de Obras
**Versão:** 1.0
**Status:** Em desenvolvimento / Definição de requisitos

## 1. Objetivo

A plataforma tem como objetivo centralizar o gerenciamento de obras, clientes, ordens de compra, financeiro, materiais, locações, atividades e usuários.

Inicialmente será utilizada por uma empresa piloto, porém deverá possuir arquitetura preparada para futura utilização por múltiplas empresas (SaaS).

## 2. Perfis de usuários

### 2.1 Administrador Geral

Possui acesso total ao sistema, podendo gerenciar usuários, permissões, clientes, obras, ordens de compra, financeiro, materiais, locações, atividades, documentos e configurações.

### 2.2 Usuário interno

Funcionário ou colaborador com acesso limitado conforme permissões definidas pelo Administrador Geral.

### 2.3 Cliente

Possui acesso exclusivo às suas próprias obras e informações disponibilizadas pela empresa, como ordens de compra, pagamentos, comprovantes e documentos.

---

# 3. Gerenciamento de usuários

### RF-001 — Criar usuário

O sistema deverá permitir que o Administrador Geral crie usuários.

**Dados:** nome, e-mail, telefone, senha, perfil, status e permissões.

### RF-002 — Editar usuário

O sistema deverá permitir a edição dos dados dos usuários.

### RF-003 — Desativar usuário

O Administrador Geral deverá poder desativar usuários sem excluir seu histórico.

### RF-004 — Gerenciar permissões

O Administrador Geral deverá definir quais funcionalidades cada usuário poderá acessar.

### RF-005 — Controle de acesso

O sistema deverá impedir que usuários acessem funcionalidades para as quais não possuem permissão, inclusive por acesso direto à URL.

---

# 4. Cadastro de clientes

### RF-006 — Cadastrar cliente

O sistema deverá permitir o cadastro de clientes.

**Dados:** nome/razão social, CPF/CNPJ, e-mail, telefone, endereço, observações e status.

### RF-007 — Editar cliente

O sistema deverá permitir a edição dos dados cadastrados.

### RF-008 — Vincular cliente à obra

O sistema deverá permitir vincular um cliente a uma ou mais obras.

---

# 5. Gerenciamento de obras

### RF-009 — Criar obra

O sistema deverá permitir a criação de obras.

**Dados:** nome, cliente, endereço, data de início, previsão de término, status, descrição e observações.

### RF-010 — Editar obra

O sistema deverá permitir a edição das informações da obra.

### RF-011 — Visualizar obra

O sistema deverá possuir uma página específica para cada obra, centralizando suas informações.

**Acesso:** ordens de compra, financeiro, materiais, locações, atividades, documentos e relatórios.

### RF-012 — Status da obra

A obra deverá possuir status: Planejamento, Em andamento, Pausada, Concluída ou Cancelada.

---

# 6. Ordens de compra

### RF-013 — Criar ordem de compra

O sistema deverá permitir criar ordens de compra vinculadas a uma obra.

**Dados:** número, obra, cliente, data, fornecedor, itens, valores, total, observações e status.

### RF-014 — Adicionar itens

Uma ordem poderá possuir múltiplos itens.

**Dados:** descrição, quantidade, unidade, valor unitário e valor total.

### RF-015 — Alterar status da ordem

A ordem deverá possuir status como: Rascunho, Aguardando pagamento, Pago, Em processamento, Recebido ou Cancelado.

### RF-016 — Anexar comprovante

O sistema deverá permitir anexar comprovante de pagamento à ordem de compra.

### RF-017 — Visualizar comprovante

Usuários autorizados deverão poder visualizar ou baixar o comprovante.

### RF-018 — Disponibilizar ordem ao cliente

Ordens vinculadas ao cliente deverão aparecer no portal do cliente quando disponibilizadas.

---

# 7. Pagamento via Pix

### RF-019 — Cadastrar chave Pix

O Administrador Geral deverá poder cadastrar a chave Pix utilizada pela empresa.

### RF-020 — Exibir chave Pix

O cliente deverá visualizar a chave Pix disponível para pagamento da ordem.

### RF-021 — Copiar chave Pix

O cliente deverá possuir opção para copiar a chave Pix.

### RF-022 — Enviar comprovante

O cliente poderá enviar o comprovante de pagamento relacionado à ordem.

---

# 8. Documentos

### RF-023 — Gerar ordem em PDF

O sistema deverá permitir gerar a ordem de compra em PDF.

### RF-024 — Gerar ordem em Word

O sistema deverá permitir gerar a ordem de compra em formato compatível com Microsoft Word.

### RF-025 — Baixar documento

Usuários autorizados e clientes poderão baixar documentos disponibilizados.

---

# 9. Financeiro da obra

### RF-026 — Registrar entrada

O sistema deverá permitir registrar entradas financeiras vinculadas à obra.

**Dados:** descrição, valor e data.

### RF-027 — Registrar saída

O sistema deverá permitir registrar saídas financeiras vinculadas à obra.

### RF-028 — Registrar gasto

O sistema deverá permitir registrar gastos.

**Dados:** descrição, categoria, valor, data, responsável pelo pagamento, forma de pagamento, observações e comprovante.

### RF-029 — Visualizar resumo financeiro

O sistema deverá apresentar o total de entradas, saídas, gastos e saldo.

### RF-030 — Filtrar movimentações

O sistema deverá permitir filtrar movimentações por período, mês, tipo, categoria, responsável, forma de pagamento e status.

### RF-031 — Identificar responsável pelo pagamento

Cada gasto deverá permitir identificar quem realizou o pagamento.

---

# 10. Atividades da obra

### RF-032 — Criar atividade

O sistema deverá permitir criar atividades vinculadas à obra.

### RF-033 — Definir prioridade

Cada atividade deverá possuir prioridade: Baixa, Média ou Alta.

### RF-034 — Criar etiquetas

As atividades poderão possuir etiquetas para organização.

**Exemplos:** Material, Elétrica, Hidráulica, Financeiro, Documentação e Urgente.

### RF-035 — Criar checklist

Uma atividade poderá possuir uma lista de tarefas/checklist.

### RF-036 — Concluir atividade

O usuário deverá conseguir marcar uma atividade como concluída.

### RF-037 — Definir responsável

Uma atividade poderá ser atribuída a um usuário interno.

### RF-038 — Definir prazo

Uma atividade poderá possuir uma data limite.

---

# 11. Materiais

### RF-039 — Cadastrar material

O sistema deverá permitir cadastrar materiais utilizados nas obras.

**Dados:** nome, descrição, unidade, quantidade e observações.

### RF-040 — Alocar material à obra

O sistema deverá permitir relacionar materiais a uma obra.

### RF-041 — Registrar entrada de material

O sistema deverá permitir registrar a entrada de materiais na obra.

### RF-042 — Registrar saída de material

O sistema deverá permitir registrar a saída de materiais da obra.

---

# 12. Locações

### RF-043 — Cadastrar equipamento locado

O sistema deverá permitir cadastrar equipamentos ou materiais alugados.

**Dados:** equipamento, fornecedor, obra, data de início, data de entrega/devolução, valor e observações.

### RF-044 — Registrar data de entrega

O sistema deverá permitir definir a data prevista de entrega ou devolução.

### RF-045 — Notificação de locação

O sistema deverá gerar uma notificação 24 horas antes da data configurada.

---

# 13. Portal do cliente

### RF-046 — Acesso individual do cliente

Cada cliente deverá possuir credenciais próprias de acesso.

### RF-047 — Visualizar obras

O cliente deverá visualizar somente suas próprias obras.

### RF-048 — Visualizar ordens

O cliente deverá visualizar as ordens disponibilizadas relacionadas às suas obras.

### RF-049 — Visualizar pagamentos

O cliente deverá visualizar informações de pagamento relacionadas às ordens.

### RF-050 — Enviar comprovantes

O cliente poderá enviar comprovantes de pagamento.

### RF-051 — Baixar documentos

O cliente poderá baixar documentos disponibilizados pela empresa.

---

# 14. Dashboard

### RF-052 — Dashboard administrativo

O sistema deverá possuir um painel inicial para usuários administrativos.

**Informações:** obras ativas, ordens pendentes, pagamentos pendentes, entradas, saídas, saldo, atividades pendentes e locações próximas do vencimento.

### RF-053 — Dashboard da obra

Cada obra deverá possuir um resumo com informações financeiras, ordens, atividades, materiais e locações.

---

# 15. Notificações

### RF-054 — Notificação de locação

O sistema deverá notificar os usuários responsáveis 24 horas antes da data de entrega/devolução de uma locação.

### RF-055 — Notificações internas

O sistema deverá possuir estrutura preparada para notificações de atividades, ordens, comprovantes, pagamentos, locações e documentos.

---

# 16. Multiempresa

### RF-056 — Estrutura multiempresa

A arquitetura deverá permitir que diferentes empresas utilizem a mesma plataforma.

Cada empresa deverá possuir seus próprios usuários, clientes, obras, ordens, financeiro, materiais, locações, documentos e configurações.

### RF-057 — Isolamento de dados

Usuários de uma empresa não deverão conseguir acessar dados pertencentes a outra empresa.

---

# 17. Auditoria

### RF-058 — Registro de ações

O sistema deverá registrar ações importantes realizadas pelos usuários.

**Exemplo:** usuário, ação, data e horário.

---

# 18. Pesquisa

### RF-059 — Pesquisa de dados

O sistema deverá permitir pesquisar informações relevantes como clientes, obras, ordens, materiais e usuários.

---

# 19. Relatórios

### RF-060 — Relatórios

O sistema deverá possuir estrutura para geração de relatórios.

**Inicialmente:** financeiro, gastos, ordens de compra, materiais, atividades e locações.

---

# 20. Prioridade do MVP

A primeira versão deverá priorizar:

### Prioridade 1 — Base

* Autenticação;
* Usuários;
* Permissões;
* Clientes;
* Obras.

### Prioridade 2 — Ordens

* Ordens de compra;
* Itens;
* Status;
* Comprovantes;
* Pix;
* PDF;
* Portal do cliente.

### Prioridade 3 — Financeiro

* Entradas;
* Saídas;
* Gastos;
* Categorias;
* Filtros.

### Prioridade 4 — Gestão

* Atividades;
* Checklist;
* Prioridades;
* Etiquetas.

### Prioridade 5 — Recursos adicionais

* Materiais;
* Locações;
* Notificações.

### Prioridade 6 — Recursos futuros

* Relatórios;
* Auditoria;
* Recursos avançados;
* Recursos comerciais SaaS.

---

# 21. Fluxo principal

```text
Administrador
      ↓
Cadastra cliente
      ↓
Cria obra
      ├──→ Cria atividades
      ├──→ Cadastra materiais
      ├──→ Registra locações
      ├──→ Registra financeiro
      └──→ Cria ordem de compra
                  ↓
             Define valor
                  ↓
        Disponibiliza ao cliente
                  ↓
          Cliente acessa
                  ↓
          Visualiza ordem
                  ↓
            Realiza PIX
                  ↓
        Envia comprovante
                  ↓
          Empresa verifica
                  ↓
             Ordem paga
```

---

# 22. Objetivo futuro — SaaS

Embora a primeira utilização seja realizada por uma empresa piloto, a plataforma deverá ser desenvolvida considerando sua futura transformação em SaaS.

A arquitetura deverá permitir futuramente:

* Cadastro de empresas;
* Planos de assinatura;
* Controle de usuários por plano;
* Limites de obras;
* Limites de armazenamento;
* Cobrança recorrente;
* Gestão de assinaturas;
* Painel administrativo da plataforma;
* Métricas de utilização;
* Controle de planos;
* Configurações específicas por empresa.

Esses recursos não são obrigatoriamente parte do primeiro MVP, mas deverão ser considerados nas decisões arquiteturais para evitar retrabalho futuro.
