import Phaser from 'phaser'
export default class Checkpoint extends Phaser.Physics.Arcade.Sprite {
  /**
   * Constructor
   * @param {Phaser.Scene} scene
   * @param {Player} player
   */
  constructor (scene, player, combo) {
    super(scene, 0, 0)

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setSize(1, 800)

    this.body.setAllowGravity(false)

    this.reached = false

    scene.physics.add.overlap(player, this, () => {
      if (this.reached) return
      this.reached = true
      combo.active = false
      combo.increaseCombo()
    })

    this.setVisible(false)
  }
}
