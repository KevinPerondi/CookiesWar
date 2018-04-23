
class Player extends Phaser.Sprite {
    constructor(game, x, y, img, pType,keys) {
        super(game, x, y, img)
        this.jumpTimer = 0;
        this.fireDelayMax = 60;
        this.fireDelay = 360;
        this.fireCount = 360;
        this.playerVelocity = 150;
        this.playerVelocityMax = 400;
        this.health = 20;
        this.anchor.setTo(0.5, 0.5)
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.collideWorldBounds = true;
        this.body.gravity.y = 1000;
        this.body.maxVelocity.y = 500;
        this.body.setSize(20, 32, 5, 16);
        this.pType = pType;

        this.cursors = {
            left: game.input.keyboard.addKey(keys.left),
            right: game.input.keyboard.addKey(keys.right),
            jump: game.input.keyboard.addKey(keys.jump),
            fire: game.input.keyboard.addKey(keys.fire)
        }

        this.bullet;
        this.specialBullet;

        game.add.existing(this)
    }        
    
    playerAlive(){
        if(this.health <= 0){
            this.kill();
        }
    }

    damageTaken(damage){
        this.health = this.health-damage;
        this.resetPlayer();
    }

    speedReset(){
        this.playerVelocity = 150;
    }

    increasesSpeed(){
        if(this.playerVelocity == this.playerVelocityMax){
            return;
        }else{
            this.playerVelocity = this.playerVelocity+50;
        }
    }

    fireDelayReset(){
        this.fireDelay = 360;
        this.fireCount = this.fireDelay;
    }

    increasesFireDelay(){
        if (this.fireDelay == this.fireDelayMax){
            return;
        }else{
            this.fireDelay = this.fireDelay-60;
            this.fireCount = this.fireDelay;
        }
    }

    resetPlayer(){
        this.speedReset();
        this.fireDelayReset();
    }

    fireCookies(){
        if(this.cursors.fire.isDown && (this.fireCount == this.fireDelay)){
            this.bullet = new Bullet(game, this.x, this.y, 'shot', this.pType);
            this.fireCount = 0;
        }
        else{
            return;
        }
    }

    movePlayer(){
        this.body.velocity.x = 0;
        if (this.cursors.left.isDown){
            this.body.velocity.x = -this.playerVelocity;
        }
        else if (this.cursors.right.isDown){
            this.body.velocity.x = this.playerVelocity;
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

    update() {
        if (this.alive){
            this.playerAlive();
            this.movePlayer();
            this.fireCookies();
            this.checkFireDelay();
        }
        else{
            return;
        }
        //this.fireBullet()
    }
}