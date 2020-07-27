import Phaser from 'phaser'
import { progressiveLoadfilesHomeScreen } from './FilesToLoad'
import MissionManager, { missions } from './MissionManager'
import MuteButton from './MuteButton'
import Button from './Button'
import { audioGame } from './GameScene'

var muteButton, playButton, shopButton
export default class HomeScreen extends Phaser.Scene {
  constructor () {
    super('home-screen')
    this.audioGame = audioGame

    this.lastSelected = 1
    this.buttons = []
  }

  init (data) {
    this.audioGame = data.audin
  }

  create () {
    this.lastSelected = 1
    var container = this.add.container(this.scale.width / 2, this.scale.height / 2)

    var coinTextStyle = {
      font: '50px rubikbold',
      fill: '#FFD700',
      stroke: '#000000',
      strokeThickness: 10,
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    }

    var textStyle = {
      font: '50px rubikbold',
      fill: '#FFF',
      stroke: '#000000',
      strokeThickness: 10,
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    }

    var missionTextStyle = {
      font: '20px rubikregular',
      fill: '#000000',
      stroke: '#000000',
      strokeThickness: 1,
      boundsAlignH: 'center',
      boundsAlignV: 'middle',
      wordWrap: { width: 180, useAdvancedWrap: true }
    }

    // For the missions-board on the right
    const activeMissions = JSON.parse(localStorage.getItem('activeMissions'))
    const missionManager = new MissionManager(this, null)
    this.add.existing(missionManager)

    var bg = this.add.image(0, 0, 'bghome').setDisplaySize(this.scale.width, this.scale.height)
    var shopWindow = this.add.image(-(this.scale.width * 0.335), 0, 'UI1', 'UIContainer.png').setDisplaySize(this.scale.width * 0.18, this.scale.height * 0.53)
    var playWindow = this.add.image(-(this.scale.width * 0.05), 0, 'UI1', 'UIContainer.png').setDisplaySize(this.scale.width * 0.27, this.scale.height * 0.73)
    var missionWindow = this.add.image(this.scale.width * 0.28, 0, 'UI1', 'UIContainer.png').setDisplaySize(this.scale.width * 0.22, this.scale.height * 0.565)
    var playButtonHolder = this.add.image(-(this.scale.width * 0.045), this.scale.height * 0.01, 'UI0', 'PlayButtonHolder.png').setScale(0.85)
    var shopButtonHolder = this.add.image(-(this.scale.width * 0.335), 0, 'UI0', 'ShopButtonHolder.png').setScale(0.8)
    var shopRoof = this.add.image(-(this.scale.width * 0.335), -(this.scale.height * 0.23), 'UI0', 'MenuShopRoof.png').setScale(1.15)
    var controls = this.add.image(this.scale.width * 0.4, this.scale.height * 0.4, 'UI0', 'controlsNavigate.png').setScale(1.2)
    var pogoLogo = this.add.image(-(this.scale.width * 0.05), -(this.scale.height * 0.32), 'UI1', 'pogologo.png').setScale(0.32).setAngle(-7)
    var coinTextContainer = this.add.image(-(this.scale.width * 0.335), this.scale.height * 0.2, 'UI0', 'TextContainerCoinCount.png')
    var coinIcon = this.add.image(-(this.scale.width * 0.37), this.scale.height * 0.2, 'UI0', 'CoinIcon.png').setScale(0.4)
    var playText = this.add.image(-(this.scale.width * 0.045), -(this.scale.height * 0.16), 'UI0', 'PlayText.png').setScale(0.25)
    var highScoreText = this.add.image(-(this.scale.width * 0.1), this.scale.height * 0.25, 'UI0', 'HighscoreText.png').setScale(0.4)
    var highScoreTextField = this.add.text(-this.scale.width * 0.1, this.scale.height * 0.3, parseInt(localStorage.getItem('bestScore')), textStyle).setScale(0.6).setOrigin(0.5, 0.5)
    var distanceText = this.add.image(this.scale.width * 0.02, this.scale.height * 0.248, 'UI0', 'DistanceText.png').setScale(0.4)
    var highScoreTextContainer = this.add.image(-(this.scale.width * 0.1), this.scale.height * 0.3, 'UI0', 'TextContainerScore.png').setScale(0.7, 0.9)
    var distanceTextContainer = this.add.image(this.scale.width * 0.02, this.scale.height * 0.3, 'UI0', 'TextContainerScore.png').setScale(0.53, 0.9)
    var missionsText = this.add.image(this.scale.width * 0.28, -(this.scale.height * 0.29), 'UI0', 'MissionText.png').setScale(0.4)
    var levelText = this.add.image(this.scale.width * 0.26, -(this.scale.height * 0.22), 'UI0', 'LevelText.png').setScale(0.4)
    var levelTextContainer = this.add.image(this.scale.width * 0.31, -(this.scale.height * 0.22), 'UI0', 'TextContainerLevel.png').setScale(0.6)
    var levelTextField = this.add.text(this.scale.width * 0.31, -(this.scale.height * 0.22), parseInt(localStorage.getItem('level')), textStyle).setOrigin(0, 0.5).setScale(0.5)
    var coinText = this.add.text(-this.scale.width * 0.345, this.scale.height * 0.2, localStorage.getItem('nCoins'), coinTextStyle).setScale(0.6).setOrigin(0, 0.5)
    var bestDistanceText = this.add.text(this.scale.width * 0.02, this.scale.height * 0.3, localStorage.getItem('bestDistance') + 'm', textStyle).setScale(0.6).setOrigin(0.5, 0.5)

    // buttons
    playButton = new Button(this, -(this.scale.width * 0.05), 0, 'buttonsatlas', 'PlayButton.png', 'PlayButtonHighlighted.png', 1.75, [70.5, 68, 115, 120])
    playButton.Select()
    playButton.on('pointerover', () => {
      playButton.Select()
      this.lastSelected = 1
    })
    playButton.on('pointerover', () => this.TweenButton(playButton))
    playButton.on('pointerout', () => { this.tweens.killTweensOf(playButton) })
    playButton.on('pointerdown', () => this.StartGame())

    shopButton = new Button(this, -(this.scale.width * 0.335), 0, 'buttonsatlas', 'ShopButton.png', 'ShopButtonHighlighted.png', 1.75, [77, 79, 102, 98])
    shopButton.on('pointerover', () => {
      shopButton.Select()
      this.lastSelected = 0
    })
    shopButton.on('pointerover', () => this.TweenButton(shopButton))
    shopButton.on('pointerout', () => { this.tweens.killTweensOf(shopButton) })
    shopButton.on('pointerdown', () => this.GoToShop())

    // mute button
    muteButton = new MuteButton(this, this.scale.width * 0.46, -this.scale.height * 0.43)
    muteButton.CreateButton()

    // finished missions:
    // var missionsText = this.add.image(this.scale.width * 0.28, -this.scale.height * 0.29, 'UI0', 'MissionText.png').setScale(0.4)
    let mission1Image
    let mission2Image
    let mission3Image
    let mission1Text
    let mission2Text
    let mission3Text

    if (!missions[activeMissions[0]].isCompleted) {
      mission1Image = this.add.image(this.scale.width * 0.28, -this.scale.height * 0.1, 'UI0', 'bg_mission_unfinished.png')
      mission1Text = this.add.text(this.scale.width * 0.2, -this.scale.height * 0.1, missionManager.ToString(missions[activeMissions[0]]), missionTextStyle).setOrigin(0, 0.5).setScale(1)
    } else {
      // loaded in MissionScreen
      mission1Image = this.add.image(this.scale.width * 0.28, -this.scale.height * 0.1, 'mission', 'MissionFinished.png')
      mission1Text = this.add.text(this.scale.width * 0.2, -this.scale.height * 0.1, missionManager.ToString(missions[activeMissions[0]]), missionTextStyle).setOrigin(0, 0.5).setScale(1)
    }

    if (!missions[activeMissions[1]].isCompleted) {
      mission2Image = this.add.image(this.scale.width * 0.28, this.scale.height * 0.05, 'UI0', 'bg_mission_unfinished.png')
      mission2Text = this.add.text(this.scale.width * 0.2, this.scale.height * 0.05, missionManager.ToString(missions[activeMissions[1]]), missionTextStyle).setOrigin(0, 0.5).setScale(1)
    } else {
      // loaded in MissionScreen
      mission2Image = this.add.image(this.scale.width * 0.28, this.scale.height * 0.05, 'mission', 'MissionFinished.png')
      mission2Text = this.add.text(this.scale.width * 0.2, this.scale.height * 0.05, missionManager.ToString(missions[activeMissions[1]]), missionTextStyle).setOrigin(0, 0.5).setScale(1)
    }

    if (!missions[activeMissions[2]].isCompleted) {
      mission3Image = this.add.image(this.scale.width * 0.28, this.scale.height * 0.2, 'UI0', 'bg_mission_unfinished.png')
      mission3Text = this.add.text(this.scale.width * 0.2, this.scale.height * 0.2, missionManager.ToString(missions[activeMissions[2]]), missionTextStyle).setOrigin(0, 0.5).setScale(1)
    } else {
      // loaded in MissionScreen
      mission3Image = this.add.image(this.scale.width * 0.28, this.scale.height * 0.2, 'mission', 'MissionFinished.png')
      mission3Text = this.add.text(this.scale.width * 0.2, this.scale.height * 0.2, missionManager.ToString(missions[activeMissions[2]]), missionTextStyle).setOrigin(0, 0.5).setScale(1)
    }

    container.add([bg, shopWindow, playWindow, missionWindow, playButtonHolder, playButton, shopButtonHolder, shopButton, shopRoof, controls, pogoLogo])
    container.add([coinTextContainer, coinIcon, playText, highScoreText, distanceText, highScoreTextContainer, distanceTextContainer, missionsText])
    container.add([levelText, levelTextContainer, coinText, bestDistanceText, highScoreTextField, levelTextField, muteButton])
    container.add([mission1Image, mission2Image, mission3Image, mission1Text, mission2Text, mission3Text])
    container.depth = 1
    this.buttons = [shopButton, playButton]

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
        this.GoToShop()
      } else {
        this.StartGame()
      }
    })
  }

  update () {
    muteButton.update()

    if (window.global.muted) {
      this.audioGame.pause()
    } else {
      if (this.audioGame.paused) {
        this.audioGame.play()
      }
    }

    // updates button being selected/unselected
    for (let i = 0; i < this.buttons.length; i++) {
      if (i !== this.lastSelected) {
        this.buttons[i].Deselect()
      }
    }
  }

  StartGame () {
    this.audioGame.pause()
    this.scene.start('loading-screen-missions')
  }

  GoToShop () {
    this.scene.start('shop-screen')
  }

  TweenButton (button) {
    this.tweens.add({
      targets: [button],
      scale: 1.6,
      ease: 'Linear',
      duration: 1000,
      yoyo: true,
      repeat: -1,
      callbackScope: this
    })
  }
}
