import Phaser from 'phaser'

function easeOut (t) {
  return (--t) * t * t + 1
}

export default class StarBoostFX extends Phaser.GameObjects.Container {
  constructor (scene) {
    super(scene, 0, 0)

    scene.add.existing(this)

    this.sparks = scene.add.particles('particles', 'particle_StarBig.png', {
      x: 0,
      y: 0,
      frequency: 66,
      lifespan: 400,
      speed: 700,
      rotate: (particle, key, t) => {
        if (!particle.initRotate) particle.initRotate = Math.randRange(0, 90)
        return particle.initRotate + 180 * t
      },
      radial: true,
      angle: { min: 0, max: 360 },
      scale: (particle, key, t) => 0.3 * ((t < 0.5) ? 1 + t : 2 * (1 - easeOut((t - 0.5) * 2))),
      accelerationY: { min: 100, max: 1000 }
    })
    this.add(this.sparks)

    this.streakSparks = scene.add.particles('particles', 'particle_StarBig.png', {
      x: 0,
      y: 0,
      frequency: 50 / 3,
      lifespan: { min: 333, max: 500 },
      speed: 1300,
      accelerationX: { min: -1200, max: -1000 },
      radial: true,
      angle: { min: 90, max: 270 },
      scale: (particle, key, t) => {
        return 0.5 * (1 - easeOut(t))
      }
    })
    this.add(this.streakSparks)

    this.pulse1 = scene.add.particles('particles', 'particle_pulse.png', {
      x: 0,
      y: 0,
      frequency: 250,
      lifespan: 500,
      delay: 50,
      alpha: (particle, key, t) => 0.8 * ((t < 0.33) ? t / 0.33 : 1 - (t - 0.33) / 0.66),
      tint: 0xd6c972,
      scale: (particle, key, t) => 4 * t
    })
    this.add(this.pulse1)

    this.pulse2 = scene.add.particles('particles', 'particle_Ring.png', {
      x: 0,
      y: 0,
      frequency: 333,
      lifespan: 500,
      alpha: (particle, key, t) => 0.8 * ((t < 0.33) ? t / 0.33 : 1 - (t - 0.33) / 0.66),
      tint: 0xd6c972,
      scale: (particle, key, t) => 4 * t
    })
    this.add(this.pulse2)
  }
}
