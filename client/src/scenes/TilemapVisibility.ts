export class TilemapVisibility {
    private _layer: Phaser.Tilemaps.DynamicTilemapLayer;
    private _activeRoom: any;

    constructor(layer: Phaser.Tilemaps.DynamicTilemapLayer) {
        this._layer = layer;
        this._activeRoom = null;
    }

    set activeRoom(value: any) {
        if (value !== this._activeRoom) {
            this.setRoomAlpha(value, 0); // Make the new room visible
            if (this._activeRoom) this.setRoomAlpha(this._activeRoom, 0.5); // Dim the old room
            this._activeRoom = value; 
        }
    }

    get activeRoom(): any {
        return this._activeRoom;
    }

    setRoomAlpha(room, alpha) {
        this._layer.forEachTile(
          t => (t.alpha = alpha),
          this,
          room.x,
          room.y,
          room.width,
          room.height
        );
    }
}