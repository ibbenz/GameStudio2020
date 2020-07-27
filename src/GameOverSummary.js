import Phaser from 'phaser'
import ShopButton from './ShopButton'
import Button from './Button'
import { audioGame } from './GameScene'
var coinMultiplier, finalScore
var coinText, continuesText, startBoostText
var shopButton1, shopButton2, replayButton, nextButton

export default class GameOverSummary extends Phaser.Scene {
  constructor () {
    super('game-over')
    this.global = window.global
    this.explainText = ''
    this.currentText = 'Looking to improve\nyour highscore? Try\nupgrading your\npowerups'
    this.audioGame = audioGame

    this.lastSelected = 1
    this.buttons = []
  }

  create () {
    this.lastSelected = 1
    this.audioGame.src = '/SoundFiles/Compressed_Music/Music_Ingame_loop.mp3'
    this.audioGame.loop = true
    this.audioGame.autoplay = true
    // set game width and height (used for scaling UI)
    const h = this.cameras.main.height
    const w = this.cameras.main.width

    // images
    this.add.image(this.scale.width / 2, this.scale.height / 2, 'bghome').setDisplaySize(this.scale.width, this.scale.height)
    this.add.image(1300, 760, 'UI0', 'controlsNavigate.png')

    // shopholders
    this.add.image(w * 0.44, h * 0.06, 'UI1', 'MainMenuBase1.png').setOrigin(0.5, 0).setScale(0.55, 2.05)
    // only image with scale set manually so we don't have to load in 2 separate images
    this.add.image(w * 0.746, h * 0.1, 'UI1', 'MainMenuBase1.png').setOrigin(0.5, 0).setScale(0.55, 2)

    // shop roof
    this.add.image(w * 0.588, h * 0.09, 'UI0', 'Menu_ShopRoof.png').setOrigin(0, 0)

    // text images
    this.add.image(w * 0.44, h * 0.26, 'UI0', 'game_over_textbox.png').setScale(0.28, 0.3)
    this.add.image(w * 0.44, h * 0.35, 'UI0', 'game_over_textbox.png').setScale(0.28, 0.312)
    this.add.image(w * 0.44, h * 0.5, 'UI0', 'game_over_textbox.png').setScale(0.35, 0.35)
    this.add.image(w * 0.44, h * 0.09, 'UI0', 'game_over_text.png').setScale(0.3)
    this.add.image(w * 0.44, h * 0.21, 'UI0', 'score_text.png').setScale(0.3)
    this.add.image(w * 0.44, h * 0.44, 'UI0', 'final_score_text.png').setScale(0.34)

    // buttons game-over
    this.add.image(w * 0.135, h * 0.66, 'UI0', 'btn_home_holder.png').setOrigin(0, 0).setScale(1.23)
    this.add.image(w * 0.44, h * 0.72, 'UI0', 'btn_replay_holder.png').setScale(0.7)

    this.add.image(w * 0.746, h * 0.62, 'UI0', 'shop_description_textbox.png').setScale(0.69)
    this.add.image(w * 0.746, h * 0.82, 'UI0', 'shop_coins_textbox.png')

    // icons
    this.add.image(w * 0.05, h * 0.16, 'UI0', 'StarIcon.png').setScale(0.2, 0.2)
    this.add.image(w * 0.05, h * 0.235, 'UI0', 'icon_heartfish.png').setScale(0.2, 0.2)
    this.add.image(w * 0.40, h * 0.35, 'UI0', 'score_coin_icon.png').setScale(0.65, 0.65).setRotation(0.5)
    this.add.image(w * 0.70, h * 0.82, 'UI0', 'CoinIcon.png').setScale(0.554)

    // text
    var coinTotalTextStyle = {
      font: '45px rubikbold',
      fill: '#FFD700',
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    }

    var finalScoreTextStyle = {
      font: '80px rubikbold',
      fill: '#FFFFFF',
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
    this.add.text(w * 0.41, h * 0.23, this.global.thisRunScore, finalScoreTextStyle).setScale(0.55)
    coinMultiplier = this.global.thisRunNumCoins / 100
    this.add.text(w * 0.42, h * 0.32, 'x ' + coinMultiplier, finalScoreTextStyle).setScale(0.5)
    finalScore = Math.round(coinMultiplier * this.global.thisRunScore)
    this.add.text(w * 0.40, h * 0.455, finalScore, finalScoreTextStyle).setScale(0.75)
    window.global.thisRunNumCoins = 0
    window.global.thisRunScore = 0
    localStorage.setItem('nComboDoubleThisRun', this.global.thisRunComboDouble)
    localStorage.setItem('nComboTripleThisRun', this.global.thisRunComboTriple)
    window.global.thisRunComboDouble = 0
    window.global.thisRunComboTriple = 0

    coinText = this.add.text(w * 0.735, h * 0.82, localStorage.getItem('nCoins'), coinTotalTextStyle).setOrigin(0, 0.5).setScale(0.7)
    continuesText = this.add.text(w * 0.07, h * 0.235, localStorage.getItem('nContinues'), textStyle).setOrigin(0, 0.5).setScale(0.6)
    startBoostText = this.add.text(w * 0.07, h * 0.16, localStorage.getItem('nStartBoosts'), textStyle).setOrigin(0, 0.5).setScale(0.6)
    this.explainText = this.add.text(w * 0.645, h * 0.52, this.currentText, textStyle).setOrigin(0, 0).setScale(0.55).setLineSpacing(-5)

    // shop buttons
    shopButton1 = new ShopButton(this, w * 0.69, h * 0.348, true, 400, 'heartpowerup', this.explainText, 8).setScale(0.82)
    shopButton2 = new ShopButton(this, w * 0.803, h * 0.348, true, 400, 'startboostpowerup', this.explainText, 9).setScale(0.82)
    shopButton1.create()
    shopButton2.create()

    // buttons
    nextButton = new Button(this, w * 0.1865, h * 0.746, 'buttonsatlas', 'HomeButton.png', 'HomeButtonHighlight.png', 0.55, [44, 48, 168, 160])
    nextButton.on('pointerover', () => { this.ChangeTextBack() })
    nextButton.on('pointerover', () => { this.TweenHomeButton(nextButton) })
    nextButton.on('pointerout', () => { this.tweens.killTweensOf(nextButton) })
    nextButton.on('pointerdown', () => { this.RestartThroughHome() })

    replayButton = new Button(this, w * 0.436, h * 0.71, 'buttonsatlas', 'ReplayButton.png', 'ReplayButtonHighlight.png', 1.45, [72, 70, 112, 116])
    replayButton.Select()
    replayButton.on('pointerover', () => { this.ChangeTextBack() })
    replayButton.on('pointerover', () => { this.TweenRestartButton(replayButton) })
    replayButton.on('pointerout', () => { this.tweens.killTweensOf(replayButton) })
    replayButton.on('pointerdown', () => { this.RestartGame() })

    window.global.keyboard = this.input.keyboard.createCursorKeys()
    this.buttons = [nextButton, replayButton, shopButton1, shopButton2]

    // Highlights button when mouse is over the button
    for (let i = 0; i < this.buttons.length; i++) {
      if (i < 2) {
        this.buttons[i].on('pointerover', () => {
          this.buttons[i].Select()
          this.lastSelected = i
        })
      } else {
        this.buttons[i].btn.on('pointerover', () => {
          this.buttons[i].Select()
          this.lastSelected = i
        })
      }
    }

    // keyboard input
    this.input.keyboard.on('keydown-RIGHT', () => {
      switch (this.lastSelected) {
        case 0:
          this.lastSelected = 1
          break
        case 1:
          this.lastSelected = 2
          break
        case 2:
          this.lastSelected = 3
          break
      }
      this.buttons[this.lastSelected].Select()
    })

    this.input.keyboard.on('keydown-LEFT', () => {
      switch (this.lastSelected) {
        case 3:
          this.lastSelected = 2
          break
        case 2:
          this.lastSelected = 1
          break
        case 1:
          this.lastSelected = 0
          break
      }
      this.buttons[this.lastSelected].Select()
    })

    this.input.keyboard.on('keydown-SPACE', () => {
      switch (this.lastSelected) {
        case 0:
          this.RestartThroughHome()
          break
        case 1:
          this.RestartGame()
          break
        case 2:
          shopButton1.PurchaseItem()
          break
        case 3:
          shopButton2.PurchaseItem()
          break
      }
    })
  }

  update () {
    // updates coin text
    coinText.setText(localStorage.getItem('nCoins'))
    // updates texts
    coinText.setText(localStorage.getItem('nCoins'))
    continuesText.setText(localStorage.getItem('nContinues'))
    startBoostText.setText(localStorage.getItem('nStartBoosts'))

    shopButton1.update()
    shopButton2.update()

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

  RestartGame () {
    this.audioGame.pause()
    this.scene.stop('game-scene')
    this.scene.start('loading-screen-missions')

    window.global.restart = true
    window.global.pause = false
    window.global.isStarting = true
  }

  TweenHomeButton (button) {
    this.tweens.add({
      targets: [button],
      scale: 0.605,
      ease: 'Linear',
      duration: 1200,
      yoyo: true,
      repeat: -1,
      callbackScope: this
    })
  }

  TweenRestartButton (button) {
    this.tweens.add({
      targets: [button],
      scale: 1.55,
      ease: 'Linear',
      duration: 1200,
      yoyo: true,
      repeat: -1,
      callbackScope: this
    })
  }

  RestartThroughHome () {
    this.scene.stop('game-scene')
    this.scene.start('home-screen', { audin: this.audioGame })

    window.global.restart = true
    window.global.pause = false
    window.global.isStarting = true
  }

  ChangeTextBack () {
    this.currentText = 'Looking to improve\nyour highscore? Try\nupgrading your\npowerups'
    this.explainText.setText(this.currentText)
  }

  SelectHome () {
    nextButton.setFrame('HomeButtonHighlight.png')
    this.selectedButton = 2
  }

  SelectReplay () {
    replayButton.setFrame('ReplayButtonHighlight.png')
    this.selectedButton = 1
  }

  SelectShop1 () {
    shopButton1.selectedButton()
    this.selectedButton = 3
  }

  SelectShop2 () {
    shopButton2.selectedButton()
    this.selectedButton = 4
  }
}
