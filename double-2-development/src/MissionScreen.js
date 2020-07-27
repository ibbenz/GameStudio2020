import Phaser from 'phaser'

var width
var height
var thisScene
var audioMission = document.createElement('audio')
var audioPiggy = document.createElement('audio')
var audioPiggyBreak = document.createElement('audio')
var audioPiggyDrums = document.createElement('audio')
var audioPiggyComplete = document.createElement('audio')
var missionLength
var keypressed

export default class MissionScreen extends Phaser.Scene {
  constructor () {
    super('mission-screen')
    this.gotReward = false
    this.textfield = null
    this.texttween = null
    this.currentMission = 0
  }

  preload () {
    this.load.image('missionbackground', '/Missions/missionCompleteBG_lowq.jpg')
    this.load.atlas('missionAccomplished', 'Missions/mission_accomplished.png', 'Missions/mission_accomplished.json')
  }

  create () {
    this.audioMission = audioMission
    this.audioPiggy = audioPiggy
    this.audioPiggyBreak = audioPiggyBreak
    this.audioPiggyDrums = audioPiggyDrums
    this.audioPiggyComplete = audioPiggyComplete

    keypressed = false
    thisScene = this

    this.audioMission.src = '/Missions/Music_Jingle_Mission_Complete_1.mp3'
    this.audioMission.loop = false
    this.audioMission.autoplay = true

    this.audioPiggy.src = '/Missions/Rewardscreen_Piggi_Bank_Appear.mp3'
    this.audioPiggy.loop = false
    this.audioPiggy.autoplay = true

    const h = this.cameras.main.height
    const w = this.cameras.main.width
    this.missionManager = window.global.gameScene.missionManager
    this.completedMissions = this.missionManager.completedMissions

    if (this.completedMissions.length > 0) {
      this.currentMission = this.completedMissions.shift()
      missionLength = this.completedMissions.length
      const currentText = this.missionManager.ToString(this.currentMission)

      var coinTextStyle = {
        font: '30px rubikregular',
        fill: '#f0ffff',
        stroke: '#f0ffff',
        strokeThickness: 0,
        boundsAlignH: 'center',
        boundsAlignV: 'middle'
      }

      width = w
      height = h
      const background = this.physics.add.image(width / 2, height / 2, 'missionbackground').setOrigin(0.5).setScale(1.2)
      background.setAngularVelocity(25)
      background.body.setAllowGravity(false)

      this.missiontween = this.physics.add.sprite(w * 0.5, h * 0.15)
      this.missiontween.setScale(0.01)
      this.missiontween.body.setAllowGravity(false)

      // luckycattween
      this.luckycattween = this.physics.add.sprite(w * 0.475, h * 0.5)
      this.luckycattween.setScale(0.01)
      this.luckycattween.body.setAllowGravity(false)

      this.hammertween = this.physics.add.sprite(w * 0.75, h * 0.5)
      this.hammertween.setScale(1)
      this.hammertween.body.setAllowGravity(false)

      this.smashtween = this.physics.add.sprite(w * 0.5, h * 0.8)
      this.smashtween.setScale(1)
      this.smashtween.body.setAllowGravity(false)

      // spawnfishTween
      this.fishtween = this.physics.add.sprite(w * 0.475, h * 0.5)
      this.fishtween.setScale(0.01)
      this.fishtween.body.setAllowGravity(false)

      this.textfield = this.add.text(w * 0.4, h * 0.25, currentText, coinTextStyle).setOrigin(0, 0.5).setScale(0.7)
      this.audioMission.addEventListener('play', thisScene.TweenReward)
    }
  }

  userInput () {
    this.onKeyDown()
    // this.onPointerDown(keypressed, missionLength)
  }

  // onPointerDown (keypressed, missionLength) {
  //   thisScene.input.on('pointerdown', () => {
  // if (!keypressed) {
  //   thisScene.audioPiggyDrums.pause()
  //   thisScene.TweenSmashCat()
  //   thisScene.audioPiggyBreak.src = '/Missions/Rewardscreen_Piggi_Bank_Break.mp3'
  //   thisScene.audioPiggyBreak.loop = false
  //   thisScene.audioPiggyBreak.autoplay = true
  //   thisScene.TweenCrumbleCat()
  //   thisScene.audioPiggyBreak.addEventListener('play', thisScene.addPiggyBreakSound)
  // }
  //     keypressed = true
  //   })
  //   return keypressed
  // }

  onKeyDown () {
    thisScene.input.keyboard.on('keydown', () => {
      if (!keypressed) {
        thisScene.audioPiggyDrums.pause()
        thisScene.TweenSmashCat()
        thisScene.audioPiggyBreak.src = '/Missions/Rewardscreen_Piggi_Bank_Break.mp3'
        thisScene.audioPiggyBreak.loop = false
        thisScene.audioPiggyBreak.autoplay = true
        thisScene.TweenCrumbleCat()
        thisScene.audioPiggyBreak.addEventListener('play', thisScene.addPiggyBreakSound)
      }
      keypressed = true
    })
    return keypressed
  }

  addPiggyBreakSound () {
    thisScene.audioPiggyBreak.autoplay = false
    thisScene.audioPiggy.autoplay = false
    thisScene.audioPiggyComplete.autoplay = false
    // "this" is here the audioPiggy, for the scene, use "thisScene"
    thisScene.rewardSpawn(missionLength, thisScene)
  }

  TweenReward () {
    // A new texture is added to the game object
    thisScene.missiontween.setTexture('missionAccomplished', 'MissionCompleteTxt.png')
    // this.flameTween = obj.setTexture('fire')
    thisScene.missiontween.scene.tweens.add({
      alpha: { from: 0, to: 1 },
      targets: [thisScene.missiontween],
      delay: 400,
      scale: { from: 0, to: 1.7 },
      ease: 'Linear',
      duration: 1500,
      yoyo: false,
      repeat: 0,
      callbackScope: thisScene.missiontween
    })

    // A new texture is added to the game object
    thisScene.luckycattween.setTexture('missionAccomplished', 'lucky cat.png')
    // this.flameTween = obj.setTexture('fire')
    thisScene.luckycattween.scene.tweens.add({
      alpha: { from: 0, to: 1 },
      targets: [thisScene.luckycattween],
      delay: 1400,
      angle: { from: 0, to: 730 },
      scale: { from: 0, to: 1.0 },
      ease: 'Linear',
      duration: 1500,
      yoyo: false,
      repeat: 0,
      callbackScope: thisScene.luckycattween,
      onComplete: thisScene.executeWaitingTweens.bind(thisScene)
    })
  }

  // After the lucky cat is loaded the keys are activated and the cats are waiting for a push
  executeWaitingTweens () {
    thisScene.TweenReward2()
    thisScene.userInput()
  }

  TweenReward2 () {
    // A new texture is added to the game object
    // console.log('du da')
    thisScene.luckycattween.setTexture('missionAccomplished', 'lucky cat.png')
    // this.flameTween = obj.setTexture('fire')
    thisScene.luckycattween.scene.tweens.add({
      targets: [thisScene.luckycattween],
      angle: { from: 730, to: 710 },
      scale: { from: 1.0, to: 0.9 },
      ease: 'Linear',
      duration: 500,
      yoyo: true,
      repeat: -1,
      callbackScope: thisScene.luckycattween
    })

    thisScene.hammertween.setTexture('missionAccomplished', 'hammer.png')
    // this.flameTween = obj.setTexture('fire')
    thisScene.hammertween.scene.tweens.add({
      targets: [thisScene.hammertween],
      angle: { from: -30, to: -10 },
      ease: 'Linear',
      duration: 500,
      yoyo: true,
      repeat: -1,
      callbackScope: thisScene.hammertween
    })

    thisScene.smashtween.setTexture('missionAccomplished', 'SMASH.png')
    // this.flameTween = obj.setTexture('fire')
    thisScene.smashtween.scene.tweens.add({
      targets: [thisScene.smashtween],
      ease: 'Linear',
      scale: { from: 1.0, to: 1.1 },
      duration: 500,
      yoyo: true,
      repeat: -1,
      callbackScope: thisScene.smashtween
    })

    thisScene.audioPiggyDrums.src = '/Missions/Music_Jingle_Mission_Complete_2_loop_short.mp3'
    thisScene.audioPiggyDrums.loop = true
    thisScene.audioPiggyDrums.autoplay = true
  }

  TweenSmashCat () {
    // A new texture is added to the game object
    // this.flameTween = obj.setTexture('fire')
    thisScene.hammertween.scene.tweens.add({
      targets: [thisScene.hammertween],
      scale: { from: 1.0, to: 0.5 },
      angle: -90,
      x: width / 2,
      ease: 'Linear',
      duration: 200,
      yoyo: false,
      repeat: 0,
      callbackScope: thisScene.hammertween
    })
  }

  TweenCrumbleCat () {
    // A new texture is added to the game object
    // this.flameTween = obj.setTexture('fire')
    thisScene.hammertween.scene.tweens.add({
      targets: [thisScene.hammertween],
      scale: { from: 0.5, to: 0.5 },
      delay: 200,
      alpha: { from: 1, to: 0 },
      angle: -90,
      x: width / 2,
      ease: 'Linear',
      duration: 200,
      yoyo: false,
      repeat: 0,
      callbackScope: thisScene.hammertween
    })

    thisScene.luckycattween.scene.tweens.add({
      targets: [thisScene.luckycattween],
      scale: { from: 1, to: 0 },
      delay: 200,
      alpha: { from: 1, to: 0 },
      angle: 0,
      ease: 'Linear',
      duration: 200,
      yoyo: false,
      repeat: 0,
      callbackScope: thisScene.luckycattween
    })

    thisScene.luckycattween.scene.tweens.add({
      targets: [thisScene.luckycattween],
      scale: { from: 1, to: 0 },
      delay: 200,
      alpha: { from: 1, to: 0 },
      angle: 0,
      ease: 'Linear',
      duration: 200,
      yoyo: false,
      repeat: 0,
      callbackScope: thisScene.luckycattween
    })

    thisScene.smashtween.scene.tweens.add({
      targets: [thisScene.smashtween],
      alpha: { from: 1, to: 0 },
      ease: 'Linear',
      duration: 200,
      yoyo: false,
      repeat: 0,
      callbackScope: thisScene.smashtween
    })
  }

  changeScreen (sceneIn) {
    if (missionLength >= 1) {
      audioMission.removeEventListener('play', thisScene.TweenReward)
      audioPiggyComplete.removeEventListener('play', thisScene.addMoneyFish)
      audioPiggyBreak.removeEventListener('play', thisScene.addPiggyBreakSound)
      sceneIn.scene.restart()
    } else {
      audioMission.removeEventListener('play', thisScene.TweenReward)
      audioPiggyComplete.removeEventListener('play', thisScene.addMoneyFish)
      audioPiggyBreak.removeEventListener('play', thisScene.addPiggyBreakSound)
      sceneIn.scene.pause()
      // Check if we got a new level.
      const oldLevel = localStorage.getItem('level')
      // console.log('oldLevel: ' + oldLevel)
      thisScene.missionManager.RefreshActiveMissions()
      // console.log('newLevel: ' + localStorage.getItem('level'))
      if (oldLevel < localStorage.getItem('level')) {
        sceneIn.scene.start('levelup-screen')
      } else {
        sceneIn.scene.start('game-over')
      }
    }
  }

  rewardSpawn (missionLength, thisScene) {
    const rewardtext = ' + ' + thisScene.currentMission.reward
    thisScene.textfield.setText(rewardtext)
    thisScene.textfield.setFill('#ffb90f')
    thisScene.textfield.setFont('90px rubikregular')
    thisScene.UpdateCoins(thisScene.currentMission.reward)
    thisScene.TweenSpawnFish(thisScene, missionLength)
  }

  TweenSpawnFish (thisScene, missionLength) {
    thisScene.audioPiggyComplete.src = '/Missions/Music_Jingle_Mission_Complete_3.mp3'
    thisScene.audioPiggyComplete.loop = false
    thisScene.audioPiggyComplete.autoplay = true
    thisScene.audioPiggyComplete.addEventListener('play', thisScene.addMoneyFish)

    // thisScene.audioPiggyComplete.addEventListener('play', function () {
    //   thisScene.TweenSpawnFish2.bind(thisScene, missionLength)
    // })
  }

  addMoneyFish () {
    thisScene.fishtween.setTexture('missionAccomplished', 'SPR_MoneyFishBG.png')
    thisScene.fishtween.scene.tweens.add({
      targets: [thisScene.fishtween],
      alpha: { from: 0, to: 1 },
      scale: { from: 0, to: 1.0 },
      angle: { from: 0, to: 730 },
      ease: 'Linear',
      duration: 800,
      yoyo: false,
      repeat: 0,
      callbackScope: thisScene.fishtween,
      onComplete: thisScene.TweenSpawnFish2.bind(this, thisScene, missionLength)
    })
  }

  TweenSpawnFish2 (thisScene, missionLength) {
  // TweenSpawnFish2 (thisScene, missionLength, audioPiggyComp) {
    thisScene.fishtween.setTexture('missionAccomplished', 'SPR_MoneyFishBG.png')
    thisScene.fishtween.scene.tweens.add({
      targets: [thisScene.fishtween],
      scale: { from: 1, to: 1.0 },
      angle: { from: 730, to: 720 },
      ease: 'Linear',
      duration: 2400,
      yoyo: false,
      repeat: 0,
      callbackScope: thisScene.fishtween,
      onComplete: thisScene.changeScreen.bind(this, thisScene)
    })
  }

  UpdateCoins (rewardIn) {
    const currentCoins = parseInt(localStorage.getItem('nCoins'))
    const newCoins = currentCoins + rewardIn
    localStorage.setItem('nCoins', newCoins)
  }
}
