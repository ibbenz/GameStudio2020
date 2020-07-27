import Phaser from 'phaser'

export default class Shield extends Phaser.GameObjects.Container {
  /**
   * Contructor
   * @param {Phaser.Scene} scene
   */
  constructor (scene, player) {
    super(scene, 0, 0)

    this.player = player
    this.s = scene.add.shader('shield-shader', 0, 0, 100, 100)
    this.s.setChannel0('shield-texture')
    this.add(this.s)

    scene.tweens.timeline({
      tweens: [
        {
          duration: 1,
          scaleX: 1.5,
          scaleY: 1
        }, {
          duration: 240,
          scaleY: 1.5,
          scaleX: 1
        }, {
          duration: 240,
          scaleX: 1.25,
          scaleY: 1.25
        }, {
          duration: 520,
          scaleX: 1.5,
          scaleY: 1
        }
      ],
      targets: [this.s],
      paused: false,
      delay: 0,
      ease: 'Linear',
      loop: -1
    })
  }

  enable () {
    this.setActive(true)
    this.setVisible(true)
    this.s.setVisible(true)
  }

  disable () {
    this.setActive(false)
    this.setVisible(false)
    this.s.setVisible(false)
  }
}
