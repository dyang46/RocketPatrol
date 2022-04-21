//Donging Yang
//dyang46@ucsc.edu
//pirate ship hunter
//4/20/2022
//This project took me about 7-8 hours. 

// Grade Break Down:
// tot

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play]
}

//game difinition
let game = new Phaser.Game(config);

//UI
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let keyF, keyR, keyLEFT, keyRIGHT;
