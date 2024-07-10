export class Obstacle extends Phaser.Physics.Arcade.Sprite {

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    // @ts-ignore
    this.setOrigin(0);
    this.setScale(10);
    this.anims.createFromAseprite(texture);
    this.anims.play("idle");
  }
}