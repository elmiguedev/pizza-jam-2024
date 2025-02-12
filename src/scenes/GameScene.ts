import { Scene } from "phaser";
import { Player } from "../entities/Player";
import { GameHud } from "../entities/GameHud";
import { CoffeeItem } from "../entities/items/CoffeeItem";
import { COFFEE_LEVEL, INITIAL_COFFEE_LEVEL, INITIAL_LEVEL_VELOCITY, ITEMS_HEIGHT, LEVEL_RAIDS, LEVEL_VELOCITIES, SHADOW_VELOCITY, TIMER_DELAY } from "../constants";
import { Utils } from "../utlis/Utils";
import { RaidFactory } from "../entities/raids/RaidFactory";
import { SoundManager } from "../utlis/SoundManager";
import { TypingText } from "../entities/ui/TypingText";

export class GameScene extends Scene {
  private platforms: Phaser.Physics.Arcade.Group
  private obstacles: Phaser.Physics.Arcade.Group
  private items: Phaser.Physics.Arcade.Group
  private player: Player;
  private jumpKey: Phaser.Input.Keyboard.Key;
  private upKey: Phaser.Input.Keyboard.Key;
  private hud: GameHud;
  private timer: number = 0;
  private levelVelocity = INITIAL_LEVEL_VELOCITY;
  private coffeeLevel = INITIAL_COFFEE_LEVEL;
  private spotlight: Phaser.GameObjects.Arc;
  private gameTimer: Phaser.Time.TimerEvent;
  private coffeTimer: Phaser.Time.TimerEvent;

  constructor() {
    super({
      key: 'GameScene',
    });
  }

  public create() {
    this.initValues();
    this.createCamera();
    this.createPlatforms();
    this.createPlayer();
    this.createObstacles();
    this.createItems();
    this.createInput();
    this.createTimer();
    this.createCollisions();
    this.createShadow();
    this.createHud();
    this.createMusic();
  }

  private createItems() {
    this.items = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });
  }

  private initValues() {
    this.timer = 0;
    this.levelVelocity = INITIAL_LEVEL_VELOCITY;
    this.coffeeLevel = INITIAL_COFFEE_LEVEL;
  }

  private createCamera() {
    this.cameras.main.setBackgroundColor(0xffffff);
  }

  private createPlatforms() {

    const x = this.game.canvas.width / 2;
    const y = this.game.canvas.height - 40;

    this.platforms = this.physics.add.group({
      immovable: true,
      allowGravity: false
    });

    const floor = this.add.rectangle(
      x,
      y,
      this.game.canvas.width,
      12,
      0x16171a
    );

    this.platforms.add(floor);
  }

  private createObstacles() {
    this.obstacles = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });
  }

  private createPlayer() {
    const x = this.game.canvas.width / 2;
    this.player = new Player(this, x, 594);
  }

  private createCollisions() {
    this.physics.add.collider(this.player, this.platforms, () => {
      if (this.player.body.blocked.right) {
        this.gameOver();
      }
    });
    this.physics.add.collider(this.player, this.obstacles, () => {
      this.gameOver();
    });
    this.physics.add.overlap(this.player, this.items, (p, i) => {
      if (i instanceof CoffeeItem) {
        SoundManager.getInstance(this).playCoffee();
        this.time.addEvent({
          repeat: COFFEE_LEVEL,
          delay: 1,
          callback: () => {
            this.coffeeLevel++;
          }
        })
        i.destroy();
      }
    })
  }

  private createInput() {
    this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.jumpKey.on('down', () => {
      this.player.jump();
    })
    this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.upKey.on('down', () => {
      this.player.jump();
    })
  }

  private createHud() {
    this.scene.run("GameHud");
    this.hud = this.scene.get("GameHud") as GameHud;
  }

  private createTimer() {
    this.gameTimer = this.time.addEvent({
      delay: TIMER_DELAY,
      callback: () => {
        this.timer++;
        this.hud.updateTimer(this.timer);
        this.checkRaid();
        this.checkVelocity();
      },
      loop: true
    })
  }

  private checkRaid() {
    const timerText = Utils.getTimeText(this.timer);
    const raids = LEVEL_RAIDS[timerText];
    if (raids) {
      RaidFactory.createRaid(this, raids[0], this.obstacles, this.levelVelocity, this.hud, this.platforms, this.items, this.win.bind(this));
    }
  }

  private checkVelocity() {
    const timerText = Utils.getTimeText(this.timer);
    const velocity = LEVEL_VELOCITIES[timerText];
    if (velocity) {
      this.levelVelocity = velocity;
    }
  }

  private gameOver() {
    this.sound.stopAll();
    SoundManager.getInstance(this).playHit();
    this.coffeTimer.destroy();
    this.gameTimer.destroy();
    this.physics.pause();
    this.time.delayedCall(2000, () => {
      this.scene.restart();
    })
  }

  private createShadow() {
    const shadow = this.add.rectangle(
      0,
      0,
      this.game.canvas.width,
      this.game.canvas.height,
      0x000000, 0.5
    ).setDepth(10).setOrigin(0, 0);

    this.spotlight = this.add.circle(
      this.player.x,
      this.player.y,
      1000,
      0x000000, 0.5)
      .setOrigin()
      .setVisible(false);

    const mask = this.spotlight.createGeometryMask();
    mask.invertAlpha = true;
    shadow.setMask(mask);

    this.coffeTimer = this.time.addEvent({
      delay: SHADOW_VELOCITY,
      callback: () => {
        this.coffeeLevel--;
        this.spotlight.setRadius(this.coffeeLevel);
        if (this.coffeeLevel <= 0) {
          this.gameOver();
        }
      },
      loop: true
    });

  }

  private createMusic() {
    this.sound.stopAll();
    SoundManager.getInstance(this).playGameLoop();
  }

  private win() {
    this.coffeeLevel = 2000;
    this.gameTimer.destroy();
    this.spotlight.setRadius(2000);
    this.coffeTimer.destroy();
    this.time.delayedCall(2000, () => {
      this.createEndCredits();
      this.player.win();
      this.time.delayedCall(1000, () => {
        this.player.smoke();
        this.time.delayedCall(1000, () => {
          this.player.winWalk();
        })
      })
    })


  }

  private createEndCredits() {
    const textHeader = "Congratulations!";
    const textBody = "You survived another day of work. Now you are free and ready to smoke listen rock music ... "
    const textEnd = "...and be prepared for another ..."

    const x = this.game.canvas.width / 2;
    const y = 200;

    const header = new TypingText(this, x, y, textHeader)
      .setOrigin(0.5);
    const body = new TypingText(this, x, y + 80, textBody)
      .setOrigin(0.5, 0)
      .setWordWrapWidth(1100);
    const end = new TypingText(this, x, y, textEnd)
      .setOrigin(0.5, 0)
      .setWordWrapWidth(1100);

    header.onFinish = () => {
      this.time.delayedCall(1000, () => {
        body.start();
      })
    }
    body.onFinish = () => {
      this.time.delayedCall(2000, () => {
        header.destroy();
        body.destroy();
        this.time.delayedCall(1500, () => {
          end.start();
        })
      })

    }

    end.onFinish = () => {
      this.time.delayedCall(5000, () => {
        this.scene.start('StartScene', { skip: true });
      })
    }

    header.start();

  }


}