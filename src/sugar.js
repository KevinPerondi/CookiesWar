class Sugar extends Phaser.Sprite{
    constructor(game, x, y, img){
        super(game, x, y, img)
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.collideWorldBounds = true;
        this.scale.setTo(1.2,1.2);
        this.anchor.setTo(0.5,0.5);
        this.turning = true;
        this.lifeDelay = 600;
        this.lifeDelayCount = 0;
        this.body.gravity.y = -200;
        game.add.existing(this);
    }

    killSugar(){
        this.kill();
    }

    update(){
        if(this.lifeDelayCount == this.lifeDelay){
            this.killSugar();
        }
        if(this.turning){
            this.angle += 2;
        }
        this.lifeDelayCount++;
    }

}