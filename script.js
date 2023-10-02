class App {
  async acessaAPI(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erro na solicitação da API");
      }
      const json = await response.json();

      return json;
    } catch (error) {
      console.error("Houve um erro: ", error);
      throw error;
    }
  }
  static removerCaracteresAcentuados(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  async buscaCidade() {
    try {
      let nomeCidade = document.getElementById("busca-cidade").value;
      if (nomeCidade) {
        const cidade = App.removerCaracteresAcentuados(
          document.getElementById("busca-cidade").value
        );

        console.log(cidade);
        const url = "https://brasilapi.com.br/api/cptec/v1/cidade/" + cidade;

        const data = await this.acessaAPI(url);
        this.mostraCidades(data);
      } else {
        const ulNomesCidades = document.getElementById("lista-cidades");
        ulNomesCidades.innerHTML = "";
      }
    } catch (error) {
      console.error("Houve um erro: ", error);
    }
  }

  mostraCidades(listaCidades) {
    const ulNomesCidades = document.getElementById("lista-cidades");
    ulNomesCidades.innerHTML = "";
    listaCidades.forEach((cidade) => {
      const radioButtonCidade = document.createElement("input");
      const labelradioButtonCidade = document.createElement("label");
      const liCidade = document.createElement("li");

      liCidade.setAttribute("class", "div-cidade");

      radioButtonCidade.setAttribute("type", "radio");
      radioButtonCidade.setAttribute("id", cidade.nome + "-" + cidade.estado);
      radioButtonCidade.setAttribute("name", "opcao-cidade");
      radioButtonCidade.setAttribute("value", cidade.id);
      radioButtonCidade.setAttribute("class", "radio-cidade");
      labelradioButtonCidade.setAttribute("class", "label-radio-cidade");

      labelradioButtonCidade.setAttribute(
        "for",
        cidade.nome + "-" + cidade.estado
      );
      labelradioButtonCidade.textContent = cidade.nome + "/" + cidade.estado;

      liCidade.appendChild(radioButtonCidade);
      liCidade.appendChild(labelradioButtonCidade);
      ulNomesCidades.appendChild(liCidade);
    });
  }

  async buscaPrevisao() {
    try {
      const idCidade = document.querySelector(
        'input[name="opcao-cidade"]:checked'
      )?.value;
      if (idCidade) {
        const days = 6;
        const url = `https://brasilapi.com.br/api/cptec/v1/clima/previsao/${idCidade}/${days}`;
        const data = await this.acessaAPI(url);
        document.getElementById('main').style.display = "none"
        document.getElementById('tela-previsao').style.display="flex";
        this.mostraPrevisao(data);
      }else{
        throw new Error("Não possui id de cidade");
      }
    } catch {
      console.error("Houve um erro: ", error);
    }
  }
  mostraPrevisao(data){
    console.log(data);
    document.getElementById("nome-cidade").innerText = data.cidade;
    document.getElementById('nome-estado').innerText = data.estado;
    
    const dataDeAtualizacao = new Date(data.atualizado_em);
    const dia = dataDeAtualizacao.getDate();
    const mes = dataDeAtualizacao.getMonth() + 1; 
    const ano = dataDeAtualizacao.getFullYear();
    const dataFormatoBrasileiro = `${dia < 10 ? '0' : ''}${dia}/${mes < 10 ? '0' : ''}${mes}/${ano}`;

    document.getElementById('data-atualizacao').innerText= dataFormatoBrasileiro;

    for(let i =0 ; i < 6; i++ ){
      document.getElementById('data' + (i + 1)).innerText = data.clima[i].data;
      document.getElementById('condicao' + (i + 1)).innerText = data.clima[i].condicao_desc;
      document.getElementById('min' + (i + 1)).innerText = data.clima[i].min + " ºC";
      document.getElementById('max' + (i + 1)).innerText = data.clima[i].max + " ºC";
      document.getElementById('uv' + (i + 1)).innerText = data.clima[i].indice_uv;
    }
  }
  voltar(){
    document.getElementById('main').style.display = "flex"
    document.getElementById('tela-previsao').style.display="none";
  }
}

const app = new App();
