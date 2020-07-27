import Phaser from 'phaser'

export default class ProgressBar {
  constructor (scene, x, y, reverse = false) {
    this.scene = scene
    this.reverse = reverse

    this.cooldownContainer = this.scene.add.image(x, y, 'GUI_CooldownBar_Container')
    this.cooldownContainerEmpty = this.scene.add.image(x, y, 'GUI_CooldownBar_Empty')

    this.cooldownRegular = this.scene.add.image(x, y, 'GUI_CooldownBar_Regular')
    this.barRegularMask = this.scene.add.image(x, y, 'GUI_CooldownBar_Regular')
    this.cooldownRegular.mask = new Phaser.Display.Masks.BitmapMask(this.scene, this.barRegularMask)
    this.cooldownCritical = this.scene.add.image(x, y, 'GUI_CooldownBar_Critical')
    this.barCriticalMask = this.scene.add.image(x, y, 'GUI_CooldownBar_Critical')
    this.cooldownCritical.mask = new Phaser.Display.Masks.BitmapMask(this.scene, this.barCriticalMask)

    this.components = [this.cooldownContainer, this.cooldownContainerEmpty,
      this.cooldownRegular, this.barRegularMask,
      this.cooldownCritical, this.barCriticalMask
    ]

    this.containerComponents = [this.cooldownContainer, this.cooldownContainerEmpty]
    this.regularBarComponents = [this.cooldownRegular, this.barRegularMask]
    this.criticalBarComponents = [this.cooldownCritical, this.barCriticalMask]

    this.width = this.cooldownRegular.width
    this.height = this.cooldownRegular.height

    this.components.forEach(component => component.setScrollFactor(0))

    this.SetProgress(0)
    this.criticalProgress = 0
  }

  SetCriticalProgress (progress) {
    this.criticalProgress = progress
    this.SetProgress(this.progress)
  }

  SetProgress (progress) {
    this.progress = progress

    if (progress <= 0) {
      this.components.forEach(component => component.setVisible(false))
      return
    }

    this.containerComponents.forEach(component => component.setVisible(true))

    if (progress <= this.criticalProgress) {
      this.regularBarComponents.forEach(component => component.setVisible(false))
      this.criticalBarComponents.forEach(component => component.setVisible(true))
      this.barCriticalMask.x = this.cooldownRegular.x + (progress * this.width - this.width) * ((this.reverse) ? -1 : 1)
    } else {
      this.regularBarComponents.forEach(component => component.setVisible(true))
      this.criticalBarComponents.forEach(component => component.setVisible(false))
      this.barRegularMask.x = this.cooldownCritical.x + (progress * this.width - this.width) * ((this.reverse) ? -1 : 1)
    }
  }
}