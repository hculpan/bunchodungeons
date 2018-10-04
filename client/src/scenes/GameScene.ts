import { Scene } from "phaser";

const TILE_WIDTH = 32;
const TILE_HEIGHT = 24;

export class GameScene extends Scene {

    constructor() {
        super({
            key: "GameScene"
        });
    }

    preload(): void {
        this.load.spritesheet('chara', 'assets/sheets/chara2.png',
            {frameWidth: 26, frameHeight: 36});
    }

    private _player: Phaser.Physics.Arcade.Sprite;
    private _map: Phaser.Tilemaps.Tilemap;
    private _cursors: Phaser.Input.Keyboard.CursorKeys;
    private _paths: Phaser.Tilemaps.DynamicTilemapLayer;
    private _spawns: Phaser.Physics.Arcade.Group;
    private _flowerTriggered: boolean = false;

    create(): void {
        this._map = this.make.tilemap({ key: 'map' });

        var tiles = this._map.addTilesetImage('tuxmon-sample-32px-extruded', 'tiles');
        var grass = this._map.createStaticLayer('Grass', tiles, 0, 0);
        this._paths = this._map.createDynamicLayer('Paths', tiles, 0, 0);
        this._paths.setCollisionByExclusion([-1]);

        let spawnPoint = this._map.findObject("Objects", obj => obj.name === "Spawn Point");
        this._player = this.physics.add.sprite(spawnPoint['x'], spawnPoint['y'], 'chara', 48);

        this.physics.world.bounds.width = 1024; //this._map.widthInPixels;
        this.physics.world.bounds.height = 768; //this._map.heightInPixels;
        this._player.setCollideWorldBounds(true);

        this._cursors = this.input.keyboard.createCursorKeys();

        this.cameras.main.setBounds(0, 0, this._map.widthInPixels, this._map.heightInPixels);
        this.cameras.main.startFollow(this._player);
        this.cameras.main.roundPixels = true;

        this.physics.add.collider(this._player, this._paths);

        let triggerPoint = this._map.findObject("Objects", obj => obj.name === "Trigger Point");
        this._spawns = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        this._spawns.create(triggerPoint['x'], triggerPoint['y'], triggerPoint['width'], triggerPoint['height']);
        this.physics.add.overlap(this._player, this._spawns, this.triggerFlower, null, this);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('chara', { frames: [60, 61, 62, 61]}),
            frameRate: 10,
            repeat: -1
        });
 
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('chara', { frames: [72, 73, 74, 73]}),
            frameRate: 10,
            repeat: -1
        });
 
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('chara', { frames: [84, 85, 86, 85]}),
            frameRate: 10,
            repeat: -1
        });
 
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('chara', { frames: [48, 49, 50, 49]}),
            frameRate: 10,
            repeat: -1
        });
 
    }

    private triggerFlower(player, zone): void {
        if (this._flowerTriggered) return;

        this._paths.putTileAt(481, 35, 6);
        this._paths.putTileAt(482, 36, 6);
        this._paths.putTileAt(529, 35, 7);
        this._paths.putTileAt(530, 36, 7);

        this._flowerTriggered = true;
    }

    update(): void {
        if (this._cursors.left.isDown) {
            this._player.body.velocity.x = -120;
        } else if (this._cursors.right.isDown) {
            this._player.body.velocity.x = 120;
        } else {
            this._player.body.velocity.x = 0;
        }

        if (this._cursors.up.isDown) {
            this._player.body.velocity.y = -120;
        } else if (this._cursors.down.isDown) {
            this._player.body.velocity.y = 120;
        } else {
            this._player.body.velocity.y = 0;
        }

        if (this._cursors.left.isDown) {
            this._player.anims.play('left', true);
        } else if (this._cursors.right.isDown) {
            this._player.anims.play('right', true);
        } else if (this._cursors.up.isDown) {
            this._player.anims.play('up', true);
        } else if (this._cursors.down.isDown) {
            this._player.anims.play('down', true);
        } else {
            this._player.anims.stop();
        }
    }
}