document.addEventListener("DOMContentLoaded", function () {
  // Inicializa o emailjs apenas uma vez
  if (typeof emailjs !== "undefined") {
    emailjs.init("FW85z6xM8hNC9Zgdl");
  } else {
    console.error("EmailJS não carregado corretamente.");
  }

  // Referência para o campo de anexo
  const anexoInput = document.getElementById("anexo");
  const previewContainer = document.createElement("div"); // Container de visualização

  // Adiciona o container de preview antes do botão de envio
  document
    .querySelector("form")
    .insertBefore(previewContainer, document.querySelector("button[type='submit']"));

  // Função para enviar o formulário com EmailJS
  document.getElementById("formSolicitacao").addEventListener("submit", function (event) {
    event.preventDefault();

    // Verificar se o campo de anexo foi preenchido
    if (anexoInput.files.length === 0) {
      alert("Por favor, anexe um arquivo antes de enviar.");
      return; // Impede o envio do formulário
    }

    const params = {
      nome: document.getElementById("nome").value,
      email: document.getElementById("email").value,
      telefone: document.getElementById("telefone").value,
      categoria: document.getElementById("categoria").value,
      descricao: document.getElementById("descricao").value,
      cep: document.getElementById("cep").value,
      logradouro: document.getElementById("logradouro").value,
      numero: document.getElementById("numero").value,
      bairro: document.getElementById("bairro").value,
      cidade: document.getElementById("cidade").value,
      uf: document.getElementById("uf").value,
      referencia: document.getElementById("referencia").value,
      anexo: document.getElementById("anexo").value,
    };

    emailjs
      .send("service_m8mii8p", "template_adfvdki", params)
      .then(function (response) {
        alert("Solicitação enviada com sucesso!");
        console.log("E-mail enviado:", response);
        document.getElementById("formSolicitacao").reset(); // Limpa o formulário
      })
      .catch(function (error) {
        alert("Erro ao enviar a denúncia. Tente novamente!");
        console.error("Erro:", error);
      });
  });

  // Função para adicionar pré-visualização das imagens anexadas
  anexoInput.addEventListener("change", function (event) {
    previewContainer.innerHTML = ""; // Limpa o conteúdo atual do preview

    const arquivos = event.target.files;

    for (let i = 0; i < arquivos.length; i++) {
      const arquivo = arquivos[i];

      // Verifica se é uma imagem
      if (arquivo.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.onload = function (e) {
          const img = document.createElement("img");
          img.src = e.target.result;
          img.style.maxWidth = "200px"; // Limita o tamanho das imagens
          img.style.margin = "10px";
          previewContainer.appendChild(img); // Adiciona a imagem ao container
        };

        reader.readAsDataURL(arquivo); // Lê o arquivo como URL
      } else {
        const p = document.createElement("p");
        p.textContent = `O arquivo ${arquivo.name} não é uma imagem.`;
        previewContainer.appendChild(p);
      }
    }
  });

  // Função para formatar o telefone
  document.getElementById("telefone").addEventListener("input", function (e) {
    let valor = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número
    if (valor.length > 11) valor = valor.slice(0, 11); // Limita a 11 dígitos

    // Formata o número de telefone
    if (valor.length > 10) {
      valor = valor.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    } else if (valor.length > 6) {
      valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
    } else if (valor.length > 2) {
      valor = valor.replace(/^(\d{2})(\d{0,5})$/, "($1) $2");
    } else {
      valor = valor.replace(/^(\d{0,2})$/, "($1");
    }

    e.target.value = valor; // Atualiza o campo
  });

  // Função para formatar o CEP
  const cepInput = document.getElementById("cep");

  // Formatação do CEP enquanto digita
  cepInput.addEventListener("input", function (e) {
    let valor = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número
    if (valor.length > 8) valor = valor.slice(0, 8); // Limita a 8 caracteres
    if (valor.length > 5) valor = valor.replace(/^(\d{5})(\d{0,3})$/, "$1-$2"); // Adiciona hífen automaticamente
    e.target.value = valor;
  });

  // Preenchimento automático do endereço com a API ViaCEP
  cepInput.addEventListener("blur", function () {
    let cep = this.value.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (cep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((response) => response.json())
        .then((data) => {
          if (!data.erro) {
            document.getElementById("logradouro").value = data.logradouro;
            document.getElementById("bairro").value = data.bairro;
            document.getElementById("cidade").value = data.localidade;
            document.getElementById("uf").value = data.uf;

            // Após preencher o endereço, foca no campo número
            document.getElementById("numero").focus(); // Foco no campo número
          } else {
            alert("CEP não encontrado. Verifique e tente novamente.");
          }
        })
        .catch((error) => console.error("Erro ao buscar o CEP:", error));
    } else {
      alert("CEP inválido. Digite um CEP com 8 dígitos.");
    }
  });
});
