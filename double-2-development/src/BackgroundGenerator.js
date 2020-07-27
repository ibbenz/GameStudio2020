import Phaser from 'phaser'

var sky, moon, mountain
var playerTracker
var currentGroundIndex, currentCloudIndex
var nextGround, nextCloud

var lowClouds = []
var ground = []
var frontHills = []
var backHills = []
var highClouds = []
var frontRocks = []
var backRocks = []

const numHills = 4
const hillResetRange = 5
const rockResetRange = 20
const highCloudsScrollFac = 0.2
const groundWidth = 1024
const cloudWidth = 1024

export default class BackgroundGenerator {
  constructor (sceneIn, player) {
    this.scene = sceneIn
    this.player = player
  }

  create () {
    const sceneWidth = this.scene.scale.width
    const sceneHeight = this.scene.scale.height
    nextGround = 1024
    nextCloud = 1024
    playerTracker = 0
    currentCloudIndex = 0
    currentGroundIndex = 0

    // background sky
    sky = this.scene.add.image(sceneWidth / 2, sceneHeight / 2, 'sky')
    sky.setDisplaySize(sceneWidth + 100, sceneHeight)
    sky.setScrollFactor(0)

    // moon
    moon = this.scene.add.sprite(sceneWidth * 0.3, sceneHeight * 0.2, 'backgroundatlas', 'SPR_BG_Moon.png')
    moon.setDisplaySize(sceneWidth * 0.15, sceneHeight * 0.2)
    moon.setScrollFactor(0)

    // upper clouds
    highClouds[0] = this.scene.add.sprite(Phaser.Math.Between(sceneWidth / 2, sceneWidth * 2), Phaser.Math.Between(sceneHeight * 0.2, sceneHeight * 0.6), 'backgroundatlas', 'SPR_Cloud01.png')
    highClouds[1] = this.scene.add.sprite(Phaser.Math.Between(sceneWidth / 2, sceneWidth * 2), Phaser.Math.Between(sceneHeight * 0.2, sceneHeight * 0.6), 'backgroundatlas', 'SPR_Cloud02.png')
    highClouds[2] = this.scene.add.sprite(Phaser.Math.Between(sceneWidth / 2, sceneWidth * 2), Phaser.Math.Between(sceneHeight * 0.2, sceneHeight * 0.6), 'backgroundatlas', 'SPR_Cloud03.png')

    for (var e = 0; e < 3; e += 1) {
      highClouds[e].setScrollFactor(highCloudsScrollFac)
    }

    // mountain
    mountain = this.scene.add.image(Phaser.Math.Between(sceneWidth / 2, sceneWidth * 2), sceneHeight * 0.47, 'backgroundatlas', 'mountain1.png')
    mountain.setScrollFactor(0.15, 1)

    // back rocks
    for (var c = 0; c < 4; c += 2) {
      backRocks[c] = this.scene.add.sprite(Phaser.Math.Between(0, sceneWidth * rockResetRange), this.scene.scale.height * 0.65, 'backgroundatlas', 'SPR_BG_Rock01.png')
      backRocks[c + 1] = this.scene.add.sprite(Phaser.Math.Between(0, sceneWidth * rockResetRange), this.scene.scale.height * 0.65, 'backgroundatlas', 'SPR_BG_Rock02.png')
    }

    // back hills
    for (var a = 0; a < numHills; a++) {
      backHills[a] = this.InitHills(sceneWidth, sceneHeight, 0.65)
    }

    // low clouds
    for (var i = 0; i < 3; i++) {
      if (i === 0) {
        lowClouds[i] = this.scene.add.sprite(nextCloud / 2, sceneHeight * 0.76, 'backgroundatlas', 'SPR_BG_Clouds.png')
      } else {
        lowClouds[i] = this.scene.add.sprite(lowClouds[i - 1].x + cloudWidth, sceneHeight * 0.76, 'backgroundatlas', 'SPR_BG_Clouds.png')
      }
    }

    // front rocks
    for (var d = 0; d < 4; d += 2) {
      frontRocks[d] = this.scene.add.sprite(Phaser.Math.Between(0, sceneWidth * rockResetRange), this.scene.scale.height * 0.75, 'backgroundatlas', 'SPR_BG_Rock01.png')
      frontRocks[d + 1] = this.scene.add.sprite(Phaser.Math.Between(0, sceneWidth * rockResetRange), this.scene.scale.height * 0.75, 'backgroundatlas', 'SPR_BG_Rock02.png')
    }

    // front hills
    for (var b = 0; b < numHills; b++) {
      frontHills[b] = this.InitHills(sceneWidth, sceneHeight, 0.75)
    }

    // ground
    for (var j = 0; j < 3; j++) {
      if (j === 0) {
        ground[j] = this.scene.add.sprite(nextGround / 2, sceneHeight * 0.94, 'backgroundatlas', 'frontfloor.png')
      } else {
        ground[j] = this.scene.add.sprite(ground[j - 1].x + groundWidth, sceneHeight * 0.94, 'backgroundatlas', 'frontfloor.png')
      }
    }
  }

  update () {
    // tracks the position of the player
    playerTracker = this.player.x - window.global.playerCamOffSet

    this.SetFloor()
    this.SetClouds()
    this.SetHills()
    this.SetRocks()
    this.SetHighClouds()
  }

  InitHills (sceneWidth, sceneHeight, hillHeight) {
    var container = this.scene.add.container(Phaser.Math.Between(0, sceneWidth * hillResetRange), sceneHeight * hillHeight)
    var hill = this.scene.add.sprite(0, 0, 'backgroundatlas', 'SPR_BG_Hills.png').setOrigin(0.5, 0.5)
    container.add(hill)

    var numBushes = Phaser.Math.Between(0, 3)
    for (var l = 0; l < numBushes; l++) {
      var selectTreeOrBush = Phaser.Math.Between(0, 1)
      var treeOrBush

      if (selectTreeOrBush === 0) {
        treeOrBush = 'SPR_BG_Tree.png'
      } else {
        treeOrBush = 'SPR_BG_Shrub.png'
      }

      var bushObject = this.scene.add.sprite(Phaser.Math.Between(-hill.width / 8, hill.width / 8), Phaser.Math.Between(-hill.height / 8, hill.height / 4), 'backgroundatlas', treeOrBush)
      bushObject.setScale(0.4, 0.55).setAngle(-15).setOrigin(0.5, 1)
      this.TweenBushesAngle(bushObject)
      this.TweenBushesScale(bushObject)
      container.add(bushObject)
    }

    return container
  }

  TweenBushesAngle (object) {
    this.scene.tweens.add({
      targets: [object],
      angle: 15,
      ease: 'Linear',
      duration: 800,
      yoyo: true,
      repeat: -1,
      callbackScope: this
    })
  }

  TweenBushesScale (object) {
    this.scene.tweens.add({
      targets: [object],
      scaleY: 0.4,
      ease: 'Linear',
      duration: 400,
      yoyo: true,
      repeat: -1,
      callbackScope: this
    })
  }

  // uses 3 floor pieces to generate the ground (last one goes to front based on player position)
  SetFloor () {
    if (playerTracker > nextGround) {
      if (currentGroundIndex === 0) {
        ground[currentGroundIndex].x = ground[2].x + groundWidth

        currentGroundIndex = 1
      } else if (currentGroundIndex === 1) {
        ground[currentGroundIndex].x = ground[0].x + groundWidth

        currentGroundIndex = 2
      } else {
        ground[currentGroundIndex].x = ground[1].x + groundWidth

        currentGroundIndex = 0
      }

      nextGround += groundWidth
    }
  }

  // uses 3 cloud pieces to generate the low clouds (last one goes to front based on player position)
  SetClouds () {
    if (playerTracker > nextCloud) {
      if (currentCloudIndex === 0) {
        lowClouds[currentCloudIndex].x = lowClouds[2].x + cloudWidth

        currentCloudIndex = 1
      } else if (currentCloudIndex === 1) {
        lowClouds[currentCloudIndex].x = lowClouds[0].x + cloudWidth

        currentCloudIndex = 2
      } else {
        lowClouds[currentCloudIndex].x = lowClouds[1].x + cloudWidth

        currentCloudIndex = 0
      }

      nextCloud += cloudWidth
    }
  }

  SetHills () {
    // front hills
    for (var i = 0; i < frontHills.length; i++) {
      this.SetHill(frontHills, i)
    }

    // back hills
    for (var j = 0; j < backHills.length; j++) {
      this.SetHill(backHills, j)
    }
  }

  SetHill (hills, index) {
    if (hills[index].x < playerTracker - (window.global.playerCamOffSet * 2)) {
      var randomNum = Phaser.Math.Between(this.scene.scale.width * 2, this.scene.scale.width * hillResetRange)
      hills[index].x += randomNum
    }
  }

  SetRocks () {
    // front rocks
    for (var i = 0; i < frontRocks.length; i++) {
      this.SetRock(frontRocks, i)
    }

    // back rocks
    for (var j = 0; j < backRocks.length; j++) {
      this.SetRock(backRocks, j)
    }
  }

  SetRock (rocks, index) {
    if (rocks[index].x < playerTracker - (window.global.playerCamOffSet * 2)) {
      var randomNum = Phaser.Math.Between(this.scene.scale.width * 2, this.scene.scale.width * rockResetRange)
      rocks[index].x += randomNum
    }
  }

  SetHighClouds () {
    for (var i = 0; i < highClouds.length; i++) {
      if (highClouds[i].x / highCloudsScrollFac * 1.2 < playerTracker) {
        var randomNumX = Phaser.Math.Between(this.scene.scale.width * 1.3, this.scene.scale.width * 2.5)
        var randomNumY = Phaser.Math.Between(this.scene.scale.height * 0.2, this.scene.scale.height * 0.6)
        highClouds[i].x += randomNumX
        highClouds[i].y = randomNumY
      }
    }
  }
}
