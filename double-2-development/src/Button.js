import Phaser from 'phaser'

export default class Button extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, texture, deselectFrame, selectFrame, scale, hitArea) {
    super(scene, x, y, texture, deselectFrame)
    this.scene = scene
    this.selectFrame = selectFrame
    this.deselectFrame = deselectFrame
    this.x = x
    this.y = y

    // add to scene
    scene.add.existing(this)

    // button properties
    this.setInteractive()
    this.setScale(scale)
    this.input.hitArea.setTo(hitArea[0], hitArea[1], hitArea[2], hitArea[3])
  }

  Select () {
    this.setFrame(this.selectFrame)
  }

  Deselect () {
    this.setFrame(this.deselectFrame)
  }
}
