# Regras de Negócio — Plataforma de Gestão de Obras

**Projeto:** Plataforma de Gestão de Obras
**Versão:** 1.0
**Status:** Em desenvolvimento / Definição de requisitos

## 1. Objetivo

As regras de negócio definem as condições, restrições e comportamentos que a Plataforma de Gestão de Obras deverá seguir para garantir que as operações sejam realizadas de forma consistente e segura.

---

# 2. Empresas

### RN-001 — Identificação da empresa

Cada empresa cadastrada na plataforma deverá possuir um identificador único.

### RN-002 — Isolamento entre empresas

Os dados de uma empresa não poderão ser acessados por usuários pertencentes a outra empresa.

### RN-003 — Vinculação de registros

Usuários, clientes, obras, ordens, movimentações financeiras, materiais, locações e demais registros deverão estar vinculados à empresa correspondente.

### RN-004 — Usuário pertence a uma empresa

Um usuário interno deverá estar vinculado a uma empresa para acessar os dados administrativos.

---

# 3. Usuários e permissões

### RN-005 — Administrador Geral

Cada empresa deverá possuir pelo menos um usuário com perfil de Administrador Geral.

### RN-006 — Criação de usuários

Somente usuários com permissão adequada poderão criar novos usuários.

### RN-007 — Permissões

Um usuário somente poderá executar ações para as quais possua permissão.

### RN-008 — Restrição de acesso

A ausência de um botão na interface não será considerada suficiente para impedir uma ação. A permissão deverá ser validada também no backend.

### RN-009 — Usuário desativado

Usuários desativados não poderão realizar login ou executar novas ações no sistema.

### RN-010 — Histórico de usuário

A desativação de um usuário não deverá apagar automaticamente os registros históricos relacionados a ele.

---

# 4. Clientes

### RN-011 — Identificação do cliente

Cada cliente deverá possuir um identificador único dentro da empresa.

### RN-012 — Cliente e empresa

Um cliente deverá estar vinculado a uma empresa.

### RN-013 — Cliente e obras

Um cliente poderá possuir uma ou mais obras.

### RN-014 — Exclusão de cliente

Um cliente que possua obras ou registros relacionados não deverá ser excluído diretamente sem que o sistema trate suas dependências.

### RN-015 — Acesso do cliente

O cliente deverá visualizar somente informações vinculadas às suas próprias obras.

---

# 5. Obras

### RN-016 — Cliente obrigatório

Toda obra deverá possuir um cliente vinculado.

### RN-017 — Empresa obrigatória

Toda obra deverá estar vinculada a uma empresa.

### RN-018 — Identificação da obra

Cada obra deverá possuir um identificador único.

### RN-019 — Status da obra

Uma obra deverá possuir um status válido definido pelo sistema.

### RN-020 — Obras encerradas

Uma obra marcada como concluída ou cancelada não deverá receber novas operações incompatíveis com seu estado.

### RN-021 — Histórico da obra

O encerramento de uma obra não deverá apagar seus registros financeiros, documentos, ordens ou histórico.

### RN-022 — Acesso à obra

Usuários internos somente poderão acessar obras pertencentes à sua empresa e conforme suas permissões.

---

# 6. Ordens de compra

### RN-023 — Obra obrigatória

Toda ordem de compra deverá estar vinculada a uma obra.

### RN-024 — Cliente da ordem

O cliente da ordem deverá ser obtido a partir da obra vinculada, evitando inconsistência entre cliente e obra.

### RN-025 — Identificação da ordem

Cada ordem de compra deverá possuir um identificador único.

### RN-026 — Itens obrigatórios

Uma ordem de compra não poderá ser finalizada sem possuir pelo menos um item.

### RN-027 — Valores

O valor total da ordem deverá ser calculado pelo sistema com base nos itens cadastrados.

### RN-028 — Quantidade

Itens da ordem deverão possuir quantidade válida maior que zero.

### RN-029 — Valor unitário

Itens da ordem deverão possuir valor unitário válido.

### RN-030 — Valor total do item

O valor total de cada item deverá ser calculado pela multiplicação da quantidade pelo valor unitário.

### RN-031 — Total da ordem

O total da ordem deverá corresponder à soma dos valores totais de seus itens, considerando eventuais descontos ou acréscimos definidos futuramente.

### RN-032 — Status inicial

Uma nova ordem deverá iniciar no status definido como padrão, inicialmente "Rascunho".

### RN-033 — Ordem em rascunho

Ordens em rascunho poderão ser alteradas por usuários autorizados.

### RN-034 — Ordem disponibilizada

Uma ordem somente deverá aparecer no portal do cliente quando estiver marcada como disponível para visualização.

### RN-035 — Ordem cancelada

Uma ordem cancelada não deverá ser considerada pendente de pagamento.

### RN-036 — Alteração de ordem

Alterações relevantes realizadas após a disponibilização da ordem deverão ser registradas no histórico.

---

# 7. Pagamentos

### RN-037 — Pagamento relacionado

Um pagamento deverá estar relacionado a uma ordem de compra ou a outro registro financeiro válido.

### RN-038 — Status de pagamento

Uma ordem não deverá ser considerada paga apenas porque o cliente enviou um comprovante.

### RN-039 — Comprovante enviado

O envio de um comprovante deverá indicar que o pagamento está aguardando verificação, quando houver validação manual.

### RN-040 — Confirmação de pagamento

Somente usuário autorizado poderá confirmar o pagamento de uma ordem quando o processo exigir validação manual.

### RN-041 — Comprovante

O comprovante deverá permanecer relacionado à ordem correspondente.

### RN-042 — Histórico de pagamento

Alterações no status de pagamento deverão ser registradas para permitir rastreabilidade.

---

# 8. Pix

### RN-043 — Chave Pix da empresa

A chave Pix utilizada no sistema deverá pertencer à empresa responsável pela obra.

### RN-044 — Exibição do Pix

O cliente somente deverá visualizar a chave Pix disponibilizada pela empresa para pagamento.

### RN-045 — Alteração da chave Pix

Somente usuários autorizados poderão alterar a chave Pix cadastrada.

### RN-046 — Comprovante via Pix

O envio de comprovante não deverá alterar automaticamente a ordem para "Pago", salvo se futuramente existir integração automatizada que valide o pagamento.

---

# 9. Documentos

### RN-047 — Documento relacionado

Documentos de uma ordem deverão estar relacionados à ordem correspondente.

### RN-048 — Acesso a documentos

Somente usuários autorizados poderão acessar documentos privados.

### RN-049 — Documento do cliente

O cliente somente poderá baixar documentos disponibilizados para ele.

### RN-050 — Integridade do documento

A exclusão ou substituição de um documento importante deverá respeitar as regras de histórico e auditoria.

---

# 10. Financeiro

### RN-051 — Empresa da movimentação

Toda movimentação financeira deverá estar vinculada a uma empresa.

### RN-052 — Obra da movimentação

Movimentações financeiras relacionadas a uma obra deverão estar vinculadas à obra correspondente.

### RN-053 — Tipo de movimentação

Cada movimentação deverá possuir um tipo definido, como entrada ou saída.

### RN-054 — Valor positivo

O valor da movimentação deverá ser maior que zero.

### RN-055 — Data

Toda movimentação financeira deverá possuir uma data.

### RN-056 — Responsável

Quando aplicável, o sistema deverá registrar o usuário responsável pelo lançamento ou pagamento.

### RN-057 — Saldo

O saldo da obra deverá ser calculado considerando as entradas e saídas registradas.

### RN-058 — Exclusão financeira

Movimentações financeiras não deverão ser excluídas sem controle adequado, especialmente quando já fizerem parte de relatórios ou históricos.

### RN-059 — Alterações financeiras

Alterações relevantes em movimentações deverão ser registradas no histórico.

---

# 11. Atividades

### RN-060 — Atividade vinculada

Toda atividade deverá estar vinculada a uma obra.

### RN-061 — Prioridade

Toda atividade deverá possuir uma prioridade válida.

### RN-062 — Checklist

Itens de checklist deverão pertencer à atividade correspondente.

### RN-063 — Conclusão

Uma atividade somente deverá ser considerada concluída quando seu status for alterado para concluído.

### RN-064 — Responsável

Quando definido, o responsável pela atividade deverá ser um usuário autorizado da empresa.

### RN-065 — Prazo

A atividade poderá possuir uma data limite.

### RN-066 — Atividade atrasada

Uma atividade não concluída após sua data limite deverá poder ser identificada como atrasada.

---

# 12. Materiais

### RN-067 — Material da empresa

Todo material cadastrado deverá pertencer à empresa correspondente.

### RN-068 — Material na obra

Um material alocado deverá estar relacionado a uma obra.

### RN-069 — Quantidade

Movimentações de entrada e saída deverão possuir quantidades válidas.

### RN-070 — Saldo de material

A quantidade disponível deverá ser calculada considerando entradas e saídas registradas.

### RN-071 — Saída superior ao disponível

O sistema deverá impedir ou solicitar tratamento específico quando uma saída resultar em quantidade negativa.

---

# 13. Locações

### RN-072 — Locação vinculada

Toda locação deverá estar vinculada a uma obra.

### RN-073 — Período da locação

A locação deverá possuir data de início e data prevista de entrega/devolução.

### RN-074 — Datas válidas

A data de entrega/devolução não deverá ser anterior à data de início.

### RN-075 — Notificação de 24 horas

O sistema deverá gerar uma notificação 24 horas antes da data configurada para entrega/devolução.

### RN-076 — Notificação única

O sistema deverá evitar o envio duplicado da mesma notificação para o mesmo evento.

### RN-077 — Locação encerrada

Uma locação encerrada deverá permanecer no histórico da obra.

---

# 14. Portal do cliente

### RN-078 — Acesso individual

Cada cliente deverá possuir acesso individual e seguro.

### RN-079 — Isolamento do cliente

Um cliente não poderá visualizar informações pertencentes a outro cliente.

### RN-080 — Obras do cliente

O cliente somente poderá visualizar obras vinculadas ao seu cadastro.

### RN-081 — Ordens do cliente

O cliente somente poderá visualizar ordens pertencentes às suas obras.

### RN-082 — Dados financeiros

O cliente somente poderá visualizar informações financeiras que tenham sido definidas como disponíveis para ele.

### RN-083 — Upload de comprovante

O cliente poderá enviar comprovantes somente para ordens às quais possua acesso.

---

# 15. Dashboard

### RN-084 — Dados do dashboard

As informações apresentadas no dashboard deverão ser baseadas nos dados existentes no sistema.

### RN-085 — Permissões do dashboard

O dashboard deverá apresentar somente informações que o usuário tenha permissão para visualizar.

### RN-086 — Dashboard da obra

O resumo da obra deverá considerar somente dados pertencentes àquela obra.

---

# 16. Notificações

### RN-087 — Destinatário

Toda notificação deverá possuir um destinatário definido.

### RN-088 — Evento

Uma notificação deverá estar relacionada a um evento ou condição específica.

### RN-089 — Histórico

Quando necessário, o sistema deverá registrar o envio ou processamento da notificação.

---

# 17. Auditoria

### RN-090 — Registro de ações

Ações relevantes deverão registrar usuário, ação, data e horário.

### RN-091 — Identificação

O histórico deverá permitir identificar quem realizou determinada ação.

### RN-092 — Integridade do histórico

Usuários comuns não deverão conseguir alterar registros de auditoria.

---

# 18. Arquivos

### RN-093 — Tipos permitidos

O sistema deverá aceitar somente formatos de arquivo previamente definidos.

### RN-094 — Tamanho máximo

Uploads deverão respeitar o limite de tamanho configurado.

### RN-095 — Arquivos maliciosos

O sistema deverá adotar medidas para reduzir o risco de armazenamento de arquivos maliciosos.

### RN-096 — Acesso protegido

Arquivos privados não deverão ser disponibilizados por URLs públicas sem autorização.

---

# 19. Exclusão de dados

### RN-097 — Exclusão lógica

Registros importantes poderão utilizar exclusão lógica em vez de exclusão física.

### RN-098 — Histórico

A exclusão de registros não deverá apagar informações necessárias para auditoria ou integridade histórica.

### RN-099 — Dependências

O sistema deverá verificar relacionamentos antes de permitir exclusões que possam causar inconsistência.

---

# 20. Status e transições

### RN-100 — Status válidos

Cada entidade que possuir status deverá utilizar somente estados previamente definidos.

### RN-101 — Transições

O sistema deverá impedir mudanças de status que não sejam permitidas pela regra da entidade.

### RN-102 — Histórico de status

Alterações importantes de status deverão poder ser rastreadas.

---

# 21. Relatórios

### RN-103 — Dados dos relatórios

Relatórios deverão utilizar dados registrados no sistema.

### RN-104 — Permissões

Usuários somente poderão gerar relatórios contendo informações às quais tenham acesso.

### RN-105 — Filtros

Relatórios deverão respeitar os filtros selecionados pelo usuário.

---

# 22. Multiempresa

### RN-106 — Contexto da empresa

Toda operação administrativa deverá ocorrer dentro do contexto da empresa do usuário autenticado.

### RN-107 — Consulta de dados

Consultas deverão considerar obrigatoriamente a empresa do usuário.

### RN-108 — Criação de dados

Novos registros deverão ser associados automaticamente à empresa correspondente.

### RN-109 — Alteração de dados

Usuários não poderão alterar registros pertencentes a outra empresa.

### RN-110 — Exclusão de dados

Usuários não poderão excluir registros pertencentes a outra empresa.

---

# 23. Integridade geral

### RN-111 — Identificadores únicos

Entidades que necessitem identificação individual deverão possuir identificadores únicos.

### RN-112 — Campos obrigatórios

O sistema deverá impedir o cadastro de registros sem informações obrigatórias.

### RN-113 — Validação

Dados deverão ser validados antes de serem persistidos.

### RN-114 — Consistência

Relacionamentos entre entidades deverão permanecer consistentes.

### RN-115 — Operações relacionadas

Operações que alterem múltiplos registros relacionados deverão preservar a consistência dos dados.

---

# 24. Regras futuras

As regras abaixo poderão ser detalhadas conforme o sistema evoluir:

* Integração automática com bancos;
* Confirmação automática de pagamentos via Pix;
* Cobrança recorrente;
* Planos SaaS;
* Limites por plano;
* Controle de armazenamento por empresa;
* Integrações externas;
* Notificações por e-mail;
* Notificações por WhatsApp;
* Aplicativo mobile;
* Relatórios financeiros avançados.

Essas funcionalidades não fazem parte obrigatoriamente do primeiro MVP.

---

# 25. Relação entre requisitos e regras

As regras de negócio deverão complementar os requisitos funcionais.

Exemplo:

```text
RF-013 — Criar ordem de compra
        ↓
RN-023 — Toda ordem deve possuir uma obra
RN-026 — Ordem deve possuir pelo menos um item
RN-027 — Total deve ser calculado pelo sistema
RN-032 — Nova ordem inicia como rascunho
```

Outro exemplo:

```text
RF-047 — Cliente visualiza suas obras
        ↓
RN-078 — Cliente possui acesso individual
RN-079 — Cliente não acessa outro cliente
RN-080 — Cliente visualiza somente suas obras
```

Dessa forma, os requisitos funcionais definem **o que o sistema oferece**, enquanto as regras de negócio definem **as condições que devem ser respeitadas durante sua utilização**.
