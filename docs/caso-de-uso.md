# Casos de Uso — Plataforma de Gestão de Obras

**Projeto:** Plataforma de Gestão de Obras
**Versão:** 1.0
**Status:** Em desenvolvimento
**Documento:** Casos de Uso

## 1. Objetivo

Este documento descreve as principais interações entre os usuários e a Plataforma de Gestão de Obras, identificando os atores, suas responsabilidades, pré-condições, fluxos principais, exceções e resultados esperados.

Os casos de uso servem como base para a construção dos diagramas UML, desenvolvimento do backend, frontend, permissões e testes do sistema.

## 2. Atores

| Ator                            | Descrição                                                                                                  |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Administrador Geral**         | Responsável pela administração da empresa, usuários, permissões, obras, clientes e informações do sistema. |
| **Usuário Interno**             | Funcionário ou colaborador com permissões definidas pelo Administrador Geral.                              |
| **Cliente**                     | Usuário externo que acessa informações relacionadas às suas obras, pedidos, pagamentos e documentos.       |
| **Sistema**                     | Executa automaticamente processos como cálculos, validações, notificações e registros.                     |
| **Administrador da Plataforma** | Futuro perfil responsável pela administração global do SaaS. Não faz parte do MVP.                         |

## 3. Casos de Uso — Autenticação e Usuários

### UC-001 — Realizar Login

**Atores:** Administrador Geral, Usuário Interno, Cliente
**Pré-condição:** Usuário possuir uma conta ativa.

**Fluxo principal:**

1. Usuário informa suas credenciais.
2. Sistema valida os dados.
3. Sistema identifica o usuário e sua empresa.
4. Sistema verifica suas permissões.
5. Sistema libera o acesso correspondente ao perfil.

**Exceções:**

* Credenciais inválidas → acesso negado.
* Usuário desativado → acesso bloqueado.

**Pós-condição:** Usuário autenticado e direcionado ao ambiente correspondente.

### UC-002 — Gerenciar Usuários

**Ator:** Administrador Geral

**Fluxo principal:**

1. Administrador acessa o gerenciamento de usuários.
2. Cadastra ou edita um usuário.
3. Define seu perfil e permissões.
4. Sistema valida os dados.
5. Sistema salva as alterações.

**Exceção:** Usuário sem dados obrigatórios não pode ser cadastrado.

### UC-003 — Gerenciar Permissões

**Ator:** Administrador Geral

**Fluxo principal:**

1. Administrador seleciona um Usuário Interno.
2. Sistema apresenta as permissões disponíveis.
3. Administrador seleciona as permissões.
4. Sistema salva as alterações.
5. Usuário passa a ter acesso conforme as permissões definidas.

**Regra:** O backend deve validar as permissões independentemente da interface.

## 4. Casos de Uso — Clientes e Obras

### UC-004 — Cadastrar Cliente

**Atores:** Administrador Geral, Usuário Interno autorizado

**Fluxo principal:**

1. Usuário acessa o cadastro de clientes.
2. Informa os dados do cliente.
3. Sistema valida os dados.
4. Sistema registra o cliente.
5. Cliente fica disponível para associação às obras.

### UC-005 — Criar Obra

**Atores:** Administrador Geral, Usuário Interno autorizado

**Fluxo principal:**

1. Usuário acessa o módulo de obras.
2. Seleciona "Nova Obra".
3. Informa os dados da obra.
4. Seleciona o cliente responsável.
5. Define o status inicial.
6. Sistema valida os dados.
7. Sistema cria a obra.

**Pós-condição:** Obra disponível para gerenciamento.

### UC-006 — Visualizar Obra

**Atores:** Administrador Geral, Usuário Interno autorizado, Cliente

**Fluxo principal:**

1. Usuário acessa uma obra.
2. Sistema verifica sua autorização.
3. Sistema apresenta as informações permitidas.
4. Usuário consulta pedidos, financeiro, atividades, materiais e demais informações disponíveis.

**Regra:** Cliente somente pode visualizar obras às quais está vinculado.

## 5. Casos de Uso — Pedidos de Compra

### UC-007 — Criar Pedido de Compra

**Atores:** Administrador Geral, Usuário Interno autorizado

**Fluxo principal:**

1. Usuário seleciona uma obra.
2. Cria um novo pedido.
3. Adiciona os produtos ou serviços.
4. Informa quantidade e preço unitário.
5. Sistema calcula o valor de cada item.
6. Sistema calcula o valor total.
7. Usuário salva o pedido.
8. Pedido recebe o status inicial.

**Regra:** O pedido deve possuir pelo menos um item.

### UC-008 — Gerenciar Status do Pedido

**Atores:** Administrador Geral, Usuário Interno autorizado

**Fluxo principal:**

1. Usuário acessa o pedido.
2. Seleciona uma alteração de status.
3. Sistema verifica se a transição é permitida.
4. Sistema registra a alteração.
5. Sistema atualiza o pedido.

**Exemplos de status:**

* Rascunho
* Disponível
* Aguardando pagamento
* Comprovante enviado
* Pago
* Cancelado

### UC-009 — Anexar Comprovante de Pagamento

**Atores:** Cliente, Administrador Geral, Usuário Interno autorizado

**Fluxo principal:**

1. Usuário acessa um pedido permitido.
2. Seleciona a opção de enviar comprovante.
3. Seleciona o arquivo.
4. Sistema valida o arquivo.
5. Sistema armazena o comprovante.
6. Sistema vincula o arquivo ao pedido.
7. Sistema registra a ação.

**Regra:** O envio do comprovante não significa automaticamente que o pagamento foi confirmado.

## 6. Casos de Uso — Pix e Pagamentos

### UC-010 — Configurar Chave Pix

**Ator:** Administrador Geral

**Fluxo principal:**

1. Administrador acessa as configurações da empresa.
2. Informa ou altera a chave Pix.
3. Sistema valida os dados.
4. Sistema salva a chave.

**Regra:** Somente usuários autorizados podem alterar a chave Pix.

### UC-011 — Realizar Pagamento e Enviar Comprovante

**Ator:** Cliente

**Fluxo principal:**

1. Cliente acessa o pedido.
2. Sistema apresenta o valor devido.
3. Sistema apresenta a chave Pix.
4. Cliente realiza o pagamento externamente.
5. Cliente envia o comprovante.
6. Sistema registra o comprovante.
7. Pedido fica aguardando verificação.

**Pós-condição:** Comprovante disponível para análise da empresa.

### UC-012 — Confirmar Pagamento

**Atores:** Administrador Geral, Usuário Interno autorizado

**Fluxo principal:**

1. Usuário acessa os pagamentos pendentes.
2. Visualiza o pedido e o comprovante.
3. Confere as informações.
4. Confirma ou rejeita o pagamento.
5. Sistema registra a decisão.
6. Sistema atualiza o status do pedido.

## 7. Casos de Uso — Documentos

### UC-013 — Gerar Documento do Pedido

**Atores:** Administrador Geral, Usuário Interno autorizado

**Fluxo principal:**

1. Usuário seleciona um pedido.
2. Solicita a geração do documento.
3. Sistema valida os dados.
4. Sistema gera o documento.
5. Documento fica disponível para download.

**Formatos previstos:**

* PDF
* Word

### UC-014 — Baixar Documento

**Atores:** Administrador Geral, Usuário Interno autorizado, Cliente

**Fluxo principal:**

1. Usuário acessa o pedido.
2. Sistema verifica sua autorização.
3. Usuário seleciona o documento.
4. Sistema disponibiliza o download.

## 8. Casos de Uso — Financeiro

### UC-015 — Registrar Entrada Financeira

**Atores:** Administrador Geral, Usuário Interno autorizado

**Fluxo principal:**

1. Usuário acessa o financeiro da obra.
2. Seleciona "Nova Entrada".
3. Informa valor, data e descrição.
4. Sistema valida os dados.
5. Sistema registra a entrada.
6. Saldo da obra é atualizado.

### UC-016 — Registrar Saída Financeira

**Atores:** Administrador Geral, Usuário Interno autorizado

**Fluxo principal:**

1. Usuário acessa o financeiro.
2. Seleciona "Nova Saída".
3. Informa valor, data, descrição e responsável/pagador quando aplicável.
4. Sistema valida os dados.
5. Sistema registra a saída.
6. Saldo é atualizado.

### UC-017 — Consultar Financeiro

**Atores:** Administrador Geral, Usuário Interno autorizado

**Fluxo principal:**

1. Usuário acessa o financeiro.
2. Seleciona uma obra.
3. Sistema apresenta entradas, saídas e despesas.
4. Usuário aplica filtros.
5. Sistema apresenta os resultados.

**Filtros previstos:**

* Período
* Mês
* Tipo de movimentação
* Pagador
* Obra

## 9. Casos de Uso — Atividades

### UC-018 — Criar Atividade

**Atores:** Administrador Geral, Usuário Interno autorizado

**Fluxo principal:**

1. Usuário acessa uma obra.
2. Cria uma atividade.
3. Informa título e descrição.
4. Define prioridade.
5. Adiciona etiquetas.
6. Define responsável e prazo, quando necessário.
7. Salva a atividade.

### UC-019 — Gerenciar Checklist

**Atores:** Administrador Geral, Usuário Interno autorizado

**Fluxo principal:**

1. Usuário acessa uma atividade.
2. Adiciona itens ao checklist.
3. Marca os itens concluídos.
4. Sistema atualiza o progresso.
5. Atividade pode ser concluída quando suas condições forem atendidas.

## 10. Casos de Uso — Materiais

### UC-020 — Gerenciar Materiais

**Atores:** Administrador Geral, Usuário Interno autorizado

**Fluxo principal:**

1. Usuário acessa o módulo de materiais.
2. Cadastra o material.
3. Registra entrada ou saída.
4. Associa o material à obra.
5. Sistema atualiza a quantidade disponível.

**Regra:** O sistema deve impedir ou controlar movimentações que gerem estoque negativo.

## 11. Casos de Uso — Equipamentos e Aluguéis

### UC-021 — Registrar Equipamento Alugado

**Atores:** Administrador Geral, Usuário Interno autorizado

**Fluxo principal:**

1. Usuário acessa uma obra.
2. Registra o equipamento.
3. Informa data de entrega/início.
4. Informa data prevista de devolução.
5. Sistema registra o aluguel.

### UC-022 — Notificar Devolução de Equipamento

**Ator:** Sistema

**Fluxo principal:**

1. Sistema verifica os equipamentos alugados.
2. Identifica equipamentos próximos da data de devolução.
3. Verifica se a notificação já foi enviada.
4. Envia a notificação 24 horas antes da devolução.
5. Registra o envio.

**Regra:** O sistema não deve enviar notificações duplicadas para o mesmo evento.

## 12. Casos de Uso — Portal do Cliente

### UC-023 — Acessar Portal do Cliente

**Ator:** Cliente

**Fluxo principal:**

1. Cliente realiza login.
2. Sistema identifica o cliente.
3. Sistema apresenta somente suas informações autorizadas.
4. Cliente acessa suas obras e pedidos.

### UC-024 — Consultar Pedido no Portal

**Ator:** Cliente

**Fluxo principal:**

1. Cliente seleciona uma obra.
2. Seleciona um pedido.
3. Sistema apresenta os dados permitidos.
4. Cliente consulta valor, status, Pix e documentos.

### UC-025 — Enviar Comprovante pelo Portal

**Ator:** Cliente

**Fluxo principal:**

1. Cliente acessa um pedido disponível.
2. Seleciona o envio de comprovante.
3. Anexa o arquivo.
4. Sistema valida o arquivo.
5. Sistema registra o comprovante.
6. Empresa poderá realizar a conferência.

## 13. Casos de Uso — Relatórios e Consultas

### UC-026 — Gerar Relatório

**Atores:** Administrador Geral, Usuário Interno autorizado

**Fluxo principal:**

1. Usuário seleciona o tipo de relatório.
2. Define os filtros.
3. Sistema consulta os dados.
4. Sistema gera o relatório.
5. Usuário visualiza ou baixa o resultado.

**Relatórios previstos:**

* Financeiro
* Obras
* Pedidos
* Materiais
* Aluguéis

### UC-027 — Pesquisar Informações

**Atores:** Administrador Geral, Usuário Interno autorizado

**Fluxo principal:**

1. Usuário informa um termo de pesquisa.
2. Sistema consulta os registros permitidos.
3. Sistema apresenta os resultados correspondentes.

## 14. Casos de Uso — Auditoria

### UC-028 — Registrar Ação do Usuário

**Ator:** Sistema

O sistema registra ações relevantes realizadas pelos usuários.

**Informações previstas:**

* Usuário responsável
* Ação realizada
* Data
* Hora
* Registro afetado
* Empresa

**Regra:** Usuários comuns não podem alterar os registros de auditoria.

## 15. Casos de Uso — Configurações

### UC-029 — Gerenciar Configurações da Empresa

**Ator:** Administrador Geral

**Fluxo principal:**

1. Administrador acessa as configurações.
2. Visualiza os dados da empresa.
3. Altera informações permitidas.
4. Configura informações como chave Pix.
5. Sistema valida e salva as alterações.

## 16. Relacionamentos entre Casos de Uso

Alguns casos de uso dependem de outros para funcionar.

### Relações `<<include>>`

* UC-001 Login → é necessário para acessar funcionalidades protegidas.
* UC-007 Criar Pedido → inclui validação da obra.
* UC-007 Criar Pedido → inclui cálculo do total.
* UC-011 Realizar Pagamento → inclui visualização da chave Pix.
* UC-013 Gerar Documento → inclui validação dos dados do pedido.
* UC-026 Gerar Relatório → inclui aplicação das permissões do usuário.

### Relações `<<extend>>`

* UC-009 Anexar Comprovante → pode estender o processo de pagamento.
* UC-022 Notificar Devolução → ocorre como extensão automática do gerenciamento de aluguel quando a data se aproxima.
* UC-025 Enviar Comprovante pelo Portal → estende a consulta de um pedido pelo cliente.

## 17. Resumo por Ator

| Caso de Uso          | Administrador | Usuário Interno | Cliente | Sistema |
| -------------------- | :-----------: | :-------------: | :-----: | :-----: |
| Login                |       ✓       |        ✓        |    ✓    |         |
| Gerenciar usuários   |       ✓       |                 |         |         |
| Gerenciar permissões |       ✓       |                 |         |         |
| Cadastrar cliente    |       ✓       |        ✓*       |         |         |
| Criar obra           |       ✓       |        ✓*       |         |         |
| Visualizar obra      |       ✓       |        ✓*       |    ✓*   |         |
| Criar pedido         |       ✓       |        ✓*       |         |         |
| Gerenciar pedido     |       ✓       |        ✓*       |         |         |
| Enviar comprovante   |       ✓*      |        ✓*       |    ✓    |         |
| Configurar Pix       |       ✓       |                 |         |         |
| Confirmar pagamento  |       ✓       |        ✓*       |         |         |
| Gerar documentos     |       ✓       |        ✓*       |         |         |
| Consultar financeiro |       ✓       |        ✓*       |    ✓*   |         |
| Criar atividade      |       ✓       |        ✓*       |         |         |
| Gerenciar materiais  |       ✓       |        ✓*       |         |         |
| Gerenciar aluguéis   |       ✓       |        ✓*       |         |         |
| Notificar devolução  |               |                 |         |    ✓    |
| Portal do cliente    |               |                 |    ✓    |         |
| Gerar relatórios     |       ✓       |        ✓*       |         |         |
| Auditoria            |       ✓*      |                 |         |    ✓    |
| Configurações        |       ✓       |                 |         |         |

`*` Depende da permissão concedida pelo Administrador Geral.

## 18. Fluxo Geral do Sistema

O fluxo principal relacionado ao processo de compra pode ser representado da seguinte forma:

**Administrador cria cliente → cria obra → cria pedido → disponibiliza pedido → Cliente acessa portal → visualiza pedido → consulta Pix → realiza pagamento → envia comprovante → Empresa confere → pagamento é confirmado → documento/registro é atualizado.**

## 19. Relação com UML

Os casos de uso deste documento poderão ser utilizados posteriormente para criação de:

* Diagrama de Caso de Uso;
* Diagramas de Atividade;
* Diagramas de Sequência;
* Diagramas de Classes;
* Fluxos de processos;
* Casos de teste.

## 20. Evolução Futura

Com a transformação da plataforma em SaaS, novos casos de uso serão adicionados para o **Administrador da Plataforma**, incluindo:

* Gerenciar empresas;
* Gerenciar planos;
* Gerenciar assinaturas;
* Controlar limites dos planos;
* Consultar métricas da plataforma;
* Gerenciar cobrança recorrente;
* Suspender ou reativar empresas;
* Gerenciar configurações globais.

Esses recursos não fazem parte do MVP atual, mas a arquitetura deverá permitir sua inclusão futuramente.
