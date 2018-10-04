import { Player } from './Player';
import { TilemapVisibility } from './TilemapVisibility';
import { Scene } from "phaser";

declare var Dungeon: any;

const DUNGEON_SIZE = 100;

export class DungeonScene extends Scene {
    private _player: Player;
    private _cursors: Phaser.Input.Keyboard.CursorKeys;
    private _groundLayer: Phaser.Tilemaps.DynamicTilemapLayer;
    private _stuff: Phaser.Tilemaps.DynamicTilemapLayer;
    private _shadowLayer: TilemapVisibility;
    private _dungeon: any;
    private _hasPlayerReachedStairs = true;

    constructor() {
        super({
            key: "DungeonScene"
        });
    }

    get player(): Player {
        return this._player;
    }

    preload(): void {
        this._player = new Player();
    }

    create(): void {
        this._dungeon = new Dungeon({
            width: DUNGEON_SIZE,
            height: DUNGEON_SIZE,
            doorPadding: 2,
            rooms: {
              width: { min: 7, max: 15, onlyOdd: true },
              height: { min: 7, max: 15, onlyOdd: true }
            }
        });
          
        // Create a blank map
        const map = this.make.tilemap({
            tileWidth: 16,
            tileHeight: 16,
            width: DUNGEON_SIZE,
            height: DUNGEON_SIZE
        });
        
        // Load up a tileset
        const tileset = map.addTilesetImage("tiles", null, 16, 16, 0, 0);

        // Create an empty layer and give it the name "ground"
        this._groundLayer = map.createBlankDynamicLayer("ground", tileset);
        this._groundLayer.scaleX = 2.5;
        this._groundLayer.scaleY = 2.5;
        this._stuff = map.createBlankDynamicLayer("stuff", tileset);
        this._stuff.scaleX = 2.5;
        this._stuff.scaleY = 2.5;
        let shadowLayer = map.createBlankDynamicLayer("shadow", tileset).fill(1378);
        shadowLayer.scaleX = 2.5;
        shadowLayer.scaleY = 2.5;
        this._shadowLayer = new TilemapVisibility(shadowLayer);

        this._dungeon.rooms.forEach(room => {
            const { x, y, width, height, left, right, top, bottom } = room;
            this._groundLayer.weightedRandomize(x + 1, y + 1, width - 2, height - 2, [
                { index: 409, weight: 95 }, // 9/10 times, use index 6
                { index: [410, 411, 412], weight: 5 } // 1/10 times, randomly pick 7, 8 or 26
            ]);
            this._groundLayer.fill(307, left, top, width - 1, 1); // Top
            this._groundLayer.fill(307, left, bottom, width, 1); // Bottom
            this._groundLayer.fill(307, left, top, 1, height - 1); // Left
            this._groundLayer.fill(307, right, top, 1, height - 1); // Right

            let doors = room.getDoorLocations();
            doors.forEach( door => {
                this._groundLayer.putTileAt(409, door.x + x, door.y + y);
            });
        });

        this._groundLayer.setCollision([-1, 307]);
//        this._stuff.setCollision([-1]);

        this._cursors = this.input.keyboard.createCursorKeys();

        let rooms = this._dungeon.rooms.slice();
        let startingRoom = rooms.shift();
        let endRoom: any = Phaser.Utils.Array.RemoveRandomElement(rooms);
        let otherRooms = Phaser.Utils.Array.Shuffle(rooms).slice(0, rooms.length * 0.9);
        otherRooms.forEach(room => {
            this._stuff.putTileAt(186, room.centerX, room.centerY);
        });
        this._shadowLayer.activeRoom = startingRoom;

        this._player.sprite = this.physics.add.sprite(startingRoom.centerX * 16 * 2.5, startingRoom.centerY * 16 * 2.5, 'chara', 48);

        this._stuff.putTileAt(1169, endRoom.centerX, endRoom.centerY);

        this.physics.add.collider(this._player.sprite, this._groundLayer);
        this.physics.add.collider(this._player.sprite, this._stuff);

        this.cameras.main.setBounds(0, 0, DUNGEON_SIZE * 16 * 2.5, DUNGEON_SIZE * 16 * 2.5);
        this.cameras.main.startFollow(this._player);
        this.cameras.main.roundPixels = true;

        this._stuff.setTileIndexCallback(1169, () => {
            this._stuff.setTileIndexCallback(1169, null, null);
            this._hasPlayerReachedStairs = true;
            // this._player.freeze();
            const cam = this.cameras.main;
            cam.fade(250, 0, 0, 0);
            cam.once("camerafadeoutcomplete", () => {
              this._player.destroy();
              this.scene.restart();
            });
        }, this);

        this._stuff.setTileIndexCallback(186, (sprite, tile) => {
            this._stuff.putTileAt(182, tile.x, tile.y);
            this._player.addXp(100);
            this.events.emit('addXp');
        }, this);

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

        this._hasPlayerReachedStairs = false;
    }

    update(): void {
        if (this._hasPlayerReachedStairs) return;
        let velocity = 120;
        if (this._cursors.shift.isDown) {
            velocity = 200;
        }

        if (this._cursors.left.isDown) {
            this._player.body.velocity.x = -velocity;
        } else if (this._cursors.right.isDown) {
            this._player.body.velocity.x = velocity;
        } else {
            this._player.body.velocity.x = 0;
        }

        if (this._cursors.up.isDown) {
            this._player.body.velocity.y = -velocity;
        } else if (this._cursors.down.isDown) {
            this._player.body.velocity.y = velocity;
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

        const playerTileX = this._groundLayer.worldToTileX(this._player.x);
        const playerTileY = this._groundLayer.worldToTileY(this._player.y);
        const playerRoom = this._dungeon.getRoomAt(playerTileX, playerTileY);    
        this._shadowLayer.activeRoom = playerRoom;
    }
}
