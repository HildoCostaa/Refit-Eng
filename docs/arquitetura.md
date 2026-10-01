# Arquitetura — Plataforma de Gestão de Obras

**Projeto:** Plataforma de Gestão de Obras
**Versão:** 1.0
**Status:** Em desenvolvimento
**Documento:** Arquitetura do Sistema

## 1. Objetivo

Definir a arquitetura técnica da Plataforma de Gestão de Obras considerando:

* Baixo custo inicial;
* Facilidade de desenvolvimento e manutenção;
* Segurança;
* Escalabilidade;
* Separação de responsabilidades;
* Preparação para transformação em SaaS;
* Possibilidade de crescimento sem reconstrução completa do sistema.

A arquitetura inicial deverá evitar complexidade e custos desnecessários, mantendo uma estrutura que permita evolução futura.

## 2. Decisão Arquitetural

A arquitetura inicial escolhida será:

**Monólito Modular.**

O sistema será executado inicialmente como uma aplicação principal, porém internamente será dividido em módulos independentes por responsabilidade.

```text
Frontend
    ↓
API / Backend
    ↓
Módulos da aplicação
    ↓
Banco de Dados
    ↓
Armazenamento de Arquivos
```

A aplicação será implantada inicialmente como uma unidade principal, evitando a necessidade de múltiplos servidores, serviços e infraestruturas.

## 3. Por que não utilizar Microserviços inicialmente?

Microserviços podem ser úteis em sistemas de grande escala, mas adicionam complexidade operacional.

Uma arquitetura com vários serviços normalmente pode exigir:

* Múltiplos processos;
* Mais servidores ou containers;
* Comunicação entre serviços;
* APIs internas;
* Gerenciamento de rede;
* Monitoramento individual;
* Logs distribuídos;
* Filas;
* Service discovery em arquiteturas maiores;
* Mais pipelines de deploy;
* Maior consumo de infraestrutura;
* Maior complexidade de manutenção.

Para o estágio atual do projeto, essa complexidade não é necessária.

### Comparação conceitual

| Aspecto                 | Monólito Modular | Microserviços            |
| ----------------------- | ---------------- | ------------------------ |
| Custo inicial           | Menor            | Maior                    |
| Infraestrutura          | Simples          | Mais complexa            |
| Deploy                  | Simples          | Vários serviços          |
| Desenvolvimento inicial | Mais rápido      | Mais complexo            |
| Monitoramento           | Mais simples     | Mais complexo            |
| Comunicação interna     | Direta           | Normalmente via rede/API |
| Escalabilidade          | Boa inicialmente | Excelente por serviço    |
| Manutenção inicial      | Mais simples     | Mais complexa            |
| Adequação ao MVP        | Alta             | Baixa                    |
| Futuro SaaS             | Possível         | Possível                 |

A escolha não significa que microserviços sejam inadequados permanentemente.

A aplicação deverá ser estruturada de maneira que módulos que futuramente precisem de escala independente possam ser separados.

## 4. Arquitetura Modular

Embora seja um monólito, o sistema não deverá ser desenvolvido como um bloco único desorganizado.

A aplicação será dividida em módulos.

```text
backend/
├── auth/
├── users/
├── permissions/
├── companies/
├── clients/
├── works/
├── orders/
├── payments/
├── documents/
├── finance/
├── activities/
├── materials/
├── rentals/
├── notifications/
├── reports/
└── audit/
```

Cada módulo deverá possuir suas próprias responsabilidades.

Exemplo:

```text
orders/
├── controller
├── service
├── repository
├── entity/model
├── validation
└── routes
```

## 5. Camadas da Aplicação

A aplicação deverá utilizar separação de responsabilidades.

Modelo inicial:

```text
┌──────────────────────────────┐
│           Frontend           │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│             API              │
├──────────────────────────────┤
│ Controllers / Routes         │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Camada de Serviço      │
│        Regras de Negócio     │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Repository / ORM       │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│          Banco de Dados      │
└──────────────────────────────┘
```

## 6. Frontend

O frontend será responsável pela interface utilizada pelos usuários.

Responsabilidades:

* Exibir informações;
* Receber entradas;
* Validar informações básicas para melhorar a experiência;
* Consumir a API;
* Controlar navegação;
* Exibir mensagens de erro;
* Respeitar permissões para apresentação dos recursos.

O frontend não será responsável por garantir a segurança do sistema.

Exemplo:

```text
Frontend
    ↓
"Usuário pode visualizar esta página?"
    ↓
API
    ↓
"Usuário realmente possui essa permissão?"
```

A API será a autoridade final.

## 7. Backend

O backend será responsável por:

* Regras de negócio;
* Autenticação;
* Autorização;
* Validação;
* Processamento financeiro;
* Controle de empresas;
* Controle de usuários;
* Manipulação de arquivos;
* Comunicação com banco de dados;
* Auditoria;
* Notificações;
* Geração de documentos.

O backend será o principal responsável pela segurança e integridade dos dados.

## 8. API

A comunicação entre frontend e backend será realizada por uma API.

Modelo inicial:

```text
Frontend
    ↓
HTTP/HTTPS
    ↓
REST API
    ↓
Backend
```

Exemplos conceituais:

```text
GET    /api/works
POST   /api/works
GET    /api/works/:id
PUT    /api/works/:id
DELETE /api/works/:id
```

A definição completa dos endpoints será documentada posteriormente em:

`docs/api.md`

## 9. Banco de Dados

O banco será compartilhado pela aplicação monolítica, utilizando relacionamentos e isolamento por empresa.

```text
Backend
   ↓
Database
```

A aplicação deverá utilizar:

* Chaves primárias;
* Chaves estrangeiras;
* Constraints;
* Índices;
* Transações;
* Migrations;
* Validações;
* Controle de integridade.

## 10. Multiempresa

O sistema deverá nascer preparado para múltiplas empresas.

Conceito:

```text
                    Plataforma
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
     Empresa A       Empresa B       Empresa C
        │               │               │
      Dados           Dados           Dados
```

Cada registro deverá estar associado à empresa correspondente.

Exemplo:

```text
obra.empresa_id
pedido.empresa_id
cliente.empresa_id
usuario.empresa_id
financeiro.empresa_id
```

O backend deverá sempre validar o contexto da empresa antes de acessar ou alterar dados.

## 11. Segurança

A arquitetura deverá considerar segurança desde o início.

### Autenticação

Responsável por identificar o usuário.

```text
Login
  ↓
Credenciais
  ↓
Autenticação
  ↓
Sessão/Token
```

### Autorização

Responsável por verificar o que o usuário pode fazer.

```text
Usuário
   ↓
Permissão
   ↓
Recurso
   ↓
Acesso permitido/negado
```

A autenticação e a autorização deverão ocorrer no backend.

## 12. Armazenamento de Arquivos

Arquivos como:

* Comprovantes;
* PDFs;
* Documentos Word;
* Anexos;

não deverão ser armazenados diretamente como grandes objetos dentro das tabelas do banco sem necessidade.

O banco deverá armazenar os metadados e a referência ao arquivo.

```text
Banco
   ↓
documento_id
arquivo_path
nome
tipo
tamanho
```

Enquanto o arquivo poderá ficar em:

```text
Storage
   ↓
Arquivo físico
```

Inicialmente poderá ser utilizado armazenamento local ou uma solução de baixo custo.

Posteriormente, o sistema poderá migrar para armazenamento em nuvem.

## 13. Processos Automáticos

Algumas tarefas não precisam acontecer durante uma requisição do usuário.

Exemplos:

* Notificação de devolução 24h antes;
* Processamento de notificações;
* Geração de relatórios;
* Rotinas de manutenção;
* Futuras cobranças recorrentes.

Inicialmente, essas tarefas poderão utilizar um mecanismo simples de tarefas agendadas.

Exemplo:

```text
Scheduler
    ↓
Verifica aluguéis
    ↓
Encontrou devolução em 24h?
    ↓
Envia notificação
```

Não será necessário criar um microserviço exclusivamente para isso no início.

## 14. Geração de Documentos

A geração de PDF e Word ficará dentro do módulo de documentos.

```text
Pedido
  ↓
Módulo de Documentos
  ↓
Gerador
  ↓
PDF / Word
```

Caso o volume cresça significativamente, esse processo poderá futuramente ser transformado em um serviço independente.

## 15. Notificações

Inicialmente, o módulo de notificações fará parte do backend principal.

```text
Evento
  ↓
Notification Module
  ↓
Notificação
  ↓
Usuário
```

No futuro, caso exista grande volume de notificações, poderá ser introduzida uma fila.

```text
Evento
  ↓
Fila
  ↓
Worker
  ↓
Notificação
```

Essa evolução não será necessária no MVP.

## 16. Estrutura de Diretórios

Uma estrutura inicial possível:

```text
gestao-obras/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── companies/
│   │   │   ├── clients/
│   │   │   ├── works/
│   │   │   ├── orders/
│   │   │   ├── payments/
│   │   │   ├── documents/
│   │   │   ├── finance/
│   │   │   ├── activities/
│   │   │   ├── materials/
│   │   │   ├── rentals/
│   │   │   ├── notifications/
│   │   │   ├── reports/
│   │   │   └── audit/
│   │   │
│   │   ├── shared/
│   │   ├── config/
│   │   ├── database/
│   │   └── app/
│   │
│   └── tests/
│
├── frontend/
│   ├── src/
│   └── tests/
│
├── docs/
│
└── README.md
```

A estrutura definitiva poderá ser ajustada de acordo com o framework escolhido.

## 17. Infraestrutura Inicial

A infraestrutura deverá ser simples para reduzir custos.

Arquitetura inicial conceitual:

```text
              Internet
                  │
                  ▼
            ┌───────────┐
            │  Frontend │
            └─────┬─────┘
                  │
                  ▼
            ┌───────────┐
            │    API    │
            │  Backend  │
            └─────┬─────┘
                  │
          ┌───────┴────────┐
          ▼                ▼
     ┌─────────┐      ┌──────────┐
     │  Banco  │      │ Storage  │
     │   SQL   │      │ Arquivos │
     └─────────┘      └──────────┘
```

O objetivo é manter o número de componentes de infraestrutura reduzido.

## 18. Estratégia de Custos

O projeto deverá priorizar inicialmente:

1. Baixo custo de hospedagem;
2. Baixo consumo de recursos;
3. Poucos serviços;
4. Banco de dados único;
5. Storage simples;
6. Deploy simples;
7. Monitoramento básico;
8. Escalabilidade somente quando necessária.

A arquitetura não deverá adicionar serviços pagos apenas porque são tecnicamente possíveis.

A introdução de uma nova tecnologia deverá possuir uma justificativa relacionada a:

* Necessidade real;
* Segurança;
* Desempenho;
* Escalabilidade;
* Redução de trabalho operacional;
* Custo-benefício.

## 19. Evolução da Infraestrutura

A evolução deverá acontecer conforme o sistema crescer.

### Fase 1 — MVP

```text
Frontend
   +
Backend
   +
Banco
   +
Storage
```

### Fase 2 — Crescimento

Caso necessário:

```text
Frontend
   +
Backend
   +
Banco
   +
Storage
   +
Cache
   +
Scheduler/Worker
```

### Fase 3 — Escala

Somente se houver necessidade real:

```text
Frontend
     │
     ▼
API / Gateway
     │
 ┌───┼───────────────┐
 ▼   ▼               ▼
Auth Orders       Finance
 │   │               │
 └───┴───────┬───────┘
             ▼
          Database
```

A separação em serviços será feita apenas quando houver justificativa técnica e financeira.

## 20. Quando Considerar Microserviços?

A migração de um módulo para um serviço independente poderá ser considerada quando houver, por exemplo:

* Necessidade de escalar um módulo separadamente;
* Alto volume de processamento;
* Necessidade de deploy independente;
* Necessidade de tecnologia diferente;
* Processamento pesado;
* Falha de um módulo afetando excessivamente o restante da aplicação;
* Equipe suficientemente grande para administrar os serviços;
* Benefício financeiro ou operacional comprovado.

A existência de um SaaS, por si só, não obriga a utilização de microserviços.

## 21. Princípio de Evolução

A arquitetura deverá seguir o princípio:

**Começar simples, mas não começar desorganizado.**

O objetivo é evitar dois extremos:

```text
Arquitetura simples e organizada
              ↓
          EVOLUÇÃO
              ↓
Arquitetura mais distribuída quando necessário
```

Em vez de:

```text
Microserviços desde o primeiro dia
              ↓
Custo + Complexidade
              ↓
Problemas desnecessários
```

## 22. Preparação para SaaS

A arquitetura deverá permitir futuramente:

* Cadastro de empresas;
* Planos;
* Assinaturas;
* Limites;
* Cobrança recorrente;
* Administração da plataforma;
* Isolamento de dados;
* Métricas;
* Configurações por empresa.

A arquitetura inicial não deverá implementar toda a infraestrutura de SaaS antes da necessidade.

Ela deverá apenas evitar decisões que dificultem essa evolução.

## 23. Observabilidade

Inicialmente serão utilizados:

* Logs da aplicação;
* Logs de erros;
* Registro de auditoria;
* Monitoramento básico da aplicação;
* Monitoramento do banco;
* Alertas essenciais.

Posteriormente poderão ser adicionados:

* Monitoramento avançado;
* Métricas;
* Rastreamento distribuído;
* Centralização de logs;
* Alertas avançados.

## 24. Backup

O ambiente deverá possuir estratégia de backup para:

* Banco de dados;
* Arquivos;
* Configurações importantes.

Os backups deverão possuir:

* Periodicidade definida;
* Armazenamento separado;
* Procedimento de restauração;
* Testes periódicos.

## 25. Ambientes

Deverão existir ambientes separados conforme a evolução do projeto:

```text
Desenvolvimento
      ↓
Teste/Homologação
      ↓
Produção
```

No início, devido ao tamanho do projeto, esses ambientes podem compartilhar infraestrutura de baixo custo, desde que os dados de produção sejam protegidos e não sejam utilizados indevidamente durante o desenvolvimento.

## 26. Tecnologias

As tecnologias definitivas deverão ser escolhidas considerando:

* Conhecimento da equipe;
* Curva de aprendizado;
* Custo;
* Comunidade;
* Segurança;
* Desempenho;
* Facilidade de hospedagem;
* Compatibilidade entre frontend e backend;
* Possibilidade de evolução para SaaS.

A escolha tecnológica será documentada antes da implementação.

## 27. Decisão Arquitetural Final

Para a primeira versão da Plataforma de Gestão de Obras será adotada:

**Arquitetura Monolítica Modular + API + Banco SQL + Storage de Arquivos.**

A arquitetura deverá ser:

* Simples para desenvolver;
* Simples para hospedar;
* Baixo custo;
* Modular;
* Segura;
* Multiempresa;
* Preparada para SaaS;
* Preparada para futura extração de serviços.

**Microserviços não fazem parte da arquitetura inicial.**

A possibilidade de utilizar microserviços será tratada como uma evolução futura baseada em necessidade real, e não como requisito inicial.

## 28. Próxima Etapa

Após a definição da arquitetura, deverão ser definidos:

1. Stack tecnológica;
2. Framework do backend;
3. Framework do frontend;
4. Banco de dados;
5. ORM;
6. Autenticação;
7. Sistema de armazenamento;
8. Hospedagem;
9. Estrutura inicial do projeto;
10. Padrão da API.

Essas decisões serão registradas nos próximos documentos antes do início da implementação.
