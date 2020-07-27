import Phaser from 'phaser'
import { audioGame } from './GameScene'

var width
var height
var thisScene
var audioHighscore = document.createElement('audio')

export default class HighScoreScreen extends Phaser.Scene {
  constructor () {
    super('highscore-screen')
    this.gotReward = false
    this.textfield = null
    this.texttween = null
  }

  preload () {
    this.load.atlas('missionAccomplished', 'Missions/mission_accomplished.png', 'Missions/mission_accomplished.json')
  }

  create () {
    this.audioHighscore = audioGame
    this.audioHighscore.src = '/Missions/Music_Jingle_Game_Over_Highscore.mp3'
    this.audioHighscore.loop = false
    this.audioHighscore.autoplay = true
    thisScene = this

    const h = this.cameras.main.height
    const w = this.cameras.main.width
    this.missionManager = window.global.gameScene.missionManager
    this.completedMissions = this.missionManager.completedMissions

    const currentText = localStorage.getItem('bestScore')

    var coinTextStyle = {
      font: '150px rubikbold',
      fill: '#ffb90f',
      stroke: '#ffb90f',
      strokeThickness: 10,
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    }

    width = w
    height = h

    // Rewardtween
    this.highscoretween = this.physics.add.sprite(w * 0.5, h * 0.2)
    this.highscoretween.setScale(0.01)
    this.highscoretween.body.setAllowGravity(false)

    this.penguintween = this.physics.add.sprite(w * 0.3, h * 1.4)
    this.penguintween.setScale(1)
    this.penguintween.body.setAllowGravity(false)
    this.textfield = this.add.text(w * 0.45, h * 0.8, currentText, coinTextStyle).setOrigin(0, 0.5).setScale(0.7)

    thisScene.audioHighscore.addEventListener('play', thisScene.addHighScore)
  }

  addHighScore () {
    thisScene.TweenHighscore()
    thisScene.TweenPenguin1(width, height)
  }

  TweenHighscore () {
    // A new texture is added to the game object
    thisScene.highscoretween.setTexture('missionAccomplished', 'NewHighscoreTxt.png')
    // this.flameTween = obj.setTexture('fire')
    thisScene.highscoretween.scene.tweens.add({
      alpha: { from: 0, to: 1 },
      targets: [thisScene.highscoretween],
      scale: { from: 0, to: 1.5 },
      ease: 'Linear',
      duration: 2000,
      yoyo: false,
      repeat: 0,
      callbackScope: thisScene.highscoretween,
      onComplete: thisScene.TweenHighscore2.bind(thisScene)
    })
  }

  TweenHighscore2 () {
    // A new texture is added to the game object
    thisScene.highscoretween.setTexture('missionAccomplished', 'NewHighscoreTxt.png')
    // this.flameTween = obj.setTexture('fire')
    thisScene.highscoretween.scene.tweens.add({
      targets: [thisScene.highscoretween],
      scale: { from: 1.5, to: 1.5 },
      ease: 'Linear',
      yoyo: false,
      repeat: -1,
      callbackScope: thisScene.highscoretween
    })
  }

  TweenPenguin1 (widthIn, heightIn) {
    // A new texture is added to the game object
    // console.log('du da')
    thisScene.penguintween.setTexture('missionAccomplished', 'Penguin.png')
    // this.flameTween = obj.setTexture('fire')
    thisScene.penguintween.scene.tweens.add({
      targets: [thisScene.penguintween],
      ease: 'Linear',
      delay: 600,
      x: widthIn / 2,
      y: heightIn / 2,
      duration: 700,
      yoyo: false,
      repeat: 0,
      callbackScope: thisScene.penguintween,
      onComplete: thisScene.TweenPenguin2.bind(thisScene, widthIn, heightIn)
    })
  }

  TweenPenguin2 (widthIn, heightIn) {
    // A new texture is added to the game object
    // console.log('du da')
    thisScene.penguintween.setTexture('missionAccomplished', 'Penguin.png')
    // this.flameTween = obj.setTexture('fire')
    thisScene.penguintween.scene.tweens.add({
      targets: [thisScene.penguintween],
      ease: 'Linear',
      x: widthIn / 2,
      y: heightIn / 2,
      duration: 700,
      yoyo: false,
      repeat: 0,
      callbackScope: thisScene.penguintween,
      onComplete: thisScene.TweenPenguin3.bind(thisScene, widthIn, heightIn)
    })
  }

  TweenPenguin3 (widthIn, heightIn) {
    // A new texture is added to the game object
    // console.log('du da')
    thisScene.penguintween.setTexture('missionAccomplished', 'Penguin.png')
    // this.flameTween = obj.setTexture('fire')
    thisScene.penguintween.scene.tweens.add({
      targets: [this.penguintween],
      ease: 'Linear',
      x: 1 * widthIn,
      y: 2 * heightIn,
      duration: 1000,
      yoyo: false,
      repeat: 0,
      callbackScope: thisScene.penguintween,
      onComplete: thisScene.changeScreen.bind(thisScene)
    })
  }

  changeScreen () {
    // If there are completed missions, then go to missions, otherwise go to homescreen
    if (window.global.gameScene.missionManager.completedMissions.length > 0) {
      thisScene.audioHighscore.removeEventListener('play', thisScene.addHighScore)
      thisScene.scene.start('mission-screen')
    } else {
      thisScene.audioHighscore.removeEventListener('play', thisScene.addHighScore)
      thisScene.scene.start('game-over')
    }
  }
}
