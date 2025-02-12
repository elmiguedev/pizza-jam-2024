import { Scene } from "phaser";

const WIDTH: number = 120;
const HEIGHT: number = 80;
const COLOR: number = 0x000000;

export class Platform extends Phaser.GameObjects.Rectangle {
  constructor(scene: Scene, x: number, y: number, width: number = 1) {
    super(scene, x, y, WIDTH * width, HEIGHT, COLOR);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setOrigin(0);
    // @ts-ignore
    this.body.allowGravity = false;
  }
}