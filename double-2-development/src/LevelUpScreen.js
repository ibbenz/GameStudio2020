import Phaser from 'phaser'
var thisScene
var audioLevelUp = document.createElement('audio')
var audioHeart = document.createElement('audio')

export default class LevelUpScreen extends Phaser.Scene {
  constructor () {
    super('levelup-screen')
    this.gotReward = false
    this.texttween = null
    this.audioLevelUp = null
    this.audioHeart = null
    this.textfield = null
  }

  preload () {
    this.load.atlas('missionAccomplished', 'Missions/mission_accomplished.png', 'Missions/mission_accomplished.json')
    this.load.atlas('missions', 'Missions/mission.png', 'Missions/mission.json')
  }

  create () {
    const h = this.cameras.main.height
    const w = this.cameras.main.width
    thisScene = this

    var coinTextStyle = {
      font: '150px rubikbold',
      fill: '#cd2626',
      stroke: '#cd2626',
      strokeThickness: 2,
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    }

    this.missionManager = window.global.gameScene.missionManager
    this.completedMissions = this.missionManager.completedMissions

    this.audioLevelUp = audioLevelUp
    this.audioHeart = audioHeart

    this.audioLevelUp.src = '/Missions/Music_Jingle_Game_Over_New_Level.mp3'
    this.audioLevelUp.loop = false
    this.audioLevelUp.autoplay = true

    this.audioHeart.src = '/Missions/Rewardscreen_Earn_Heart.mp3'
    this.audioHeart.loop = false
    this.audioHeart.autoplay = true

    const background = this.physics.add.image(w / 2, h / 2, 'missionbackground').setOrigin(0.5).setScale(1.2)
    background.setAngularVelocity(25)
    background.body.setAllowGravity(false)

    this.texttween = this.physics.add.sprite(w * 0.5, h * 0.15)
    this.texttween.setScale(0.01)
    this.texttween.body.setAllowGravity(false)

    this.hearttween = this.physics.add.sprite(w * 0.475, h * 0.5)
    this.hearttween.setScale(0.01)
    this.hearttween.body.setAllowGravity(false)

    this.textfield = this.add.text(w * 0.6, h * 0.5, '', coinTextStyle).setOrigin(0, 0.5).setScale(1)

    thisScene.audioLevelUp.addEventListener('play', thisScene.TweenReward)
  }

  TweenReward () {
    // A new texture is added to the game object
    thisScene.texttween.setTexture('missionAccomplished', 'LevelUp!.png')
    // this.flameTween = obj.setTexture('fire')
    thisScene.texttween.scene.tweens.add({
      alpha: { from: 0, to: 0.8 },
      targets: [thisScene.texttween],
      delay: 100,
      scale: { from: 0, to: 1.7 },
      ease: 'Linear',
      duration: 2000,
      yoyo: false,
      repeat: 0,
      callbackScope: thisScene.texttween
    })

    // A new texture is added to the game object
    thisScene.hearttween.setTexture('missionAccomplished', 'icon_heartfish.png')
    thisScene.hearttween.scene.tweens.add({
      alpha: { from: 0, to: 0.8 },
      targets: [thisScene.hearttween],
      delay: 100,
      angle: { from: 0, to: 730 },
      scale: { from: 0, to: 1.0 },
      ease: 'Linear',
      duration: 2000,
      yoyo: false,
      repeat: 0,
      callbackScope: thisScene.hearttween,
      onComplete: thisScene.TweenReward2.bind()
    })
  }

  TweenReward2 () {
    let newlife = parseInt(localStorage.getItem('level'))
    newlife = newlife + 1
    const lifetext = ' + ' + newlife
    localStorage.setItem('nContinues', parseInt(localStorage.getItem('nContinues')) + newlife)
    thisScene.textfield.setText(lifetext)
    thisScene.textfield.setFill('#f8f8ff')
    thisScene.textfield.setStroke('#f8f8ff')
    thisScene.textfield.setFont('50px rubikbold')
    // this.flameTween = obj.setTexture('fire')
    thisScene.hearttween.scene.tweens.add({
      targets: [thisScene.hearttween],
      ease: 'Linear',
      scale: { from: 1, to: 1.0 },
      duration: 5000,
      yoyo: false,
      repeat: 0,
      callbackScope: thisScene.hearttween,
      onComplete: thisScene.changeScreen.bind()
    })
  }

  changeScreen () {
    thisScene.audioLevelUp.removeEventListener('play', thisScene.TweenReward)
    thisScene.scene.start('game-over')
    // thisScene.input.keyboard.on('keydown', () => thisScene.scene.start('game-over'))
    // thisScene.input.on('pointerdown', () => thisScene.scene.start('game-over'))
  }
}
