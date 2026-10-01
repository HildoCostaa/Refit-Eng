# Banco de Dados — Plataforma de Gestão de Obras

**Projeto:** Plataforma de Gestão de Obras
**Versão:** 1.0
**Status:** Em desenvolvimento
**Documento:** Banco de Dados

## 1. Objetivo

Definir a estrutura lógica do banco de dados da Plataforma de Gestão de Obras, identificando as principais entidades, seus atributos, relacionamentos, regras de integridade e preparação para futura transformação da plataforma em um sistema SaaS multiempresa.

O banco deve garantir:

* Integridade dos dados;
* Relacionamentos consistentes;
* Isolamento entre empresas;
* Controle de acesso;
* Histórico das informações;
* Possibilidade de crescimento da plataforma.

## 2. Estratégia de Multiempresa

Desde o início, o sistema será estruturado considerando múltiplas empresas.

A entidade principal será:

**Empresa**

As demais entidades que pertencem a uma empresa deverão possuir uma referência para ela, direta ou indiretamente.

Exemplo:

```text
Empresa
 ├── Usuários
 ├── Clientes
 ├── Obras
 ├── Pedidos
 ├── Financeiro
 ├── Materiais
 └── Aluguéis
```

A empresa funcionará como o principal limite de isolamento dos dados.

Um usuário de uma empresa nunca deverá conseguir consultar, editar ou excluir dados pertencentes a outra empresa.

## 3. Principais Entidades

O banco de dados deverá possuir, inicialmente, as seguintes entidades:

| Entidade                   | Finalidade                                      |
| -------------------------- | ----------------------------------------------- |
| Empresas                   | Armazenar as empresas cadastradas na plataforma |
| Usuários                   | Armazenar usuários e seus acessos               |
| Permissões                 | Controlar permissões dos usuários               |
| Clientes                   | Armazenar clientes                              |
| Obras                      | Armazenar as obras                              |
| Pedidos                    | Armazenar pedidos de compra                     |
| Itens do Pedido            | Armazenar produtos/serviços dos pedidos         |
| Pagamentos                 | Controlar pagamentos e comprovantes             |
| Documentos                 | Armazenar referências aos documentos            |
| Financeiro                 | Registrar entradas e saídas                     |
| Atividades                 | Controlar tarefas da obra                       |
| Checklists                 | Controlar itens das atividades                  |
| Materiais                  | Controlar materiais                             |
| Movimentações de Materiais | Registrar entradas e saídas                     |
| Aluguéis                   | Controlar equipamentos alugados                 |
| Notificações               | Registrar notificações                          |
| Auditoria                  | Registrar ações importantes                     |
| Status/Históricos          | Preservar alterações importantes                |

## 4. Empresa

Representa uma empresa que utiliza a plataforma.

### Principais campos

```text
Empresa
- id
- nome
- nome_fantasia
- documento
- email
- telefone
- endereco
- chave_pix
- status
- created_at
- updated_at
```

### Regras

* Cada empresa possui um identificador único.
* O documento da empresa deve ser validado.
* A chave Pix pertence à empresa.
* Uma empresa pode possuir vários usuários.
* Uma empresa pode possuir vários clientes e obras.
* Empresas diferentes não podem acessar os dados umas das outras.

## 5. Usuário

Representa uma pessoa que possui acesso ao sistema.

```text
Usuario
- id
- empresa_id
- nome
- email
- senha_hash
- perfil
- ativo
- ultimo_login
- created_at
- updated_at
```

### Perfis iniciais

```text
ADMIN_GERAL
USUARIO_INTERNO
CLIENTE
```

O cliente poderá possuir uma estrutura própria de acesso caso seja necessário separar o usuário do cadastro comercial do cliente.

## 6. Permissões

Como os Usuários Internos terão permissões configuráveis, o sistema deverá permitir controle individual.

Uma estrutura possível:

```text
Permissao
- id
- nome
- descricao
```

E uma tabela intermediária:

```text
UsuarioPermissao
- id
- usuario_id
- permissao_id
```

Exemplo:

```text
Usuário João
   ↓
Permissões
   ├── works.view
   ├── works.create
   ├── orders.view
   └── finance.view
```

## 7. Cliente

Representa o cliente da empresa.

```text
Cliente
- id
- empresa_id
- nome
- documento
- email
- telefone
- endereco
- ativo
- created_at
- updated_at
```

Um cliente pode possuir uma ou várias obras.

```text
Cliente 1 ───── N Obras
```

## 8. Obra

Representa uma obra administrada pela empresa.

```text
Obra
- id
- empresa_id
- cliente_id
- nome
- descricao
- endereco
- status
- data_inicio
- data_prevista_fim
- data_fim
- created_at
- updated_at
```

### Status previstos

```text
PLANEJAMENTO
EM_ANDAMENTO
PAUSADA
CONCLUIDA
CANCELADA
```

### Relacionamentos

```text
Empresa 1 ───── N Obras

Cliente 1 ───── N Obras
```

## 9. Pedido de Compra

Representa uma solicitação ou pedido relacionado a uma obra.

```text
Pedido
- id
- empresa_id
- obra_id
- numero
- status
- observacao
- valor_total
- data_criacao
- data_vencimento
- created_at
- updated_at
```

### Relacionamentos

```text
Obra 1 ───── N Pedidos

Pedido 1 ───── N Itens
```

O cliente será identificado a partir da obra associada ao pedido.

## 10. Item do Pedido

Representa cada produto ou serviço dentro de um pedido.

```text
ItemPedido
- id
- pedido_id
- descricao
- quantidade
- valor_unitario
- valor_total
```

O valor total do item deverá ser calculado:

```text
valor_total = quantidade × valor_unitario
```

O valor total do pedido deverá ser calculado a partir dos seus itens.

```text
Pedido
   ↓
Itens
   ├── Item 1
   ├── Item 2
   └── Item N

Total do Pedido = soma dos itens
```

## 11. Pagamento

Representa o controle do pagamento relacionado a um pedido.

```text
Pagamento
- id
- empresa_id
- pedido_id
- valor
- status
- comprovante_id
- data_pagamento
- data_confirmacao
- confirmado_por
- created_at
- updated_at
```

### Status possíveis

```text
PENDENTE
COMPROVANTE_ENVIADO
CONFIRMADO
REJEITADO
CANCELADO
```

O envio de um comprovante não deverá alterar automaticamente o pagamento para confirmado.

## 12. Documentos

Representa documentos gerados ou anexados ao sistema.

```text
Documento
- id
- empresa_id
- pedido_id
- tipo
- nome_original
- caminho_arquivo
- tamanho
- mime_type
- created_at
```

### Tipos previstos

```text
PDF
WORD
COMPROVANTE
OUTRO
```

O banco não deverá armazenar necessariamente o arquivo diretamente.

Uma estratégia inicial será armazenar:

```text
metadados + localização do arquivo
```

O armazenamento físico poderá posteriormente utilizar:

* servidor;
* armazenamento em nuvem;
* objeto storage.

## 13. Financeiro

Representa as movimentações financeiras da empresa ou de uma obra.

```text
MovimentacaoFinanceira
- id
- empresa_id
- obra_id
- tipo
- descricao
- valor
- data
- responsavel_id
- created_at
- updated_at
```

### Tipos

```text
ENTRADA
SAIDA
```

### Regra

```text
Saldo = Total de Entradas - Total de Saídas
```

## 14. Atividade

Representa uma tarefa ou atividade relacionada à obra.

```text
Atividade
- id
- empresa_id
- obra_id
- titulo
- descricao
- prioridade
- status
- responsavel_id
- prazo
- created_at
- updated_at
```

### Prioridades

```text
BAIXA
MEDIA
ALTA
URGENTE
```

### Status

```text
PENDENTE
EM_ANDAMENTO
CONCLUIDA
CANCELADA
```

## 15. Checklist

Representa os itens de uma atividade.

```text
ChecklistItem
- id
- atividade_id
- descricao
- concluido
- ordem
- created_at
- updated_at
```

Relacionamento:

```text
Atividade 1 ───── N ChecklistItems
```

## 16. Material

Representa materiais utilizados nas obras.

```text
Material
- id
- empresa_id
- nome
- descricao
- unidade
- estoque_atual
- estoque_minimo
- ativo
- created_at
- updated_at
```

Exemplos de unidade:

```text
UN
KG
M
M²
M³
L
```

## 17. Movimentação de Material

Registra entradas e saídas de materiais.

```text
MovimentacaoMaterial
- id
- empresa_id
- material_id
- obra_id
- tipo
- quantidade
- observacao
- responsavel_id
- created_at
```

### Tipos

```text
ENTRADA
SAIDA
```

O estoque deverá ser atualizado conforme as movimentações.

## 18. Aluguel de Equipamento

Representa equipamentos alugados para uma obra.

```text
Aluguel
- id
- empresa_id
- obra_id
- equipamento
- fornecedor
- data_inicio
- data_devolucao_prevista
- data_devolucao_real
- valor
- status
- created_at
- updated_at
```

### Status

```text
AGUARDANDO_ENTREGA
EM_USO
DEVOLVIDO
ATRASADO
CANCELADO
```

## 19. Notificações

Registra notificações geradas pelo sistema.

```text
Notificacao
- id
- empresa_id
- usuario_id
- tipo
- titulo
- mensagem
- lida
- data_envio
- created_at
```

Exemplo:

```text
Equipamento "Betoneira"
deve ser devolvido amanhã.
```

O sistema deve evitar notificações duplicadas para o mesmo evento.

## 20. Auditoria

Registra ações importantes realizadas no sistema.

```text
Auditoria
- id
- empresa_id
- usuario_id
- acao
- entidade
- entidade_id
- dados_anteriores
- dados_novos
- ip
- created_at
```

Exemplos:

```text
CRIAR_PEDIDO
ALTERAR_PEDIDO
CONFIRMAR_PAGAMENTO
ALTERAR_PERMISSAO
EXCLUIR_REGISTRO
ALTERAR_CHAVE_PIX
```

## 21. Relacionamentos Principais

Visão simplificada:

```text
Empresa
│
├── Usuários
│   └── Permissões
│
├── Clientes
│   └── Obras
│       ├── Pedidos
│       │   ├── Itens
│       │   ├── Pagamentos
│       │   └── Documentos
│       │
│       ├── Financeiro
│       ├── Atividades
│       │   └── Checklists
│       ├── Materiais
│       │   └── Movimentações
│       └── Aluguéis
│
├── Notificações
│
└── Auditoria
```

## 22. Relacionamentos Cardinalidade

| Relacionamento                   | Cardinalidade |
| -------------------------------- | ------------- |
| Empresa → Usuários               | 1:N           |
| Empresa → Clientes               | 1:N           |
| Empresa → Obras                  | 1:N           |
| Cliente → Obras                  | 1:N           |
| Obra → Pedidos                   | 1:N           |
| Pedido → Itens                   | 1:N           |
| Pedido → Pagamentos              | 1:N           |
| Pedido → Documentos              | 1:N           |
| Obra → Financeiro                | 1:N           |
| Obra → Atividades                | 1:N           |
| Atividade → Checklists           | 1:N           |
| Material → Movimentações         | 1:N           |
| Obra → Movimentações de Material | 1:N           |
| Obra → Aluguéis                  | 1:N           |
| Usuário → Permissões             | N:N           |
| Usuário → Notificações           | 1:N           |
| Usuário → Auditoria              | 1:N           |

## 23. Integridade e Chaves

Cada tabela deverá possuir uma chave primária única:

```text
id
```

Relacionamentos deverão utilizar chaves estrangeiras:

```text
empresa_id
cliente_id
obra_id
pedido_id
usuario_id
```

O banco deverá impedir relacionamentos inválidos.

Exemplo:

Um pedido não poderá apontar para uma obra inexistente.

## 24. Isolamento entre Empresas

Toda consulta administrativa deverá respeitar o contexto da empresa.

Exemplo conceitual:

```text
Usuário → Empresa A

Consulta:
Pedidos da Empresa A

Resultado:
Somente pedidos da Empresa A
```

Nunca:

```text
Pedidos de todas as empresas
```

Essa regra será aplicada também no backend.

## 25. Exclusão de Dados

Registros importantes deverão utilizar preferencialmente exclusão lógica.

Exemplo:

```text
ativo = false
```

ou:

```text
deleted_at = data
```

Isso permite preservar histórico e auditoria.

Registros com dependências importantes não deverão ser excluídos fisicamente sem validação.

## 26. Índices

O banco deverá possuir índices para campos frequentemente utilizados em consultas.

Exemplos:

```text
empresa_id
email
documento
obra_id
cliente_id
pedido_id
status
created_at
```

Os índices deverão ser definidos de acordo com as consultas reais da aplicação.

## 27. Valores Financeiros

Valores monetários não deverão utilizar tipos inadequados para cálculos financeiros.

A implementação deverá utilizar um tipo numérico apropriado para representar valores monetários com precisão.

Exemplo conceitual:

```text
DECIMAL(12,2)
```

A definição final dependerá do banco de dados escolhido.

## 28. Datas e Horários

Registros importantes deverão possuir informações de data e horário.

Campos comuns:

```text
created_at
updated_at
deleted_at
```

A aplicação deverá definir uma estratégia consistente para armazenamento e exibição de fusos horários.

## 29. Preparação para SaaS

A estrutura deverá permitir futuramente:

```text
Empresa
   ↓
Plano
   ↓
Assinatura
   ↓
Limites
```

Exemplos de limites futuros:

* Quantidade de usuários;
* Quantidade de obras;
* Armazenamento;
* Quantidade de clientes;
* Recursos disponíveis.

Essas entidades poderão ser adicionadas posteriormente sem necessidade de reconstruir a estrutura principal.

## 30. Tecnologias do Banco

A tecnologia definitiva do banco será definida durante a etapa de arquitetura.

A escolha deverá considerar:

* Relacionamentos entre entidades;
* Integridade referencial;
* Transações;
* Segurança;
* Escalabilidade;
* Facilidade de desenvolvimento;
* Compatibilidade com o backend;
* Futuro modelo SaaS.

## 31. Próxima Etapa

Antes da implementação do banco, será necessário transformar esta modelagem conceitual em:

1. Modelo Entidade-Relacionamento;
2. Diagrama ER;
3. Modelo lógico;
4. Definição das tabelas;
5. Definição das chaves primárias;
6. Definição das chaves estrangeiras;
7. Índices;
8. Constraints;
9. Migrations;
10. Seed inicial.

A criação do banco físico deverá acontecer somente depois da definição da arquitetura e da tecnologia escolhida.
