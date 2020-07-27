import Phaser from 'phaser'

export default class CoinMagnet extends Phaser.GameObjects.Container {
  /**
   * Constructor
   * @param {Phaser.Scene} scene
   * @param {Player} player
   */
  constructor (scene, player) {
    var radius = 150
    super(scene, player.playerBody.width / 2, player.playerBody.height / 2, '')
    this.player = player

    scene.add.existing(this)

    this.coinBody = scene.physics.add.sprite(-radius, -radius, '')
    this.coinBody.body.setCircle(radius)
    this.coinBody.setVisible(false)
    this.coinBody.body.setOffset(radius / 10, radius / 10)
    this.coinBody.body.setAllowGravity(false)
    this.add(this.coinBody)

    this.halo = scene.add.circle(0, 0, 150, 0xffffff, 0.2)
    this.halo.setDepth(-1)
    this.add(this.halo)

    this.pulse = scene.add.particles('particles', 'particle_Ring.png', {
      x: 0,
      y: 0,
      frequency: 300,
      lifespan: 800,
      scale: { start: 2.5, end: 0 },
      maxParticles: 4,
      tint: 0xFFE65C,
      emitCallback: (particle) => {
        if (particle.emitter.getAliveParticleCount() === 3) {
          particle.emitter.maxParticles--
        }
      },
      deathCallback: (particle) => {
        if (particle.emitter.getAliveParticleCount() === 0) {
          particle.emitter.maxParticles++
        }
      },
      alpha: (particle, key, t, value) => {
        return 0.39 * ((t < 0.33) ? t / 0.33 : (0.66 - t * t) / 0.66)
      }
    })
    this.add(this.pulse)
  }

  enable () {
    this.coinBody.body.setEnable(true)
    this.halo.setVisible(true)
    this.pulse.setActive(true)
    this.pulse.setVisible(true)
  }

  disable () {
    this.coinBody.body.setEnable(false)
    this.halo.setVisible(false)
    this.pulse.setActive(false)
    this.pulse.setVisible(false)
  }
}
