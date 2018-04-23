class Milk extends Phaser.Sprite{
    constructor(game, x, y, img){
        super(game, x, y, img)
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.collideWorldBounds = true;
        //alterando o tamanho da imagem
        this.damage = 1;
        this.scale.setTo(0.5,0.5);        
        game.add.existing(this)
    }

    killMilk(){
        this.kill();
    }
}