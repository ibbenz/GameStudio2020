import Phaser from 'phaser'
import Timer from './Timer'

export const PowerUpType = {
  INVINCIBILITY: 1, // fast-forward
  FASTER: 2, // powerful jetpack
  COIN_BONANZA: 3, // big jmp with coins
  MAGNET: 4, // coin magnet
  HEART: 5, // heart
  X2: 6, // score multiplier
  SHIELD: 7 // shield
}

const PowerUpAnim = [
  'powerup-star-boost-anim',
  'powerup-faster-anim',
  'powerup-coin-bonanza-anim',
  'powerup-magnet-anim',
  'powerup-heart-anim',
  'powerup-x2-anim',
  'powerup-shield-anim'
]

export default class PowerUp extends Phaser.Physics.Arcade.Sprite {
  /**
   * Constructor
   * @param {Phaser.Scene} scene
   * @param {EntityManager} entityManager
   */
  constructor (scene, entityManager) {
    super(scene, 200, 200)
    this.entityManager = entityManager
    this.player = entityManager.player
    this.bar = scene.powerUpBar
    console.log(this.bar)
    this.amplitude = 0
    this.type = 0

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.body.setAllowGravity(false)
    scene.physics.add.overlap(entityManager.player, this, () => this.PickUp())
  }

  preUpdate (time, delta) {
    this.anims.update(time, delta)
    this.x -= delta / 7
    this.y = this.offset + this.amplitude * Math.sin(2 * Math.PI * time / 3000)
  }

  setType (type) {
    this.type = type
    this.anims.play(PowerUpAnim[type - 1])
    this.body.setSize(this.anims.currentFrame.frame.width, this.anims.currentFrame.frame.height)
  }

  PickUp () {
    this.setActive(false)
    this.setVisible(false)
    this.body.checkCollision.none = true
    this.bar.SetPowerUpFrame(this.type)

    switch (this.type) {
      case PowerUpType.INVINCIBILITY:
        this.PickUpInvincility()
        if (window.global.soundMap.has('invincible')) { window.global.soundMap.get('invincible').play() }
        break

      case PowerUpType.FASTER:
        if (window.global.soundMap.has('generic')) { window.global.soundMap.get('generic').play() }
        this.PickUpFaster()
        break

      case PowerUpType.COIN_BONANZA:
        this.PickUpCoinBonanza()
        break

      case PowerUpType.MAGNET:
        if (window.global.soundMap.has('magnet')) { window.global.soundMap.get('magnet').play() }
        this.PickUpMagnet()
        break

      case PowerUpType.HEART:
        if (window.global.soundMap.has('heart')) { window.global.soundMap.get('heart').play() }
        this.PickUpHeart()
        break

      case PowerUpType.X2:
        if (window.global.soundMap.has('generic')) { window.global.soundMap.get('generic').play() }
        this.PickUpX2()
        break

      case PowerUpType.SHIELD:
        if (window.global.soundMap.has('generic')) { window.global.soundMap.get('generic').play() }
        this.PickUpShield()
        break
    }
  }

  PickUpInvincility () {
    var level = parseInt(localStorage.getItem('invincibilityLevel'))
    var duration = 5000 * level
    this.bar.SetLevel(level - 1)
    this.bar.Toggle()
    var timer = new Timer(this.scene, duration)

    this.player.SetBoostAnimation(true)
    this.player.SetInvicibility(true, duration, 1500)

    var lerp = {
      x: this.scene.cameras.main.lerp.x,
      y: this.scene.cameras.main.lerp.y
    }
    this.scene.cameras.main.setLerp(0.5, lerp.y)

    timer.onTick = (progress, remaining) => {
      this.player.body.setVelocityX(7 * remaining)
      this.bar.SetProgress(1 - progress)
    }
    timer.onTimedOut = () => {
      this.player.SetBoostAnimation(false)
      this.player.body.setVelocityX(0)
      this.scene.cameras.main.setLerp(lerp.x, lerp.y)
      this.bar.Toggle()
    }
    timer.Start()
  }

  PickUpFaster () {
    var level = parseInt(localStorage.getItem('fasterLevel'))
    this.player.jetSpeed *= 1.5
    this.player.UpdateJet('boost')
    var duration = 5000 * level
    if (duration < 5000) duration = 5000
    this.bar.SetLevel(level - 1)
    this.bar.Toggle()
    var timer = new Timer(this.scene, duration)
    timer.onTick = (progress) => this.bar.SetProgress(1 - progress)
    timer.onTimedOut = () => {
      this.player.jetSpeed /= 1.5
      this.player.UpdateJet('regular')
      this.bar.Toggle()
    }
    timer.Start()
  }

  PickUpCoinBonanza () {
    if (this.player.isInvincible) return

    this.player.SetInvicibility(true, 10000, 0)
    this.entityManager.SpawnCoinTrail()
    this.player.defaultPath = false
    this.player.body.setAllowGravity(true)
    this.player.coinBonanzaFx.PlayAnim()

    var lerp = this.scene.cameras.main.lerp
    this.scene.cameras.main.setLerp(0.1, 0.3)

    var velocityTimer = new Timer(this.scene, 2500)
    velocityTimer.onTick = (progress, remaining) => {
      this.player.body.setVelocityY(-remaining / 1.5)
    }
    velocityTimer.Start()

    this.scene.cameras.main.setBounds(0, -2000, 10000000, 2820)
    this.player.once('player-hit-ground', () => {
      this.player.SetInvicibility(true, 2000, 0)
      this.player.defaultPath = true
      this.player.animationTime = 0
      this.player.body.setVelocityY(0)
      this.player.body.setAllowGravity(false)
      this.player.cbLanding.Play()
      this.scene.cameras.main.setBounds(0, 0, 1000000, 820)
      this.scene.cameras.main.setLerp(lerp.x, lerp.y)
    })
  }

  PickUpMagnet () {
    var level = parseInt(localStorage.getItem('coinMagnetLevel'))
    this.player.coinMagnet.enable()
    var duration = 5000 * level
    if (duration < 5000) duration = 5000
    this.bar.SetLevel(level - 1)
    this.bar.Toggle()
    var timer = new Timer(this.scene, duration)
    timer.onTick = (progress) => this.bar.SetProgress(1 - progress)
    timer.onTimedOut = () => {
      this.bar.Toggle()
      this.player.coinMagnet.disable()
    }
    timer.Start()
  }

  PickUpHeart () {
    localStorage.setItem('nContinues', localStorage.getItem('nContinues') + 1)
  }

  PickUpX2 () {
    var level = parseInt(localStorage.getItem('X2Level'))
    var duration = 5000 * level
    if (duration < 5000) duration = 5000
    this.bar.SetLevel(level - 1)
    this.bar.Toggle()
    var timer = new Timer(this.scene, duration)
    timer.onTick = (progress) => this.bar.SetProgress(1 - progress)
    // TODO : Add score mutliplier
    timer.onTimedOut = () => {
      this.bar.Toggle()
    // TODO : Remove score multiplier
    }
    timer.Start()
  }

  PickUpShield () {
    this.player.shield.enable()
  }
}
