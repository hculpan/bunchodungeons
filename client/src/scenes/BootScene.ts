export class BootScene extends Phaser.Scene {
    constructor() {
        super( { key: "BootScene"} );
    }

    preload(): void {
        this.load.image('tiles', 'assets/tilesets/dungeon.png')
        // this.load.image('tiles', 'assets/tilesets/tuxmon-sample-32px-extruded.png');
        // this.load.tilemapTiledJSON('map', 'assets/maps/zone1.json');
        this.load.spritesheet('chara', 'assets/sheets/chara2.png',
            {frameWidth: 26, frameHeight: 36});
    }

    create(): void {
        this.scene.start('DungeonScene');
        this.scene.start('PlayerHudScene');
    }
}