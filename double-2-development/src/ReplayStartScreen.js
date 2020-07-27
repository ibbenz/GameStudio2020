import Phaser from 'phaser'
// missions is a global, non-object bound array in the MissionManager.js-file
// wherein the information about all missions is saved.
import MissionManager, { missions } from './MissionManager'

export default class ReplayStartScene extends Phaser.Scene {
  constructor () {
    super('replay-start-scene')

    this.hasStartBoost = false
  }

  preload () {
    this.load.image('starboostholder', 'GlobalUI/ButtonHolderBoost.png')
  }

  create () {
    var coinTextStyle = {
      font: '20px rubikregular',
      fill: '#000000',
      stroke: '#000000',
      strokeThickness: 1,
      boundsAlignH: 'center',
      boundsAlignV: 'middle',
      wordWrap: { width: 180, useAdvancedWrap: true }
    }

    // set game width and height (used for scaling UI)
    const h = this.cameras.main.height
    const w = this.cameras.main.width
    const activeMissions = JSON.parse((localStorage.getItem('activeMissions')))
    const missionManager = new MissionManager(this, null)
    this.add.existing(missionManager)

    if (parseInt(localStorage.getItem('nStartBoosts')) >= 1) {
      this.hasStartBoost = true
    } else {
      this.hasStartBoost = false
    }

    this.add.image(w * 0.3, h * 0.5, 'UI1', 'bg_menu_base.png')
    this.add.image(w * 0.3, h * 0.2, 'UI0', 'txt_mission.png').setRotation(-0.01)

    var playButton
    if (!this.hasStartBoost) {
      this.add.image(w * 0.8, h * 0.5, 'UI0', 'btn_holder_play.png')
      playButton = this.add.sprite(w * 0.8, h * 0.53, 'buttonsatlas', 'ContinueButtonHighlight.png').setInteractive().setScale(0.8)
      playButton.input.hitArea.setTo(50, 54, 168, 160)
    } else {
      this.add.image(w * 0.83, h * 0.5, 'UI0', 'btn_holder_play.png')
      playButton = this.add.sprite(w * 0.83, h * 0.53, 'buttonsatlas', 'ContinueButtonHighlight.png').setInteractive().setScale(0.8)
      playButton.input.hitArea.setTo(50, 54, 168, 160)

      this.add.image(w * 0.65, h * 0.5, 'starboostholder').setScale(0.38)
      var starButton = this.add.sprite(w * 0.647, h * 0.523, 'buttonsatlas', 'StarButtonHighlighted.png').setInteractive().setScale(1.5)
      starButton.input.hitArea.setTo(81, 86, 94, 84)

      this.tweens.add({
        targets: starButton,
        scale: 1.62,
        ease: 'Linear',
        duration: 3000,
        yoyo: true,
        repeat: -1,
        callbackScope: this
      })
    }

    if (!missions[activeMissions[0]].isCompleted) {
      // console.log('mission 0')
      this.add.image(w * 0.3, h * 0.36, 'UI0', 'bg_mission_unfinished.png')
      const textfield = this.add.text(w * 0.22, h * 0.36, missionManager.ToString(missions[activeMissions[0]]), coinTextStyle).setOrigin(0, 0.5).setScale(1)
    } else {
      // loaded in MissionScreen
      // console.log('mission 0')
      this.add.image(w * 0.3, h * 0.36, 'mission', 'MissionFinished.png')
      const textfield = this.add.text(w * 0.22, h * 0.36, missionManager.ToString(missions[activeMissions[0]]), coinTextStyle).setOrigin(0, 0.5).setScale(1)
    }

    if (!missions[activeMissions[1]].isCompleted) {
      // console.log('mission 1')
      this.add.image(w * 0.3, h * 0.51, 'UI0', 'bg_mission_unfinished.png')
      const textfield = this.add.text(w * 0.22, h * 0.51, missionManager.ToString(missions[activeMissions[1]]), coinTextStyle).setOrigin(0, 0.5).setScale(1)
    } else {
      // loaded in MissionScreen
      // console.log('mission 0')
      this.add.image(w * 0.3, h * 0.51, 'mission', 'MissionFinished.png')
      const textfield = this.add.text(w * 0.22, h * 0.51, missionManager.ToString(missions[activeMissions[1]]), coinTextStyle).setOrigin(0, 0.5).setScale(1)
    }

    if (!missions[activeMissions[2]].isCompleted) {
      // console.log('mission 2')
      this.add.image(w * 0.3, h * 0.66, 'UI0', 'bg_mission_unfinished.png')
      const textfield = this.add.text(w * 0.22, h * 0.66, missionManager.ToString(missions[activeMissions[2]]), coinTextStyle).setOrigin(0, 0.5).setScale(1)
    } else {
      // loaded in MissionScreen
      // console.log('mission 0')
      this.add.image(w * 0.3, h * 0.66, 'mission', 'MissionFinished.png')
      const textfield = this.add.text(w * 0.22, h * 0.66, missionManager.ToString(missions[activeMissions[2]]), coinTextStyle).setOrigin(0, 0.5).setScale(1)
    }

    this.tweens.add({
      targets: playButton,
      scale: 0.88,
      ease: 'Linear',
      duration: 3000,
      yoyo: true,
      repeat: -1,
      callbackScope: this
    })

    playButton.on('pointerdown', () => this.ReplayGame())

    if (this.hasStartBoost) {
      starButton.on('pointerdown', () => this.StartBoost())
    }

    this.input.keyboard.on('keydown-SPACE', () => {
      this.ReplayGame()
    })
  }

  ReplayGame () {
    this.scene.stop()
    this.scene.resume('game-scene')
  }

  StartBoost () {
    localStorage.setItem('nStartBoosts', parseInt(localStorage.getItem('nStartBoosts')) - 1)

    this.scene.stop()
    this.scene.resume('game-scene')
    window.global.isStarting = false
    window.global.startBoost = true
  }
}
