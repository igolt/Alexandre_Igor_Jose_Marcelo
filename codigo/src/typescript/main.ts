import { AssetsManagar as AssetsManager } from "./assetsmanager";
import { SceneMap } from "./scenemap";

//assets gerais: sprites, musicas, etc
var assetsMng = new AssetsManager(20);
assetsMng.loadImage("bear", "./assets/bear.png");
assetsMng.loadImage("charger", "./assets/charger.png");

//assets de mapas
var mapAssets = new AssetsManager(20);
mapAssets.loadImage("background1", "./assets/toyroom.png");
mapAssets.loadImage("voidtile", "./assets/voidtile.png");

var canvas = document.querySelector("canvas");
canvas.width = 800;
canvas.height = 640;

var ctx = canvas.getContext("2d");
var teclas = {
    esquerda: 0,
    cima: 0,
    direita: 0,
    baixo: 0,
    espaco: 0
}





//MAPAS

var mapas = [];
var mapa0 = new SceneMap(
    mapAssets, [
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [1, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 2],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [1, 2, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [1, 2, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2],
    [1, 2, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
], 0, 20, 25, 32);

mapas.push(mapa0);




///COMPORTAMENTOS

///Corre em direção enquanto está perto
function charge(alvo) {
    return function () {
        if (Math.sqrt((alvo.x - this.x) * (alvo.x - this.x)) + (alvo.y - this.y) * (alvo.y - this.y) <= 200) {
            if (alvo.x <= this.x) {
                this.lado = 0;
            }
            else {
                this.lado = 1;
            }
            this.ax = 200 * Math.sign(alvo.x - this.x);
        }
    }
}

//controla pc
function porTeclasDirecionais(teclas) {
    return function () {
        if (teclas.esquerda) { this.ax = -300, this.lado = 0; }
        if (teclas.direita) { this.ax = +300, this.lado = 1; }
        if (teclas.esquerda === teclas.direita) { this.ax = 0; }
        if (teclas.cima && this.cooldown <= 0) { this.cooldown = 1.0; this.vy = -500; }
        if (this.pulo >= 0.5) { this.pulo = 0, this.vy = -800; }
        if (teclas.cima === teclas.baixo) { this.ay = 0; }
        if (teclas.espaco && this.cooldown <= 0 && this.dialogo <= 0) {
            if (this.lado <= 0.5) {
                var tiro = new Sprite({
                    lado: 0,
                    x: this.x - 48,
                    y: this.y - 8,
                    ax: -1,
                    vx: -600,
                    w: 24,
                    h: 24,
                    props: { tipo: "tiro" },
                });
                this.scene.adicionar(tiro);
                this.cooldown = 0.25;
            }
            else {
                var tiro = new Sprite({
                    lado: 1,
                    x: this.x + 48,
                    y: this.y - 8,
                    ax: 1,
                    vx: 600,
                    w: 24,
                    h: 24,
                    props: { tipo: "tiro" },
                });
                this.scene.adicionar(tiro);
                this.cooldown = 0.25;
            }
        }
    }
}



var cena = new Scene({ ctx: ctx, w: canvas.width, h: canvas.height, assets: assetsMng, map: mapas });
var pc = new Sprite({ x: 120, y: 440, w: 24, h: 24, vx: 20, vy: 20, comportar: porTeclasDirecionais(teclas), props: { tipo: "pc", riding: 0 } });
cena.adicionar(pc);

//event listener do teclado
addEventListener("keydown", function (e) {
    switch (e.keyCode) {
        case 32:
            teclas.espaco = 1;
            menu = 1;
            break;
        case 37:
            teclas.esquerda = 1;
            this.lado = 0;
            break;
        case 38:
            teclas.cima = 1;
            break;
        case 39:
            teclas.direita = 1;
            this.lado = 1;
            break;
        case 40:
            teclas.baixo = 1;
            break;
    }
});
addEventListener("keyup", function (e) {
    switch (e.keyCode) {
        case 32:
            teclas.espaco = 0;
            break;
        case 37:
            teclas.esquerda = 0;
            break;
        case 38:
            teclas.cima = 0;
            break;
        case 39:
            teclas.direita = 0;
            break;
        case 40:
            teclas.baixo = 0;
            break;
    }
});

function passo(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    dt = (t - anterior) / 1000;
    if (assetsMng.progresso() >= 100) {
        cena.passo(dt);
    }
    anterior = t;
    requestAnimationFrame(passo);
    ctx.restore();
}

var dt, anterior = 0;
requestAnimationFrame(passo);