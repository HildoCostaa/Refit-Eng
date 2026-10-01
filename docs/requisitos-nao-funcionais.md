# Requisitos Não Funcionais — Plataforma de Gestão de Obras

**Projeto:** Plataforma de Gestão de Obras
**Versão:** 1.0
**Status:** Em desenvolvimento / Definição de requisitos

## 1. Objetivo

Os requisitos não funcionais definem características de qualidade, segurança, desempenho, disponibilidade, manutenção e escalabilidade que a Plataforma de Gestão de Obras deverá atender.

Diferentemente dos requisitos funcionais, os requisitos não funcionais não descrevem uma funcionalidade específica, mas determinam como o sistema deverá operar.

---

# 2. Segurança

### RNF-001 — Autenticação

O sistema deverá exigir autenticação para acesso às áreas restritas.

### RNF-002 — Senhas

As senhas dos usuários não deverão ser armazenadas em texto puro. Deverão ser armazenadas utilizando mecanismo seguro de hash.

### RNF-003 — Autorização

O sistema deverá verificar as permissões do usuário antes de permitir acesso a recursos protegidos.

### RNF-004 — Isolamento de dados

Usuários deverão acessar somente dados pertencentes à sua empresa e às obras para as quais possuem autorização.

### RNF-005 — Proteção de documentos

Comprovantes, documentos e arquivos enviados ao sistema não deverão possuir acesso público não autorizado.

### RNF-006 — Sessões

O sistema deverá possuir mecanismo seguro de gerenciamento de sessões e autenticação.

### RNF-007 — Proteção contra ataques

A aplicação deverá adotar medidas de proteção contra vulnerabilidades comuns, incluindo:

* SQL Injection;
* Cross-Site Scripting (XSS);
* Cross-Site Request Forgery (CSRF), quando aplicável;
* Brute Force;
* Upload de arquivos maliciosos;
* Acesso não autorizado.

---

# 3. Privacidade e proteção de dados

### RNF-008 — Proteção de dados pessoais

O sistema deverá tratar dados pessoais de acordo com as boas práticas de segurança e privacidade e com a legislação aplicável, incluindo a LGPD.

### RNF-009 — Controle de acesso aos dados

Informações pessoais de clientes e usuários deverão ser acessíveis somente por usuários autorizados.

### RNF-010 — Minimização de dados

O sistema deverá armazenar somente os dados necessários para o funcionamento das funcionalidades disponibilizadas.

### RNF-011 — Exclusão e desativação

O sistema deverá possuir mecanismos para desativação de usuários e gerenciamento adequado de seus dados, considerando obrigações legais e necessidades de auditoria.

---

# 4. Desempenho

### RNF-012 — Tempo de resposta

As principais operações do sistema deverão apresentar tempo de resposta adequado para utilização cotidiana.

### RNF-013 — Consultas

Consultas ao banco de dados deverão ser estruturadas de forma eficiente, evitando operações desnecessariamente pesadas.

### RNF-014 — Paginação

Listagens que possam possuir grande quantidade de registros deverão utilizar paginação ou mecanismo equivalente.

### RNF-015 — Upload de arquivos

O sistema deverá controlar tamanho e formatos permitidos para arquivos enviados.

---

# 5. Disponibilidade

### RNF-016 — Disponibilidade

O sistema deverá permanecer disponível para utilização durante o período de operação definido pela plataforma.

### RNF-017 — Tratamento de erros

Falhas internas não deverão expor informações técnicas sensíveis ao usuário final.

### RNF-018 — Recuperação de falhas

O sistema deverá possuir mecanismos que permitam identificar e recuperar serviços após falhas.

---

# 6. Backup e recuperação

### RNF-019 — Backup do banco de dados

Deverão existir backups periódicos do banco de dados.

### RNF-020 — Backup de arquivos

Arquivos importantes, como comprovantes e documentos, deverão possuir estratégia de backup.

### RNF-021 — Recuperação

Deverá existir um procedimento documentado para recuperação dos dados em caso de falha.

### RNF-022 — Teste de backup

Os backups deverão ser periodicamente verificados para garantir que possam ser restaurados.

---

# 7. Escalabilidade

### RNF-023 — Arquitetura escalável

A arquitetura deverá permitir crescimento da quantidade de usuários, empresas, obras, documentos e registros sem necessidade de reescrever completamente o sistema.

### RNF-024 — Multiempresa

A arquitetura deverá suportar múltiplas empresas utilizando a mesma plataforma com isolamento adequado dos dados.

### RNF-025 — Armazenamento

O armazenamento de documentos deverá permitir crescimento conforme a quantidade de arquivos aumente.

### RNF-026 — Componentização

O sistema deverá ser desenvolvido de forma modular, permitindo evolução independente de seus principais componentes.

---

# 8. Responsividade e compatibilidade

### RNF-027 — Responsividade

A interface deverá ser adaptável para:

* Computadores;
* Notebooks;
* Tablets;
* Smartphones.

### RNF-028 — Navegadores

O sistema deverá funcionar nos principais navegadores modernos.

Inicialmente:

* Google Chrome;
* Microsoft Edge;
* Mozilla Firefox;
* Safari.

### RNF-029 — Interface

A interface deverá manter boa legibilidade, organização e usabilidade em diferentes tamanhos de tela.

---

# 9. Usabilidade

### RNF-030 — Facilidade de uso

As funcionalidades deverão possuir fluxos simples e compreensíveis para usuários com diferentes níveis de conhecimento técnico.

### RNF-031 — Feedback

O sistema deverá informar ao usuário o resultado das operações realizadas.

Exemplos:

```text
✓ Ordem criada com sucesso.

✓ Comprovante enviado.

✕ Não foi possível salvar a ordem.
```

### RNF-032 — Validação

Campos obrigatórios e informações inválidas deverão ser identificados antes do envio dos dados.

### RNF-033 — Confirmação de ações

Operações potencialmente destrutivas deverão solicitar confirmação.

Exemplo:

```text
Deseja realmente excluir esta atividade?

[Cancelar] [Confirmar]
```

---

# 10. Manutenibilidade

### RNF-034 — Código organizado

O código deverá seguir uma estrutura organizada e padronizada.

### RNF-035 — Separação de responsabilidades

As diferentes responsabilidades da aplicação deverão ser separadas de forma adequada.

Exemplo:

```text
Frontend
Backend
Banco de dados
Serviços
Autenticação
Armazenamento
```

### RNF-036 — Documentação

Decisões técnicas e componentes importantes deverão possuir documentação.

### RNF-037 — Controle de versão

O código deverá ser versionado utilizando Git.

### RNF-038 — Branches

O desenvolvimento deverá utilizar uma estratégia de branches definida pelo projeto.

---

# 11. Confiabilidade

### RNF-039 — Integridade dos dados

O sistema deverá evitar inconsistências nos dados armazenados.

### RNF-040 — Validação no backend

Informações recebidas pelo frontend deverão ser validadas também no backend.

### RNF-041 — Transações

Operações que envolvam múltiplas alterações relacionadas deverão utilizar mecanismos que preservem a consistência dos dados.

### RNF-042 — Tratamento de erros

Erros deverão ser tratados de maneira controlada, evitando perda ou corrupção de informações.

---

# 12. Auditoria e rastreabilidade

### RNF-043 — Registro de ações

Ações relevantes deverão possuir registro de usuário, data e horário.

### RNF-044 — Histórico

O sistema deverá manter informações necessárias para identificar alterações relevantes realizadas nos registros.

### RNF-045 — Segurança dos logs

Logs não deverão armazenar informações sensíveis desnecessárias, como senhas ou tokens de autenticação.

---

# 13. Arquivos e documentos

### RNF-046 — Tipos de arquivo

O sistema deverá controlar os tipos de arquivos permitidos para upload.

### RNF-047 — Tamanho dos arquivos

O sistema deverá possuir limite configurável para tamanho dos arquivos enviados.

### RNF-048 — Nomes dos arquivos

O sistema deverá evitar conflitos de nomes e caracteres que possam causar problemas no armazenamento.

### RNF-049 — Armazenamento

Arquivos deverão ser armazenados de maneira separada dos dados estruturados do banco de dados, utilizando uma estratégia adequada de armazenamento.

---

# 14. Notificações

### RNF-050 — Confiabilidade das notificações

Notificações programadas deverão ser processadas de maneira confiável.

### RNF-051 — Não duplicação

O sistema deverá evitar o envio duplicado de uma mesma notificação quando não necessário.

### RNF-052 — Histórico

O sistema deverá possuir estrutura para registrar notificações processadas quando necessário para auditoria e controle.

---

# 15. Arquitetura

### RNF-053 — Separação de camadas

A aplicação deverá possuir separação adequada entre interface, regras de negócio, acesso a dados e serviços.

### RNF-054 — API

A comunicação entre frontend e backend deverá utilizar uma interface de comunicação bem definida.

### RNF-055 — Configurações

Informações sensíveis e configurações específicas do ambiente não deverão ser armazenadas diretamente no código-fonte.

### RNF-056 — Variáveis de ambiente

Credenciais, chaves, URLs e outras configurações sensíveis deverão utilizar variáveis de ambiente ou mecanismo equivalente.

---

# 16. Ambientes

### RNF-057 — Ambiente de desenvolvimento

O projeto deverá possuir configuração adequada para desenvolvimento local.

### RNF-058 — Ambiente de testes

O sistema deverá possuir ambiente ou estratégia que permita realizar testes sem comprometer os dados reais.

### RNF-059 — Ambiente de produção

O ambiente de produção deverá ser separado do ambiente de desenvolvimento.

---

# 17. Testes

### RNF-060 — Testes automatizados

As principais regras de negócio deverão possuir testes automatizados progressivamente.

### RNF-061 — Testes de API

Endpoints importantes deverão possuir testes para validar entradas, respostas, permissões e erros.

### RNF-062 — Testes de segurança

Funcionalidades relacionadas a autenticação, autorização e acesso a dados deverão ser testadas.

### RNF-063 — Testes de regressão

Alterações no sistema deverão ser verificadas para evitar que funcionalidades existentes sejam quebradas.

---

# 18. Observabilidade

### RNF-064 — Logs

O sistema deverá possuir logs suficientes para auxiliar na identificação de erros e problemas operacionais.

### RNF-065 — Monitoramento

A plataforma deverá possuir estrutura preparada para monitorar disponibilidade, erros e desempenho.

### RNF-066 — Alertas

O sistema poderá gerar alertas para falhas críticas, indisponibilidade ou problemas que necessitem de intervenção.

---

# 19. SEO e acesso público

### RNF-067 — Área administrativa protegida

Áreas administrativas não deverão ser acessíveis publicamente sem autenticação.

### RNF-068 — Portal do cliente protegido

O portal do cliente deverá exigir autenticação.

### RNF-069 — Dados privados

Dados de clientes, obras, financeiro, ordens e documentos não deverão ser indexados publicamente por mecanismos de busca.

---

# 20. Escopo do MVP

Os requisitos não funcionais deverão ser implementados de maneira proporcional à primeira versão do sistema.

No MVP, deverão receber prioridade:

* Autenticação segura;
* Controle de permissões;
* Isolamento de dados;
* Validação no backend;
* Proteção de arquivos;
* Responsividade;
* Backup;
* Tratamento de erros;
* Variáveis de ambiente;
* Controle de versão;
* Estrutura preparada para multiempresa.

Recursos mais avançados de monitoramento, escalabilidade e observabilidade poderão ser evoluídos conforme a plataforma crescer.

---

# 21. Objetivo arquitetural futuro

A plataforma deverá ser construída de forma que a evolução de uma empresa piloto para uma plataforma SaaS possa ocorrer sem necessidade de reconstrução completa do sistema.

A arquitetura deverá considerar desde o início:

```text
Plataforma
│
├── Empresa A
│   ├── Usuários
│   ├── Clientes
│   ├── Obras
│   └── Dados
│
├── Empresa B
│   ├── Usuários
│   ├── Clientes
│   ├── Obras
│   └── Dados
│
└── Empresa C
    ├── Usuários
    ├── Clientes
    ├── Obras
    └── Dados
```

O isolamento entre empresas deverá ser tratado como requisito fundamental da arquitetura.
