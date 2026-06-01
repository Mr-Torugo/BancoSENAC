document
  .getElementById("form-cadastro")
  .addEventListener("submit", function (event) {
    // Impede o recarregamento automático da página
    event.preventDefault();

    let formValido = true;

    // Expressões Regulares (RegEx)
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexSenha = /^.{6,}$/; // Mínimo de 6 caracteres
    const regexCPF = /^(\d{3}\.?\d{3}\.?\d{3}-?\d{2}|\d{11})$/; // Aceita com ou sem formatação
    const regexCEP = /^\d{5}-?\d{3}$/; // 8 dígitos com ou sem hífen
    const regexCelular = /^\(?\d{2}\)?\s?9\d{4}-?\d{4}$/; // Formato de DDD + 9 dígitos

    // Função de Validação e Feedback Visual
    // Função de Validação e Feedback Visual (Critério 3)
    function validarCampo(id, condicaoValida) {
      const input = document.getElementById(id);
      if (!condicaoValida) {
        input.classList.add("erro");
        formValido = false;
      } else {
        input.classList.remove("erro");
      }
      return input.value.trim();
    }

    // Validação de campos obrigatórios
    const nome = validarCampo(
      "nome",
      document.getElementById("nome").value.trim() !== "",
    );
    const endereco = validarCampo(
      "endereco",
      document.getElementById("endereco").value.trim() !== "",
    );
    const complemento = validarCampo(
      "complemento",
      document.getElementById("complemento").value.trim() !== "",
    );
    const cidade = validarCampo(
      "cidade",
      document.getElementById("cidade").value.trim() !== "",
    );
    const estado = validarCampo(
      "estado",
      document.getElementById("estado").value.trim() !== "",
    );

    // Validação utilizando as Expressões Regulares
    const email = validarCampo(
      "email",
      regexEmail.test(document.getElementById("email").value.trim()),
    );
    const senha = validarCampo(
      "senha",
      regexSenha.test(document.getElementById("senha").value.trim()),
    );
    const cpf = validarCampo(
      "cpf",
      regexCPF.test(document.getElementById("cpf").value.trim()),
    );
    const cep = validarCampo(
      "cep",
      regexCEP.test(document.getElementById("cep").value.trim()),
    );
    const celular = validarCampo(
      "celular",
      regexCelular.test(document.getElementById("celular").value.trim()),
    );

    // Validação condicional do Saldo (Numérico >= 0)
    const saldoInput = document.getElementById("saldo").value;
    const saldo = validarCampo(
      "saldo",
      saldoInput !== "" && !isNaN(saldoInput) && parseFloat(saldoInput) >= 0,
    );

    // Requisição Assíncrona (Fetch API - POST)
    if (formValido) {
      // Formata o CPF para enviar exatamente os 11 números, removendo pontos e traços
      const cpfLimpo = cpf.replace(/\D/g, "");

      // Estrutura de dados exata esperada pela API
      const payload = {
        email: email,
        senha: senha,
        saldo: parseFloat(saldo),
        nome: nome,
        cpf: cpfLimpo,
        endereco: endereco,
        complemento: complemento,
        cep: cep,
        cidade: cidade,
        estado: estado,
        celular: celular,
      };

      fetch("https://senac-bank-api.dennislopes.com.br/banco/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Convertendo o objeto JavaScript para JSON
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Cliente cadastrado com sucesso!", data);
          alert("Cadastro realizado com sucesso!");
          document.getElementById("form-cadastro").reset(); // Limpa o formulário para um novo cadastro
        })
        .catch((error) => {
          console.error("Falha na requisição:", error);
          alert("Houve um erro na comunicação com o servidor.");
        });
    } else {
      console.warn("Existem campos inválidos. O envio foi bloqueado.");
    }
  });
