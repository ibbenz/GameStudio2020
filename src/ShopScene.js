import Phaser from 'phaser'
import ShopButton from './ShopButton'
import Button from './Button'

var coinAmountText, heartAmountText, startAmountText

const costsStartBoost = window.globalArray.startBoostUpgradeCosts
const costsSpeedBoost = window.globalArray.fasterUpgradeCosts
const costsMagnetBoost = window.globalArray.coinMagnetUpgradeCosts
const costsComboBoost = window.globalArray.x2UpgradeCosts
const costsInvicibilityBoost = window.globalArray.invincibilityUpgradeCosts

var shopButtons = []
var homeButton, shopButton1, shopButton2, shopButton3, shopButton4, shopButton5, shopButton6, shopButton7

export default class ShopScreen extends Phaser.Scene {
  constructor () {
    super('shop-screen')

    this.currentText = 'Welcome to the shop! Here, you can\nupgrade your powerups or buy some items\nusing the coins you have collected. Enjoy'
    this.explainText = ''

    this.nCoins = 0

    this.lastSelected = 0
    this.buttons = []
  }

  create () {
    this.lastSelected = 0
    var width = this.scale.width
    var height = this.scale.height

    // text styles
    var textStyle = {
      font: '50px rubikbold',
      fill: '#FFF',
      stroke: '#000000',
      strokeThickness: 10,
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    }

    var coinTextStyle = {
      font: '50px rubikbold',
      fill: '#FFD700',
      stroke: '#000000',
      strokeThickness: 10,
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    }

    var container = this.add.container(width / 2, height / 2)

    // images
    var bg = this.add.image(0, 0, 'bghome').setDisplaySize(width, height)
    var shopContainer = this.add.image(0, 0, 'UI1', 'ShopContainer.png').setScale(1.05, 1.25)
    var shopRoof = this.add.image(0, -height * 0.35, 'UI0', 'ShopRoof.png').setScale(1.1)
    var shopText = this.add.image(-width * 0.23, -height * 0.4, 'UI0', 'ShopText.png').setScale(0.85)
    var itemText = this.add.image(width * 0.225, 0, 'UI0', 'ItemsText.png').setScale(0.8)
    var upgradesText = this.add.image(0, -height * 0.3, 'UI0', 'UpgradesText.png').setScale(0.6)
    var shopIcon = this.add.image(-width * 0.31, -height * 0.425, 'UI0', 'Iconshop.png').setScale(0.85)
    var textContainer = this.add.image(-width * 0.15, height * 0.12, 'UI0', 'HolderText.png').setScale(1.2)
    var coinContainer = this.add.image(-width * 0.2, height * 0.28, 'UI0', 'HolderCoins.png')
    var continuesContainer = this.add.image(-width * 0.06, height * 0.28, 'UI0', 'HolderItems.png').setScale(0.5)
    var startBoostsContainer = this.add.image(width * 0.03, height * 0.28, 'UI0', 'HolderItems.png').setScale(0.5)
    var coinIcon = this.add.image(-width * 0.25, height * 0.28, 'UI0', 'CoinIcon.png').setScale(0.45)
    var heartIcon = this.add.image(-width * 0.075, height * 0.28, 'UI0', 'icon_heartfish.png').setScale(0.16)
    var starIcon = this.add.image(width * 0.015, height * 0.28, 'UI0', 'StarIcon.png').setScale(0.16)

    // texts
    this.explainText = this.add.text(-width * 0.36, height * 0.03, this.currentText, textStyle).setOrigin(0, 0).setScale(0.55).setLineSpacing(-5)
    coinAmountText = this.add.text(-width * 0.22, height * 0.28, localStorage.getItem('nCoins'), coinTextStyle).setOrigin(0, 0.5).setScale(0.7)
    heartAmountText = this.add.text(-width * 0.06, height * 0.28, localStorage.getItem('nContinues'), textStyle).setOrigin(0, 0.5).setScale(0.7)
    startAmountText = this.add.text(width * 0.03, height * 0.28, localStorage.getItem('nStartBoosts'), textStyle).setOrigin(0, 0.5).setScale(0.7)

    // home button
    homeButton = new Button(this, -width * 0.34, height * 0.29, 'buttonsatlas', 'HomeButton.png', 'HomeButtonHighlight.png', 0.5, [44, 48, 168, 160])
    homeButton.Select()
    homeButton.on('pointerover', () => {
      homeButton.Select()
      this.lastSelected = 0
    })
    homeButton.on('pointerover', () => this.ChangeTextHome())
    homeButton.on('pointerdown', () => this.ReturnHome())

    shopButton1 = new ShopButton(this, -width * 0.3, -height * 0.15, false, costsSpeedBoost, 'fasterpowerup', this.explainText, 1)
    shopButton2 = new ShopButton(this, -width * 0.15, -height * 0.15, false, costsMagnetBoost, 'magnetpowerup', this.explainText, 2)
    shopButton3 = new ShopButton(this, 0, -height * 0.15, false, costsComboBoost, 'coinpowerup', this.explainText, 3)
    shopButton4 = new ShopButton(this, width * 0.15, -height * 0.15, false, costsInvicibilityBoost, 'starpowerup', this.explainText, 4)
    shopButton5 = new ShopButton(this, width * 0.3, -height * 0.15, false, costsStartBoost, 'startboostpowerup', this.explainText, 5)
    shopButton6 = new ShopButton(this, width * 0.15, height * 0.15, true, 400, 'heartpowerup', this.explainText, 6)
    shopButton7 = new ShopButton(this, width * 0.3, height * 0.15, true, 400, 'startboostpowerup', this.explainText, 7)
    this.buttons = [homeButton, shopButton1, shopButton2, shopButton3, shopButton4, shopButton5, shopButton6, shopButton7]

    for (let j = 1; j < 8; j++) {
      this.buttons[j].create()
      this.buttons[j].btn.on('pointerover', () => {
        this.buttons[j].Select()
        this.lastSelected = j
      })
    }

    // add items to container
    container.add([bg, shopContainer, shopRoof])
    for (var k = 0; k < 8; k++) {
      container.add([this.buttons[k]])
    }
    container.add([shopText, shopIcon, upgradesText, itemText, textContainer, coinContainer, continuesContainer, startBoostsContainer, this.explainText])
    container.add([coinIcon, heartIcon, starIcon, coinAmountText, heartAmountText, startAmountText])
    container.depth = 1

    // keyboard input
    this.input.keyboard.on('keydown-RIGHT', () => {
      switch (this.lastSelected) {
        case 1:
          this.lastSelected = 2
          break
        case 2:
          this.lastSelected = 3
          break
        case 3:
          this.lastSelected = 4
          break
        case 4:
          this.lastSelected = 5
          break
        case 6:
          this.lastSelected = 7
          break
        case 0:
          this.lastSelected = 6
          break
      }
      this.buttons[this.lastSelected].Select()
    })

    this.input.keyboard.on('keydown-LEFT', () => {
      switch (this.lastSelected) {
        case 5:
          this.lastSelected = 4
          break
        case 4:
          this.lastSelected = 3
          break
        case 3:
          this.lastSelected = 2
          break
        case 2:
          this.lastSelected = 1
          break
        case 7:
          this.lastSelected = 6
          break
        case 6:
          this.lastSelected = 0
          break
      }
      this.buttons[this.lastSelected].Select()
    })

    this.input.keyboard.on('keydown-UP', () => {
      switch (this.lastSelected) {
        case 0:
          this.lastSelected = 1
          break
        case 6:
          this.lastSelected = 4
          break
        case 7:
          this.lastSelected = 5
          break
      }
      this.buttons[this.lastSelected].Select()
    })

    this.input.keyboard.on('keydown-DOWN', () => {
      switch (this.lastSelected) {
        case 1:
          this.lastSelected = 0
          break
        case 2:
          this.lastSelected = 0
          break
        case 3:
          this.lastSelected = 0
          break
        case 4:
          this.lastSelected = 6
          break
        case 5:
          this.lastSelected = 7
          break
      }
      this.buttons[this.lastSelected].Select()
    })

    this.input.keyboard.on('keydown-SPACE', () => {
      switch (this.lastSelected) {
        case 0:
          this.ReturnHome()
          break
        case 1:
          shopButton1.PurchaseItem()
          break
        case 2:
          shopButton2.PurchaseItem()
          break
        case 3:
          shopButton3.PurchaseItem()
          break
        case 4:
          shopButton4.PurchaseItem()
          break
        case 5:
          shopButton5.PurchaseItem()
          break
        case 6:
          shopButton6.PurchaseItem()
          break
        case 7:
          shopButton7.PurchaseItem()
          break
      }
    })
  }

  update () {
    // update player coins
    coinAmountText.setText(localStorage.getItem('nCoins'))
    heartAmountText.setText(localStorage.getItem('nContinues'))
    startAmountText.setText(localStorage.getItem('nStartBoosts'))
    this.nCoins = parseInt(localStorage.getItem('nCoins'))

    for (let i = 1; i < 8; i++) {
      this.buttons[i].update()
    }

    // updates button being selected/unselected
    for (let i = 0; i < this.buttons.length; i++) {
      if (i !== this.lastSelected) {
        this.buttons[i].Deselect()
      }
    }
  }

  ChangeTextHome () {
    this.currentText = 'Welcome to the shop! Here, you can\nupgrade your powerups or buy some items\nusing the coins you have collected. Enjoy'
    this.explainText.setText(this.currentText)
  }

  ReturnHome () {
    this.scene.start('home-screen')
  }
}
