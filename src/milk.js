class Milk extends Phaser.Sprite{
    constructor(game, x, y, img){
        super(game, x, y, img)
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.collideWorldBounds = true;
        this.scale.setTo(0.12,0.12);
        this.anchor.setTo(0.5,0.5);
        this.damage = 1;       
        game.add.existing(this);
    }

    killMilk(){
        this.loadTexture('splash')
        this.scale.setTo(0.4,0.4);
        this.anchor.setTo(0.5,0.5);
        this.kill();
    }
}