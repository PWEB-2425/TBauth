// Este script é responsável por lidar com a pesquisa de países
// Ativa o evento de envio do formulário
document.getElementById('formPesquisa').onsubmit = async function (e) {
    e.preventDefault(); // Impede o recarregamento da página ao enviar o formulário

    // Obtém o valor no campo do país
    const pais = document.getElementById('pais').value;

    // Faz uma requisição para a rota /pesquisa/:pais do servidor
    const resposta = await fetch('/pesquisa/' + encodeURIComponent(pais));

    // Se a resposta for bem-sucedida (status 200)
    if (resposta.ok) {
        const info = await resposta.json(); // Converte a resposta em JSON

        // Mostra as informações do país na página
        document.getElementById('resultado').innerHTML = `
            <h2>${info.nome}</h2>
            <p><strong>Capital:</strong> ${info.capital}</p>
            <p><strong>População:</strong> ${info.populacao}</p>
            <img src="${info.bandeira}" alt="Bandeira de ${info.nome}" width="150">
        `;
    } else {
        // Caso haja erro ou país não encontrado, mostra mensagem de erro
        document.getElementById('resultado').innerText = "País não encontrado ou erro na pesquisa.";
    }
}