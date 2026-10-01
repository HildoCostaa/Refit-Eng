# Stack Tecnológica — Plataforma de Gestão de Obras

**Projeto:** Plataforma de Gestão de Obras
**Versão:** 1.0
**Status:** Em desenvolvimento
**Documento:** Stack Tecnológica

## 1. Objetivo

Definir as tecnologias que serão utilizadas no desenvolvimento, execução, testes e futura hospedagem da Plataforma de Gestão de Obras.

A escolha da stack considera:

* Baixo custo;
* Facilidade de aprendizado;
* Tecnologias amplamente utilizadas;
* Simplicidade;
* Manutenção;
* Segurança;
* Compatibilidade;
* Preparação para SaaS;
* Possibilidade de conteinerização;
* Possibilidade de crescimento futuro.

## 2. Stack Principal

A stack inicial definida será:

| Camada                | Tecnologia           |
| --------------------- | -------------------- |
| Estrutura do frontend | HTML5                |
| Estilização           | CSS3                 |
| Lógica do frontend    | JavaScript           |
| Backend               | Node.js              |
| Framework HTTP        | Express.js           |
| Banco de dados        | PostgreSQL           |
| Driver do banco       | `pg` / node-postgres |
| Conteinerização       | Docker               |
| Orquestração local    | Docker Compose       |
| Controle de versão    | Git                  |
| Repositório           | GitHub               |
| Deploy inicial        | Vercel               |
| Documentação          | Markdown             |

## 3. Frontend

### 3.1 HTML5

O HTML será responsável pela estrutura das páginas.

Será utilizado para:

* Formulários;
* Tabelas;
* Menus;
* Cards;
* Dashboards;
* Estrutura das telas;
* Elementos de acessibilidade.

Inicialmente não será utilizado um framework frontend.

### 3.2 CSS3

O CSS será responsável pela apresentação visual.

Responsabilidades:

* Layout;
* Responsividade;
* Cores;
* Tipografia;
* Espaçamentos;
* Componentes visuais;
* Adaptação para celular, tablet e desktop.

O projeto deverá utilizar CSS organizado por componentes ou módulos para evitar uma folha de estilos desorganizada.

### 3.3 JavaScript

O JavaScript será utilizado no frontend para:

* Interação com a interface;
* Validação inicial dos formulários;
* Requisições para a API;
* Atualização dinâmica das páginas;
* Manipulação do DOM;
* Controle de menus;
* Filtros;
* Dashboards;
* Tratamento de respostas da API.

A segurança não deverá depender das validações realizadas no frontend.

Toda informação importante deverá ser validada novamente pelo backend.

## 4. Por que começar sem React ou outro framework frontend?

O projeto tem também um objetivo educacional.

Utilizar inicialmente:

**HTML + CSS + JavaScript**

permite compreender os fundamentos antes de adicionar abstrações de um framework.

O desenvolvedor deverá aprender:

* DOM;
* Eventos;
* Fetch API;
* HTTP;
* JSON;
* Formulários;
* Cookies/sessões ou tokens;
* Manipulação de estado;
* Comunicação frontend/backend.

Posteriormente, caso o sistema cresça e a complexidade da interface justifique, poderá ser avaliada a adoção de um framework frontend.

Possibilidades futuras:

* React;
* Vue;
* outro framework adequado ao projeto.

A adoção de um framework não é requisito do MVP.

## 5. Backend

### 5.1 Node.js

Node.js será utilizado como runtime do backend.

O Node.js permitirá executar JavaScript no servidor e utilizar o mesmo ecossistema de linguagem no frontend e backend.

Responsabilidades:

* Executar a API;
* Processar requisições;
* Aplicar regras de negócio;
* Autenticar usuários;
* Autorizar operações;
* Comunicar com PostgreSQL;
* Processar arquivos;
* Gerar documentos;
* Executar tarefas automáticas.

Para o projeto, será utilizada uma versão LTS do Node.js. A versão exata será fixada no projeto por meio de configuração de runtime.

## 6. Express.js

Express será utilizado como framework HTTP do backend.

Responsabilidades:

* Rotas;
* Middleware;
* Controllers;
* Recebimento de requisições;
* Respostas HTTP;
* Tratamento de erros;
* Autenticação;
* Integração com os serviços da aplicação.

A Vercel possui suporte documentado para aplicações Express e oferece implantação de Express sem configuração complexa.

Exemplo conceitual:

```text
Cliente
   ↓
HTTP Request
   ↓
Express
   ↓
Middleware
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
PostgreSQL
```

## 7. PostgreSQL

PostgreSQL será o banco de dados principal da aplicação.

A escolha está relacionada ao modelo fortemente relacional do projeto.

O sistema possui relações como:

```text
Empresa
   ↓
Cliente
   ↓
Obra
   ↓
Pedido
   ↓
Pagamento
```

Além de:

```text
Obra
 ├── Financeiro
 ├── Atividades
 ├── Materiais
 └── Aluguéis
```

PostgreSQL oferece recursos importantes para esse cenário, incluindo chaves primárias, chaves estrangeiras, constraints, transações, índices e integridade transacional.

## 8. Versão do PostgreSQL

A aplicação deverá utilizar uma versão estável e suportada do PostgreSQL.

**PostgreSQL 18** será a referência inicial do projeto.

Não será utilizada uma versão beta em produção.

O projeto deverá fixar a versão utilizada no ambiente de desenvolvimento e no ambiente de produção para evitar diferenças inesperadas.

## 9. Acesso ao PostgreSQL

Inicialmente será utilizado o pacote:

```text
pg
```

Também conhecido como **node-postgres**.

A aplicação poderá executar consultas SQL diretamente pelo backend.

Exemplo conceitual:

```text
Express
   ↓
Service
   ↓
Repository
   ↓
pg
   ↓
PostgreSQL
```

### Motivo da escolha

Como o projeto possui finalidade também educacional, inicialmente não será utilizado um ORM para esconder o funcionamento do SQL.

Isso permitirá aprender:

* SELECT;
* INSERT;
* UPDATE;
* DELETE;
* JOIN;
* WHERE;
* GROUP BY;
* ORDER BY;
* Transações;
* Constraints;
* Índices;
* Foreign Keys;
* Agregações;
* Paginação.

Posteriormente poderá ser avaliada a utilização de um ORM ou query builder caso isso gere benefício real ao projeto.

## 10. Migrations

As alterações estruturais do banco deverão ser versionadas.

Não será permitido depender apenas de alterações manuais realizadas no banco.

Exemplo:

```text
migrations/
├── 001_create_companies.sql
├── 002_create_users.sql
├── 003_create_clients.sql
├── 004_create_works.sql
└── ...
```

Isso permitirá reproduzir a estrutura do banco em diferentes ambientes.

A ferramenta definitiva para execução das migrations será escolhida durante a implementação.

## 11. Docker

Docker será utilizado para conteinerização.

O objetivo possui dois aspectos:

### Técnico

Garantir ambientes mais previsíveis e reproduzíveis.

### Educacional

Permitir que o desenvolvedor aprenda:

* Imagens;
* Containers;
* Dockerfile;
* Volumes;
* Redes;
* Variáveis de ambiente;
* Docker Compose;
* Portas;
* Comunicação entre containers;
* Build;
* Deploy de containers.

Containers permitem isolar componentes da aplicação e tornam o ambiente mais reproduzível entre máquinas e ambientes.

## 12. Docker Compose

O desenvolvimento local deverá utilizar Docker Compose quando houver necessidade de executar múltiplos componentes.

Estrutura inicial prevista:

```text
Docker Compose
      │
      ├── Backend
      │
      └── PostgreSQL
```

Posteriormente poderão ser adicionados:

```text
      ├── Storage
      ├── Worker
      └── Redis
```

Somente quando houver necessidade.

## 13. Dockerfile

O backend deverá possuir um `Dockerfile`.

Exemplo conceitual:

```text
Dockerfile
   ↓
Imagem Node.js
   ↓
Dependências
   ↓
Código da aplicação
   ↓
Container
   ↓
Express
```

O objetivo é permitir que a aplicação seja executada de maneira consistente em diferentes ambientes.

## 14. Docker não significa Microserviços

A utilização de Docker não altera a decisão arquitetural anterior.

O projeto continuará sendo:

**Monólito Modular.**

Podemos ter:

```text
Container
└── Backend monolítico
```

em vez de:

```text
Container 1 → Auth
Container 2 → Orders
Container 3 → Finance
Container 4 → Users
Container 5 → Notifications
```

A segunda estrutura seria uma arquitetura distribuída e não será utilizada inicialmente.

Docker é uma tecnologia de empacotamento e execução; microserviços são uma decisão arquitetural.

## 15. Estratégia de Deploy

A estratégia inicial será:

**Vercel para o deploy da aplicação + PostgreSQL hospedado em serviço compatível + Docker para desenvolvimento e preparação para ambientes containerizados.**

A Vercel atualmente suporta Express e Node.js diretamente, incluindo implantação de aplicações Express.

Arquitetura inicial:

```text
                    Internet
                       │
                       ▼
                 ┌───────────┐
                 │  Vercel   │
                 │ Front/API │
                 └─────┬─────┘
                       │
                       ▼
                 ┌───────────┐
                 │PostgreSQL │
                 │ hospedado │
                 └───────────┘
```

O storage de arquivos será definido posteriormente de acordo com custo, segurança e necessidade.

## 16. Por que Vercel inicialmente?

A Vercel será utilizada inicialmente para reduzir a complexidade operacional.

Benefícios para o projeto:

* Deploy integrado ao Git;
* Deploys automatizados;
* Preview deployments;
* Infraestrutura gerenciada;
* Suporte a Node.js;
* Suporte documentado para Express;
* Menor necessidade de administrar um servidor inicialmente.

O objetivo não é tornar o projeto dependente permanentemente da Vercel.

## 17. Docker como Preparação para Migração

A aplicação deverá continuar funcionando em container.

Isso permite futuramente executar o mesmo backend em:

* VPS;
* Servidor próprio;
* Cloud;
* Plataforma de containers;
* Outro provedor compatível.

Estratégia:

```text
Código
  │
  ├── Vercel
  │
  └── Docker
        ↓
      Futuro
        ↓
 VPS / Cloud / Container Platform
```

A Vercel também documenta execução de aplicações containerizadas, portanto a existência de Docker não impede uma futura estratégia baseada na própria plataforma, embora a arquitetura do projeto não dependa disso.

## 18. Git e GitHub

O projeto utilizará Git para controle de versão.

O GitHub será utilizado para:

* Armazenar o código;
* Controlar versões;
* Criar branches;
* Registrar commits;
* Revisar alterações;
* Documentar o projeto;
* Integrar posteriormente CI/CD.

Estratégia inicial:

```text
main
  ↑
develop
  ↑
feature/*
```

A estratégia de branches poderá ser simplificada durante o desenvolvimento inicial caso o projeto seja desenvolvido individualmente.

## 19. Variáveis de Ambiente

Informações sensíveis não deverão ser armazenadas diretamente no código.

Exemplos:

```text
DATABASE_URL
JWT_SECRET
PORT
STORAGE_KEY
STORAGE_SECRET
```

Essas informações deverão ser configuradas através de variáveis de ambiente.

Nunca deverão ser enviadas para o GitHub:

```text
.env
.env.production
senhas
tokens
chaves privadas
credenciais
```

Deverá existir um arquivo de exemplo:

```text
.env.example
```

sem valores secretos.

## 20. Segurança da Stack

A stack deverá utilizar:

* HTTPS em produção;
* Hash de senhas;
* Variáveis de ambiente;
* Validação de entrada;
* Prepared statements/queries parametrizadas;
* Controle de permissões;
* Proteção de arquivos;
* CORS configurado adequadamente;
* Rate limiting quando necessário;
* Logs;
* Auditoria;
* Dependências atualizadas.

## 21. Estrutura Tecnológica

Visão geral:

```text
┌────────────────────────────────────┐
│              Frontend              │
│        HTML + CSS + JavaScript     │
└────────────────┬───────────────────┘
                 │
                 │ HTTP/HTTPS
                 ▼
┌────────────────────────────────────┐
│              Backend               │
│        Node.js + Express.js        │
├────────────────────────────────────┤
│ Auth │ Users │ Works │ Orders      │
│ Finance │ Materials │ Rentals      │
└────────────────┬───────────────────┘
                 │
                 ▼
┌────────────────────────────────────┐
│            PostgreSQL              │
└────────────────────────────────────┘
```

Ambiente de desenvolvimento:

```text
Docker Compose
   │
   ├── Backend
   │
   └── PostgreSQL
```

## 22. Stack e Objetivo Educacional

A stack foi escolhida também para permitir aprendizado progressivo.

### Fundamentos

```text
HTML
CSS
JavaScript
```

### Backend

```text
Node.js
Express
HTTP
REST API
```

### Banco

```text
SQL
PostgreSQL
Relacionamentos
Transactions
Indexes
Constraints
```

### Infraestrutura

```text
Git
GitHub
Docker
Docker Compose
Deploy
CI/CD
```

Dessa maneira, o projeto também funcionará como um laboratório prático de desenvolvimento de software.

## 23. Possíveis Tecnologias Futuras

Não fazem parte da stack inicial, mas poderão ser adicionadas caso exista necessidade.

### Frontend

```text
React
Vue
TypeScript
```

### Backend

```text
Redis
Queue/Worker
WebSocket
```

### Infraestrutura

```text
Container Registry
Reverse Proxy
Load Balancer
Orquestração
```

### Observabilidade

```text
Métricas
Tracing
Centralização de logs
Alertas avançados
```

A inclusão dessas tecnologias deverá ser baseada em necessidade real.

## 24. Decisão Final da Stack

A stack inicial oficial será:

**Frontend**

```text
HTML5
CSS3
JavaScript
```

**Backend**

```text
Node.js
Express.js
```

**Banco**

```text
PostgreSQL
pg / node-postgres
```

**Infraestrutura**

```text
Docker
Docker Compose
```

**Deploy inicial**

```text
Vercel
```

**Controle de versão**

```text
Git
GitHub
```

## 25. Princípio da Stack

A decisão seguirá o princípio:

**"Poucas tecnologias, bem utilizadas."**

O projeto não deverá adicionar uma tecnologia simplesmente porque ela é popular.

Cada nova ferramenta deverá responder a uma necessidade concreta.

A stack inicial deverá permanecer simples enquanto atender aos requisitos.

## 26. Próxima Etapa

Após definir a stack, os próximos documentos e decisões deverão abordar:

1. Estrutura definitiva do projeto;
2. Padrão da API;
3. Autenticação;
4. Modelo de autorização;
5. Migrations;
6. Configuração do PostgreSQL;
7. Dockerfile;
8. Docker Compose;
9. Ambiente de desenvolvimento;
10. Estratégia de testes.

A implementação será iniciada somente após essas decisões fundamentais estarem suficientemente definidas.
