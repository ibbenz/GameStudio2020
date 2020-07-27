import Phaser from 'phaser'
import Timer from './Timer'
import ProgressBar from './ProgressBar'
let timer
let score
export default class Combo extends Phaser.GameObjects.GameObject {
  constructor (sceneIn, player) {
    super(sceneIn, 'Combo')
    sceneIn.add.existing(this)
    this.global = window.global
    this.scene = sceneIn
    this.player = player
    this.score = score
    this.bounce = true
    this.setStats = true
    this.updateCombo = 0
    this.updateScore = 0
    const h = this.scene.cameras.main.height
    const w = this.scene.cameras.main.width
    timer = new Timer(this.scene, 2500)

    this.bar = new ProgressBar(sceneIn, w * 0.44, h * 0.05)
    this.bar.SetCriticalProgress(0.3)

    var comboText = {
      font: '30px rubikbold',
      fill: '#FFFF00FF',
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    }

    var multiplierText = {
      font: '80px rubikbold',
      fill: '#FFF',
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    }

    var scoreText = {
      font: '50px rubikbold',
      fill: '#FFF',
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    }

    // combo-text
    this.comboText = this.scene.add.text(w * 0.47, h * 0.07, 'COMBO!', comboText)
    this.multiplierText = this.scene.add.text(w * 0.57, h * 0.01, 'x2', multiplierText)
    this.scoreText = this.scene.add.text(w * 0.92, h * 0.02, '0', scoreText)
    this.scoreComponents = [this.comboText, this.multiplierText, this.scoreText]
    this.scoreComponents.forEach(comp => {
      comp.setScrollFactor(0)
      comp.setVisible(false)
    })
  }

  increaseCombo () {
    this.global.enemiesPassed += 1
    this.addMultiplier()
    this.initBar()
    this.tweenScore()

    timer.onTick = (progress, remaining) => {
      this.bar.SetProgress(1 - progress)
      this.multiplierText.text = 'x' + `${this.global.scoreMultiplier}`
      if (this.player.y >= 675) {
        this.bounce = true
        if (this.global.enemiesPassed === 2) {
          this.global.thisRunComboDouble += 1
          localStorage.setItem('nComboDoubleThisRun', this.global.thisRunComboDouble)
          this.updateCombo = parseInt(localStorage.getItem('nTotalDoubles')) + 1
          localStorage.setItem('nTotalDoubles', this.updateCombo)
        } else if (this.global.enemiesPassed >= 3) {
          this.global.thisRunComboTriple += 1
          this.updateCombo = parseInt(localStorage.getItem('nTotalTriples')) + 1
          localStorage.setItem('nComboTripleThisRun', this.global.thisRunComboDouble)
          localStorage.setItem('nTotalTriples', this.updateCombo)
        }
        this.global.enemiesPassed = 0
      }
    }

    timer.onTimedOut = () => {
      this.resetBar()
    }
    timer.Start()
  }

  addMultiplier () {
    if (this.player.isInvincible) {
      this.global.scoreMultiplier += 1
      return
    } else {
      this.global.scoreMultiplier += 1
      if (this.bounce) {
        this.bounce = false
        this.global.thisRunScore += this.global.scoreMultiplier - 1
        this.updateScore = JSON.parse(localStorage.getItem('nTotalPoints')) + this.global.scoreMultiplier - 1
        localStorage.setItem('nTotalPoints', this.updateScore)
      } else {
        this.global.scoreMultiplier = this.global.scoreMultiplier + this.global.enemiesPassed * 2 - 1
        this.global.thisRunScore += this.global.scoreMultiplier
        this.updateScore = JSON.parse(localStorage.getItem('nTotalPoints')) + this.global.scoreMultiplier
        localStorage.setItem('nTotalPoints', this.updateScore)
      }
    }
    this.scoreText.text = this.global.thisRunScore
  }

  resetBar () {
    this.global.scoreMultiplier = 1
    this.scoreComponents.forEach(comp => comp.setVisible(false))
    this.bar.SetProgress(0)
  }

  initBar () {
    this.multiplierText.text = 'x' + `${this.global.scoreMultiplier}`
    this.bar.SetProgress(1)
    this.scoreComponents.forEach(comp => comp.setVisible(true))
  }

  tweenScore () {
    var tweenTimeline = this.scene.tweens.createTimeline()

    tweenTimeline.add({
      targets: this.multiplierText,
      scale: 1.07,
      duration: 50,
      yoyo: true
    })

    tweenTimeline.play()
  }
}
