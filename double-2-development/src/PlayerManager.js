import Phaser from 'phaser'
import MissionManager, { missions } from './MissionManager'

var coinText
var scoreText
var distanceText

var pastCompletedMissions
var currentCompletedMissions
var missionManager

export default class PlayerManager extends Phaser.GameObjects.GameObject {
  constructor (scene, player) {
    super(scene, 'PlayerManager')
    this.player = player

    this.thisRunCoins = 0
    this.thisRunScore = 0
    this.thisRunDistance = 0
    this.distanceIndicator = 25
    this.bestDistance = parseInt(localStorage.getItem('bestDistance'))
    this.setStats = true
  }

  create () {
    this.SetText()

    missionManager = new MissionManager(this.scene, this.player)
    pastCompletedMissions = JSON.parse(localStorage.getItem('allCompletedMissions'))

    if (this.bestDistance > 0) {
      this.scene.add.image(this.bestDistance * 100, this.scene.scale.height * 0.5, 'UI0', 'BestDistanceMarker.png').setAlpha(0.45).setScale(0.8, 1).setRotation(Phaser.Math.DegToRad(90))
    }
  }

  update () {
    this.thisRunCoins = window.global.thisRunNumCoins
    this.thisRunScore = window.global.thisRunScore
    this.thisRunDistance = window.global.thisRunDistance

    currentCompletedMissions = JSON.parse(localStorage.getItem('allCompletedMissions'))



    if (currentCompletedMissions.length > pastCompletedMissions.length) {
      window.global.soundMap.get('missionComplete').play()

      if (currentCompletedMissions.length === 1) {
        const newlyCompleted = missions[currentCompletedMissions.slice(0, 1)]
        this.mission0Text = missionManager.ToString(newlyCompleted)
        pastCompletedMissions = currentCompletedMissions
        this.TweenMission0Completed()
      }

      if (currentCompletedMissions.length === 2) {
        const newlyCompleted = missions[currentCompletedMissions.slice(1, 2)]
        this.mission1Text = missionManager.ToString(newlyCompleted)
        pastCompletedMissions = currentCompletedMissions
        this.TweenMission1Completed()
      }

      if (currentCompletedMissions.length === 3) {
        const newlyCompleted = missions[currentCompletedMissions.slice(2, 3)]
        this.mission2Text = missionManager.ToString(newlyCompleted)
        pastCompletedMissions = currentCompletedMissions
        this.TweenMission2Completed()
      }
    }
 
    this.UpdateText()
    this.UpdatePlayerStats()
    // console.log('coins in storage  ' + localStorage.getItem('nCoins'))
  }

  SetText () {
    var textStyle = {
      font: '50px rubikbold',
      fill: '#FFF',
      stroke: '#000000',
      strokeThickness: 10,
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    }

    coinText = this.scene.add.text(this.scene.scale.width * 0.145, this.scene.scale.height * 0.03, this.thisRunCoins, textStyle).setScrollFactor(0).setDepth(1).setScale(0.6).setOrigin(1, 0)
    scoreText = this.scene.add.text(this.scene.scale.width * 0.98, this.scene.scale.height * 0.02, this.thisRunScore, textStyle).setScrollFactor(0).setDepth(1).setScale(0.9).setOrigin(1, 0)
    distanceText = this.scene.add.text(2500, this.scene.scale.height * 0.94, this.distanceIndicator + 'm', textStyle).setDepth(1).setScale(0.6)

    var missionsTextStyle = {
      font: '24px rubikregular',
      fill: '#f8f8ff',
      stroke: '#f8f8ff',
      strokeThickness: 1,
      boundsAlignH: 'center',
      boundsAlignV: 'middle',
      wordWrap: { width: 320, useAdvancedWrap: true }
    }

    // The scroll factor takes into account the movement of the Camera on the object.
    // Since multiple missions can be finished in the same moment, separate images have to be created for each mission
    this.mission0Text = ''
    this.mission1Text = ''
    this.mission2Text = ''

    this.missionComplete = this.scene.add.image(this.scene.scale.width * 0.74, this.scene.scale.height * 0.07).setScrollFactor(0).setDepth(1).setScale(0.5).setOrigin(0).setAlpha(0)

    this.mission0ImageU = this.scene.add.image(this.scene.scale.width * 0.74, this.scene.scale.height * 0.13).setScrollFactor(0).setDepth(1).setScale(0.7).setOrigin(0).setAlpha(0)
    this.mission0ImageF = this.scene.add.image(this.scene.scale.width * 0.74, this.scene.scale.height * 0.13).setScrollFactor(0).setDepth(1).setScale(0.7).setOrigin(0).setAlpha(0)
    this.mission0TextField = this.scene.add.text(this.scene.scale.width * 0.77, this.scene.scale.height * 0.16, this.missionsText, missionsTextStyle).setScrollFactor(0).setDepth(1).setScale(0.7).setOrigin(0).setAlpha(0)

    this.mission1ImageU = this.scene.add.image(this.scene.scale.width * 0.74, this.scene.scale.height * 0.13 + 50).setScrollFactor(0).setDepth(1).setScale(0.7).setOrigin(0).setAlpha(0)
    this.mission1ImageF = this.scene.add.image(this.scene.scale.width * 0.74, this.scene.scale.height * 0.13 + 50).setScrollFactor(0).setDepth(1).setScale(0.7).setOrigin(0).setAlpha(0)
    this.mission1TextField = this.scene.add.text(this.scene.scale.width * 0.77, this.scene.scale.height * 0.16 + 50, this.missionsText, missionsTextStyle).setScrollFactor(0).setDepth(1).setScale(0.7).setOrigin(0).setAlpha(0)

    this.mission2ImageU = this.scene.add.image(this.scene.scale.width * 0.74, this.scene.scale.height * 0.13 + 100).setScrollFactor(0).setDepth(1).setScale(0.7).setOrigin(0).setAlpha(0)
    this.mission2ImageF = this.scene.add.image(this.scene.scale.width * 0.74, this.scene.scale.height * 0.13 + 100).setScrollFactor(0).setDepth(1).setScale(0.7).setOrigin(0).setAlpha(0)
    this.mission2TextField = this.scene.add.text(this.scene.scale.width * 0.77, this.scene.scale.height * 0.16 + 100, this.missionsText, missionsTextStyle).setScrollFactor(0).setDepth(1).setScale(0.7).setOrigin(0).setAlpha(0)

    if (this.bestDistance > 0) {
      this.scene.add.text(this.bestDistance * 100, this.scene.scale.height * 0.97, 'BEST', textStyle).setScale(0.65).setDepth(1).setOrigin(0.5, 0.5)
    }
  }

  UpdateText () {
    // update coin text amount
    coinText.setText(this.thisRunCoins)

    // update distance text amount
    scoreText.setText(this.thisrunScore)
    this.mission0TextField.setText(this.mission0Text)
    this.mission1TextField.setText(this.mission1Text)
    this.mission2TextField.setText(this.mission2Text)

    // move distance indicator text to next point
    if (this.player.x > distanceText.x + this.scene.scale.width * 0.6) {
      distanceText.x += 2500
      this.distanceIndicator += 25
      distanceText.setText(this.distanceIndicator + 'm')
    }
  }

  UpdatePlayerStats () {
    // updates this run's distance
    window.global.thisRunDistance = Phaser.Math.CeilTo(this.player.x / 100, 0, 1)

    // update best distance
    if (this.thisRunDistance > this.bestDistance) {
      localStorage.setItem('bestDistance', this.thisRunDistance)
    }

    this.setStats = false
  }

  TweenMission0Completed () {
    // A new texture is added to the game object
    this.mission0ImageU.setTexture('mission', 'MissionLongUnfinished.png')
    this.mission0ImageU.scene.tweens.add({
      targets: [this.mission0ImageU],
      alpha: { from: 0, to: 1 },
      ease: 'Linear',
      duration: 500,
      yoyo: false,
      repeat: 0,
      callbackScope: this.mission0ImageU
    })

    this.mission0TextField.scene.tweens.add({
      targets: [this.mission0TextField],
      alpha: { from: 0, to: 1 },
      ease: 'Linear',
      duration: 500,
      yoyo: false,
      repeat: 0,
      callbackScope: this.mission0TextField
    })

    this.missionComplete.setTexture('mission', 'MissionCompleted!.png')
    this.missionComplete.scene.tweens.add({
      targets: [this.missionComplete],
      alpha: { from: 0, to: 1 },
      ease: 'Linear',
      duration: 500,
      yoyo: false,
      repeat: 0,
      callbackScope: this.missionComplete
    })

    this.mission0ImageU.setTexture('mission', 'MissionLongUnfinished.png')
    this.mission0ImageU.scene.tweens.add({
      targets: [this.mission0ImageU],
      alpha: { from: 1, to: 1 },
      delay: 700,
      ease: 'Linear',
      duration: 1000,
      yoyo: false,
      repeat: 0,
      callbackScope: this.mission0ImageU
    })

    this.mission0ImageU.setTexture('mission', 'MissionLongUnfinished.png')
    this.mission0ImageU.scene.tweens.add({
      targets: [this.mission0ImageU],
      alpha: { from: 1, to: 0 },
      delay: 1700,
      ease: 'Linear',
      duration: 500,
      yoyo: false,
      repeat: 0,
      callbackScope: this.mission0ImageU
    })

    this.mission0ImageF.setTexture('mission', 'MissionLongFinished.png')
    this.mission0ImageF.scene.tweens.add({
      targets: [this.mission0ImageF],
      alpha: { from: 0, to: 1 },
      delay: 1700,
      ease: 'Linear',
      duration: 500,
      yoyo: false,
      repeat: 0,
      callbackScope: this.mission0ImageF
    })

    this.mission0ImageF.setTexture('mission', 'MissionLongFinished.png')
    this.mission0ImageF.scene.tweens.add({
      targets: [this.mission0ImageF],
      alpha: { from: 1, to: 1 },
      delay: 2200,
      ease: 'Linear',
      duration: 1000,
      yoyo: false,
      repeat: 0,
      callbackScope: this.mission0ImageF
    })

    this.mission0ImageF.setTexture('mission', 'MissionLongFinished.png')
    this.mission0ImageF.scene.tweens.add({
      targets: [this.mission0ImageF],
      alpha: { from: 1, to: 0 },
      delay: 3200,
      ease: 'Linear',
      duration: 500,
      yoyo: false,
      repeat: 0,
      callbackScope: this.mission0ImageF
    })

    this.mission0TextField.scene.tweens.add({
      targets: [this.mission0TextField],
      alpha: { from: 1, to: 0 },
      delay: 3200,
      ease: 'Linear',
      duration: 500,
      yoyo: false,
      repeat: 0,
      callbackScope: this.mission0TextField
    })

    this.missionComplete.setTexture('mission', 'MissionCompleted!.png')
    this.missionComplete.scene.tweens.add({
      targets: [this.missionComplete],
      alpha: { from: 1, to: 0 },
      ease: 'Linear',
      delay: 3200,
      duration: 500,
      yoyo: false,
      repeat: 0,
      callbackScope: this.missionComplete
    })
  }



  // Tween Mission 2
  TweenMission1Completed () {
    // A new texture is added to the game object
    this.mission1ImageU.setTexture('mission', 'MissionLongUnfinished.png')
    this.mission1ImageU.scene.tweens.add({
      targets: [this.mission1ImageU],
      alpha: { from: 0, to: 1 },
      ease: 'Linear',
      duration: 500,
      yoyo: false,
      repeat: 0,
      callbackScope: this.mission1ImageU
    })

    this.mission1TextField.scene.tweens.add({
      targets: [this.mission1TextField],
      alpha: { from: 0, to: 1 },
      ease: 'Linear',
      duration: 500,
      yoyo: false,
      repeat: 0,
      callbackScope: this.mission1TextField
    })

    this.missionComplete.setTexture('mission', 'MissionCompleted!.png')
    this.missionComplete.scene.tweens.add({
      targets: [this.missionComplete],
      alpha: { from: 0, to: 1 },
      ease: 'Linear',
      duration: 500,
      yoyo: false,
      repeat: 0,
      callbackScope: this.missionComplete
    })

    this.mission1ImageU.setTexture('mission', 'MissionLongUnfinished.png')
    this.mission1ImageU.scene.tweens.add({
      targets: [this.mission1ImageU],
      alpha: { from: 1, to: 1 },
      delay: 700,
      ease: 'Linear',
      duration: 1000,
      yoyo: false,
      repeat: 0,
      callbackScope: this.mission1ImageU
    })

    this.mission1ImageU.setTexture('mission', 'MissionLongUnfinished.png')
    this.mission1ImageU.scene.tweens.add({
      targets: [this.mission1ImageU],
      alpha: { from: 1, to: 0 },
      delay: 1700,
      ease: 'Linear',
      duration: 500,
      yoyo: false,
      repeat: 0,
      callbackScope: this.mission1ImageU
    })

    this.mission1ImageF.setTexture('mission', 'MissionLongFinished.png')
    this.mission1ImageF.scene.tweens.add({
      targets: [this.mission1ImageF],
      alpha: { from: 0, to: 1 },
      delay: 1700,
      ease: 'Linear',
      duration: 500,
      yoyo: false,
      repeat: 0,
      callbackScope: this.mission1ImageF
    })

    this.mission1ImageF.setTexture('mission', 'MissionLongFinished.png')
    this.mission1ImageF.scene.tweens.add({
      targets: [this.mission1ImageF],
      alpha: { from: 1, to: 1 },
      delay: 2200,
      ease: 'Linear',
      duration: 1000,
      yoyo: false,
      repeat: 0,
      callbackScope: this.mission1ImageF
    })

    this.mission1ImageF.setTexture('mission', 'MissionLongFinished.png')
    this.mission1ImageF.scene.tweens.add({
      targets: [this.mission1ImageF],
      alpha: { from: 1, to: 0 },
      delay: 3200,
      ease: 'Linear',
      duration: 500,
      yoyo: false,
      repeat: 0,
      callbackScope: this.mission1ImageF
    })

    this.mission1TextField.scene.tweens.add({
      targets: [this.mission1TextField],
      alpha: { from: 1, to: 0 },
      delay: 3200,
      ease: 'Linear',
      duration: 500,
      yoyo: false,
      repeat: 0,
      callbackScope: this.mission1TextField
    })

    this.missionComplete.setTexture('mission', 'MissionCompleted!.png')
    this.missionComplete.scene.tweens.add({
      targets: [this.missionComplete],
      alpha: { from: 1, to: 0 },
      ease: 'Linear',
      delay: 3200,
      duration: 500,
      yoyo: false,
      repeat: 0,
      callbackScope: this.missionComplete
    })
  }



  // Tween Mission 3
  TweenMission2Completed () {
    // A new texture is added to the game object
    this.mission2ImageU.setTexture('mission', 'MissionLongUnfinished.png')
    this.mission2ImageU.scene.tweens.add({
      targets: [this.mission2ImageU],
      alpha: { from: 0, to: 1 },
      ease: 'Linear',
      duration: 500,
      yoyo: false,
      repeat: 0,
      callbackScope: this.mission2ImageU
    })

    this.mission2TextField.scene.tweens.add({
      targets: [this.mission2TextField],
      alpha: { from: 0, to: 1 },
      ease: 'Linear',
      duration: 500,
      yoyo: false,
      repeat: 0,
      callbackScope: this.mission2TextField
    })

    this.missionComplete.setTexture('mission', 'MissionCompleted!.png')
    this.missionComplete.scene.tweens.add({
      targets: [this.missionComplete],
      alpha: { from: 0, to: 1 },
      ease: 'Linear',
      duration: 500,
      yoyo: false,
      repeat: 0,
      callbackScope: this.missionComplete
    })

    this.mission2ImageU.setTexture('mission', 'MissionLongUnfinished.png')
    this.mission2ImageU.scene.tweens.add({
      targets: [this.mission2ImageU],
      alpha: { from: 1, to: 1 },
      delay: 700,
      ease: 'Linear',
      duration: 1000,
      yoyo: false,
      repeat: 0,
      callbackScope: this.mission2ImageU
    })

    this.mission2ImageU.setTexture('mission', 'MissionLongUnfinished.png')
    this.mission2ImageU.scene.tweens.add({
      targets: [this.mission2ImageU],
      alpha: { from: 1, to: 0 },
      delay: 1700,
      ease: 'Linear',
      duration: 500,
      yoyo: false,
      repeat: 0,
      callbackScope: this.mission2ImageU
    })

    this.mission2ImageF.setTexture('mission', 'MissionLongFinished.png')
    this.mission2ImageF.scene.tweens.add({
      targets: [this.mission2ImageF],
      alpha: { from: 0, to: 1 },
      delay: 1700,
      ease: 'Linear',
      duration: 500,
      yoyo: false,
      repeat: 0,
      callbackScope: this.mission2ImageF
    })

    this.mission2ImageF.setTexture('mission', 'MissionLongFinished.png')
    this.mission2ImageF.scene.tweens.add({
      targets: [this.mission2ImageF],
      alpha: { from: 1, to: 1 },
      delay: 2200,
      ease: 'Linear',
      duration: 1000,
      yoyo: false,
      repeat: 0,
      callbackScope: this.mission2ImageF
    })

    this.mission2ImageF.setTexture('mission', 'MissionLongFinished.png')
    this.mission2ImageF.scene.tweens.add({
      targets: [this.mission2ImageF],
      alpha: { from: 1, to: 0 },
      delay: 3200,
      ease: 'Linear',
      duration: 500,
      yoyo: false,
      repeat: 0,
      callbackScope: this.mission2ImageF
    })

    this.mission2TextField.scene.tweens.add({
      targets: [this.mission2TextField],
      alpha: { from: 1, to: 0 },
      delay: 3200,
      ease: 'Linear',
      duration: 500,
      yoyo: false,
      repeat: 0,
      callbackScope: this.mission2TextField
    })

    this.missionComplete.setTexture('mission', 'MissionCompleted!.png')
    this.missionComplete.scene.tweens.add({
      targets: [this.missionComplete],
      alpha: { from: 1, to: 0 },
      ease: 'Linear',
      delay: 3200,
      duration: 500,
      yoyo: false,
      repeat: 0,
      callbackScope: this.missionComplete
    })
  }
}
