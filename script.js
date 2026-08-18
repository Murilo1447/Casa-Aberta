const CODIGO_CORRETO = "4123"; 

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

// Bloqueia F5, Ctrl+R e Cmd+R sem emitir nenhum aviso/alerta
window.addEventListener("keydown", function (event) {
    // Tecla F5 (keyCode 116 ou key 'F5')
    const eF5 = event.key === "F5" || event.keyCode === 116;
    
    // Ctrl + R (Windows/Linux) ou Cmd + R (Mac)
    const eCtrlR = (event.ctrlKey || event.metaKey) && (event.key === "r" || event.key === "R");

    if (eF5 || eCtrlR) {
        event.preventDefault(); // Cancela o recarregamento silenciosamente
    }
});