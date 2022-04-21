class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    preload() {
        this.load.image('rocket', './assets/canon.png');
        this.load.spritesheet('ship', './assets/ship.png', {frameWidth: 150, frameHeight: 70, startFrame: 0, endFrame: 3});
        this.load.spritesheet('spaceship', './assets/p2.png', {frameWidth: 170, frameHeight: 70, startFrame: 0, endFrame: 2});
        this.load.image('starfield', './assets/s.png');
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        //explosion.png from https://github.com/nathanaltice/RocketPatrol/tree/master/assets

    }
    create() {
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x0000).setOrigin(0, 0);
        
        
        this.anims.create({
            key: 's1',            
            frames: this.anims.generateFrameNumbers('ship', {start: 0, end: 3, first: 0}),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 's2',            
            frames: this.anims.generateFrameNumbers('spaceship', {start: 0, end: 2, first: 0}),
            frameRate: 3,
            repeat: -1
        });
        //let miku = this.add.sprite(50, 50 ,'miku').setOrigin(0, 0);
        //miku.anims.play('s1');
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        this.ship03 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'ship', 0, 10).setOrigin(0, 0);
        this.ship03.play('s1');
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'ship', 0, 20).setOrigin(0,0);
        this.ship02.play('s1');
        this.ship01 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'ship', 0, 30).setOrigin(0,0);
        this.ship01.play('s1');
        //a smaller ship with faster speed and more points.
        this.ship04 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 50).setOrigin(0,0);
        this.ship04.setScale(0.7);
        this.ship04.play('s2');
        this.ship04.moveSpeed = 12;
        
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        //animation
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        this.p1Score = 0;
        this.p1Fire = 0;
         // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            //backgroundColor: '#E3E4FA',
            color: '#B21807',
            align: 'left',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }
        let fireConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            //backgroundColor: '#E3E4FA',
            color: '#B21807',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }
        this.fire = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, 'SCORE:', fireConfig);
        this.scoreLeft = this.add.text(borderUISize + borderPadding*12, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        this.fire = this.add.text(borderUISize + borderPadding*32, borderUISize + borderPadding*2, 'FIRE: ', fireConfig);
        this.fireRight = this.add.text(borderUISize + borderPadding*42, borderUISize + borderPadding*2, this.p1Fire, scoreConfig);
        //game over
        this.gameOver =false;
        // clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(60000, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }
    update() {
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
            
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        if(!this.gameOver){
            this.p1Rocket.update();
            //this.s1.update();
            this.ship01.update();               
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
        }
        this.starfield.tilePositionX -= 4;
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
            //console.log('kaboom ship 03');
          }
          if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
            //console.log('kaboom ship 02');
          }
          if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
            //console.log('kaboom ship 01');
          }
          if (this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship04);
            //console.log('kaboom ship 01');
          }
    }
    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }
    
    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();                         // reset ship position
          ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        });  
        this.p1Score += ship.points;
        this.p1Fire +=1;
        this.scoreLeft.text = this.p1Score;
        this.fireRight.text = this.p1Fire;
        this.sound.play('sfx_explosion');
      }

}