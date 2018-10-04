import { PlayerHudScene } from './scenes/PlayerHudScene';
import { DungeonScene } from './scenes/DungeonScene';
import { BootScene } from './scenes/BootScene';
import 'phaser';

const config: GameConfig = {
    title: "Bunch O' Dungeons",
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    canvasStyle: "visibility:hidden",
    zoom: 3,
//    pixelArt: true,
    scene: [BootScene, DungeonScene, PlayerHudScene],
    physics: {
        default: 'arcade',
        rpg: {
            gravity: { y: 0 }
        }
    }
};

export class Game extends Phaser.Game {
    constructor(config: GameConfig) {
        super(config);
    }
}

window.onload = () => {
    var game = new Game(config);
}
