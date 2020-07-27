import Phaser from 'phaser'
import MissionManager, { missions } from './MissionManager'
import MuteButton from './MuteButton'
import Button from './Button'

var muteButton, playButton, homeButton
export default class PauseScene extends Phaser.Scene {
  constructor () {
    super('pause-scene')
    this.player = null
    this.audiofromGame = null

    this.buttons = []
    this.lastSelected = 0
  }

  init (data) {
    this.player = data.player
    this.audiofromGame = data.gameAudio
  }

  preload () {
    this.load.image('missionbackground', '/Missions/missionCompleteBG_lowq.jpg')
  }

  create () {
    this.lastSelected = 0

    var missionsTextStyle = {
      font: '24px rubikregular',
      fill: '#f8f8ff',
      stroke: '#f8f8ff',
      strokeThickness: 1,
      boundsAlignH: 'center',
      boundsAlignV: 'middle',
      wordWrap: { width: 320, useAdvancedWrap: true }
    }

    var container = this.add.container(this.scale.width / 2, this.scale.height * 0.45)

    var pauseMenuHolder = this.add.image(0, 0, 'UI1', 'PauseMenuHolder.png')
    pauseMenuHolder.setScale(1.2, 1)
    var menuWidth = pauseMenuHolder.width
    var menuHeight = pauseMenuHolder.height

    var playButtonHolder = this.add.image(-(menuWidth * 0.15), menuHeight * 0.67, 'UI1', 'PlayHomeButtonHolder.png')
    var homeButtonHolder = this.add.image(menuWidth * 0.15, menuHeight * 0.67, 'UI1', 'PlayHomeButtonHolder.png')
    var pauseText = this.add.image(0, -(menuHeight * 0.52), 'UI0', 'PausedText.png')

    // The missions field
    const activeMissions = JSON.parse((localStorage.getItem('activeMissions')))
    const missionManager = new MissionManager(this, null)
    this.add.existing(missionManager)

    let mission1Image
    let mission2Image
    let mission3Image
    let mission1Text
    let mission2Text
    let mission3Text

    const text1 = missionManager.ToString(missions[activeMissions[0]]) + ' (' + missionManager.GetProgressScaled(missions[activeMissions[0]], this.player).toFixed(0) + '/' + missionManager.GetTarget(missions[activeMissions[0]]) + ')'
    const text2 = missionManager.ToString(missions[activeMissions[1]]) + ' (' + missionManager.GetProgressScaled(missions[activeMissions[1]], this.player).toFixed(0) + '/' + missionManager.GetTarget(missions[activeMissions[1]]) + ')'
    const text3 = missionManager.ToString(missions[activeMissions[2]]) + ' (' + missionManager.GetProgressScaled(missions[activeMissions[2]], this.player).toFixed(0) + '/' + missionManager.GetTarget(missions[activeMissions[2]]) + ')'

    if (!missions[activeMissions[0]].isCompleted) {
      // console.log('mission 1')
      mission1Image = this.add.image(0, -(menuHeight * 0.28), 'mission', 'MissionLongUnfinished.png')
      mission1Text = this.add.text(-(menuWidth * 0.27), -(menuHeight * 0.35), text1, missionsTextStyle).setScale(1)
    } else {
      // loaded in MissionScreen
      // console.log('mission 0')
      mission1Image = this.add.image(0, -(menuHeight * 0.28), 'mission', 'MissionLongFinished.png')
      mission1Text = this.add.text(-(menuWidth * 0.27), -(menuHeight * 0.35), text1, missionsTextStyle).setScale(1)
    }

    if (!missions[activeMissions[1]].isCompleted) {
      // console.log('mission 1')
      mission2Image = this.add.image(0, -(menuHeight * 0.0), 'mission', 'MissionLongUnfinished.png')
      mission2Text = this.add.text(-(menuWidth * 0.27), -(menuHeight * 0.07), text2, missionsTextStyle).setScale(1)
    } else {
      // loaded in MissionScreen
      // console.log('mission 0')
      mission2Image = this.add.image(0, -(menuHeight * 0.0), 'mission', 'MissionLongFinished.png')
      mission2Text = this.add.text(-(menuWidth * 0.27), -(menuHeight * 0.07), text2, missionsTextStyle).setScale(1)
    }

    if (!missions[activeMissions[2]].isCompleted) {
      // console.log('mission 1')
      mission3Image = this.add.image(0, (menuHeight * 0.28), 'mission', 'MissionLongUnfinished.png')
      mission3Text = this.add.text(-(menuWidth * 0.27), (menuHeight * 0.21), text3, missionsTextStyle).setScale(1)
    } else {
      // loaded in MissionScreen
      // console.log('mission 0')
      mission3Image = this.add.image(0, (menuHeight * 0.28), 'mission', 'MissionLongFinished.png')
      mission3Text = this.add.text(-(menuWidth * 0.27), (menuHeight * 0.21), text3, missionsTextStyle).setScale(1)
    }

    // continue button
    playButton = new Button(this, -menuWidth * 0.15, menuHeight * 0.67, 'buttonsatlas', 'ContinueButton.png', 'ContinueButtonHighlight.png', 0.5, [50, 54, 168, 160])
    playButton.Select()
    playButton.on('pointerover', () => {
      playButton.Select()
      this.lastSelected = 0
    })
    playButton.on('pointerdown', () => this.UnPause())

    // home button
    homeButton = new Button(this, menuWidth * 0.15, menuHeight * 0.67, 'buttonsatlas', 'HomeButton.png', 'HomeButtonHighlight.png', 0.5, [44, 48, 168, 160])
    homeButton.on('pointerover', () => {
      homeButton.Select()
      this.lastSelected = 1
    })
    homeButton.on('pointerdown', () => this.ReturnHome())

    container.add([pauseMenuHolder, playButtonHolder, homeButtonHolder, homeButton, playButton, pauseText])
    container.add([mission1Image, mission1Text, mission2Image, mission2Text, mission3Image, mission3Text])
    // container.add([mission1Image, mission2Image, mission3Image, mission1Text, mission2Text, mission3Text])
    // mute button
    muteButton = new MuteButton(this, menuWidth * 0.31, menuHeight * 0.47)
    muteButton.CreateButton()

    container.add([pauseMenuHolder, playButtonHolder, homeButtonHolder, homeButton, playButton, pauseText, muteButton])
    container.depth = 1
    this.buttons = [playButton, homeButton]

    // keyboard input
    this.input.keyboard.on('keydown-RIGHT', () => {
      this.lastSelected = 1
      this.buttons[this.lastSelected].Select()
    })

    this.input.keyboard.on('keydown-LEFT', () => {
      this.lastSelected = 0
      this.buttons[this.lastSelected].Select()
    })

    this.input.keyboard.on('keydown-SPACE', () => {
      if (this.lastSelected === 0) {
        this.UnPause()
      } else {
        this.ReturnHome()
      }
    })

    this.input.keyboard.on('keydown-ESC', () => this.UnPause())
  }

  update () {
    muteButton.update()

    // mute button
    if (window.global.muted) {
      this.audiofromGame.pause()
    } else {
      if (this.audiofromGame.paused) {
        this.audiofromGame.play()
      }
    }

    // updates button being selected/unselected
    for (let i = 0; i < this.buttons.length; i++) {
      if (i !== this.lastSelected) {
        this.buttons[i].Deselect()
      }
    }
  }

  UnPause () {
    this.scene.stop()
    this.scene.resume('game-scene', this.scene.key)
  }

  ReturnHome () {
    // reset current run stats
    window.global.thisRunNumCoins = 0
    window.global.thisRunDistance = 0
    this.scene.stop()
    this.scene.stop('game-scene')
    this.scene.start('game-over')
  }
}
