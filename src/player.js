import Phaser from 'phaser'
import CoinMagnet from './CoinMagnet'
import Shield from './Shield'
import StarBoostFX from './FX/StarBoostFX'
import CoinBonanzaFX from './FX/CoinBonanzaFX'
import Timer from './Timer'

let soundcheck = false
let jetsound = null
let pogosound = null
export var deltaFrame

export default class Player extends Phaser.GameObjects.Container {
  constructor (scene, x, y) {
    super(scene, x, y)

    this.scene = scene
    this.x = x
    this.y = y
    this.jetSpeed = 600
    // this.bounceHeight = 1275
    this.bounceHeight = 434
    this.bouncePeriod = 1250
    this.defaultPath = true
    this.isBoostActive = false
    this.isInvincible = false
    this.hasShield = false
    this.gameOverMoveup = true
    this.inVisDuration = 500

    // add to scene
    scene.add.existing(this)
    scene.physics.add.existing(this)

    // settings
    this.body.setCollideWorldBounds(true)
    this.body.setGravityY(2 * this.bounceHeight)
    this.body.setAllowGravity(false)

    // children
    this.playerBody = this.scene.add.sprite(0, 0, '')
    this.playerBody.setDepth(1)
    this.add(this.playerBody)

    this.jetObject = this.scene.add.sprite(-210, -30, '')
    this.jetMode = 'regular'
    this.add(this.jetObject)

    this.coinMagnet = new CoinMagnet(scene, this)
    this.coinMagnet.disable()
    this.add(this.coinMagnet)

    this.shield = new Shield(scene, this)
    this.shield.disable()
    this.add(this.shield)

    this.starBoostFx = new StarBoostFX(scene)
    this.starBoostFx.setActive(false)
    this.starBoostFx.setVisible(false)
    this.add(this.starBoostFx)

    this.coinBonanzaFx = new CoinBonanzaFX(scene)
    this.add(this.coinBonanzaFx)

    this.setDepth(1)

    this.animationTime = 0

    // variables
    this.keys = this.scene.input.keyboard.createCursorKeys()

    this.on('player-hit-ground', (player) => {
      this.bounceFx.x = this.x + 20
      this.bounceFx.emitParticle()
      pogosound.play()
    })

    this.bringToTop(this.playerBody)
  }

  Create () {
    this.CreateAnimation()
    jetsound = window.global.soundMap.get('jetmove')
    pogosound = window.global.soundMap.get('pogobounce1')
    pogosound.volume(0.3)
    jetsound.volume(0.1)
  }

  StartPlayer () {
    if (window.global.isStarting) {
      this.playerBody.anims.setCurrentFrame(this.playerBody.anims.load('player_idle', 4))
      this.PlayJet()
      this.x += 7.5
      // this.y = 0

      if (this.x >= window.global.playerStartX) {
        window.global.isStarting = false
        this.StopJet()
      }
    }
  }

  PlayJet () {
    if (this.isBoostActive) return

    this.jetObject.anims.alpha = 1
    this.jetObject.anims.play(`player-jet-${this.jetMode}-start`, true)
      .once('animationcomplete', () => {
        this.jetObject.anims.play(`player-jet-${this.jetMode}-loop`, true)
      })
  }

  UpdateJet (newJet) {
    if (this.isBoostActive) return

    var oldMode = this.jetMode
    this.jetMode = newJet

    var animationName = ''
    var frameIndex = this.jetObject.anims.currentFrame.index
    if (this.jetObject.anims.currentAnim.key === `player-jet-${oldMode}-start`) {
      animationName = `player-jet-${this.jetMode}-start`
    }
    if (this.jetObject.anims.currentAnim.key === `player-jet-${oldMode}-loop`) {
      animationName = `player-jet-${this.jetMode}-loop`
    }
    if (this.jetObject.anims.currentAnim.key === `player-jet-${oldMode}-end`) {
      animationName = `player-jet-${this.jetMode}-end`
    }
    var anim = this.jetObject.anims.play(animationName, true, frameIndex)

    if (animationName === `player-jet-${this.jetMode}-start`) {
      anim.once('animationcomplete', () => {
        this.jetObject.anims.play(`player-jet-${this.jetMode}-loop`, true)
      })
    }
  }

  StopJet () {
    if (this.isBoostActive) return
    this.jetObject.anims.play(`player-jet-${this.jetMode}-end`, true)
  }

  SetBoostAnimation (isBoostActive) {
    this.isBoostActive = isBoostActive
    if (this.isBoostActive) {
      this.jetObject.x = -490
      this.jetObject.setScale(2)
      this.jetObject.anims.play('player-jet-blast', true)
      this.starBoostFx.setActive(true)
      this.starBoostFx.setVisible(true)
    } else {
      this.jetObject.x = -210
      this.jetObject.setScale(1)
      this.PlayJet()
      if (!this.keys.space.isDown) this.jetObject.anims.pause()
      this.starBoostFx.setActive(false)
      this.starBoostFx.setVisible(false)
    }
  }

  SetInvicibility (isInvincible, boostDuration, invisDuration) {
    this.isInvincible = isInvincible
    this.inVisDuration = boostDuration + invisDuration
  }

  CreateAnimation () {
    // tracks when spacebar is pressed down
    var player = this
    this.scene.input.keyboard.on('keydown-SPACE', function (event) {
      player.playerBody.anims.play('player_jumpforward', true)
      player.playerBody.anims.pause()
      player.PlayJet()
    })

    // tracks when spacebar is released
    this.scene.input.keyboard.on('keyup-SPACE', function (event) {
      player.playerBody.anims.play('player_idle', true)
      player.playerBody.anims.pause()
      player.StopJet()
    })

    // idle jump animation
    this.scene.anims.create({
      key: 'player_idle',
      // frameRate: 9.1,
      duration: 1250,
      // @ts-ignore
      frames: this.scene.anims.generateFrameNames('playersheet', {
        prefix: 'SPR_JumpIdle_',
        suffix: '.png',
        start: 0,
        end: 24
      }),
      repeat: 0
    })

    // forward jump animation
    this.scene.anims.create({
      key: 'player_jumpforward',
      frameRate: 9.1,
      // @ts-ignore
      frames: this.scene.anims.generateFrameNames('playersheet', {
        prefix: 'SPR_JumpForward_',
        suffix: '.png',
        start: 0,
        end: 24
      }),
      repeat: 0
    })

    // game over start animation
    this.scene.anims.create({
      key: 'GOS',
      frameRate: 5,
      // @ts-ignore
      frames: this.scene.anims.generateFrameNames('playersheet', {
        prefix: 'SPR_GameOverStart_',
        suffix: '.png',
        start: 0,
        end: 9
      }),
      repeat: 0
    })

    // regular jet animation
    this.scene.anims.create({
      key: 'player-jet-regular-start',
      frameRate: 30,
      frames: this.scene.anims.generateFrameNames('jet', {
        prefix: 'JetBlast_Regular_',
        suffix: '.png',
        start: 1,
        end: 8,
        zeroPad: 4
      })
    })

    this.scene.anims.create({
      key: 'player-jet-regular-loop',
      frameRate: 30,
      frames: this.scene.anims.generateFrameNames('jet', {
        prefix: 'JetBlast_Regular_',
        suffix: '.png',
        start: 9,
        end: 13,
        zeroPad: 4
      }),
      repeat: -1
    })

    this.scene.anims.create({
      key: 'player-jet-regular-end',
      frameRate: 30,
      frames: this.scene.anims.generateFrameNames('jet', {
        prefix: 'JetBlast_Regular_',
        suffix: '.png',
        start: 14,
        end: 18,
        zeroPad: 4
      })
    })

    // boost jet animation
    this.scene.anims.create({
      key: 'player-jet-boost-start',
      frameRate: 30,
      frames: this.scene.anims.generateFrameNames('jet', {
        prefix: 'JetBlast_Faster_',
        suffix: '.png',
        start: 1,
        end: 8,
        zeroPad: 4
      })
    })

    this.scene.anims.create({
      key: 'player-jet-boost-loop',
      frameRate: 30,
      frames: this.scene.anims.generateFrameNames('jet', {
        prefix: 'JetBlast_Faster_',
        suffix: '.png',
        start: 9,
        end: 13,
        zeroPad: 4
      }),
      repeat: -1
    })

    this.scene.anims.create({
      key: 'player-jet-boost-end',
      frameRate: 30,
      frames: this.scene.anims.generateFrameNames('jet', {
        prefix: 'JetBlast_Faster_',
        suffix: '.png',
        start: 14,
        end: 18,
        zeroPad: 4
      })
    })
  }

  preUpdate (time, delta) {
    // super.preUpdate(time, delta)
    deltaFrame = delta
    this.StartPlayer()

    // --------------------------------------------- PHYSICS
    if (!window.global.startGameOver) {
      // forward movement for player
      if (!this.isBoostActive) {
        if (this.keys.space.isDown) {
          this.body.setVelocityX(this.jetSpeed)
          jetsound.play()
        } else {
          this.body.setVelocityX(0)
          jetsound.stop()
        }
      } else {
        if (!window.global.soundMap.has('boost')) {
          if (this.keys.space.isDown) {
            this.body.setVelocityX(this.jetSpeed)
            jetsound.play()
          } else {
            this.body.setVelocityX(0)
            jetsound.stop()
          }
        }

        if (window.global.soundMap.has('boost')) {
          if (!(window.global.soundMap.get('boost').playing())) {
            window.global.soundMap.get('boost').play()
            this.body.setVelocityX(this.jetSpeed)
          }
        }
      }

      if (this.defaultPath) {
        this.animationTime += delta
        this.animationTime %= this.bouncePeriod
        var t = 2 * this.animationTime / this.bouncePeriod
        this.y = 695 + (this.bounceHeight * t * t - 2 * this.bounceHeight * t)
      }

      if (this.y >= 675) this.emit('player-hit-ground', this)
    } else {
      if (this.gameOverMoveup) {
        this.emit('player-death')
        this.body.setVelocityY(-500)
        this.body.setCollideWorldBounds(false)
        this.body.setGravityY(1000)
        this.body.setAllowGravity(true)
        this.body.setVelocityX(0)
        this.jetObject.anims.stop()
        this.jetObject.alpha = 0
        jetsound.stop()
        this.gameOverMoveup = false
      }
    }

    // -------------------------------------------- HIT BOX
    var jetWidth = this.playerBody.anims.currentFrame.frame.width * 0.35
    this.body.setSize(this.playerBody.anims.currentFrame.frame.width - jetWidth, this.playerBody.anims.currentFrame.frame.height)
    this.body.setOffset(-(this.body.width - jetWidth) / 2, -this.body.height / 2)

    // ---------------------------------------------- ANIMATIONS
    if (!soundcheck) {
      // window.global.sound.play('pogobounce1', { loop: true })
      soundcheck = true
    }
    if (!window.global.startGameOver) {
      this.playerBody.anims.setCurrentFrame(this.playerBody.anims.currentAnim.getFrameByProgress(t / 2))
    }
    if (window.global.startGameOver) {
      this.playerBody.anims.play('GOS', true)
    }

    if (window.global.startBoost) {
      this.UseStartBoost()
    }

    if (this.isInvincible) {
      this.BecomeInvinsible()
    }
  }

  Reset () {
    this.animationTime = 0
    this.playerBody.anims.play('player_idle', true)
    this.playerBody.anims.pause()
    this.body.setAllowGravity(false)
    this.body.setVelocityY(0)
    this.jetObject.alpha = 1
  }

  UseStartBoost () {
    if (this.scene.anims.exists('player-jet-blast')) {
      var duration = 300 * parseInt(localStorage.getItem('startBoostLevel'))
      var timer = new Timer(this.scene, duration)

      this.SetBoostAnimation(true)
      this.SetInvicibility(true, duration, 1500)

      var lerp = {
        x: this.scene.cameras.main.lerp.x,
        y: this.scene.cameras.main.lerp.y
      }
      this.scene.cameras.main.setLerp(0.5, lerp.y)

      timer.onTick = (progress, remaining) => {
        this.body.setVelocityX(7 * remaining)
      }
      timer.onTimedOut = () => {
        this.body.setVelocityX(0)
        this.SetBoostAnimation(false)
        this.scene.cameras.main.setLerp(lerp.x, lerp.y)
        window.global.startBoost = false
      }
      timer.Start()
    }
  }

  BecomeInvinsible () {
    var invincibilityDuration = this.inVisDuration
    var invinTimer = new Timer(this.scene, invincibilityDuration)

    invinTimer.onTimedOut = () => {
      this.SetInvicibility(false)
    }
    invinTimer.Start()
  }
}
