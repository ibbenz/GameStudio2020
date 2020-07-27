import Phaser from 'phaser'

var muteButton
export default class MuteButton extends Phaser.GameObjects.Container {
  constructor (scene, x, y) {
    super(scene, x, y)
    this.scene = scene
    this.x = x
    this.y = y

    scene.add.existing(this)
  }

  CreateButton () {
    muteButton = this.scene.add.sprite(0, 0, 'mutebuttons', 'UnMuted.png').setInteractive()
    muteButton.input.hitArea.setTo(5, 5, 54, 54)
    muteButton.on('pointerdown', () => this.ManageMute())

    this.add([muteButton])
  }

  ManageMute () {
    if (!window.global.muted) {
      window.global.muted = true
    } else {
      window.global.muted = false
    }
  }

  update () {
    if (window.global.muted) {
      muteButton.setFrame('Muted.png')
    } else {
      muteButton.setFrame('UnMuted.png')
    }
  }
}
