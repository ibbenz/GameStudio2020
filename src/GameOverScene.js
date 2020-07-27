import Phaser from 'phaser'
import { progressiveLoadfilesGameOverScreen } from './FilesToLoad'
import Player from './Player'
import Button from './Button'

var nextButton, lifeButton
export default class GameOverScreen extends Phaser.Scene {
  constructor () {
    super('game-over-screen')

    this.buttons = []
    this.lastSelected = 0
  }

  init (data) {
    this.player = data.playerIn
    this.audioGame = data.gameAudio
  }

  create () {
    this.lastSelected = 0
    var container = this.add.container(this.scale.width / 2, this.scale.height * 0.45)

    var textStyle = {
      font: '50px rubikbold',
      fill: '#FFF',
      stroke: '#000000',
      strokeThickness: 10,
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    }

    // container items (position relative to container)
    var popupWindow = this.add.sprite(0, 0, 'UI0', 'crashed_popupwindow.png')
    popupWindow.depth = this.depth
    var windowWidth = popupWindow.width
    var windowHeight = popupWindow.height
    var reviveText = this.add.sprite(0, -(windowHeight * 0.5), 'UI0', 'ReviveText.png')
    reviveText.angle = -5
    var nextButtonBox = this.add.sprite(0, windowWidth * 0.66, 'UI1', 'surroundingWindow.png')
    nextButtonBox.setDisplaySize(nextButtonBox.width * 0.3, nextButtonBox.height * 0.3)
    var heartFishIcon = this.add.sprite(windowWidth * 0.21, -(windowHeight * 0.35), 'UI0', 'icon_heartfish.png')
    heartFishIcon.setDisplaySize(heartFishIcon.width * 0.33, heartFishIcon.height * 0.33)
    var continuesText = this.add.text(windowWidth * 0.285, -(windowHeight * 0.33), 'x' + parseInt(localStorage.getItem('nContinues')), textStyle).setOrigin(0, 0.5).setScale(0.7)

    // next button gets created
    nextButton = new Button(this, 0, windowHeight * 0.66, 'buttonsatlas', 'NextButton.png', 'NextButtonHighlighted.png', 2, [26, 42.5, 76, 43])
    nextButton.Select()
    nextButton.on('pointerover', () => {
      nextButton.Select()
      this.lastSelected = 0
    })

    // next button can lead to gameoverscreen, highscore screen or missions screen (based on variables)
    if (window.global.gameScene.missionManager.completedMissions.length > 0) {
      nextButton.on('pointerdown', () => {
        this.NextMissionScreen()
      })
    } else {
      nextButton.on('pointerdown', () => {
        this.NextGameOverScreen()
      })
    }

    // extra life button gets created
    lifeButton = new Button(this, -(windowWidth * 0.21), windowHeight * 0.28, 'buttonsatlas', 'LifeButton.png', 'LifeButtonHighlight.png', 2, [81.5, 86.5, 93, 83])
    lifeButton.on('pointerover', () => {
      lifeButton.Select()
      this.lastSelected = 1
    })
    // player must have more than 0 lives to use this button
    if (parseInt(localStorage.getItem('nContinues')) >= 1) {
      lifeButton.on('pointerdown', () => this.ExtraLife())
    }

    container.add([popupWindow, reviveText, nextButtonBox, nextButton, lifeButton, heartFishIcon, continuesText])
    container.depth = 1
    this.buttons = [nextButton, lifeButton]

    // keyboard input
    this.input.keyboard.on('keydown-UP', () => {
      this.lastSelected = 1
      this.buttons[this.lastSelected].Select()
    })

    this.input.keyboard.on('keydown-DOWN', () => {
      this.lastSelected = 0
      this.buttons[this.lastSelected].Select()
    })

    this.input.keyboard.on('keydown-SPACE', () => {
      if (this.lastSelected === 0) {
        if (window.global.gameScene.missionManager.completedMissions.length > 0) {
          this.NextMissionScreen()
        } else {
          this.NextGameOverScreen()
        }
      } else {
        if (parseInt(localStorage.getItem('nContinues')) >= 1) {
          this.ExtraLife()
        }
      }
    })
  }

  update () {
    // updates button being selected/unselected
    for (let i = 0; i < this.buttons.length; i++) {
      if (i !== this.lastSelected) {
        this.buttons[i].Deselect()
      }
    }
  }

  ExtraLife () {
    localStorage.setItem('nContinues', parseInt(localStorage.getItem('nContinues')) - 1)
    this.scene.resume('game-scene', this.scene.key)
    this.scene.stop()
  }

  NextMissionScreen () {
    // Without extralive the player starts from 0 again.
    const newtotalDistance = JSON.parse(localStorage.getItem('totalDistance')) + this.player.x
    localStorage.setItem('totalDistance', newtotalDistance)

    if (window.global.thisRunScore > JSON.parse(localStorage.getItem('bestScore'))) {
      console.log('best Score: ' + JSON.parse(localStorage.getItem('bestScore')))
      console.log('this run Score: ' + window.global.thisRunScore)
      localStorage.setItem('bestScore', window.global.thisRunScore)
      this.scene.stop('game-scene')
      this.scene.stop()
      this.scene.start('highscore-screen')
    } else {
      this.scene.stop('game-scene')
      this.scene.stop()
      this.scene.start('mission-screen')
    }
  }

  NextGameOverScreen () {
    const newtotalDistance = JSON.parse(localStorage.getItem('totalDistance')) + this.player.x
    localStorage.setItem('totalDistance', newtotalDistance)
    // reset current run stats
    if (window.global.thisRunScore > JSON.parse(localStorage.getItem('bestScore'))) {
      localStorage.setItem('bestScore', window.global.thisRunScore)
      this.scene.stop('game-scene')
      this.scene.stop()
      this.scene.start('highscore-screen')
    } else {
      this.scene.stop('game-scene')
      this.scene.stop()
      this.scene.start('game-over')
    }
  }
}
