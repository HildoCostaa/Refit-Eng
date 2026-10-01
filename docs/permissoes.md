# Matriz de Permissões — Plataforma de Gestão de Obras

**Projeto:** Plataforma de Gestão de Obras
**Versão:** 1.0
**Status:** Em desenvolvimento / Definição de requisitos

## 1. Objetivo

Este documento define os níveis de acesso e permissões dos usuários da Plataforma de Gestão de Obras.

O sistema deverá utilizar controle de acesso baseado em permissões, garantindo que cada usuário consiga executar somente as ações autorizadas.

---

# 2. Perfis do sistema

A primeira versão possuirá três perfis principais:

```text
Administrador Geral
Usuário Interno
Cliente
```

### 2.1 Administrador Geral

Possui acesso administrativo completo dentro da própria empresa.

Pode gerenciar usuários, permissões, clientes, obras, ordens, financeiro, materiais, locações, atividades, documentos e configurações.

### 2.2 Usuário Interno

Representa funcionários ou colaboradores da empresa.

Seu acesso deverá ser configurável pelo Administrador Geral.

Um usuário interno poderá possuir permissões diferentes de outro usuário interno.

### 2.3 Cliente

Possui acesso exclusivamente ao portal do cliente e aos dados disponibilizados relacionados às suas próprias obras.

Não possui acesso ao painel administrativo da empresa.

---

# 3. Tipos de permissão

As permissões serão divididas em ações.

```text
Visualizar
Criar
Editar
Excluir
Gerenciar
```

### Visualizar

Permite consultar informações.

### Criar

Permite cadastrar novos registros.

### Editar

Permite alterar registros existentes.

### Excluir

Permite excluir ou desativar registros, respeitando as regras de negócio.

### Gerenciar

Permite executar ações administrativas relacionadas ao módulo.

Exemplo:

```text
Usuários
├── Visualizar
├── Criar
├── Editar
├── Excluir
└── Gerenciar permissões
```

---

# 4. Administrador Geral

O Administrador Geral terá acesso completo aos recursos da própria empresa.

| Módulo           | Visualizar | Criar | Editar | Excluir | Gerenciar |
| ---------------- | ---------- | ----- | ------ | ------- | --------- |
| Usuários         | ✓          | ✓     | ✓      | ✓       | ✓         |
| Permissões       | ✓          | ✓     | ✓      | —       | ✓         |
| Clientes         | ✓          | ✓     | ✓      | ✓       | ✓         |
| Obras            | ✓          | ✓     | ✓      | ✓       | ✓         |
| Ordens de compra | ✓          | ✓     | ✓      | ✓       | ✓         |
| Financeiro       | ✓          | ✓     | ✓      | —       | ✓         |
| Atividades       | ✓          | ✓     | ✓      | ✓       | ✓         |
| Materiais        | ✓          | ✓     | ✓      | ✓       | ✓         |
| Locações         | ✓          | ✓     | ✓      | ✓       | ✓         |
| Documentos       | ✓          | ✓     | ✓      | ✓       | ✓         |
| Relatórios       | ✓          | —     | —      | —       | ✓         |
| Configurações    | ✓          | ✓     | ✓      | —       | ✓         |
| Auditoria        | ✓          | —     | —      | —       | ✓         |

> A exclusão física de dados poderá ser substituída por exclusão lógica conforme as regras de negócio.

---

# 5. Usuário Interno

O usuário interno terá permissões configuráveis.

O Administrador Geral poderá definir individualmente quais ações cada usuário poderá executar.

Exemplo:

```text
Usuário: João

Obras
✓ Visualizar
✓ Criar
✓ Editar
✗ Excluir

Ordens de compra
✓ Visualizar
✓ Criar
✓ Editar
✗ Excluir

Financeiro
✓ Visualizar
✗ Criar
✗ Editar
✗ Excluir

Usuários
✗ Visualizar
✗ Criar
✗ Editar
✗ Excluir
```

---

# 6. Cliente

O cliente terá acesso limitado ao portal.

| Recurso                            | Acesso |
| ---------------------------------- | ------ |
| Próprias obras                     | ✓      |
| Ordens de compra disponíveis       | ✓      |
| Dados de pagamento                 | ✓      |
| Chave Pix                          | ✓      |
| Enviar comprovante                 | ✓      |
| Visualizar comprovante             | ✓      |
| Baixar documentos disponibilizados | ✓      |
| Financeiro interno completo        | ✗      |
| Outros clientes                    | ✗      |
| Outros usuários                    | ✗      |
| Configurações                      | ✗      |
| Gerenciamento de obras             | ✗      |
| Gerenciamento de usuários          | ✗      |

O cliente não deverá conseguir criar, editar ou excluir informações administrativas da empresa.

---

# 7. Permissões por módulo

## 7.1 Usuários

Permissões:

```text
usuarios.visualizar
usuarios.criar
usuarios.editar
usuarios.desativar
usuarios.gerenciar_permissoes
```

Somente o Administrador Geral deverá possuir acesso completo.

---

## 7.2 Clientes

Permissões:

```text
clientes.visualizar
clientes.criar
clientes.editar
clientes.excluir
```

O Cliente não possui acesso ao gerenciamento de clientes.

---

## 7.3 Obras

Permissões:

```text
obras.visualizar
obras.criar
obras.editar
obras.excluir
obras.gerenciar
```

O cliente possui apenas:

```text
obras.cliente.visualizar
```

Essa permissão deverá retornar somente obras pertencentes ao próprio cliente.

---

## 7.4 Ordens de compra

Permissões administrativas:

```text
ordens.visualizar
ordens.criar
ordens.editar
ordens.excluir
ordens.gerenciar
```

Permissões do cliente:

```text
ordens.cliente.visualizar
ordens.cliente.comprovante.enviar
ordens.cliente.documento.baixar
```

---

## 7.5 Financeiro

Permissões:

```text
financeiro.visualizar
financeiro.criar
financeiro.editar
financeiro.gerenciar
financeiro.relatorios
```

O acesso ao financeiro deverá ser especialmente controlado.

Um usuário poderá, por exemplo, possuir:

```text
financeiro.visualizar = true
financeiro.criar = false
financeiro.editar = false
```

Nesse caso, poderá consultar os dados, mas não poderá cadastrar ou alterar movimentações.

---

## 7.6 Atividades

Permissões:

```text
atividades.visualizar
atividades.criar
atividades.editar
atividades.excluir
atividades.gerenciar
```

---

## 7.7 Materiais

Permissões:

```text
materiais.visualizar
materiais.criar
materiais.editar
materiais.excluir
materiais.movimentar
```

---

## 7.8 Locações

Permissões:

```text
locacoes.visualizar
locacoes.criar
locacoes.editar
locacoes.excluir
locacoes.gerenciar
```

---

## 7.9 Documentos

Permissões:

```text
documentos.visualizar
documentos.criar
documentos.baixar
documentos.excluir
documentos.gerenciar
```

---

## 7.10 Relatórios

Permissões:

```text
relatorios.visualizar
relatorios.financeiro
relatorios.obras
relatorios.ordens
relatorios.materiais
relatorios.locacoes
```

O sistema deverá verificar as permissões do usuário antes de disponibilizar cada relatório.

---

## 7.11 Configurações

Permissões:

```text
configuracoes.visualizar
configuracoes.editar
configuracoes.pix
configuracoes.empresa
```

O acesso deverá ser restrito ao Administrador Geral ou usuários explicitamente autorizados.

---

# 8. Matriz resumida

| Funcionalidade        | Admin | Usuário Interno |  Cliente |
| --------------------- | ----: | --------------: | -------: |
| Gerenciar usuários    |     ✓ |    Configurável |        ✗ |
| Gerenciar permissões  |     ✓ |    Configurável |        ✗ |
| Gerenciar clientes    |     ✓ |    Configurável |        ✗ |
| Criar obras           |     ✓ |    Configurável |        ✗ |
| Visualizar obras      |     ✓ |    Configurável | Próprias |
| Gerenciar ordens      |     ✓ |    Configurável |        ✗ |
| Visualizar ordens     |     ✓ |    Configurável | Próprias |
| Gerenciar financeiro  |     ✓ |    Configurável |        ✗ |
| Visualizar financeiro |     ✓ |    Configurável | Limitado |
| Gerenciar atividades  |     ✓ |    Configurável |        ✗ |
| Gerenciar materiais   |     ✓ |    Configurável |        ✗ |
| Gerenciar locações    |     ✓ |    Configurável |        ✗ |
| Gerenciar documentos  |     ✓ |    Configurável | Limitado |
| Enviar comprovante    |     ✓ |    Configurável |        ✓ |
| Gerar relatórios      |     ✓ |    Configurável |        ✗ |
| Configurar Pix        |     ✓ |    Configurável |        ✗ |
| Configurar empresa    |     ✓ |  ✗/Configurável |        ✗ |
| Visualizar auditoria  |     ✓ |    Configurável |        ✗ |

---

# 9. Princípio do menor privilégio

O sistema deverá seguir o princípio do menor privilégio.

Cada usuário deverá receber somente as permissões necessárias para executar suas atividades.

Exemplo:

Um funcionário responsável por atividades não precisa necessariamente possuir acesso ao financeiro.

```text
João
├── Obras → ✓
├── Atividades → ✓
├── Materiais → ✓
├── Financeiro → ✗
├── Usuários → ✗
└── Configurações → ✗
```

---

# 10. Permissões no frontend e backend

As permissões deverão ser verificadas em duas camadas.

### Frontend

A interface poderá ocultar funcionalidades que o usuário não possui permissão para utilizar.

Exemplo:

```text
Usuário sem permissão:

[Visualizar ordem]

Usuário com permissão:

[Visualizar] [Editar] [Excluir]
```

### Backend

O backend deverá realizar a validação definitiva.

Mesmo que um usuário tente acessar diretamente uma rota ou endpoint, a API deverá verificar sua autorização.

```text
Frontend
   ↓
Solicitação
   ↓
Backend
   ↓
Autenticação
   ↓
Permissão
   ↓
Regra de negócio
   ↓
Banco de dados
```

O frontend nunca deverá ser considerado responsável pela segurança sozinho.

---

# 11. Escopo da empresa

Toda permissão administrativa deverá respeitar o contexto da empresa.

Exemplo:

```text
Usuário
Empresa A
   ↓
Pode acessar
   ↓
Dados da Empresa A
```

Mesmo que o usuário conheça o identificador de um registro pertencente à Empresa B, o backend deverá impedir o acesso.

---

# 12. Permissões futuras

A estrutura deverá permitir a criação de novas permissões sem necessidade de alterar toda a arquitetura.

Possíveis futuras permissões:

```text
notificacoes.visualizar
notificacoes.gerenciar

auditoria.visualizar

dashboard.visualizar

integracoes.visualizar
integracoes.gerenciar

assinatura.visualizar
assinatura.gerenciar

empresa.gerenciar
```

---

# 13. Regra para Administrador Geral

O Administrador Geral deverá possuir acesso administrativo completo dentro da própria empresa.

Entretanto, ele não deverá possuir acesso aos dados internos de outras empresas da plataforma.

A administração global da plataforma SaaS deverá ser tratada posteriormente por um perfil separado.

---

# 14. Futuro perfil — Administrador da Plataforma

Quando o sistema evoluir para SaaS, poderá existir um perfil superior responsável pela própria plataforma.

Exemplo:

```text
Administrador da Plataforma
        │
        ├── Empresas
        ├── Planos
        ├── Assinaturas
        ├── Usuários
        ├── Configurações globais
        └── Monitoramento
```

Esse perfil não deverá ser confundido com o Administrador Geral de uma empresa.

```text
PLATAFORMA
│
├── Administrador da Plataforma
│
├── Empresa A
│   └── Administrador Geral
│
├── Empresa B
│   └── Administrador Geral
│
└── Empresa C
    └── Administrador Geral
```

---

# 15. Resumo da estrutura de acesso

```text
Administrador da Plataforma
        │
        └── Gerencia a plataforma SaaS
                │
                ├── Empresa A
                │     ├── Administrador Geral
                │     ├── Usuários Internos
                │     └── Clientes
                │
                ├── Empresa B
                │     ├── Administrador Geral
                │     ├── Usuários Internos
                │     └── Clientes
                │
                └── Empresa C
                      ├── Administrador Geral
                      ├── Usuários Internos
                      └── Clientes
```

Essa estrutura deverá garantir separação entre a administração da plataforma e a administração de cada empresa.
