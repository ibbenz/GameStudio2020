import Phaser from 'phaser'
import { Howl } from 'howler'

export var audioCoin1 = document.createElement('audio')
var audioCoin2 = document.createElement('audio')
var audioCoin3 = document.createElement('audio')
var audioCoin4 = document.createElement('audio')
var audioCoin5 = document.createElement('audio')
var audioCoin6 = document.createElement('audio')
var audioCoin7 = document.createElement('audio')
var audioCoin8 = document.createElement('audio')
var audioCoin9 = document.createElement('audio')
var audioCoin10 = document.createElement('audio')
var audioCoin11 = document.createElement('audio')
var audioCoin12 = document.createElement('audio')

export var audioCoin1p = document.createElement('audio')
var audioCoin2p = document.createElement('audio')
var audioCoin3p = document.createElement('audio')
var audioCoin4p = document.createElement('audio')
var audioCoin5p = document.createElement('audio')
var audioCoin6p = document.createElement('audio')
var audioCoin7p = document.createElement('audio')
var audioCoin8p = document.createElement('audio')
var audioCoin9p = document.createElement('audio')
var audioCoin10p = document.createElement('audio')
var audioCoin11p = document.createElement('audio')
var audioCoin12p = document.createElement('audio')

export default class Coin extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, player, isSuper = false) {
    var spriteKey = isSuper ? 'coin-super' : 'coin-normal'
    var animKey = isSuper ? 'coin-super-anim' : 'coin-normal-anim'
    super(scene, 400, 200, spriteKey)

    this.originalY = 200
    this.value = isSuper ? 5 : 1
    this.timeOffset = 0
    this.player = player
    this.collectedNormal = false
    this.collected = false
    this.speed = 500
    this.updateCoins = 0
    this.coingroup = []
    this.audioTune = null

    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.body.setAllowGravity(false)
    this.body.setSize(56, 46, true)
    this.body.setOffset(2, 5)
    this.anims.play(animKey)

    this.scene.physics.add.overlap(this.player, this, () => {
      this.audioTune = null
      this.overlap = true
      // In case of more than 12 coins, restart at 0
      const completedCoins = this.numberOfCompleted() % 13
      // console.log('completed Coins: ' + completedCoins)
      this.collectedNormal = true
      this.body.setEnable(false)
      this.setVisible(false)
      const checkKey = this.anims.currentAnim.key
      if (checkKey === 'coin-super-anim') {
        // this.audioTune =
        this.chooseTonePurple(completedCoins)
        // window.global.soundMap.get('coinpurple1').play()
        window.global.thisRunNumCoins += 10
        localStorage.setItem('nCoinsThisRun', window.global.thisRunNumCoins)
        this.updateCoins = parseInt(localStorage.getItem('nCoins')) + 10
        localStorage.setItem('nCoins', this.updateCoins)
      }
      if (checkKey === 'coin-normal-anim') {
        // this.audioTune =
        this.chooseToneYellow(completedCoins)
        // window.global.soundMap.get('coinyellow1').play()
        window.global.thisRunNumCoins += 1
        localStorage.setItem('nCoinsThisRun', window.global.thisRunNumCoins)
        this.updateCoins = parseInt(localStorage.getItem('nCoins')) + 1
        localStorage.setItem('nCoins', this.updateCoins)
      }

      this.setActive(false)
    })

    this.scene.physics.add.overlap(this.player.coinMagnet.coinBody, this, () => {
      if (!this.player.coinMagnet.active) {
        return
      }
      this.collected = true
    })
  }

  setIndex (i) {
    this.index = i
  }

  setIsSuper (isSuper) {
    this.value = isSuper ? 5 : 1
    var animKey = isSuper ? 'coin-super-anim' : 'coin-normal-anim'
    this.anims.play(animKey)
  }

  setAnimationDelay (delay) {
    this.anims.setProgress(1000 * delay / this.anims.duration)
  }

  preUpdate (time, delta) {
    this.anims.update(time, delta)

    if (this.player.coinMagnet.active && this.collected) {
      this.scene.physics.moveToObject(this, this.player, this.speed)
      this.speed += 30
    } else {
      this.speed = 500

      this.body.setVelocityX(0)
      this.body.setVelocityY(0)

      var t = (time - this.timeOffset) * this.anims.duration / (this.anims.msPerFrame * this.anims.currentAnim.frames.length * 200)
      this.y = this.originalY + 15 * Math.cos(t)
      this.rotation = 0.33166156 * Math.sin(t + 0.3)
    }
  }

  numberOfCompleted () {
    const groupSize = this.coingroup.length
    let counter = 0
    for (let q = 0; q < groupSize; q++) {
      if (this.coingroup[q].collectedNormal) {
        counter++
      }
    }
    return counter
  }

  chooseTonePurple (numCompleted) {
    switch (numCompleted) {
      case 0: {
        audioCoin1p.play()
        break
      }
      case 1: {
        if (audioCoin2p.readyState === 4) {
          audioCoin2p.play()
        } else (audioCoin1p.play())
        break }
      case 2: {
        if (audioCoin3p.readyState === 4) {
          audioCoin3p.play()
        } else (audioCoin1p.play())
        break
      }
      case 3: {
        if (audioCoin4p.readyState === 4) {
          audioCoin4p.play()
        } else (audioCoin1p.play())
        break
      }
      case 4: {
        if (audioCoin5p.readyState === 4) {
          audioCoin5p.play()
        } else (audioCoin1p.play())
        break
      }
      case 5: {
        if (audioCoin6p.readyState === 4) {
          audioCoin6p.play()
        } else (audioCoin1p.play())
        break
      }
      case 6: {
        if (audioCoin7p.readyState === 4) {
          audioCoin7p.play()
        } else (audioCoin1p.play())
        break
      }
      case 7: {
        if (audioCoin8p.readyState === 4) {
          audioCoin8p.play()
        } else (audioCoin1p.play())
        break
      }
      case 8: {
        if (audioCoin9p.readyState === 4) {
          audioCoin9p.play()
        } else (audioCoin1p.play())
        break }
      case 9: {
        if (audioCoin10p.readyState === 4) {
          audioCoin10p.play()
        } else (audioCoin1p.play())
        break }
      case 10: {
        if (audioCoin11p.readyState === 4) {
          audioCoin11p.play()
        } else (audioCoin1p.play())
        break
      }
      case 11: {
        if (audioCoin12p.readyState === 4) {
          audioCoin12p.play()
        } else (audioCoin1p.play())
        break }
    }
  }

  chooseToneYellow (numCompleted) {
    switch (numCompleted) {
      case 0: {
        audioCoin1.play()
        break
      }
      case 1: {
        if (audioCoin2.readyState === 4) {
          audioCoin2.play()
        } else (audioCoin1.play())

        break
      }
      case 2: {
        if (audioCoin3.readyState === 4) {
          audioCoin3.play()
        } else (audioCoin1.play())

        break
      }

      case 3: {
        if (audioCoin4.readyState === 4) {
          audioCoin4.play()
        } else (audioCoin1.play())
        break
      }
      case 4: {
        if (audioCoin5.readyState === 4) {
          audioCoin5.play()
        } else (audioCoin1.play())

        break
      }
      case 5: {
        if (audioCoin6.readyState === 4) {
          audioCoin6.play()
        } else (audioCoin1.play())

        break
      }
      case 6: {
        if (audioCoin7.readyState === 4) {
          audioCoin7.play()
        } else (audioCoin1.play())

        break
      }
      case 7: {
        if (audioCoin8.readyState === 4) {
          audioCoin8.play()
        } else (audioCoin1.play())

        break
      }
      case 8: {
        if (audioCoin9.readyState === 4) {
          audioCoin9.play()
        } else (audioCoin1.play())

        break
      }
      case 9: {
        if (audioCoin10.readyState === 4) {
          audioCoin10.play()
        } else (audioCoin1.play())

        break
      }
      case 10: {
        if (audioCoin11.readyState === 4) {
          audioCoin11.play()
        } else (audioCoin1.play())

        break }
      case 11: {
        if (audioCoin12.readyState === 4) {
          audioCoin12.play()
        } else (audioCoin1.play())

        break
      }
    }
  }
}

function loadCoinSounds () {
  audioCoin2.src = 'Soundfiles/Compressed_Sounds/Pickup_Coin_Yellow_02.mp3'
  audioCoin2.loop = false
  audioCoin2.volume = 0.3
  audioCoin2.autoplay = false

  audioCoin3.src = 'Soundfiles/Compressed_Sounds/Pickup_Coin_Yellow_03.mp3'
  audioCoin3.loop = false
  audioCoin3.volume = 0.3
  audioCoin3.autoplay = false

  audioCoin4.src = 'Soundfiles/Compressed_Sounds/Pickup_Coin_Yellow_04.mp3'
  audioCoin4.loop = false
  audioCoin4.volume = 0.3
  audioCoin4.autoplay = false

  audioCoin5.src = 'Soundfiles/Compressed_Sounds/Pickup_Coin_Yellow_05.mp3'
  audioCoin5.loop = false
  audioCoin5.volume = 0.3
  audioCoin5.autoplay = false

  audioCoin6.src = 'Soundfiles/Compressed_Sounds/Pickup_Coin_Yellow_06.mp3'
  audioCoin6.loop = false
  audioCoin6.volume = 0.3
  audioCoin6.autoplay = false

  audioCoin7.src = 'Soundfiles/Compressed_Sounds/Pickup_Coin_Yellow_07.mp3'
  audioCoin7.loop = false
  audioCoin7.volume = 0.3
  audioCoin7.autoplay = false

  audioCoin8.src = 'Soundfiles/Compressed_Sounds/Pickup_Coin_Yellow_08.mp3'
  audioCoin8.loop = false
  audioCoin8.volume = 0.3
  audioCoin8.autoplay = false

  audioCoin9.src = 'Soundfiles/Compressed_Sounds/Pickup_Coin_Yellow_09.mp3'
  audioCoin9.loop = false
  audioCoin9.volume = 0.3
  audioCoin9.autoplay = false

  audioCoin10.src = 'Soundfiles/Compressed_Sounds/Pickup_Coin_Yellow_10.mp3'
  audioCoin10.loop = false
  audioCoin10.volume = 0.3
  audioCoin10.autoplay = false

  audioCoin11.src = 'Soundfiles/Compressed_Sounds/Pickup_Coin_Yellow_11.mp3'
  audioCoin11.loop = false
  audioCoin11.volume = 0.3
  audioCoin11.autoplay = false

  audioCoin12.src = 'Soundfiles/Compressed_Sounds/Pickup_Coin_Yellow_12.mp3'
  audioCoin12.loop = false
  audioCoin12.volume = 0.3
  audioCoin12.autoplay = false

  audioCoin2p.src = 'Soundfiles/Compressed_Sounds/Pickup_Coin_Purple02.mp3'
  audioCoin2p.loop = false
  audioCoin2p.volume = 0.3
  audioCoin2p.autoplay = false

  audioCoin3p.src = 'Soundfiles/Compressed_Sounds/Pickup_Coin_Purple03.mp3'
  audioCoin3p.loop = false
  audioCoin3p.volume = 0.3
  audioCoin3p.autoplay = false

  audioCoin4p.src = 'Soundfiles/Compressed_Sounds/Pickup_Coin_Purple04.mp3'
  audioCoin4p.loop = false
  audioCoin4p.volume = 0.3
  audioCoin4p.autoplay = false

  audioCoin5p.src = 'Soundfiles/Compressed_Sounds/Pickup_Coin_Purple05.mp3'
  audioCoin5p.loop = false
  audioCoin5p.volume = 0.3
  audioCoin5p.autoplay = false

  audioCoin6p.src = 'Soundfiles/Compressed_Sounds/Pickup_Coin_Purple06.mp3'
  audioCoin6p.loop = false
  audioCoin6p.volume = 0.3
  audioCoin6p.autoplay = false

  audioCoin7p.src = 'Soundfiles/Compressed_Sounds/Pickup_Coin_Purple07.mp3'
  audioCoin7p.loop = false
  audioCoin7p.volume = 0.3
  audioCoin7p.autoplay = false

  audioCoin8p.src = 'Soundfiles/Compressed_Sounds/Pickup_Coin_Purple08.mp3'
  audioCoin8p.loop = false
  audioCoin8p.volume = 0.3
  audioCoin8p.autoplay = false

  audioCoin9p.src = 'Soundfiles/Compressed_Sounds/Pickup_Coin_Purple09.mp3'
  audioCoin9p.loop = false
  audioCoin9p.volume = 0.3
  audioCoin9p.autoplay = false

  audioCoin10p.src = 'Soundfiles/Compressed_Sounds/Pickup_Coin_Purple10.mp3'
  audioCoin10p.loop = false
  audioCoin10p.volume = 0.3
  audioCoin10p.autoplay = false

  audioCoin11p.src = 'Soundfiles/Compressed_Sounds/Pickup_Coin_Purple11.mp3'
  audioCoin11p.loop = false
  audioCoin11p.volume = 0.3
  audioCoin11p.autoplay = false

  audioCoin12p.src = 'Soundfiles/Compressed_Sounds/Pickup_Coin_Purple12.mp3'
  audioCoin12p.loop = false
  audioCoin12p.volume = 0.3
  audioCoin12p.autoplay = false
}
window.loadCoinSounds = loadCoinSounds
