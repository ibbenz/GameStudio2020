import Phaser from 'phaser'
import { PowerUpType } from './PowerUp'

export default class PowerUpBar {
  constructor (scene) {
    this.scene = scene

    var screen = {
      w: this.scene.cameras.main.width,
      h: this.scene.cameras.main.height
    }

    this.level = 0
    this.progress = 0
    this.scale = 1

    this.baseWidth = scene.textures.getFrame('power-up-bar', 'Base.png').width
    this.bases = []
    for (let i = 0; i < 6; i++) {
      const base = this.scene.add.image(screen.w - 160 - i * this.baseWidth, screen.h + 70, 'power-up-bar', 'Base.png')
      if (i !== 0) base.setVisible(false)
      base.setScrollFactor(0)
      base.setDepth(99)
      this.bases.push(base)
    }
    this.baseEnd = this.scene.add.image(0, this.bases[0].y, 'power-up-bar', 'BaseEnd.png')
    this.baseEnd.setDepth(99)
    this.baseEnd.setFlipX(true)
    this.baseEnd.setScrollFactor(0)

    this.bar = this.scene.add.image(0, this.bases[0].y, 'power-up-bar', 'Bar2.png')
    this.bar.setDepth(99)
    this.bar.setOrigin(0, this.bar.originY)
    this.bar.x = this.bases[0].getRightCenter().x - this.bar.width
    this.bar.setFlipX(true)
    this.bar.setScrollFactor(0)
    this.bar.setTint(0xBCFF00)

    this.barMask = this.scene.add.image(0, this.bases[0].y, 'power-up-bar', 'Bar2.png')
    this.barMask.setDepth(99)
    this.barMask.setOrigin(0, this.barMask.originY)
    this.barMask.x = this.bases[0].getRightCenter().x - this.barMask.width
    this.barMask.setScrollFactor(0)
    this.barMask.setFlipX(true)

    this.bar.mask = new Phaser.Display.Masks.BitmapMask(this.scene, this.barMask)

    this.bowl = this.scene.add.image(this.bases[0].x + 49, this.bases[0].y - 21, 'power-up-bar', 'Bowl.png')
    this.bowl.setFlipX(true)
    this.bowl.setScrollFactor(0)
    // this.bowl.setDepth(100)
    this.bowlGlass = this.scene.add.image(this.bowl.x + 10, this.bowl.y, 'power-up-bar', 'BowlGlass.png')
    this.bowlGlass.setScrollFactor(0)
    // this.bowlGlass.setDepth(100)
    this.powerBowl = this.scene.add.image(this.bowl.x + 10, this.bowl.y, 'powerups', 'FasterFish_0019.png')
    this.powerBowl.setScale(0.7)
    this.powerBowl.setScrollFactor(0)
    this.powerBowl.setDepth(100)

    this.anim = scene.tweens.add({
      targets: [
        this.bases[0], this.bases[1], this.bases[2],
        this.bases[3], this.bases[4], this.bases[5],
        this.baseEnd, this.bar, this.barMask,
        this.bowl, this.bowlGlass, this.powerBowl
      ],
      paused: true,
      duration: 400,
      ease: 'Sine.easeInOut',
      yoyo: true,
      onYoyo: () => { this.anim.pause() },
      loop: true,
      onLoop: () => { this.anim.pause() },
      y: '-=140'
    })
  }

  Toggle () {
    this.anim.resume()
  }

  SetProgress (progress) {
    this.progress = progress
    const maxProgress = (this.level + 2) / 7
    const p = maxProgress * progress
    this.barMask.x = this.bar.x + (1 - p) * this.bar.width
  }

  SetLevel (level) {
    if (level >= this.bases.length) return
    this.level = level
    for (let i = 1; i < this.bases.length; i++) this.bases[i].setVisible(i <= this.level)
    this.baseEnd.x = this.bases[0].x - (this.level * this.baseWidth + this.baseEnd.width - 3)
    this.SetProgress(this.progress)
  }

  SetPowerUpFrame (type) {
    switch (type) {
      case PowerUpType.INVINCIBILITY:
        this.powerBowl.setFrame('StarBoost2_0018.png')
        break
      case PowerUpType.MAGNET:
        this.powerBowl.setFrame('magnetpickup_1_0001.png')
        break
      case PowerUpType.X2:
        this.powerBowl.setFrame('ScoreDouble_0001.png')
        break
      case PowerUpType.FASTER:
        this.powerBowl.setFrame('FasterFish_0001.png')
        break
      default:
        this.powerBowl.setFrame('')
    }
  }
}
