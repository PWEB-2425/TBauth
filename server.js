const express = require('express');
const session = require('express-session');
const { MongoClient } = require('mongodb');


const dotenv = require('dotenv');
dotenv.config();

const app = express();

// servidor estático
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SECRET || "12345" }));
app.use(express.json());

// se quisesse usar autenticação em todas as rotas
//app.use(estaAutenticado);

app.get('/about', (req, res) => {
    res.send('Sobre nós');
});

app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // validasr na base de dados
    userdb = await collection.findOne({ username: username, password: password });
    if (userdb) {
        console.log(`Usuário ${username} autenticado com sucesso.`);
        req.session.username = username;
        return res.redirect('/segredo');    
    } else {  
        console.log(`Falha na autenticação para o usuário ${username}.`);
        return res.redirect('/login.html');
    }
});


function estaAutenticado(req, res, next) {
    if (req.session.username) {
        next();
    } else {
        res.status(401).redirect('/login.html');
    }
}

// rota protegida
app.get('/segredo', estaAutenticado, (req, res) => {
        res.send(`Bem-vindo ao segredo, ${req.session.username}!`);
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login.html');
});

// exemplo de rota para exibir informações de um país
app.get('/pesquisa/:pais', async (req, res) => {
    pais = req.params.pais;
    console.log(`Procurando informações sobre o país: ${pais}`);
    let URL = "https://restcountries.com/v3.1/name/" + pais;
    resposta = await fetch(URL);
    resultado = await resposta.json();

    console.log(resultado)

    let info = new Object();
    info.nome = resultado[0].name.common;
    info.capital = resultado[0].capital;
    info.populacao = resultado[0].population;
    info.bandeira = resultado[0].flags.png;

    res.send(res.json(info))
});
    



let db;
let collection;

async function start() {
    try { 
        const client = new MongoClient(process.env.DB || 'mongodb://localhost:27017');
        await client.connect();
        console.log('Conectado ao MongoDB');
        db = client.db('usersdb');
        collection = db.collection('users');
        app.listen(process.env.PORT || 3001, () => {
            console.log("Server is running on port" + process.env.PORT || 3001);
        });
    }
    catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
    }
}

start();
