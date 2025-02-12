import { Game } from "phaser";
import { BootloaderScene } from "./scenes/BootloaderScene";
import { GameScene } from "./scenes/GameScene";
import { StartScene } from "./scenes/StartScene";
import { GameOverScene } from "./scenes/GameOverScene";
import { CreditsScene } from "./scenes/CreditsScene";
import { GameHud } from "./entities/GameHud";
import { LEVEL_GRAVITY } from "./constants";

export default new Game({
  type: Phaser.AUTO,
  parent: "#canvas",
  width: 1280,
  height: 720,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: {
        y: LEVEL_GRAVITY,
        x: 0
      }
    }
  },
  render: {
    pixelArt: true
  },
  backgroundColor: "#000000",
  scene: [
    BootloaderScene,
    GameScene,
    GameHud,
    StartScene,
    GameOverScene,
    CreditsScene,
  ]
})