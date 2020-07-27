import Phaser from 'phaser'

export default class Timer extends Phaser.GameObjects.GameObject {
  /**
   * Timer Constructor
   * @param {integer} defaultTime
   * @param {function ()} onTimedOut
   * @param {function (integer, integer)} onTick
   * The first parameter is the progress of the timer and the second one is the remaining time
   */
  constructor (scene, defaultTime, onTimedOut, onTick) {
    super(scene, 'Timer')
    scene.add.existing(this)
    this.defaultTime = defaultTime != null ? defaultTime : 0
    this.time = 0
    this.progress = 0
    this.startTime = 0
    this.onTimedOut = onTimedOut
    this.onTick = onTick
  }

  Start (time) {
    if (time == null) {
      time = this.defaultTime
    }
    this.time = time
    this.progress = 0
    this.startTime = Date.now()
  }

  Reset () {
    this.time = this.defaultTime
    this.progress = 0
    this.startTime = Date.now()
  }

  preUpdate (time, delta) {
    if (this.progress >= this.time) {
      return
    }

    var previousProgress = this.progress
    this.progress += delta
    if (this.onTick) {
      this.onTick(this.progress / this.time, this.time - this.progress)
    }
    if (previousProgress < this.time && this.progress >= this.time && this.onTimedOut) {
      this.onTimedOut()
      this.progress = 0
      this.time = 0
      this.startTime = 0
    }
  }
}
