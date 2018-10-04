export class Player {
    private _sprite: Phaser.Physics.Arcade.Sprite;

    private _xp: number = 0;

    constructor(sprite?: Phaser.Physics.Arcade.Sprite) {
        this._sprite = sprite;
    }

    addXp(xp: number) {
        this._xp += xp;
    }

    get sprite(): Phaser.Physics.Arcade.Sprite {
        return this._sprite;
    }

    set sprite(value: Phaser.Physics.Arcade.Sprite) {
        this._sprite = value;
        if (this._sprite) {
            this._sprite.body.width = 24;
            this._sprite.body.height = 24;
            this._sprite.body.offset = new Phaser.Math.Vector2(0, 12);
        }
    }

    destroy(): void {
        this._sprite.destroy();
    }

    get body(): Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody {
        return this._sprite.body;
    }

    get anims(): Phaser.GameObjects.Components.Animation {
        return this._sprite.anims;
    }

    get x(): number {
        return this._sprite.x;
    }

    get y(): number {
        return this._sprite.y;
    }

    get xp(): number {
        return this._xp;
    }
}