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
config.RES_Y = 720;

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
    D = deathzone
    U = unbreakable wall
    V = vortex
    */

    map = game.add.group()
    for (var row = 0; row < mapData.length; row++) {
        for (var col = 0; col < mapData[row].length; col++) {
            var tipo = mapData[row][col];
            var param = '';

            if (tipo == 'W') {
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
                game.physics.enable(deathWall, Phaser.Physics.ARCADE);
                deathWall.body.immovable = true;
                deathWall.body.collideWorldBounds = true;
                deathWall.body.allowGravity = false;
                deathWall.tag = 'deathWall';
            }else if (tipo == 'V'){
                var vortex = map.create(col*32, row*32, 'vortex');
                vortex.scale.setTo(0.5, 0.5);
                game.physics.enable(vortex, Phaser.Physics.ARCADE);
                vortex.body.collideWorldBounds = true;
                vortex.body.allowGravity = false;
                vortex.body.immovable = true;
                vortex.tag = 'vortex';
            }else if (tipo == 'U'){
                var uwall = map.create(col*32, row*32, 'uwall');
                uwall.scale.setTo(0.5, 0.5);
                game.physics.enable(uwall, Phaser.Physics.ARCADE);
                uwall.body.collideWorldBounds = true;
                uwall.body.allowGravity = false;
                uwall.body.immovable = true;
                uwall.tag = 'uwall';
            }
        }
    }
}

function preload() {
    game.load.image('background','assets/background1.png')
    game.load.image('p1','assets/airplane1.png')
    game.load.image('shot', 'assets/shot.png')
    game.load.image('specialShot', 'assets/specialShot.png')
    game.load.image('sugar', 'assets/sugar.png')
    game.load.image('yeast', 'assets/yeast.png')
    game.load.image('milk', 'assets/milk.png')
    game.load.image('wall', 'assets/wall.png')
    game.load.image('deathWall', 'assets/deathWall.png')
    game.load.image('uwall', 'assets/uwall.png')
    game.load.image('vortex', 'assets/vortex.png')
    game.load.text('map1', 'assets/map1.txt');
    game.load.text('map2', 'assets/map2.txt');
    game.load.text('map3', 'assets/map3.txt');
}

function create(){

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 300;

    var backgroundWidth = game.cache.getImage('background').width;
    var backgroundHeight = game.cache.getImage('background').height;
    bg = game.add.tileSprite(0, 0, backgroundWidth, backgroundHeight, 'background');
    bg.scale.x = game.width/bg.width;
    bg.scale.y = game.height/bg.height;

    createMap();

    player = new Player(game, game.width*2/9, game.height/2, 'p1', 't1', {   
            left: Phaser.Keyboard.LEFT,
            right: Phaser.Keyboard.RIGHT,
            jump: Phaser.Keyboard.UP,
            fire: Phaser.Keyboard.SPACEBAR
        });

    player2 = new Player(game, game.width*7/9, game.height/7, 'p1', 't2', {   
            left: Phaser.Keyboard.A,
            right: Phaser.Keyboard.D,
            jump: Phaser.Keyboard.W,
            fire: Phaser.Keyboard.S
        });

    sugars = game.add.group();
    yeasts = game.add.group();
    milks = game.add.group();
    
    var fullScreenButton = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    fullScreenButton.onDown.add(toggleFullScreen);

    hud = {
        text1: createHealthText(game.width*1/9, 50, 'PLAYER 1: 20'),
        text2: createHealthText(game.width*8/9, 50, 'PLAYER 2: 20'),
        fps: createHealthText(game.width*6/9, 50, 'FPS'),
    };
    updateHud();

    var fps = new FramesPerSecond(game, game.width*3/9, 50);
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
    if(wall.tag == 'deathWall'){
        sugar.killSugar();
    }
}

function yeastMapCollide(yeast, wall){
    if(wall.tag == 'deathWall'){
        yeast.killYeast();
    }
}

function bulletMapCollide(bullet,wall){
    if (wall.tag == 'wall'){
        wall.kill();
        bullet.killBullet();
    }else if (wall.tag == 'uwall'){
        bullet.killBullet();
    }
    else if (wall.tag == 'deathWall'){
        bullet.killBullet();
    }
}

function bothBulletsCollide(b1,b2){
    b1.killBullet();
    b2.killBullet();
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

function checkCollisions(){
    //tudo colidindo com o mapa
    game.physics.arcade.collide(player, map);
    game.physics.arcade.collide(player2, map);
    game.physics.arcade.collide(milks, map, gameKillMilk);
    game.physics.arcade.collide(sugars, map, sugarMapCollide);
    game.physics.arcade.collide(yeasts, map, yeastMapCollide);

    //players collisions with collectibles
    game.physics.arcade.collide(player, sugars, playerGetSugar);
    game.physics.arcade.collide(player, yeasts, playerGetYeast);

    game.physics.arcade.collide(player2, sugars, playerGetSugar);
    game.physics.arcade.collide(player2, yeasts, playerGetYeast);

    //players collides with milk
    game.physics.arcade.collide(player, milks, playerHitByMilk);
    game.physics.arcade.collide(player2, milks, playerHitByMilk);

    //bullets collisions
    game.physics.arcade.collide(player,player2.bullet,playerHitBySimpleBullet);
    game.physics.arcade.collide(player2,player.bullet,playerHitBySimpleBullet);

    game.physics.arcade.overlap(player.bullet,map,bulletMapCollide);
    game.physics.arcade.overlap(player2.bullet,map,bulletMapCollide);

    //bullet collides with milk
    game.physics.arcade.overlap(player.bullet, milks, bulletHitMilk);
    game.physics.arcade.overlap(player2.bullet, milks, bulletHitMilk);


}

function update(){
    hud.fps.text = `FPS ${game.time.fps}`
    updateHud();
    checkCollisions();
    createMilk();
    createSugar();
    createYeast();
}

function updateHud() {
    hud.text1.text = 'PLAYER 1: '+ player.health
    hud.text2.text = 'PLAYER 2: ' + player2.health
}

function render(){
    game.debug.body(player);
    game.debug.body(player2);
    //game.debug.bodyInfo(player);
}


/*var sky
var fog
var player1
var player2
var hud
var map
var obstacles

var game = new Phaser.Game(config.RES_X, config.RES_Y, Phaser.CANVAS, 
    'game-container',
    {   
        preload: preload,
        create: create,
        update: update,
        render: render
    })

function preload() {
    game.load.image('saw', 'assets/saw.png')
    game.load.image('sky', 'assets/sky.png')
    game.load.image('plane1', 'assets/airplane1.png')
    game.load.image('shot', 'assets/shot.png')
    game.load.image('wall', 'assets/wall.png')
    game.load.image('fog', 'assets/fog.png')
    game.load.text('map1', 'assets/map1.txt');  // arquivo txt do mapa
}

function createBullets() {
    var bullets = game.add.group()
    bullets.enableBody = true
    bullets.physicsBodyType = Phaser.Physics.ARCADE
    bullets.createMultiple(10, 'shot')
    bullets.setAll('anchor.x', 0.5)
    bullets.setAll('anchor.y', 0.5)
    return bullets
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE)

    var skyWidth = game.cache.getImage('sky').width
    var skyHeight = game.cache.getImage('sky').height
    sky = game.add.tileSprite(
        0, 0, skyWidth, skyHeight, 'sky')
    sky.scale.x = game.width/sky.width
    sky.scale.y = game.height/sky.height

    fog = game.add.tileSprite(
        0, 0, game.width, game.height, 'fog')
    fog.tileScale.setTo(7,7)
    fog.alpha = 0.4
    
    obstacles = game.add.group()
    createMap()

    player1 = new Player(game, game.width*2/9, game.height/2, 
                        'plane1', 0xff0000, createBullets(), {   
            left: Phaser.Keyboard.LEFT,
            right: Phaser.Keyboard.RIGHT,
            up: Phaser.Keyboard.UP,
            down: Phaser.Keyboard.DOWN,
            fire: Phaser.Keyboard.L
        })
    player2 = new Player(game, game.width*7/9, game.height/2, 
                        'plane1', 0x00ff00, createBullets(), {   
            left: Phaser.Keyboard.A,
            right: Phaser.Keyboard.D,
            up: Phaser.Keyboard.W,
            down: Phaser.Keyboard.S,
            fire: Phaser.Keyboard.G
        })
    game.add.existing(player1)
    game.add.existing(player2)
    player2.angle = 180

    hud = {
        text1: createHealthText(game.width*1/9, 50, 'PLAYER 1: 20'),
        text2: createHealthText(game.width*8/9, 50, 'PLAYER 2: 20'),
        fps: createHealthText(game.width*6/9, 50, 'FPS'),
    }
    updateHud()

    var fps = new FramesPerSecond(game, game.width*3/9, 50)
    game.add.existing(fps)

    var fullScreenButton = game.input.keyboard.addKey(Phaser.Keyboard.ONE)
    fullScreenButton.onDown.add(toggleFullScreen)

    game.time.advancedTiming = true;
}

function loadFile() {
    var text = game.cache.getText('map1');
    return text.split('\n');
}

function createMap() {
    // carrega mapa de arquivo texto
    var mapData = loadFile()

    map = game.add.group()
    for (var row = 0; row < mapData.length; row++) {
        for (var col = 0; col < mapData[row].length; col++) {
            var tipo = mapData[row][col]
            var param = ''
            if (col+1 < mapData[row].length) {
                param = mapData[row][col+1]
            }
            if (tipo == 'X') {
                var wall = map.create(col*32, row*32, 'wall')
                wall.scale.setTo(0.5, 0.5)
                game.physics.arcade.enable(wall)
                wall.body.immovable = true
                wall.tag = 'wall'
            } else
            if (tipo == 'S') {
                var saw = new Saw(game, col*32, row*32, 'saw', param) 
                //game.add.existing(saw)
                obstacles.add(saw)
            }
        }
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

function createHealthText(x, y, text) {
    var style = {font: 'bold 16px Arial', fill: 'white'}
    var text = game.add.text(x, y, text, style)
    //text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
    text.stroke = '#000000';
    text.strokeThickness = 2;
    text.anchor.setTo(0.5, 0.5)
    return text
}

function updateBullets(bullets) {
    bullets.forEach(function(bullet) {
        game.world.wrap(bullet, 0, true)
    })
}

function update() {
    hud.fps.text = `FPS ${game.time.fps}`

    sky.tilePosition.x += 0.5
    fog.tilePosition.x += 0.3
 
    //moveAndStop(player1)
    updateBullets(player1.bullets)
    updateBullets(player2.bullets)

    game.physics.arcade.collide(player1, player2)
    game.physics.arcade.collide(
        player1, player2.bullets, hitPlayer)
    game.physics.arcade.collide(
        player2, player1.bullets, hitPlayer)

    game.physics.arcade.collide(player1, map)
    game.physics.arcade.collide(player2, map)
    game.physics.arcade.collide(
        player1.bullets, map, killBullet)
    game.physics.arcade.collide(
        player2.bullets, map, killBullet)
}

function killBullet(bullet, wall) {
    //wall.kill()
    bullet.kill()
}

function hitPlayer(player, bullet) {
    if (player.alive) {
        player.damage(1)
        bullet.kill()
        updateHud()
    }
}

function updateHud() {
    hud.text1.text = `PLAYER 1: ${player1.health}`
    hud.text2.text = 'PLAYER 2: ' + player2.health
}

function render() {
    obstacles.forEach( function(obj) {
        game.debug.body(obj)
    })
    //game.debug.body(player1)
    //game.debug.body(player2)
}*/