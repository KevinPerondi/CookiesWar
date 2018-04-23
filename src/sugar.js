class Sugar extends Phaser.Sprite{
    constructor(game, x, y, img){
        super(game, x, y, img)
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.collideWorldBounds = true;
        game.add.existing(this)
    }

    killSugar(){
        this.kill();
    }

}