import { DungeonScene } from './DungeonScene';
import { Scene } from "phaser";

export class PlayerHudScene extends Scene {
    constructor() {
        super({
            key: "PlayerHudScene"
        });
    }

    preload(): void {

    }

    create(): void {
        let graphics = this.add.graphics();
        graphics.lineStyle(5, 0xFF00FF, 1.0);
        graphics.fillStyle(0xFFFFFF, 1.0);
        graphics.fillRect(5, 5, 120, 25);

        let info = this.add.text(10, 7, 'XP: 0', { font: '20px Arial', fill: '#000000' });

        let dungeonScene: any = this.scene.get("DungeonScene");
        dungeonScene.events.on('addXp', function() {
            info.setText('XP: ' + dungeonScene.player.xp);
        }, this);
    }

    update(): void {

    }
}