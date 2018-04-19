
class Player extends Phaser.Sprite {
    constructor(game, x, y, img, keys) {
        super(game, x, y, img)
        this.fireDelay = 360;
        this.fireCount = 0;
        this.playerVelocity = 150;
        //this.health = config.PLAYER_HEALTH
        this.anchor.setTo(0.5, 0.5)
        //game.physics.arcade.enable(this)//professor
        game.physics.enable(this, Phaser.Physics.ARCADE);//phaser
        this.body.collideWorldBounds = true;
        this.body.gravity.y = 1000;
        this.body.maxVelocity.y = 500;
        this.body.setSize(20, 32, 5, 16);

        this.cursors = {
            left: game.input.keyboard.addKey(keys.left),
            right: game.input.keyboard.addKey(keys.right),
            jump: game.input.keyboard.addKey(keys.jump),
            fire: game.input.keyboard.addKey(keys.fire)
        }
    
    }        

    // move e rotaciona, como em Asteroids
    /*moveAndTurn() {
        // define aceleracao pela rotacao (radianos) do sprite
        if (this.cursors.up.isDown) {
            game.physics.arcade.accelerationFromRotation(
                this.rotation, config.PLAYER_ACCELERATION, this.body.acceleration
            )
        } else {
            // precisa anular campo "acceleration" caso nao pressione UP
            this.body.acceleration.set(0)
        }

        // rotaciona
        if (this.cursors.left.isDown) {
            this.body.angularVelocity = -config.PLAYER_TURN_VELOCITY
        } else
        if (this.cursors.right.isDown) {
            this.body.angularVelocity = config.PLAYER_TURN_VELOCITY
        } else {
            this.body.angularVelocity = 0
        }

        // atravessa bordas da tela (usando phaser built-in)
        game.world.wrap(this, 0, true)
    }   */
    
    /*fireBullet() {
        if (!this.alive)
            return;
    
        if (this.cursors.fire.isDown) {
            if (this.game.time.time > this.nextFire) {
                var bullet = this.bullets.getFirstExists(false)
                if (bullet) {
                    bullet.reset(this.x, this.y)
                    bullet.lifespan = config.BULLET_LIFE_SPAN
                    bullet.rotation = this.rotation
                    bullet.body.bounce.setTo(1,1)
                    bullet.body.friction.setTo(0,0)
                    game.physics.arcade.velocityFromRotation(
                        bullet.rotation + game.rnd.realInRange(-config.BULLET_ANGLE_ERROR, config.BULLET_ANGLE_ERROR), 
                        config.BULLET_VELOCITY, bullet.body.velocity
                    )
                    // fire rate
                    this.nextFire = this.game.time.time + config.BULLET_FIRE_RATE
                }
            }
        }    
    } */
    
    fireCookies(){
        if(!this.alive){
            return;
        }
        else{
            if(this.cursors.fire.isDown && (this.fireCount == this.fireDelay)){
                var bullet = new Bullet(game, this.x, this.y, 'shot')
                bullet.kill();
                //atira e reseta o contador
                this.fireCount = 0;
                //lembrar de voltar pro sprite sem bala!
                console.log("MANDEI BIXKOITO");
            }
            else{
                return;
            }
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
        
        if (this.cursors.jump.isDown && this.body.onFloor() && game.time.now > jumpTimer){
            this.body.velocity.y = -500;
            jumpTimer = game.time.now + 750;
        }
    }

    checkFireDelay(){
        if (this.fireCount < this.fireDelay){
            this.fireCount++;
        }
    }

    update() {
        this.checkFireDelay();
        this.movePlayer();
        this.fireCookies();      
        //this.moveAndTurn()
        //this.fireBullet()
    }
}