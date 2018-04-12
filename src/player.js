
class Player extends Phaser.Sprite {
    constructor(game, x, y, img, keys) {
        super(game, x, y, img)
        this.health = config.PLAYER_HEALTH
        this.anchor.setTo(0.5, 0.5)
        //game.physics.arcade.enable(this)//professor
        game.physics.enable(this, Phaser.Physics.ARCADE);//phaser
        player.body.collideWorldBounds = true;
        player.body.gravity.y = 1000;
        player.body.maxVelocity.y = 500;
        player.body.setSize(20, 32, 5, 16);

        this.cursors = {
            left: game.input.keyboard.addKey(keys.left),
            right: game.input.keyboard.addKey(keys.right),
            jump: game.input.keyboard.addKey(keys.jump),
            fire: game.input.keyboard.addKey(keys.fire)
        }
    
        //player.animations.add('left', [0, 1, 2, 3], 10, true);
        //player.animations.add('turn', [4], 20, true);
        //player.animations.add('right', [5, 6, 7, 8], 10, true);
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
    
    movePlayer(){
        player.body.velocity.x = 0;
        if (cursors.left.isDown){
            player.body.velocity.x = -150;

            /*if (facing != 'left'){
                player.animations.play('left');
                facing = 'left';
            }*/
        }
        else if (cursors.right.isDown){
            player.body.velocity.x = 150;

            /*if (facing != 'right'){
                player.animations.play('right');
                facing = 'right';
            }*/
        }
        else{
            /*if (facing != 'idle'){
                player.animations.stop();
                if (facing == 'left'){
                    player.frame = 0;
                }
                else{
                    player.frame = 5;
                }
                facing = 'idle';
            }*/
        }
        
        if (cursors.jump.isDown && player.body.onFloor() && game.time.now > jumpTimer){
            player.body.velocity.y = -500;
            jumpTimer = game.time.now + 750;
        }
    }

    update() {
        this.movePlayer();        
        //this.moveAndTurn()
        //this.fireBullet()
    }
}