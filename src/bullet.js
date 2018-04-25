class Bullet extends Phaser.Sprite{
    constructor(game, x, y, img, pType){
        super(game, x, y, img)
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.damage = 1;
        this.bulletSpeed = 5;
        this.playerType = pType;
        this.scale.setTo(0.4,0.4);
        this.anchor.setTo(0.5,0.5);
        this.angleSpeed = 1;
        game.add.existing(this);
    }

    killBullet(){
        this.kill();
    }

    bulletTragectory(){
        if(this.playerType == 't1'){
            this.x = this.x + this.bulletSpeed;
            this.y = this.y - this.bulletSpeed;
        }else if(this.playerType == 't2'){
            this.x = this.x - this.bulletSpeed;
            this.y = this.y - this.bulletSpeed;            
        }

    }

    changeBullet(){
        this.damage = 5;
        this.loadTexture('specialShot')
        this.scale.setTo(0.4,0.4);
        this.anchor.setTo(0.5,0.5);
        this.angleSpeed = 3;
    }

    update(){
        this.bulletTragectory();
        this.angle = this.angle+this.angleSpeed;
    }
}