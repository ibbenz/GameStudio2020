import Phaser from 'phaser'

export default class CoinBonanzaFX extends Phaser.GameObjects.Container {
  constructor (scene) {
    super(scene, 0, 125)

    scene.add.existing(this)

    this.sparks = scene.add.particles('particles', 'particle_StarBig.png', {
      x: 0,
      y: 0,
      frequency: -1,
      lifespan: { min: 400, max: 700 },
      speed: { min: 300, max: 500 },
      scale: (particle, key, t) => {
        if (!particle.initScale) particle.initScale = Math.randRange(0.2, 0.3)
        return particle.initScale * ((t < 0.2) ? t : ((t < 0.65) ? 1 : 1 - (t - 0.65) / 0.35))
      },
      rotate: (particle, key, t) => {
        if (!particle.initRotate) particle.initRotate = Math.randRange(0, 360)
        return particle.initRotate + 360 * t
      },
      accelerationY: 200,
      radial: true,
      angle: { min: 190, max: 350 },
      quantity: 12
    })
    this.add(this.sparks)

    this.blast = scene.add.sprite(0, 0, 'cb-blast')
    scene.anims.create({
      key: 'cb-blast-anim',
      frameRate: 40,
      frames: scene.anims.generateFrameNames('cb-blast', {
        prefix: 'CB_Blast_',
        suffix: '.png',
        start: 1,
        end: 10,
        zeroPad: 4
      }),
      repeat: 3
    })
    this.blast.setVisible(false)
    this.add(this.blast)
  }

  PlayAnim () {
    this.blast.setVisible(true)
    this.blast.anims.play('cb-blast-anim').once('animationcomplete', () => this.blast.setVisible(false))
    this.sparks.emitParticle()
  }
}
