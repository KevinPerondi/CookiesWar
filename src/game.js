'use strict'

/**
 * Exemplo de jogo com miscelanea de elementos:
 * - control de personagem por rotacionar e mover usando arcade physics
 * - dois players PVP
 * - pool e tiros
 * - colisao de tiros e players
 * - taxa de tiros e variancia de angulo
 * - HUD simples
 * - mapa em TXT
 */

const config = {};
config.RES_X = 1280 ;// resolucao HD
config.RES_Y = 704;

var player1Score = 0;
var player2Score = 0;

var backgroundCount = 1;

var level = 1;
var showLevelDelay = 180;
var showLevelCount = 0;

var player;
var player2;
var cursors;
var bg;

var hud;

var map;
var mapsCount = 0;
var maps = ['map1','map2','map3'];

var sugarSpawnDelay = 600;
var yeastSpawnDelay = 900;
var milkSpawnDelay = 120;

var sugarDelay = 0;
var yeastDelay = 0;
var milkDelay = 0;

var sugars;
var yeasts;
var milks;

var game = new Phaser.Game(config.RES_X, config.RES_Y, Phaser.CANVAS, 
    'game-container',
    {   
        preload: preload,
        create: create,
        update: update,
        render: render
    })

function getRandomX(){
    var spawnX = Math.floor(Math.random() * (config.RES_X-10)+10);
    while(spawnX == (config.RES_X/2)){
        spawnX = Math.floor(Math.random() * (config.RES_X-10)+10);
    }
    return spawnX;
}

function createSugar(){
    if (sugarDelay == sugarSpawnDelay){        
        var sugar = new Sugar(game, getRandomX(), 0, 'sugar');
        sugars.add(sugar);
        sugarDelay = 0;
    }
    else{
        sugarDelay++;
    }
}

function createYeast(){
    if (yeastDelay == yeastSpawnDelay){        
        var yeast = new Yeast(game, getRandomX(), 0, 'yeast') ;
        yeasts.add(yeast);
        yeastDelay = 0;
    }
    else{
        yeastDelay++;
    }
}

function createMilk(){
    if(milkDelay == milkSpawnDelay){
        var milk = new Milk(game, getRandomX(), 0, 'milk');
        milks.add(milk);
        milkDelay = 0;
    }else{
        milkDelay++;
    }
}

function toggleFullScreen() {
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
    if (game.scale.isFullScreen) {
        game.scale.stopFullScreen()
    } else {
        game.scale.startFullScreen(false)
    }
}

function loadFile() {
    var text = game.cache.getText(maps[mapsCount]);
    mapsCount++;
    return text.split('\n');
}

function createMap() {
    // carrega mapa de arquivo texto
    var mapData = loadFile()

    /*
    W = wall
    S = surface
    D = deathzone
    U = unbreakable wall
    V = vortex
    */

    map = game.add.group()
    for (var row = 0; row < mapData.length; row++) {
        for (var col = 0; col < mapData[row].length; col++) {
            var tipo = mapData[row][col];
            if(tipo == 'S'){
                var swall = map.create(col*32, row*32, 'sWall');
                swall.scale.setTo(0.5, 0.5);
                game.physics.enable(swall, Phaser.Physics.ARCADE);
                swall.body.collideWorldBounds = true;
                swall.body.allowGravity = false;
                swall.body.immovable = true;
                swall.tag = 'sWall';
            }
            else if (tipo == 'W') {
                var wall = map.create(col*32, row*32, 'wall');
                wall.scale.setTo(0.5, 0.5);
                game.physics.enable(wall, Phaser.Physics.ARCADE);
                wall.body.collideWorldBounds = true;
                wall.body.allowGravity = false;
                wall.body.immovable = true;
                wall.tag = 'wall';
            } else if (tipo == 'D'){
                var deathWall = map.create(col*32, row*32, 'deathWall');
                deathWall.scale.setTo(0.5, 0.5);
                deathWall.animations.add('burn');
                deathWall.animations.play('burn',100,true);
                game.physics.enable(deathWall, Phaser.Physics.ARCADE);
                deathWall.body.collideWorldBounds = true;
                deathWall.body.allowGravity = false;
                deathWall.body.immovable = true;
                deathWall.tag = 'deathWall';
            }else if (tipo == 'V'){
                var vortex = map.create(col*32, row*32, 'vortex');
                vortex.scale.setTo(0.5, 0.5);
                vortex.animations.add('teleport');
                vortex.animations.play('teleport',10,true);
                game.physics.enable(vortex, Phaser.Physics.ARCADE);
                vortex.body.collideWorldBounds = true;
                vortex.body.allowGravity = false;
                vortex.body.immovable = true;
                vortex.tag = 'vortex';
            }else if (tipo == 'U'){
                var uwall = map.create(col*32, row*32, 'uWall');
                uwall.scale.setTo(0.5, 0.5);
                game.physics.enable(uwall, Phaser.Physics.ARCADE);
                uwall.body.collideWorldBounds = true;
                uwall.body.allowGravity = false;
                uwall.body.immovable = true;
                uwall.tag = 'uWall';
            }
        }
    }
}

function preload() {
    game.load.image('background1','assets/back1.png');
    game.load.image('background2','assets/back2.png');
    game.load.image('background3','assets/back1.png');
    game.load.image('cookie','assets/cookie.png');
    game.load.image('shot', 'assets/shot.png');
    game.load.image('specialShot', 'assets/specialShot.png');
    game.load.image('sugar', 'assets/sugar.png');
    game.load.image('yeast', 'assets/yeast.png');
    game.load.image('milk', 'assets/milk.png');
    game.load.image('splash', 'assets/splash.png');
    game.load.image('wall', 'assets/wall.png');
    game.load.image('uWall', 'assets/uwall.png');
    game.load.image('sWall', 'assets/swall.png');
    
    game.load.spritesheet('vortex','assets/teleport.png',64,64,4);
    game.load.spritesheet('deathWall','assets/deathWall.png',64,64,64);

    game.load.text('map1', 'assets/map1.txt');
    game.load.text('map2', 'assets/map2.txt');
    game.load.text('map3', 'assets/map3.txt');
}

function createPlayers(){
    player = new Player(game, game.width*2/9, game.height/2, 'cookie', 't1', {   
            left: Phaser.Keyboard.A,
            right: Phaser.Keyboard.D,
            jump: Phaser.Keyboard.W,
            fire: Phaser.Keyboard.SPACEBAR
        });

    player2 = new Player(game, game.width*7/9, game.height/7, 'cookie', 't2', {   
            left: Phaser.Keyboard.LEFT,
            right: Phaser.Keyboard.RIGHT,
            jump: Phaser.Keyboard.UP,
            fire: Phaser.Keyboard.ENTER
        });
}

function createBackground(){
    var backgroundWidth = game.cache.getImage('background'+backgroundCount).width;
    var backgroundHeight = game.cache.getImage('background'+backgroundCount).height;
    bg = game.add.tileSprite(0, 0, backgroundWidth, backgroundHeight, 'background'+backgroundCount);
    bg.scale.x = game.width/bg.width;
    bg.scale.y = game.height/bg.height;
    backgroundCount++;
}

function create(){

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 300;

    createBackground();

    createMap();

    sugars = game.add.group();
    yeasts = game.add.group();
    milks = game.add.group();

    createPlayers();
    
    var fullScreenButton = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    fullScreenButton.onDown.add(toggleFullScreen);

    hud = {
        text1: createHealthText(game.width*1/9, 50, 'PLAYER 1: 20'),
        text2: createHealthText(game.width*8/9, 50, 'PLAYER 2: 20'),
        score1: createScoreText(game.width*1/9, 80, 'MD3: '+player1Score),
        score2: createScoreText(game.width*8/9, 80, 'MD3: '+player2Score),
        textLevel: createLevelText()
    };
    updateHud();

    var fps = new FramesPerSecond(game, game.width/2, 50);
    game.add.existing(fps);
}

function createHealthText(x, y, text) {
    var style = {font: 'bold 16px Arial', fill: 'white'}
    var text = game.add.text(x, y, text, style)
    //text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
    text.stroke = '#000000';
    text.strokeThickness = 2;
    text.anchor.setTo(0.5, 0.5)
    return text
}

function createScoreText(x, y, text) {
    var style = {font: 'bold 16px Arial', fill: 'white'}
    var text = game.add.text(x, y, text, style)
    //text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
    text.stroke = '#000000';
    text.strokeThickness = 2;
    text.anchor.setTo(0.5, 0.5)
    return text
}

function createLevelText(x, y) {
    var levelNumber = 'Level '+level;
    var style = {font: 'bold 48px Arial', fill: 'white'}
    var text = game.add.text(game.width/2, game.height/2, levelNumber, style)
    //text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
    text.stroke = '#000000';
    text.strokeThickness = 2;
    text.anchor.setTo(0.5, 0.5)
    text.visible = true;
    level++;
    return text
}

function gameKillMilk(milk,wall){
    milk.killMilk();
}

function playerGetSugar(player, sugar){
    player.increasesSpeed();
    sugar.killSugar();
}

function playerGetYeast(player, yeast){
    player.increasesFireDelay();
    yeast.killYeast();
}

function playerHitByMilk(player,milk){
    player.damageTaken(milk.damage);
    milk.killMilk();
}

function sugarMapCollide(sugar, wall){
    sugar.turning = false;
    if(wall.tag == 'deathWall'){
        sugar.killSugar();
    }else if (wall.tag == 'vortex'){
        sugar.killSugar();
    }
}

function yeastMapCollide(yeast, wall){
    yeast.turning = false;
    if(wall.tag == 'deathWall'){
        yeast.killYeast();
    }else if (wall.tag == 'vortex'){
        yeast.killYeast();
    }
}

function bulletMapCollide(bullet,wall){
    if (wall.tag == 'wall'){
        wall.kill();
        bullet.killBullet();
    }else if (wall.tag == 'sWall'){
        wall.kill();
        bullet.killBullet();
    }
    else if (wall.tag == 'uWall'){
        bullet.killBullet();
    }
    else if (wall.tag == 'deathWall'){
        bullet.killBullet();
    }
}

function playerHitBySimpleBullet(player,bullet){
    player.damageTaken(bullet.damage);
    bullet.killBullet();
}

function playerHitBySpecialBullet(player,bullet){
    player.damageTaken(bullet.damage);
    bullet.killSpecialBullet();
}

function bulletHitMilk(bullet,milk){
    bullet.changeBullet();
    milk.killMilk();
}

function playerMapCollide(player,wall){
    if (wall.tag == 'deathWall'){
        player.health = 0;
    }
}

function bulletHitSugar(bullet,sugar){
    bullet.killBullet();
    sugar.killSugar();
}

function bulletHitYeast(bullet, yeast){
    bullet.killBullet();
    yeast.killYeast();
}

function playerCollisions(){
    //jogador colidindo com o mapa
    game.physics.arcade.collide(player, map, playerMapCollide);
    game.physics.arcade.collide(player2, map, playerMapCollide);

    //jogador colidindo com os colecionaveis
    game.physics.arcade.overlap(player, sugars, playerGetSugar);
    game.physics.arcade.overlap(player, yeasts, playerGetYeast);
    game.physics.arcade.overlap(player2, sugars, playerGetSugar);
    game.physics.arcade.overlap(player2, yeasts, playerGetYeast);

    //jogador colidindo com a gota de leite
    game.physics.arcade.overlap(player, milks, playerHitByMilk);
    game.physics.arcade.overlap(player2, milks, playerHitByMilk);
}

function bulletsCollisions(){
    //bala colidindo entre os jogadores
    game.physics.arcade.overlap(player,player2.bullets,playerHitBySimpleBullet);
    game.physics.arcade.overlap(player2,player.bullets,playerHitBySimpleBullet);

    //bala colidindo com o mapa
    game.physics.arcade.overlap(player.bullets,map,bulletMapCollide);
    game.physics.arcade.overlap(player2.bullets,map,bulletMapCollide);

    //bala colidindo com a gota de leite
    game.physics.arcade.overlap(player.bullets, milks, bulletHitMilk);
    game.physics.arcade.overlap(player2.bullets, milks, bulletHitMilk);

    //bala colidindo com os colecionaveis
    game.physics.arcade.collide(player.bullets, sugars, bulletHitSugar);
    game.physics.arcade.collide(player2.bullets, sugars, bulletHitSugar);

    game.physics.arcade.collide(player.bullets, yeasts, bulletHitYeast);
    game.physics.arcade.collide(player2.bullets, yeasts, bulletHitYeast);
}

function checkCollisions(){
    //gota de leite colidindo com o mapa
    game.physics.arcade.collide(milks, map, gameKillMilk);

    //açucar colidindo com o mapa
    game.physics.arcade.collide(sugars, map, sugarMapCollide);

    //fermento colidindo com o mapa
    game.physics.arcade.collide(yeasts, map, yeastMapCollide);

}

function checkDeadMilks(){
    milks.forEach(function(milk){
        if(!milk.alive){
            milk.destroy();
        }
    });
}

function checkDeadSugars(){
    sugars.forEach(function(sugar){
        if(!sugar.alive){
            sugar.destroy();
        }
    });
}

function checkDeadYeast(){
    yeasts.forEach(function(yeast){
        if(!yeast.alive){
            yeast.destroy();
        }
    });
}

function callNextStage(){
    game.state.restart();
    showLevelCount = 0;
    milkSpawnDelay = milkSpawnDelay-40;
    milkDelay = 0;
}

function update(){
    if(player1Score == 2){

    }else if (player2Score == 2){
        
    }else{
        checkDeadMilks();
        checkDeadSugars();
        checkDeadYeast();
        playerCollisions();
        bulletsCollisions();
        checkCollisions();
        updateHud();
        createMilk();
        createSugar();
        createYeast();

        if(player.alive && !player2.alive){
            player1Score++;
            callNextStage();
        }else if (player2.alive && !player.alive){
            player2Score++;
            callNextStage();
        }else if (!player.alive && !player2.alive){
            player1Score++;
            player2Score++;
            callNextStage();
        }
    }
}

function updateHud() {
    hud.text1.text = 'PLAYER 1: '+ player.health
    hud.text2.text = 'PLAYER 2: ' + player2.health
    hud.score1.text = 'MD3: '+player1Score;
    hud.score2.text = 'MD3: '+player2Score;
    if (hud.textLevel.visible == false){
        return;
    }
    else if (showLevelCount == showLevelDelay){
        hud.textLevel.visible = false;
    }else{
        showLevelCount++;
    }

}

function render(){
    game.debug.body(player);
    game.debug.body(player2);
    maps.forEach(function(obj){game.debug.body(obj)});
    milks.forEach(function(obj){game.debug.body(obj)});
    sugars.forEach(function(obj){game.debug.body(obj)});
    yeasts.forEach(function(obj){game.debug.body(obj)});
}