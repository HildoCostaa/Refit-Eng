# API — Plataforma de Gestão de Obras

## 1. Objetivo

A API será responsável pela comunicação entre o frontend e o backend da Plataforma de Gestão de Obras.

Ela receberá requisições do frontend, validará os dados, aplicará as regras de negócio, acessará o PostgreSQL e retornará uma resposta padronizada.

Arquitetura:

```text
Frontend
   ↓
HTTP/HTTPS
   ↓
API REST — Express.js
   ↓
Controllers
   ↓
Services
   ↓
Repositories
   ↓
PostgreSQL
```

---

## 2. Padrão da API

A API seguirá o padrão REST.

As operações utilizarão os principais métodos HTTP:

| Método | Utilização              |
| ------ | ----------------------- |
| GET    | Consultar dados         |
| POST   | Criar dados             |
| PUT    | Atualizar dados         |
| PATCH  | Alterar parcialmente    |
| DELETE | Excluir/desativar dados |

A API utilizará JSON para entrada e saída de dados.

Exemplo:

```http
GET /api/v1/obras
```

Resposta:

```json
{
  "data": [
    {
      "id": 1,
      "nome": "Obra Residencial",
      "status": "EM_ANDAMENTO"
    }
  ]
}
```

---

## 3. Versionamento

A API será versionada através da URL:

```text
/api/v1
```

Exemplo:

```text
/api/v1/clientes
/api/v1/obras
/api/v1/pedidos
```

O versionamento permite alterar a API futuramente sem quebrar imediatamente versões anteriores.

---

## 4. Estrutura das rotas

As rotas serão organizadas por módulo.

```text
/api/v1/auth
/api/v1/usuarios
/api/v1/clientes
/api/v1/obras
/api/v1/pedidos
/api/v1/pagamentos
/api/v1/documentos
/api/v1/financeiro
/api/v1/atividades
/api/v1/materiais
/api/v1/alugueis
/api/v1/notificacoes
/api/v1/relatorios
/api/v1/configuracoes
```

---

# 5. Autenticação

A API deverá possuir autenticação para proteger as áreas administrativas e o portal do cliente.

### Endpoints iniciais

```http
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

### Login

```http
POST /api/v1/auth/login
```

Entrada:

```json
{
  "email": "usuario@email.com",
  "senha": "senha"
}
```

A senha nunca será armazenada em texto puro.

O backend deverá verificar a senha utilizando um algoritmo seguro de hash.

---

# 6. Usuários

### Consultar usuários

```http
GET /api/v1/usuarios
GET /api/v1/usuarios/:id
```

### Criar usuário

```http
POST /api/v1/usuarios
```

### Atualizar usuário

```http
PUT /api/v1/usuarios/:id
```

### Desativar usuário

```http
PATCH /api/v1/usuarios/:id/status
```

### Gerenciar permissões

```http
GET  /api/v1/usuarios/:id/permissoes
PUT  /api/v1/usuarios/:id/permissoes
```

Somente usuários com autorização adequada poderão executar essas operações.

---

# 7. Clientes

### Endpoints

```http
GET    /api/v1/clientes
GET    /api/v1/clientes/:id
POST   /api/v1/clientes
PUT    /api/v1/clientes/:id
DELETE /api/v1/clientes/:id
```

O cliente deverá estar associado à empresa atual.

---

# 8. Obras

### Endpoints

```http
GET    /api/v1/obras
GET    /api/v1/obras/:id
POST   /api/v1/obras
PUT    /api/v1/obras/:id
DELETE /api/v1/obras/:id
```

Também poderão existir filtros:

```http
GET /api/v1/obras?status=EM_ANDAMENTO
```

A API deverá garantir que o usuário somente visualize obras às quais possui acesso.

---

# 9. Pedidos de compra

### Endpoints

```http
GET    /api/v1/pedidos
GET    /api/v1/pedidos/:id
POST   /api/v1/pedidos
PUT    /api/v1/pedidos/:id
DELETE /api/v1/pedidos/:id
```

Itens:

```http
GET    /api/v1/pedidos/:id/itens
POST   /api/v1/pedidos/:id/itens
PUT    /api/v1/pedidos/:id/itens/:itemId
DELETE /api/v1/pedidos/:id/itens/:itemId
```

Status:

```http
PATCH /api/v1/pedidos/:id/status
```

O valor total do pedido será calculado pelo backend.

O frontend não será considerado fonte confiável para valores financeiros.

---

# 10. Pagamentos

### Endpoints

```http
GET  /api/v1/pedidos/:id/pagamento
POST /api/v1/pedidos/:id/pagamento
PATCH /api/v1/pagamentos/:id/status
```

Envio de comprovante:

```http
POST /api/v1/pagamentos/:id/comprovante
```

A existência de um comprovante não significa automaticamente que o pagamento foi confirmado.

A confirmação deverá respeitar as regras de negócio definidas no sistema.

---

# 11. Pix

### Configuração

```http
GET /api/v1/configuracoes/pix
PUT /api/v1/configuracoes/pix
```

O Pix configurado pertence à empresa atual.

Somente usuários autorizados poderão alterá-lo.

---

# 12. Documentos

### Gerar documento

```http
POST /api/v1/pedidos/:id/documentos
```

### Consultar documentos

```http
GET /api/v1/pedidos/:id/documentos
```

### Baixar documento

```http
GET /api/v1/documentos/:id/download
```

Os arquivos não deverão ser disponibilizados diretamente sem verificar a autorização do usuário.

---

# 13. Financeiro

### Endpoints

```http
GET  /api/v1/financeiro
POST /api/v1/financeiro
GET  /api/v1/financeiro/:id
PUT  /api/v1/financeiro/:id
DELETE /api/v1/financeiro/:id
```

Filtros:

```http
GET /api/v1/financeiro?obraId=1
GET /api/v1/financeiro?tipo=ENTRADA
GET /api/v1/financeiro?tipo=SAIDA
GET /api/v1/financeiro?mes=10&ano=2026
```

Resumo:

```http
GET /api/v1/financeiro/resumo
```

O saldo será calculado utilizando os registros armazenados no banco.

```text
Saldo = Entradas - Saídas
```

---

# 14. Atividades

### Endpoints

```http
GET    /api/v1/obras/:id/atividades
GET    /api/v1/atividades/:id
POST   /api/v1/obras/:id/atividades
PUT    /api/v1/atividades/:id
DELETE /api/v1/atividades/:id
```

Checklist:

```http
GET    /api/v1/atividades/:id/checklist
POST   /api/v1/atividades/:id/checklist
PATCH  /api/v1/checklist/:id
DELETE /api/v1/checklist/:id
```

---

# 15. Materiais

### Endpoints

```http
GET  /api/v1/materiais
GET  /api/v1/materiais/:id
POST /api/v1/materiais
PUT  /api/v1/materiais/:id
DELETE /api/v1/materiais/:id
```

Movimentações:

```http
POST /api/v1/materiais/:id/entrada
POST /api/v1/materiais/:id/saida
GET  /api/v1/materiais/:id/movimentacoes
```

O backend deverá validar a quantidade disponível antes de realizar uma saída.

---

# 16. Aluguéis

### Endpoints

```http
GET    /api/v1/alugueis
GET    /api/v1/alugueis/:id
POST   /api/v1/alugueis
PUT    /api/v1/alugueis/:id
DELETE /api/v1/alugueis/:id
```

O sistema deverá registrar:

* equipamento;
* obra;
* data de entrega;
* data prevista de devolução;
* status;
* histórico.

---

# 17. Portal do cliente

O cliente terá endpoints específicos para acessar somente seus próprios dados.

```http
GET /api/v1/portal/me
GET /api/v1/portal/obras
GET /api/v1/portal/obras/:id
GET /api/v1/portal/pedidos
GET /api/v1/portal/pedidos/:id
POST /api/v1/portal/pedidos/:id/comprovante
GET /api/v1/portal/documentos/:id/download
```

O backend deverá verificar:

```text
Usuário → Cliente → Obra → Pedido
```

Antes de permitir o acesso.

Isso evita que um cliente consiga consultar informações pertencentes a outro cliente.

---

# 18. Relatórios

### Endpoints

```http
GET /api/v1/relatorios/financeiro
GET /api/v1/relatorios/obras
GET /api/v1/relatorios/pedidos
GET /api/v1/relatorios/materiais
GET /api/v1/relatorios/alugueis
```

Os relatórios deverão respeitar as permissões do usuário e os filtros informados.

---

# 19. Respostas HTTP

A API utilizará códigos HTTP apropriados.

| Código | Significado                     |
| ------ | ------------------------------- |
| 200    | Operação realizada              |
| 201    | Recurso criado                  |
| 204    | Operação realizada sem conteúdo |
| 400    | Requisição inválida             |
| 401    | Não autenticado                 |
| 403    | Sem permissão                   |
| 404    | Recurso não encontrado          |
| 409    | Conflito                        |
| 422    | Dados inválidos                 |
| 429    | Muitas requisições              |
| 500    | Erro interno                    |

---

# 20. Padrão de resposta

Resposta de sucesso:

```json
{
  "data": {
    "id": 1,
    "nome": "Obra Residencial"
  }
}
```

Lista:

```json
{
  "data": [
    {
      "id": 1,
      "nome": "Obra Residencial"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

Erro:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Os dados enviados são inválidos.",
    "details": [
      {
        "field": "email",
        "message": "Informe um e-mail válido."
      }
    ]
  }
}
```

O formato de erro deverá ser consistente em toda a API.

---

# 21. Validação

A validação deverá ocorrer no backend.

Exemplo:

```text
Frontend envia:
quantidade = -5

        ↓

API recebe

        ↓

Validação

        ↓

Valor inválido

        ↓

HTTP 422
```

Nunca devemos confiar somente na validação realizada pelo frontend.

---

# 22. Segurança da API

A API deverá implementar:

* autenticação;
* autorização;
* validação de entrada;
* consultas parametrizadas;
* proteção contra SQL Injection;
* proteção contra XSS;
* proteção contra CSRF quando aplicável;
* controle de upload;
* limite de requisições;
* CORS configurado;
* proteção de arquivos;
* logs;
* auditoria;
* isolamento por empresa.

Toda operação deverá respeitar:

```text
Empresa → Usuário → Permissão → Recurso
```

---

# 23. Isolamento entre empresas

Como o sistema poderá se tornar SaaS, todas as operações deverão considerar a empresa do usuário autenticado.

Exemplo:

```text
Usuário pertence à Empresa A

        ↓

GET /api/v1/obras

        ↓

Banco consulta somente obras da Empresa A
```

O backend não deverá confiar em um `company_id` enviado pelo frontend para determinar a empresa do usuário.

A empresa deverá ser identificada a partir do contexto autenticado.

---

# 24. Paginação

Listagens poderão utilizar paginação:

```http
GET /api/v1/clientes?page=1&limit=20
```

Resposta:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

Isso evita carregar grandes quantidades de dados de uma única vez.

---

# 25. Filtros e ordenação

As listagens poderão utilizar parâmetros:

```http
GET /api/v1/obras?status=EM_ANDAMENTO
```

```http
GET /api/v1/clientes?nome=Joao
```

```http
GET /api/v1/financeiro?mes=10&ano=2026
```

Quando necessário:

```http
GET /api/v1/obras?sort=created_at&order=desc
```

Os campos permitidos para ordenação deverão ser controlados pelo backend.

---

# 26. Controllers, Services e Repositories

A API não deverá colocar toda a lógica dentro das rotas.

Estrutura:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
PostgreSQL
```

### Route

Define o endereço da API.

### Controller

Recebe a requisição e prepara a resposta.

### Service

Contém as regras de negócio.

### Repository

Responsável pelo acesso ao banco de dados.

Exemplo:

```text
POST /api/v1/pedidos

Route
  ↓
PedidoController
  ↓
PedidoService
  ↓
PedidoRepository
  ↓
PostgreSQL
```

---

# 27. Transações

Operações que alteram vários registros relacionados deverão utilizar transações do PostgreSQL quando necessário.

Exemplo:

```text
Criar pedido
    ↓
Criar itens
    ↓
Calcular total
    ↓
Registrar operação
```

Se uma etapa crítica falhar, a transação poderá ser revertida para evitar dados inconsistentes.

---

# 28. Auditoria

Operações importantes deverão gerar registros de auditoria.

Exemplo:

```text
Usuário: João
Ação: ALTEROU_PEDIDO
Pedido: #152
Data: 01/10/2026
```

A auditoria será utilizada para rastrear alterações relevantes no sistema.

---

# 29. API pública e API interna

Inicialmente, a API será utilizada pelo próprio frontend da plataforma.

Não haverá necessidade de criar uma API pública para terceiros no MVP.

No futuro, caso o sistema se torne SaaS, poderá existir uma API externa para integrações.

Exemplos futuros:

```text
API de parceiros
API de contabilidade
API de pagamentos
API de notificações
API de integração com outros sistemas
```

---

# 30. Documentação futura da API

Durante a implementação, a API poderá ser documentada utilizando OpenAPI/Swagger.

A documentação deverá apresentar:

* endpoints;
* métodos HTTP;
* parâmetros;
* autenticação;
* respostas;
* códigos de erro;
* exemplos;
* modelos de dados.

---

# 31. MVP da API

No primeiro MVP, a implementação deverá priorizar:

1. Autenticação;
2. Usuários;
3. Permissões;
4. Clientes;
5. Obras;
6. Pedidos;
7. Itens dos pedidos;
8. Pagamentos;
9. Comprovantes;
10. Financeiro;
11. Portal do cliente;
12. Documentos básicos.

Os módulos de materiais, aluguéis, relatórios avançados e integrações poderão evoluir posteriormente.

---

# 32. Princípios

A API seguirá os seguintes princípios:

* simples de entender;
* organizada por módulos;
* REST;
* segura por padrão;
* validação no backend;
* regras de negócio nos Services;
* acesso ao banco nos Repositories;
* respostas padronizadas;
* isolamento por empresa;
* preparada para crescimento;
* sem complexidade desnecessária.

> **Princípio do projeto:** começar simples, mas com uma estrutura que permita evoluir.

---

## Próxima etapa

Após a definição da API, os próximos documentos e implementações serão:

1. Estrutura física do projeto;
2. Configuração do ambiente de desenvolvimento;
3. PostgreSQL e migrations;
4. Dockerfile;
5. Docker Compose;
6. Autenticação;
7. Autorização e permissões;
8. Implementação dos primeiros endpoints;
9. Testes da API.
