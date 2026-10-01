# Ambiente de Desenvolvimento — Plataforma de Gestão de Obras

## 1. Objetivo

Este documento define como preparar o ambiente necessário para desenvolver a Plataforma de Gestão de Obras.

O ambiente inicial utilizará:

* Node.js;
* npm;
* Git;
* GitHub;
* PostgreSQL;
* editor de código.

O objetivo é manter o ambiente simples e reproduzível.

---

# 2. Ferramentas

## 2.1 Node.js

Será utilizado como ambiente de execução do backend.

Responsabilidades:

* executar o JavaScript no servidor;
* executar o Express;
* gerenciar dependências;
* executar scripts do projeto.

Versão recomendada:

```text
Node.js 20+
```

A versão exata poderá ser fixada posteriormente para manter o ambiente consistente.

---

## 2.2 npm

Será utilizado para gerenciamento das dependências do projeto.

Exemplos:

```bash
npm install
npm install express
npm run dev
```

O arquivo `package.json` registrará as dependências e scripts.

---

# 3. Git

O Git será utilizado para controle de versão.

Comandos básicos utilizados durante o projeto:

```bash
git init
git status
git add .
git commit
git branch
git switch
git pull
git push
```

O Git permitirá acompanhar a evolução do projeto e recuperar versões anteriores.

---

# 4. GitHub

O GitHub será utilizado para armazenar o repositório remoto do projeto.

Estrutura:

```text
Computador
    ↓
Git
    ↓
GitHub
```

O GitHub também poderá armazenar:

* documentação;
* código;
* histórico de alterações;
* issues;
* roadmap;
* decisões técnicas.

---

# 5. Editor de código

O desenvolvimento poderá ser realizado utilizando o Visual Studio Code.

Extensões úteis:

* JavaScript;
* ESLint;
* Prettier;
* PostgreSQL;
* GitLens, se necessário.

Não será necessário instalar muitas extensões inicialmente.

---

# 6. PostgreSQL

O PostgreSQL será o banco de dados principal.

Ele será responsável por armazenar:

* empresas;
* usuários;
* permissões;
* clientes;
* obras;
* pedidos;
* itens;
* pagamentos;
* documentos;
* financeiro;
* atividades;
* materiais;
* aluguéis;
* notificações;
* auditoria.

A aplicação deverá acessar o banco através do backend.

```text
Frontend
   ↓
Backend
   ↓
PostgreSQL
```

O frontend não deverá acessar diretamente o PostgreSQL.

---

# 7. Variáveis de ambiente

Informações de configuração não deverão ser colocadas diretamente no código.

Exemplo:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=gestao_obras
DB_USER=postgres
DB_PASSWORD=

JWT_SECRET=
```

O arquivo:

```text
.env
```

não deverá ser enviado para o GitHub.

Será utilizado:

```text
.env.example
```

para documentar quais variáveis são necessárias.

---

# 8. Primeiro projeto Node.js

Dentro da pasta do backend será criado um projeto Node.js.

```bash
cd backend
npm init -y
```

Isso criará:

```text
backend/
└── package.json
```

O `package.json` será responsável por registrar:

* nome do projeto;
* versão;
* dependências;
* scripts;
* configurações do Node.js.

---

# 9. Dependências iniciais

A primeira dependência principal será o Express:

```bash
npm install express
```

Para desenvolvimento, posteriormente poderão ser adicionadas ferramentas como:

```bash
npm install -D nodemon
```

O conjunto definitivo de dependências será definido conforme cada funcionalidade for implementada.

---

# 10. Primeiro servidor

O backend terá inicialmente:

```text
backend/
└── src/
    ├── app.js
    └── server.js
```

Responsabilidades:

### app.js

Configurar o Express.

### server.js

Iniciar o servidor HTTP.

Fluxo:

```text
server.js
    ↓
app.js
    ↓
Express
    ↓
Servidor
```

---

# 11. Primeira rota

Antes de criar funcionalidades complexas, será criada uma rota de teste.

```http
GET /api/v1/health
```

Resposta esperada:

```json
{
  "status": "ok"
}
```

Essa rota servirá para verificar se o backend está funcionando.

---

# 12. Health Check

A rota:

```text
/api/v1/health
```

será utilizada futuramente para verificar se a aplicação está disponível.

Exemplo:

```text
GET /api/v1/health

200 OK
```

Resposta:

```json
{
  "status": "ok"
}
```

Posteriormente o health check poderá verificar também:

* conexão com PostgreSQL;
* serviços essenciais;
* dependências críticas.

---

# 13. Scripts do projeto

O `package.json` deverá possuir scripts para facilitar o desenvolvimento.

Exemplo:

```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  }
}
```

Assim poderemos utilizar:

```bash
npm run dev
```

durante o desenvolvimento.

E:

```bash
npm start
```

para iniciar a aplicação normalmente.

---

# 14. Configuração do PostgreSQL

A conexão com PostgreSQL deverá ser centralizada.

Estrutura:

```text
backend/src/config/
└── database.js
```

O código não deverá espalhar informações de conexão por vários arquivos.

Fluxo:

```text
Service
   ↓
Repository
   ↓
Database connection
   ↓
PostgreSQL
```

---

# 15. Migrations

A estrutura do banco será controlada por migrations.

```text
database/
└── migrations/
```

Exemplo:

```text
001_create_empresas.sql
002_create_usuarios.sql
003_create_permissoes.sql
004_create_clientes.sql
005_create_obras.sql
```

Cada migration representará uma alteração controlada no banco.

---

# 16. Banco de desenvolvimento

O banco utilizado durante o desenvolvimento será separado do banco de produção.

Exemplo:

```text
Desenvolvimento
    ↓
PostgreSQL local

Produção
    ↓
PostgreSQL hospedado
```

Nunca deverão ser utilizados dados reais de produção para testes sem autorização e cuidados adequados.

---

# 17. Portas

Durante o desenvolvimento, poderemos utilizar:

```text
Frontend: 8080
Backend: 3000
PostgreSQL: 5432
```

As portas poderão ser alteradas conforme a configuração do ambiente.

---

# 18. Comunicação local

Durante o desenvolvimento:

```text
Frontend
http://localhost:8080
       ↓
Backend
http://localhost:3000
       ↓
PostgreSQL
localhost:5432
```

---

# 19. CORS

Como frontend e backend poderão utilizar origens diferentes durante o desenvolvimento, o backend deverá possuir uma configuração adequada de CORS.

Exemplo:

```text
Frontend
localhost:8080

Backend
localhost:3000
```

O backend deverá permitir somente as origens necessárias.

Não deverá ser utilizado:

```text
Access-Control-Allow-Origin: *
```

sem uma justificativa adequada em ambientes protegidos.

---

# 20. Ambiente de desenvolvimento

O desenvolvimento deverá utilizar:

```text
Node.js
Express
PostgreSQL
Git
GitHub
VS Code
```

Fluxo:

```text
Escrever código
      ↓
Executar backend
      ↓
Conectar ao PostgreSQL
      ↓
Testar API
      ↓
Commit
      ↓
GitHub
```

---

# 21. Ambiente de produção

O ambiente de produção será definido posteriormente.

A arquitetura deverá permitir utilizar:

```text
Frontend
Backend
PostgreSQL
Storage
```

O deploy inicial poderá utilizar Vercel para a aplicação, enquanto o PostgreSQL será hospedado em um serviço compatível.

A escolha definitiva do provedor de banco e dos custos será feita antes do primeiro deploy de produção.

---

# 22. Segurança

Desde o início deverão ser consideradas:

* `.env` fora do Git;
* senhas armazenadas com hash;
* queries parametrizadas;
* validação de entrada;
* autenticação;
* autorização;
* controle de acesso por empresa;
* proteção de arquivos;
* CORS;
* rate limiting;
* logs;
* auditoria.

A segurança não será adicionada somente depois que o sistema estiver pronto.

---

# 23. Ordem prática de configuração

A implementação do ambiente seguirá esta ordem:

```text
1. Criar repositório GitHub
        ↓
2. Clonar o projeto
        ↓
3. Criar estrutura de pastas
        ↓
4. Inicializar Node.js
        ↓
5. Instalar Express
        ↓
6. Criar app.js
        ↓
7. Criar server.js
        ↓
8. Criar rota /health
        ↓
9. Testar servidor
        ↓
10. Configurar PostgreSQL
        ↓
11. Conectar backend ao PostgreSQL
        ↓
12. Criar primeira migration
        ↓
13. Testar ambiente completo
```

---

# 24. Critério para considerar o ambiente pronto

O ambiente inicial será considerado funcional quando conseguirmos:

```text
✓ Git funcionando
✓ Projeto no GitHub
✓ Node.js funcionando
✓ Express funcionando
✓ Backend iniciando
✓ /api/v1/health respondendo
✓ PostgreSQL funcionando
✓ Backend conectado ao PostgreSQL
✓ Variáveis de ambiente funcionando
```

Somente depois disso começaremos a implementar as funcionalidades reais da plataforma.

---

# 25. Princípio de desenvolvimento

O projeto será desenvolvido em pequenos incrementos.

Exemplo:

```text
Configurar
   ↓
Testar
   ↓
Entender
   ↓
Documentar
   ↓
Avançar
```

O objetivo não é apenas fazer o sistema funcionar.

O objetivo também é compreender **por que cada parte existe e como elas se comunicam**.

> **Aprender construindo: cada etapa deve produzir um resultado funcional e compreensível.**
