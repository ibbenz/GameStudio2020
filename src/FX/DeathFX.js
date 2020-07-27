import Phaser from 'phaser'

function easeOut (t) {
  return (--t) * t * t + 1
}

export default class DeathFX extends Phaser.GameObjects.Container {
  constructor (scene, player) {
    super(scene)
    this.player = player

    scene.add.existing(this)

    this.lightbeams = scene.add.particles('particles', 'particle_Stripes.png', {
      x: 0,
      y: 0,
      frequency: -1,
      lifespan: 100,
      rotate: 10,
      scale: { start: 1, end: 3 },
      alpha: { start: 1, end: 0 }
    })
    this.add(this.lightbeams)

    this.rings = scene.add.particles('particles', 'particle_shield.png', {
      x: 0,
      y: 0,
      frequency: 40,
      lifespan: 200,
      rotate: { min: 0, max: 360 },
      maxParticles: 2,
      scale: (particle, key, t) => {
        if (!particle.initScale) particle.initScale = Math.randRange(3, 4.000001)
        return particle.initScale * (0.5 + 1.5 * easeOut(t))
      },
      alpha: (particle, key, t) => {
        return ((t < 0.68) ? 0.5 - 0.012 * t : 0.49 - (t - 0.68) / 0.32)
      }
    })
    this.rings.setActive(false)
    this.add(this.rings)

    this.smokes = scene.add.particles('particles', 'particle_smoke.png', {
      x: 0,
      y: 0,
      frequency: -1,
      quantity: 10,
      lifespan: { min: 400, max: 500 },
      speed: { min: 0, max: 300 },
      radial: true,
      angle: { min: 0, max: 360 },
      rotate: { min: 0, max: 360 },
      scale: (particle, key, t) => {
        if (!particle.initScale) particle.initScale = Math.randRange(0.3, 0.9)
        return particle.initScale * ((t < 0.5) ? t / 0.5 : (1 - t) / 0.5)
      }
    })
    this.add(this.smokes)

    this.star = scene.add.particles('particles', 'particle_StarThin.png', {
      x: 0,
      y: 0,
      frequency: -1,
      lifespan: 333,
      rotate: (particle, key, t) => {
        if (!particle.initRotation) particle.initRotation = Math.randRange(0.00001, 360)
        return particle.initRotation + 234 * t
      },
      scale: (particle, key, t) => {
        return 5 * ((t < 0.5) ? t / 0.5 : (1 - t) / 0.5)
      },
      alpha: (particle, key, t) => {
        return ((t < 0.5) ? t / 0.5 : (1 - t) / 0.5)
      }
    })
    this.add(this.star)

    this.circleStar = scene.add.particles('particles', 'particle_StarThin.png', {
      x: 0,
      y: 0,
      frequency: -1,
      lifespan: 1500,
      quantity: 8,
      speed: 500,
      accelerationX: (particle) => -0.8 * particle.velocityX,
      accelerationY: (particle) => -0.8 * particle.velocityY,
      radial: true,
      angle: { start: 0, end: 360, steps: 8 },
      rotate: (particle, key, t) => {
        return 720 * t
      },
      scale: (particle, key, t) => {
        return 0.6 * ((t < 0.1) ? t / 0.1 : 1 - (t - 0.1) / 0.9)
      }
    })
    this.add(this.circleStar)

    player.on('player-death', () => {
      this.x = player.x
      this.y = player.y
      this.lightbeams.emitParticle()
      this.rings.emitters.list[0].dead = []
      this.rings.setActive(true)
      this.smokes.emitParticle()
      this.star.emitParticle()
      this.circleStar.emitParticle()
    })
  }
}
