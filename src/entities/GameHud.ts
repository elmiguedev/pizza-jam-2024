import { Scene } from "phaser";
import { Utils } from "../utlis/Utils";

export class GameHud extends Scene {
  private timerTxt: Phaser.GameObjects.Text;
  private calendarIcon: Phaser.GameObjects.Image;
  private meetingTxt: Phaser.GameObjects.Text;
  private blinkTimer: Phaser.Time.TimerEvent;

  constructor() {
    super("GameHud");
  }

  public create() {
    this.createTimerText();
    this.createCalendarIcon();
  }

  public updateTimer(timer: number) {
    const timerText = Utils.getTimeText(timer);
    this.timerTxt.setText(timerText);
  }

  public setMeetingMode(meeting: string) {
    this.calendarIcon.setVisible(true);
    this.meetingTxt.setVisible(true);
    this.meetingTxt.setText(meeting);
    this.blinkTimer.paused = false;
  }

  public endMeeting() {
    this.blinkTimer.paused = true;
    this.calendarIcon.setVisible(false);
    this.meetingTxt.setVisible(false);
  }

  private createCalendarIcon() {
    this.calendarIcon = this.add.image(
      1130,
      20,
      "calendar"
    )
      .setScale(8)
      .setDepth(20)
      .setOrigin(0)
      .setVisible(false);

    this.meetingTxt = this.add.text(1100, 20, "", {
      color: "#000000",
      fontSize: "72px",
      fontFamily: "origami",
      fontStyle: "normal",
      backgroundColor: "#ffffff",
      align: "right",
      padding: {
        x: 8,
        y: 10
      }
    })
      .setAlign("right")
      .setOrigin(1, 0)
      .setDepth(20)
      .setVisible(false);

    this.blinkTimer = this.time.addEvent({
      delay: 300,
      callback: () => {
        this.meetingTxt.setVisible(!this.meetingTxt.visible);
      },
      loop: true
    });

    this.blinkTimer.paused = true;
    this.meetingTxt.setVisible(false);

  }

  private createTimerText() {
    this.timerTxt = this.add.text(20, 20, "09:00", {
      color: "#000000",
      fontSize: "72px",
      fontFamily: "origami",
      fontStyle: "normal",
      backgroundColor: "#ffffff",
      padding: {
        x: 8,
        y: 10
      }
    }).setDepth(20)
  }


}