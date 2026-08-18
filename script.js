const CODIGO_CORRETO = "4213"; 

let tentativasErradas = 0;
const MAX_TENTATIVAS = 3;
const TEMPO_BLOQUEIO = 60; // Tempo em segundos

function confirmar() {
    const input = document.getElementById("codigoInput");
    const containerErros = document.getElementById("erros");
    const painelResultado = document.getElementById("resultado");
    const btnConfirmar = document.getElementById("btnConfirmar");

    const valorDigitado = input.value.trim();

    if (tentativasErradas >= MAX_TENTATIVAS) return;

    if (valorDigitado === CODIGO_CORRETO) {
        painelResultado.style.display = "block";
        input.disabled = true;
        btnConfirmar.style.display = "none";
    } else {
        tentativasErradas++;

        // Adiciona um 'X' vermelho na tela normal
        const spanX = document.createElement("span");
        spanX.classList.add("erro-x");
        spanX.innerText = "X";
        containerErros.appendChild(spanX);

        input.value = "";

        // Ao atingir o limite, inicia o bloqueio
        if (tentativasErradas >= MAX_TENTATIVAS) {
            iniciarTimer();
        }
    }
}

function iniciarTimer() {
    const cardPrincipal = document.getElementById("cardPrincipal");
    const cardBloqueio = document.getElementById("cardBloqueio");
    const errosBloqueio = document.getElementById("errosBloqueio");
    const elementoTempo = document.getElementById("tempo");

    // 1. Troca a imagem de fundo
    document.body.classList.add("bloqueado");

    // 2. Esconde o card principal e mostra o card de bloqueio
    cardPrincipal.style.display = "none";
    cardBloqueio.style.display = "block";

    // 3. Copia os 3 'X' para dentro da caixa de bloqueio
    errosBloqueio.innerHTML = `
        <span class="erro-x">X</span>
        <span class="erro-x">X</span>
        <span class="erro-x">X</span>
    `;

    let tempoRestante = TEMPO_BLOQUEIO;
    elementoTempo.innerText = tempoRestante;

    const intervalo = setInterval(() => {
        tempoRestante--;
        elementoTempo.innerText = tempoRestante;

        if (tempoRestante <= 0) {
            clearInterval(intervalo);

            // VOLTA AO ESTADO NORMAL
            document.body.classList.remove("bloqueado");
            
            // Esconde card de bloqueio e exibe o card principal
            cardBloqueio.style.display = "none";
            cardPrincipal.style.display = "block";

            // Reseta contadores e limpa os campos
            tentativasErradas = 0;
            document.getElementById("erros").innerHTML = "";
            
            const input = document.getElementById("codigoInput");
            input.disabled = false;
            input.focus();
        }
    }, 1000);
}

// Bloqueia teclas e atalhos de atualização, navegação e fechamento
window.addEventListener("keydown", function (event) {
    const tecla = event.key;
    const codigo = event.keyCode;
    const ctrlOuCmd = event.ctrlKey || event.metaKey;

    // 1. Tecla F5 e F11/F12 (Evita reload e abertura de DevTools)
    const teclasF = tecla === "F5" || codigo === 116 || tecla === "F12" || codigo === 123;

    // 2. Ctrl+R / Cmd+R (Reload) e Ctrl+Shift+R / Cmd+Shift+R (Hard Reload)
    const atalhoReload = ctrlOuCmd && (tecla === "r" || tecla === "R");

    // 3. Ctrl+W / Cmd+W (Fechar Aba) e Ctrl+F4
    const atalhoFechar = (ctrlOuCmd && (tecla === "w" || tecla === "W")) || (event.ctrlKey && tecla === "F4");

    // 4. Alt + Seta Esquerda (Voltar página) e Alt + Seta Direita (Avançar página)
    const atalhoNavegacaoAlt = event.altKey && (tecla === "ArrowLeft" || tecla === "ArrowRight");

    // 5. Backspace fora de campos de texto (evita voltar página em navegadores antigos)
    const eBackspaceForaDeInput = tecla === "Backspace" && document.activeElement.tagName !== "INPUT";

    if (teclasF || atalhoReload || atalhoFechar || atalhoNavegacaoAlt || eBackspaceForaDeInput) {
        event.preventDefault();
        event.stopPropagation();
    }
});


// Captura elementos
const inputCodigo = document.getElementById("codigoInput");

// 1. Aciona o botão ao pressionar "Enter"
inputCodigo.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        confirmar();
    }
});

// 2. Garante o foco no input assim que a página carrega
window.addEventListener("DOMContentLoaded", () => {
    inputCodigo.focus();
});

// 3. Qualquer tecla digitada fora do campo direciona o foco para o input
document.addEventListener("keydown", (event) => {
    // Evita focar se estiver bloqueado ou se o input já estiver desativado
    if (inputCodigo.disabled || tentativasErradas >= MAX_TENTATIVAS) return;

    // Se a tecla pressionada não for Enter, Tab, Escape, etc., foca no input
    if (document.activeElement !== inputCodigo && event.key.length === 1) {
        inputCodigo.focus();
    }
});

// 4. Se o usuário clicar em qualquer lugar fora da tela, o foco volta para o input
document.addEventListener("click", () => {
    if (!inputCodigo.disabled && tentativasErradas < MAX_TENTATIVAS) {
        inputCodigo.focus();
    }
});