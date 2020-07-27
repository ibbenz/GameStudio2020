import Phaser from 'phaser'

var btn
export default class ShopButton extends Phaser.GameObjects.Container {
  constructor (scene, x, y, isItem, price, animKey, explainText, upgradeNum) {
    super(scene, x, y)
    this.scene = scene
    this.x = x
    this.y = y
    this.isItem = isItem
    this.price = price
    this.animKey = animKey
    this.upgradeNum = upgradeNum
    this.explainText = explainText
    this.width = scene.scale.width
    this.height = scene.scale.height
    this.nCoins = 0
    this.btn = 0

    this.lvlSpeedBoost = localStorage.getItem('fasterLevel')
    this.lvlMagnetBoost = localStorage.getItem('coinMagnetLevel')
    this.lvlComboBoost = localStorage.getItem('X2Level')
    this.lvlInvincibleBoost = localStorage.getItem('invincibilityLevel')
    this.lvlStartBoost = localStorage.getItem('startBoostLevel')

    // add to scene
    scene.add.existing(this)

    this.setScale(1.05)
  }

  getUpgradeLevel () {
    switch (this.upgradeNum) {
      case 1:
        return this.lvlSpeedBoost
      case 2:
        return this.lvlMagnetBoost
      case 3:
        return this.lvlComboBoost
      case 4:
        return this.lvlInvincibleBoost
      case 5:
        return this.lvlStartBoost
    }
    return 0
  }

  create () {
    this.CreateAnims()

    var textStyle = {
      font: '50px rubikbold',
      fill: '#FFF',
      stroke: '#000000',
      strokeThickness: 5,
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    }

    // button items
    var btnHolder = this.scene.add.image(0, 0, 'UI0', 'ShopBtn_Holder.png')
    var coinInput = this.scene.add.image(-this.width * 0.02, this.height * 0.03, 'UI0', 'CoinInput.png').setScale(0.25)

    // text for price
    var priceText = ''
    if (!this.isItem) {
      priceText = this.scene.add.text(-this.width * 0.005, this.height * 0.03, this.price[this.getUpgradeLevel()], textStyle).setOrigin(0, 0.5).setScale(0.37)
    } else {
      priceText = this.scene.add.text(-this.width * 0.005, this.height * 0.03, this.price, textStyle).setOrigin(0, 0.5).setScale(0.37)
    }

    // actual button
    this.btn = this.scene.add.sprite(0, 0, 'shopbuttons', 'ShopBtn_Button.png').setInteractive()
    this.btn.input.hitArea.setTo(37, 35.5, 158, 185)
    this.btn.on('pointerover', () => { this.ChangeText() })
    if (!this.isItem) {
      this.btn.on('pointerdown', () => this.Upgrade(priceText))
    } else {
      this.btn.on('pointerdown', () => this.PurchaseItem())
    }

    // play the upgrade/item animation
    var indicator = this.scene.add.sprite(0, -this.height * 0.05)
    indicator.anims.play(this.animKey)

    this.add([btnHolder, this.btn, coinInput, indicator, priceText])

    // upgrade stars
    if (!this.isItem) {
      var level = this.getUpgradeLevel()
      for (var i = 0; i < 5; i++) {
        var star = this.scene.add.sprite(0, this.height * 0.09, 'shopbuttons', 'Star_Empty.png').setOrigin(0.5, 1)
        star.name = 'star' + (i + 1)

        switch (i) {
          case 0:
            star.x = -this.width * 0.039
            star.setScale(0.15)
            break
          case 1:
            star.x = -this.width * 0.024
            star.setScale(0.18)
            break
          case 2:
            star.x = -this.width * 0.006
            star.setScale(0.21)
            break
          case 3:
            star.x = this.width * 0.015
            star.setScale(0.24)
            break
          case 4:
            star.x = this.width * 0.039
            star.setScale(0.27)
            break
        }

        if (i < level) star.setFrame('Star_Filled.png')

        this.add(star)
      }
    }
  }

  Select () {
    this.btn.setFrame('ShopBtn_Selected.png')
  }

  Deselect () {
    this.btn.setFrame('ShopBtn_Button.png')
  }

  update () {
    this.nCoins = parseInt(localStorage.getItem('nCoins'))
  }

  // purchases an items from the store
  PurchaseItem () {
    if (this.nCoins >= this.price) {
      const newPrice = parseInt(localStorage.getItem('nCoins')) - this.price
      localStorage.setItem('nCoins', newPrice)

      // set number of continues
      if (this.upgradeNum === 6 || this.upgradeNum === 8) {
        localStorage.setItem('nContinues', parseInt(localStorage.getItem('nContinues')) + 1)
      }

      // set number of start boosts
      if (this.upgradeNum === 7 || this.upgradeNum === 9) {
        localStorage.setItem('nStartBoosts', parseInt(localStorage.getItem('nStartBoosts')) + 1)
      }
    }
  }

  // upgrade one of the powerups (the upgrade star will go up by one)
  Upgrade (priceText) {
    var upgradeLevel

    // checks which upgrade is selected
    switch (this.upgradeNum) {
      case 1:
        upgradeLevel = this.IncreaseLevel(this.lvlSpeedBoost)
        this.lvlSpeedBoost = upgradeLevel
        localStorage.setItem('fasterLevel', this.lvlSpeedBoost)
        break
      case 2:
        upgradeLevel = this.IncreaseLevel(this.lvlMagnetBoost)
        this.lvlMagnetBoost = upgradeLevel
        localStorage.setItem('coinMagnetLevel', this.lvlMagnetBoost)
        break
      case 3:
        upgradeLevel = this.IncreaseLevel(this.lvlComboBoost)
        this.lvlComboBoost = upgradeLevel
        localStorage.setItem('X2Level', this.lvlComboBoost)
        break
      case 4:
        upgradeLevel = this.IncreaseLevel(this.lvlInvincibleBoost)
        this.lvlInvincibleBoost = upgradeLevel
        localStorage.setItem('invincibilityLevel', this.lvlInvincibleBoost)
        break
      case 5:
        upgradeLevel = this.IncreaseLevel(this.lvlStartBoost)
        this.lvlStartBoost = upgradeLevel
        localStorage.setItem('startBoostLevel', this.lvlStartBoost)
        break
    }

    if (upgradeLevel > 0 && upgradeLevel <= 5) {
      // fill the star based on upgrade level
      this.getByName('star' + upgradeLevel).setFrame('Star_Filled.png')

      // update price of upgrade based on upgrade level
      priceText.setText(this.price[upgradeLevel])
    }
  }

  // increases the level of an upgrade in the shop
  IncreaseLevel (boostLevel) {
    // checks if the player has enough coins
    if (this.nCoins >= this.price[boostLevel]) {
      // coins get substracted based on upgrade cost
      const newprice = parseInt(localStorage.getItem('nCoins')) - this.price[boostLevel]
      localStorage.setItem('nCoins', newprice)
      boostLevel++
    }

    return boostLevel
  }

  ChangeText () {
    var currentText = ''

    switch (this.upgradeNum) {
      case 1:
        currentText = 'Upgrade the SpeedBoost pickup, making it\nlast longer when you pick it up. The\nSpeedBoost makes it easier to get double\nand triple combos'
        break
      case 2:
        currentText = 'Upgrade the CoinMagnet pickup,\nmaking it last longer when you pick it\nup. Great for collecting more coins'
        break
      case 3:
        currentText = 'Upgrade the duration of the ComboMultiplier\npickup. When this is active, you get twice as\nmany points for each enemy'
        break
      case 4:
        currentText = 'Upgrade the Invicibility pickup, making\nit last longer when you pick it up. A\ngreat way to increase your combo'
        break
      case 5:
        currentText = 'Upgrade the StartBoost. This will give\nyou a longer head start when you use it'
        break
      case 6:
        currentText = 'Buy a continue, allowing you to\ncontinue your run after you have crashed'
        break
      case 7:
        currentText = 'Buy a StartBoost. They are excellent for\ngetting a head start'
        break
      case 8:
        currentText = 'Buy a continue,\nallowing you to\ncontinue your run\nafter youve crashed'
        break
      case 9:
        currentText = 'Buy a StartBoost\nTheyre excellent\nfor getting a head\nstart'
        break
    }

    this.explainText.setText(currentText)
  }

  CreateAnims () {
    this.scene.anims.create({
      key: 'fasterpowerup',
      frameRate: 16,
      frames: this.scene.anims.generateFrameNames('shopanims', {
        prefix: 'FasterFish_',
        suffix: '.png',
        start: 1,
        end: 24,
        zeroPad: 4
      }),
      repeat: -1
    })

    this.scene.anims.create({
      key: 'magnetpowerup',
      frameRate: 16,
      frames: this.scene.anims.generateFrameNames('shopanims', {
        prefix: 'magnetpickup_1_',
        suffix: '.tif',
        start: 1,
        end: 24,
        zeroPad: 4
      }),
      repeat: -1
    })

    this.scene.anims.create({
      key: 'coinpowerup',
      frameRate: 16,
      frames: this.scene.anims.generateFrameNames('shopanims', {
        prefix: 'ScoreDouble_',
        suffix: '.png',
        start: 1,
        end: 24,
        zeroPad: 4
      }),
      repeat: -1
    })

    this.scene.anims.create({
      key: 'starpowerup',
      frameRate: 16,
      frames: this.scene.anims.generateFrameNames('shopanims', {
        prefix: 'StarBoost2_',
        suffix: '.png',
        start: 1,
        end: 24,
        zeroPad: 4
      }),
      repeat: -1
    })

    this.scene.anims.create({
      key: 'startboostpowerup',
      frameRate: 16,
      frames: this.scene.anims.generateFrameNames('shopanims', {
        prefix: 'StarFish_',
        suffix: '.png',
        start: 1,
        end: 24,
        zeroPad: 4
      }),
      repeat: -1
    })

    this.scene.anims.create({
      key: 'heartpowerup',
      frameRate: 16,
      frames: this.scene.anims.generateFrameNames('shopanims', {
        prefix: 'HeartFish_',
        suffix: '.png',
        start: 1,
        end: 24,
        zeroPad: 4
      }),
      repeat: -1
    })
  }
}
