const botoes = document.querySelectorAll(".filtro");
const fotos = document.querySelectorAll(".miniatura");
const galeria = document.querySelector(".galeria");
const total = document.getElementById("totalImagens");

const modal = document.getElementById("modal");
const btnFechar = document.getElementById("fechar");
const btnAnterior = document.getElementById("anterior");
const btnProximo = document.getElementById("proximo");
const imagemModal = document.getElementById("imagemModal");
const nomeImagem = document.getElementById("nomeImagem");
const contador = document.getElementById("contador");

let fotosVisiveis = [];
let indiceAtual = 0;

// ---------- Filtro ----------

function atualizarVisiveis() {
    fotosVisiveis = [];

    fotos.forEach(function (foto) {
        if (!foto.classList.contains("oculta")) {
            fotosVisiveis.push(foto);
        }
    });

    if (total) {
        total.textContent = "Exibindo " + fotosVisiveis.length + " de " + fotos.length + " imagens";
    }
}

function filtrarImagens(categoria) {
    fotos.forEach(function (foto) {
        const catFoto = foto.dataset.categoria || "";

        // Se for "todos", mostra todas. Caso contrário, busca a categoria selecionada
        if (categoria === "todos" || catFoto.includes(categoria)) {
            foto.classList.remove("oculta");
        } else {
            foto.classList.add("oculta");
        }
    });

    // Quando filtra por categoria, ativa a classe que força o tamanho uniforme das fotos na galeria
    if (categoria === "todos") {
        galeria.classList.remove("uniforme");
    } else {
        galeria.classList.add("uniforme");
    }

    atualizarVisiveis();
}

botoes.forEach(function (botao) {
    botao.addEventListener("click", function () {
        botoes.forEach(function (item) {
            item.classList.remove("ativo");
        });
        botao.classList.add("ativo");

        filtrarImagens(botao.dataset.filtro);
    });
});

// ---------- Modal ----------

function mostrarFoto(indice) {
    const quantidade = fotosVisiveis.length;
    if (quantidade === 0) return;

    indiceAtual = (indice + quantidade) % quantidade;
    const foto = fotosVisiveis[indiceAtual];

    const modalConteudo = document.querySelector(".modal-conteudo");

    // Limpa a largura para a nova imagem calcular o seu tamanho real
    modalConteudo.style.width = "auto";

    imagemModal.src = foto.src;
    imagemModal.alt = foto.alt;

    imagemModal.onload = function () {
        modalConteudo.style.width = imagemModal.clientWidth + "px";
    };

    if (nomeImagem) {
        nomeImagem.textContent = foto.dataset.descricao || foto.alt;
    }

    if (contador) {
        contador.textContent = (indiceAtual + 1) + " de " + quantidade;
    }
}

function abrirModal(foto) {
    indiceAtual = fotosVisiveis.indexOf(foto);
    if (indiceAtual !== -1) {
        mostrarFoto(indiceAtual);
        modal.classList.add("ativo");
    }
}

function fecharModal() {
    modal.classList.remove("ativo");
}

fotos.forEach(function (foto) {
    foto.addEventListener("click", function () {
        abrirModal(foto);
    });

    foto.addEventListener("keydown", function (evento) {
        if (evento.key === "Enter") {
            abrirModal(foto);
        }
    });
});

btnFechar.addEventListener("click", fecharModal);

modal.addEventListener("click", function (evento) {
    if (evento.target === modal) {
        fecharModal();
    }
});

btnProximo.addEventListener("click", function () {
    mostrarFoto(indiceAtual + 1);
});

btnAnterior.addEventListener("click", function () {
    mostrarFoto(indiceAtual - 1);
});

document.addEventListener("keydown", function (evento) {
    if (!modal.classList.contains("ativo")) return;

    if (evento.key === "Escape") fecharModal();
    if (evento.key === "ArrowRight") mostrarFoto(indiceAtual + 1);
    if (evento.key === "ArrowLeft") mostrarFoto(indiceAtual - 1);
});

// Início
filtrarImagens("todos");