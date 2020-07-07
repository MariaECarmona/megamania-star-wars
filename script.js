class Sprite {
    constructor(x, y, largura, altura, imagem) {
        this.x = x;
        this.y = y;
        this.altura = altura;
        this.largura = largura;
        this.imagem = imagem;
    }

    desenha(ctx) {
        if (this.imagem) {
            ctx.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
        }
        else {
            ctx.fillRect(this.x, this.y, this.largura, this.altura);
        }
    }

}
let bodyEl = document.querySelector('body');
//Elemento canvas
let canvasEl = document.querySelector("#game");
let ctx = canvasEl.getContext('2d');
ctx.imageSmoothingEnabled = false;

//Nave inimiga
let imagemTie = new Image();
imagemTie.src = 'img/tie-fighter.png';
let navesInim = [];
let x1 = -115;
let x2 = 0;


//Millennium falcon
let imagemMillennium = new Image();
imagemMillennium.src = 'img/millenium.png';
let millennium = new Sprite(670, 580, 124, 158, imagemMillennium);
let millenniumXAtual = 0;//apagar?

//tiro
let tiro;

//retangulo de vida e pontos
let retangulo = new Sprite(30, 750, 1440, 120);

//Vida
let imagemVida = new Image();
imagemVida.src = 'img/millenium-vida.png';
let vidas = [new Sprite(1174, 770, 68, 86, imagemVida), new Sprite(1262, 770, 68, 86, imagemVida), new Sprite(1350, 770, 68, 86, imagemVida)];
let numVidas = 3;

//mexe a millennium com mouse
canvasEl.addEventListener('mousemove', (e) => {
    millennium.x = e.offsetX - millennium.largura / 2;
    desenhaJogo();
});

//dispara tiro
canvasEl.addEventListener('click', (e) => {
    ctx.fillStyle = 'red';
    millenniumXAtual = millennium.x + millennium.largura / 2;
    tiro = new Sprite(millenniumXAtual, 400, 8, 18);
    tiro.desenha(ctx);
});

imagemMillennium.addEventListener('load', (e) => {
    desenhaJogo();  
});

setInterval(() => {
    geraNave();
    for (let nave of navesInim){
        nave.x++;
        if (nave.x > 1500) {
            nave.x = -100;
        }
        if (nave.y < 0) {
            nave.y += 10;
        }

        nave.y += Math.cos(nave.x) * 90;
    }
}, 80);

//Gera naves inimigas
function geraNave() {
    ctx.clearRect(0, 0, 1500, 400);
    for (let i = 0; i <= 10; i++) {
        if (i % 2 == 0) {
            x1 += 250;
            navesInim.push(new Sprite(x1, 20, 80, 80, imagemTie));
        }
        else {
            x2 += 250;
            navesInim.push(new Sprite(x2, 140, 80, 80, imagemTie));
        }
        navesInim[i].desenha(ctx);
    }

}

//Funcionamento de vidas
function contaVidas() {
    for (let vida of vidas) {
        vida.desenha(ctx);
    }
}

//Desenha a maioria dos sprites
function desenhaJogo() {
    ctx.clearRect(0,300, 1500, 742);
    millennium.desenha(ctx);

    ctx.fillStyle = 'grey';
    retangulo.desenha(ctx);
    contaVidas();

    ctx.fillStyle = 'blue';
    ctx.font = "70px 'Press Start 2P', cursive";
    ctx.fillText("00000", 100, 845);
}