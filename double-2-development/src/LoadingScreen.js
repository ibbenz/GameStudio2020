import Phaser from 'phaser'
import { initialLoadfilesGameScene } from './FilesToLoad'

let frameCounter = 0
var img
var loadingText
// Loading bar
var progressBar
var progressBarFill
var width
var height

// https://www.patchesoft.com/phaser-3-loading-screen
export default class LoadingScreen extends Phaser.Scene {
  constructor () {
    super('loading-screen')
  }

  preload () {
    this.load.image('loading_background_img', 'LoadingScreen/BG_Test2.png')
  }

  create () {
    const h = this.cameras.main.height
    const w = this.cameras.main.width
    width = w
    height = h
    img = this.physics.add.image(width / 2, height / 2, 'loading_background_img').setOrigin(0.5).setRotation(-0.4)
    img.setAngularVelocity(25)
    img.setGravityY(-300)
    img.setDebug(0)
    window.global.keyboard = this.input.keyboard.createCursorKeys()

    var fontStyle = {
      font: '50px rubikbold',
      fill: '#FFF',
      stroke: '#000000',
      strokeThickness: 10,
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    }

    loadingText = this.add.text(width * 0.5 - 200, height * 0.5 - 50, 'Loading... ', fontStyle)
    loadingText.depth = 1
    // Loading bar
    this.graphics = this.add.graphics()
    this.graphics.depth = 1
    this.newGraphics = this.add.graphics()
    this.newGraphics.depth = 1
    // progressBar = new Phaser.Geom.Rectangle(400, 200, 400, 50)
    progressBar = new Phaser.Geom.Rectangle(width * 0.5 - 200, height * 0.5 - 150, 400, 50)
    progressBar.depth = 1
    // progressBarFill = new Phaser.Geom.Rectangle(405, 205, 290, 40)
    progressBarFill = new Phaser.Geom.Rectangle(width * 0.5 - 195, height * 0.5 - 145, 10, 40)
    progressBarFill.depth = 1

    this.graphics.fillStyle(0xffffff, 1)
    this.graphics.fillRectShape(progressBar)

    this.newGraphics.fillStyle(0x3587e2, 1)
    this.newGraphics.fillRectShape(progressBarFill)

    window.loader1(this, initialLoadfilesGameScene)
    this.load.on('progress', this.updateBar, { newGraphics: this.newGraphics, loadingText: loadingText })
    this.load.on('complete', () => {
      this.scene.stop('loading-screen')
      frameCounter = 0
      this.scene.start('game-scene')
    })
  }

  update () {
    // We declare the variable in GlobVars and implement it in MainMenue
    if (window.global.keyboard.space.isDown) {
    }
  }

  updateBar (percentage) {
    this.newGraphics.clear()
    this.newGraphics.fillStyle(0x3587e2, 1)
    this.newGraphics.fillRectShape(new Phaser.Geom.Rectangle(width * 0.5 - 195, height * 0.5 - 145, percentage * 390, 40))

    percentage = percentage * 100
    this.loadingText.setText('Loading: ' + percentage.toFixed(0) + '%')
    // console.log('P:' + percentage)
  }
}
