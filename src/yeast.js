class Yeast extends Phaser.Sprite{
    constructor(game, x, y, img){
        super(game, x, y, img)
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.collideWorldBounds = true;
        this.scale.setTo(0.13, 0.13);
        this.anchor.setTo(0.5,0.5);
        this.turning = true;
        this.lifeDelay = 600;
        this.lifeDelayCount = 0;
        this.body.gravity.y = -200;
        game.add.existing(this)
    }

    killYeast(){
        this.kill();
    }

    update(){
        if(this.lifeDelayCount == this.lifeDelay){
            this.killYeast();
        }
        if(this.turning){
            this.angle += 2;
        }
        this.lifeDelayCount++;
    }

}