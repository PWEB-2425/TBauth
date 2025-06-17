// Exercicio desenvolvido na aulas de 
// Programação Web ERSC TB
// 2025.06.17 9h00-11h00

// Importa módulos necessários
const express = require('express');
const session = require('express-session');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Permite receber dados de formulários via POST
app.use(express.urlencoded({ extended: true }));
// Configura sessões para autenticação
app.use(session({ secret: process.env.SECRET || "12345" }));
// Permite receber dados em JSON
app.use(express.json());


// Rota pública de exemplo
app.get('/about', (req, res) => {
    res.send('Sobre nós');
});

// proteger a pagina estatica '/pesquisa.html'
// tem que ser feito antes de configurar o servidor estatico

app.use('/pesquisa.html', estaAutenticado,(req, res, next) => {
    if (req.session.username) {
        next();
    } else {
        res.redirect('/login.html');
    }
});

// Configura servidor para servir arquivos estáticos da pasta 'public'
app.use(express.static('public'));


// Rota de login: autentica username e cria sessão
app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Procura username na base de dados
    userdb = await collection.findOne({ username: username, password: password });
    if (userdb) {
        // username autenticado com sucesso
        console.log(`Utilizador ${username} autenticado com sucesso.`);
        req.session.username = username;
        return res.redirect('/segredo');    
    } else {  
        // Falha na autenticação
        console.log(`Falha na autenticação para o usuário ${username}.`);
        return res.redirect('/login.html');
    }
});

// Middleware para proteger rotas: verifica se username está autenticado
function estaAutenticado(req, res, next) {
    if (req.session.username) {
        next();
    } else {
        res.status(401).redirect('/login.html');
    }
}

// Rota protegida: só acessível se autenticado
app.get('/segredo', estaAutenticado, (req, res) => {
    res.send(`Bem-vindo ao segredo, ${req.session.username}!`);
});

// Rota de logout: destroi a sessão autenticada
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login.html');
});

// Rota autenticada para buscar informações de um país usando API externa
app.get('/pesquisa/:pais', estaAutenticado, async (req, res) => {
    pais = req.params.pais;
    console.log(`Procurando informações sobre o país: ${pais}`);
    let URL = "https://restcountries.com/v3.1/name/" + pais;
    
    resposta = await fetch(URL);

    if (!resposta.ok) {
        console.error(`Erro ao buscar informações do país: ${pais}`);
        return res.status(404).send('País não encontrado ou erro na pesquisa.');
    }

    resultado = await resposta.json();
    //console.log(resultado)

    // Monta objeto com informações relevantes do país
    // o primeiro da lista
    let info = new Object();
    info.nome = resultado[0].name.common;
    info.capital = resultado[0].capital;
    info.populacao = resultado[0].population;
    info.bandeira = resultado[0].flags.png;

    console.log(`Informações do país ${pais}:`, info);
    
    // Envia resposta JSON com as informações do país
    return res.json(info)
});

// Variáveis globais para banco de dados
let db; // instância da ligacao à BD MongoDB
let collection; // Coleção de users

// Função para conectar ao MongoDB e iniciar o servidor
async function start() {
    try { 
        // Cria um novo cliente MongoDB usando a string de conexão do .env ou padrão local
        const client = new MongoClient(process.env.DB || 'mongodb://localhost:27017');
        await client.connect(); // Estabelece conexão com base de dados
        console.log('Ligado ao MongoDB');
        db = client.db('usersdb'); // Seleciona a base de dados 'usersdb'
        collection = db.collection('users'); // Seleciona a coleção 'users'
        // Inicia o servidor Express na porta definida no .env ou 3001
        app.listen(process.env.PORT || 3001, () => {
            const port = process.env.PORT || 3001;
            console.log("Servidor pronto na porta " + port);
        });
    }
    catch (error) {
        // Mostra erro caso não consiga ligar BD e/ou servidor
        console.error('Erro ao iniciar', error);
    }
}

// Inicia a aplicação
start();
