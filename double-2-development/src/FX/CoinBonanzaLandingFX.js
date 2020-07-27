import Phaser from 'phaser'

export default class CoinBonanzaLandingFX extends Phaser.GameObjects.Container {
  constructor (scene, player) {
    super(scene, 0, 695)
    this.player = player

    scene.add.existing(this)

    this.flash = scene.add.particles('particles', 'particle_Glow.png', {
      x: 0,
      y: 0,
      lifespan: 300,
      frequency: -1,
      scale: (particle, key, t) => 6 * t,
      alpha: (particle, key, t) => 1 - t
    })
    this.add(this.flash)

    this.dust = scene.add.particles('particles', 'particle_smoke.png', {
      x: 0,
      y: 0,
      frequency: -1,
      lifespan: { min: 200, max: 800 },
      speed: 300,
      quantity: 20,
      radial: true,
      angle: { min: 0, max: 360 },
      scale: (particle, key, t) => {
        if (!particle.initScale) particle.initScale = Math.randRange(0.5, 1.5)
        return particle.initScale * ((t < 0.2) ? t / 0.2 : 1 - (t - 0.2) / 0.8)
      },
      rotate: (particle, key, t) => {
        if (!particle.initRotate) particle.initRotate = Math.randRange(0, 360)
        return particle.initRotate + 360 * t
      }
    })
    this.add(this.dust)

    this.shockwave = scene.add.particles('particles', 'particle_pulse.png', {
      x: 0,
      y: 0,
      frequency: -1,
      lifespan: 150,
      scaleX: (particle, ket, t) => 4 * t,
      scaleY: (particle, key, t) => 2 * t,
      alpha: (particle, key, t) => 1 - t
    })
    this.add(this.shockwave)
  }

  Play () {
    console.log('Play landing')
    this.x = this.player.x
    this.flash.emitParticle()
    this.dust.emitParticle()
    this.shockwave.emitParticle()
  }
}
