class Bullet extends Phaser.Sprite{
    constructor(game, x, y, img){
        super(game, x, y, img)
        game.physics.enable(this, Phaser.Physics.ARCADE);
    }

    killBullet(){
        this.kill();
    }



    update(){
          
    }
}