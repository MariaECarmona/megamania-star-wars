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

    colisao(outraSprite){
        if(this.x<outraSprite.x+outraSprite.largura && this.x+this.largura>outraSprite.x && this.y < outraSprite.y+outraSprite.altura && this.y + this.altura > outraSprite.y){
            return true;
        }
    }

}

class Inimigo extends Sprite{
    constructor(x,y){
        super(x,y,80,80,imagemTie);
        this.linha = y;
        this.destroiNave = false;
    }  

    atualizar(){
        this.x += 11;

        if (this.x > 1500) {
            this.x = -150;
            this.y = this.linha;
        }
        this.y += Math.cos(this.x/25)*8;
    }

    
}

class Tiro extends Sprite{
    constructor(personagem){
        super(personagem.x+ personagem.largura/2,personagem.y, 8, 18);
        this.velocidade = -13;
        this.personagem = personagem;
    }

    atualizar(){
        if(this.personagem == millennium){
            this.y += this.velocidade;

            if(this.y<0){
                this.destruir = true;
            }
        }
        else{
            this.velocidade = 8;
            this.y += this.velocidade;

            if(this.y> 750){
                this.destruir = true;
            }

        }
    }
}

//VARIAVEIS
//Elemento canvas
let canvasEl = document.querySelector("#game");
let ctx = canvasEl.getContext('2d');
ctx.imageSmoothingEnabled = false;
//Nave inimiga
let imagemTie = new Image();
imagemTie.src = 'tie-fighter.png';
let navesInim = [];
let x1 = -115;
let x2 = 0;
//Millennium falcon
let imagemMillennium = new Image();
imagemMillennium.src = 'millenium.png';
let millennium = new Sprite(670, 580, 124, 158, imagemMillennium);
//tiro
let tiros = [];
let tirosInimigos = [];
//retangulo de vida e pontos
let retangulo = new Sprite(30, 750, 1440, 120);
let pontos = 00000;
//Vida
let imagemVida = new Image();
imagemVida.src = 'millenium-vida.png';
let vidas = [new Sprite(1174, 770, 68, 86, imagemVida), new Sprite(1262, 770, 68, 86, imagemVida), new Sprite(1350, 770, 68, 86, imagemVida)];

//EVENTOS
//mexe a millennium com mouse
canvasEl.addEventListener('mousemove', (e) => {
    millennium.x = e.offsetX - millennium.largura / 2;
});

//dispara tiro
document.body.addEventListener('keydown', e => {
    if (e.key === ' ') {
        atirar();
        e.preventDefault();
    }
});

imagemMillennium.addEventListener('load', (e) => {
    geraNave();
    desenhaJogo();  
});

let loop = setInterval(atualizaLogicaJogo, 19);

setInterval(atirarInimigo, 300);

//FUNÇÕES
function desenhaJogo() {
    ctx.clearRect(0,0, 1500,900);
    millennium.desenha(ctx);

    ctx.fillStyle = 'grey';
    retangulo.desenha(ctx);

    for (let tiro of tiros) {
        ctx.fillStyle = "red";
        tiro.desenha(ctx);
    }
    
    for(let vida of vidas){
        vida.desenha(ctx);
    }

    for (let tiro of tirosInimigos){
        ctx.fillStyle = "green";
        tiro.desenha(ctx);
    }
    for (let nave of navesInim){
        nave.desenha(ctx);
    }

    ctx.fillStyle = 'blue';
    ctx.font = "70px 'Press Start 2P', cursive";
    ctx.fillText(pontos, 100, 845);

    verificaVitoria();
    verificaDerrota();
}

function atualizaLogicaJogo(){
    atualizaInimigos();  
    atualizaTiros();
    atualizaTirosInimigos();
    verificaColisao();
    desenhaJogo();
}

function geraNave() {
    for (let i = 0; i < 10; i++) {
        if (i % 2 == 0) {
            x1 += 250;
            navesInim.push(new Inimigo(x1,20));
        }
        else {
            x2 += 250;
            navesInim.push(new Inimigo(x2, 140));
        }
        navesInim[i].desenha(ctx);
    }

}

function atualizaInimigos(){
    for (let i=0;i<navesInim.length;i++){
        navesInim[i].atualizar();
        if(navesInim[i].destroiNave){
            navesInim.splice(i,1);
        }
    }
}

function atirar(){
    let tiro = new Tiro(millennium);
    tiros.push(tiro);
}

function atualizaTiros(){
    for (let tiro of tiros){
        tiro.atualizar();
    }

    for(let i=0; i<tiros.length; i++){
        if(tiros[i].destruir){
            tiros.splice(i,1);
        }
    }

}

function atirarInimigo(){
    let sorteio = Math.round(Math.random()* navesInim.length);
    let tiro = new Tiro(navesInim[sorteio]);
    tirosInimigos.push(tiro);
}

function atualizaTirosInimigos(){
    for (let tiro of tirosInimigos){
        tiro.atualizar();
    }

    for(let i=0; i<tirosInimigos.length; i++){
        if(tirosInimigos[i].destruir){
            tirosInimigos.splice(i,1);
        }
    }
}


function verificaColisao(){
    for (let tiro of tirosInimigos) {
        const atingiuMillennium = tiro.colisao(millennium);
        if (atingiuMillennium) {
            tiro.destruir = true;
            vidas.pop();

        }
    }

    for(let nave of navesInim){
        for(let tiro of tiros){
            const naveAtingida = tiro.colisao(nave);
            if(naveAtingida){
                tiro.destruir = true;
                nave.destroiNave = true;
                pontos+=100;
            }
        }
    }
}

function verificaVitoria(){
    if(navesInim.length == 0){
        ctx.fillStyle = 'black';
        ctx.fillRect(0,0,1500,900);
        ctx.fillStyle='blue';
        ctx.font = "70px 'Press Start 2P', cursive";
        ctx.fillText("Você venceu", 425,450);
        ctx.font = "30px 'Press Start 2P', cursive";
        ctx.fillText("Para jogar  novamente, reinicie a página", 160,500);
        clearInterval(loop);
    }
}

function verificaDerrota(){
    if(vidas.length==0){
        ctx.fillStyle = 'black';
        ctx.fillRect(0,0,1500,900);
        ctx.fillStyle='blue';
        ctx.font = "70px 'Press Start 2P', cursive";
        ctx.fillText("Game Over", 435,450);
        ctx.font = "30px 'Press Start 2P', cursive";
        ctx.fillText("Para jogar  novamente, reinicie a página", 160,500);
        clearInterval(loop);
    }
}
