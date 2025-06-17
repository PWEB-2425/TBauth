# TBauth - Autenticação e Pesquisa de Países

Projeto desenvolvido nas aulas de Programação Web ERSC TB (2025.06.17).

## Descrição

Esta aplicação Node.js permite:

- Autenticação de utilizadores com sessão (usando MongoDB)
- Proteção de páginas e rotas apenas para utilizadores autenticados
- Pesquisa de informações de países via API externa [restcountries.com](https://restcountries.com)
- Página de pesquisa acessível apenas após login

## Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior recomendado)
- [MongoDB](https://www.mongodb.com/) (local ou Atlas)
- npm (geralmente já vem com o Node.js)

## Instalação

1. **Clone o repositório:**

   ```sh
   git clone <url-do-repo>
   cd TBauth
   ```

2. **Instale as dependências:**

   ```sh
   npm install
   ```

3. **Configure as variáveis de ambiente:**

   - Crie um ficheiro `.env` na raiz do projeto com o seguinte conteúdo:
     ```
     SECRET=sua_chave_secreta
     DB=connection_string_para_mongodb
     PORT=3001
     ```
   - Ajuste os valores conforme necessário.

4. **Certifique-se que o MongoDB está a correr.**

   - Configure a string de conexão para Atlas no `.env`
   - ou se estiver a correr localmente `mongod`

5. **Crie a coleção de utilizadores:**
   - No MongoDB, crie a base de dados `usersdb` e a coleção `users`.
   - Adicione pelo menos um utilizador para testes, por exemplo:
     ```json
     { "username": "admin", "password": "1234" }
     ```

## Como correr o projeto

diretamente invocando o node.js

```sh
node server.js
```

Ou via npm

```sh
npm start
```

Ou, para desenvolvimento com recarregamento automático:

```sh
npx nodemon server.js
```

A aplicação ficará disponível em [http://localhost:3001](http://localhost:3001) (ou na porta definida no `.env`).

## Estrutura de pastas

```
TBauth/
├── public/
│   ├── pesquisa.html
│   ├── pesquisa.js
│   └── ... (outros ficheiros estáticos)
├── server.js
├── package.json
├── .env
└── README.md
```

## Fluxo de utilização

1. Aceda a `/login.html` e faça login com um utilizador válido.
2. Após login, aceda à página secreta `/segredo`.
3. Clique no link para `/pesquisa.html` para pesquisar países.
4. Faça logout em `/logout`.

## Notas para desenvolvimento

- O código está comentado para facilitar a compreensão.
- Pode adicionar novas funcionalidades, como registo de utilizadores, hashing de passwords, etc.
- Para qualquer dúvida, consulte os comentários no código fonte.

---

Bom desenvolvimento!
