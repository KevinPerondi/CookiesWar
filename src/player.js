
class Player extends Phaser.Sprite {
    constructor(game, x, y, img, pType,keys) {
        super(game, x, y, img)
        this.jumpTimer = 0;
        this.fireDelayMax = 30;
        this.fireDelay = 180;
        this.fireCount = 180;
        this.velocity = 150;
        this.health = 3;
        this.angleSpeed = 3;
        this.scale.setTo(0.1,0.1);
        this.anchor.setTo(0.5, 0.5)
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.collideWorldBounds = true;
        this.body.gravity.y = 1000;
        this.body.maxVelocity.y = 500;
        this.body.maxVelocity.x = 400;
        this.pType = pType;

        this.cursors = {
            left: game.input.keyboard.addKey(keys.left),
            right: game.input.keyboard.addKey(keys.right),
            jump: game.input.keyboard.addKey(keys.jump),
            fire: game.input.keyboard.addKey(keys.fire)
        }

        this.bullets = game.add.group();
        this.specialBullet;

        game.add.existing(this)
    }        
    
    killPlayer(){
        this.kill();
    }

    playerAlive(){
        if(this.health <= 0){
            this.kill();
        }
    }

    damageTaken(damage){
        hitSound.play();
        this.health = this.health-damage;
        this.resetPlayer();
    }

    speedReset(){
        this.velocity = 150;
    }

    increasesSpeed(){
        bufSound.play();
        if(this.playerVelocity == this.body.maxVelocity.x){
            this.velocity = this.body.maxVelocity.x;
        }else{
            this.velocity = this.velocity+50;
        }
    }

    fireDelayReset(){
        this.fireDelay = 180;
        this.fireCount = this.fireDelay;
    }

    increasesFireDelay(){
        bufSound.play();
        if (this.fireDelay == this.fireDelayMax){
            this.fireDelay = this.fireDelayMax;
        }else{
            this.fireDelay = this.fireDelay-30;
            this.fireCount = this.fireDelay;
        }
    }

    resetPlayer(){
        this.speedReset();
        this.fireDelayReset();
    }

    fireCookies(){
        if(this.cursors.fire.isDown && (this.fireCount == this.fireDelay)){
            var bullet = new Bullet(game, this.x, this.y, 'shot', this.pType);
            this.bullets.add(bullet);
            this.fireCount = 0;
            shotSound.play();
        }
        else{
            return;
        }
    }

    chancheAngleSpeed(){
        if(this.playerVelocity = 150){
            this.angleSpeed = 5;
        }
        else if(this.playerVelocity = 200){
            this.angleSpeed = 40;
        }
        else if(this.playerVelocity = 250){
            this.angleSpeed = 60;
        }
        else if(this.playerVelocity = 300){
            this.angleSpeed = 80;
        }
        else if(this.playerVelocity = 350){
            this.angleSpeed = 100;
        }
        else if(this.playerVelocity = 400){
            this.angleSpeed = 120;
        }
    }

    movePlayer(){
        this.body.velocity.x = 0;
        if (this.cursors.left.isDown){
            this.body.velocity.x = -this.velocity;
            this.angle -= this.angleSpeed;
        }
        else if (this.cursors.right.isDown){
            this.body.velocity.x = this.velocity;
            this.angle += this.angleSpeed;
        }
        
        if (this.cursors.jump.isDown && this.body.touching.down && game.time.now > this.jumpTimer){
            this.body.velocity.y = -500;
            this.jumpTimer = game.time.now + 750;
        }
    }

    checkFireDelay(){
        if (this.fireCount < this.fireDelay){
            this.fireCount++;
        }
    }

    destroyPlayer(){
        this.bullets.destroy();
        this.destroy();
    }

    update() {
        if (this.alive){
            this.playerAlive();
            this.chancheAngleSpeed();
            this.movePlayer();
            this.fireCookies();
            this.checkFireDelay();
        }
        else{
            return;
        }
    }
}