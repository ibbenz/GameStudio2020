import Phaser from 'phaser'
import CoinSpawner from './CoinSpawner'
import PowerUpSpawner from './PowerUpSpawner'
import EnemySpawner from './EnemyFolder/EnemySpawner'
import CheckpointSpawner from './CheckpointSpawner'
import { CollisionGroup } from './EnemyFolder/CollisionGroup'
import './math.js'
import Vector3 from './Vector3'
import { PowerUpType } from './PowerUp'
import Combo from './Combo'

let sectionnumber = 0

const groupConfig = {
  classType: Phaser.GameObjects.Sprite,
  defaultKey: null,
  defaultFrame: null,
  active: true,
  visible: true,
  maxSize: -1,
  runChildUpdate: false,
  createCallback: null,
  removeCallback: null,
  createMultipleCallback: null
}

function MaxColumnsForNumEnemies (nbEnemies) {
  switch (nbEnemies) {
    case 1:
    case 2:
      return 6
    case 3:
      return 4
    case 4:
      return 3
    default:
      return 1
  }
}

class Section {
  /** Section constructor
     * @param {integer} nbEnemies   Number of obstacles
     * @param {float} dist
     * @param {boolean} top
     * @param {float} verticalMoveRange     Range of movement for Floater enemies
     * @param {float} verticalOffset
     * @param {integer} nbColumns           Width of the obstacle
     * @param {float} gapSize
     * @param {float} verticalSpeed         Vertical move speed
     * @param {boolean} growing             Is the enemy a Climber ?
     * @param {float} horizontalMoveSpeed   Horizontal move speed
     */
  constructor (nbEnemies, dist, top, verticalMoveRange, verticalOffset, nbColumns, gapSize = -80, verticalSpeed = 2, growing = false, horizontalSpeed = 0) {
    this.nbEnemies = nbEnemies
    this.distToNext = dist
    this.top = top
    this.verticalMoveRange = verticalMoveRange
    this.verticalOffset = verticalOffset
    this.nbColumns = nbColumns
    this.gapSize = gapSize
    this.verticalSpeed = verticalSpeed
    this.growing = growing
    this.horizontalSpeed = horizontalSpeed
  }

  static SimpleSection () { return new Section(Math.randRange(2, 4), Math.randRange(400.0001, 1000), false, 0, 0, 1, -80, 2, false, 0) }
  static SimpleCloseSection () { return new Section(Math.randRange(2, 5), Math.randRange(300.0001, 500), false, 0, 0, 1, -80, 2, false, 0) }
  static TallSection () { return new Section(Math.randRange(1, 6), Math.randRange(300.0001, 800), false, 0, 0, 1, -80, 2, false, 0) }
  static TopSection () { return new Section(Math.randRange(3, 5), Math.randRange(300.0001, 600), Math.random() < 0.5, 0, 0, 1, -80, 2, false, 0) }
  static CloseTopSection () { return new Section(Math.randRange(1, 6), Math.randRange(250.0001, 800), Math.random() < 0.2, 0, 0, 1, -80, 2, false, 0) }
  static CloseTopSectionPlusPlus () { return new Section(Math.randRange(1, 6), Math.randRange(250.0001, 800), Math.random() < 0.5, 0, 0, 1, -80, 2, false, 0) }
  static VerticalMover () { return new Section(Math.randRange(1, 3), Math.randRange(300.0001, 900), false, 410, 0, 1, -300, Math.randRange(50, 250)) }
  static MultipleColumns () {
    var nbEnemies = Math.randRange(1, 6)
    //   constructor (nbEnemies, dist, top, verticalMoveRange, verticalOffset, nbColumns, gapSize = 1.1, verticalSpeed = 2, growing = false, horizontalSpeed = 0) {
    return new Section(nbEnemies, Math.randRange(300.0001, 600), false, 0, 0, Math.randRange(1, MaxColumnsForNumEnemies(nbEnemies) + 1))
  }

  static VerticalMoversRanged () {
    var nbEnemies = Math.randRange(1, 3)
    var minRange = nbEnemies * 75
    //   constructor (nbEnemies, dist, top, verticalMoveRange, verticalOffset, nbColumns, gapSize = 1.1, verticalSpeed = 2, growing = false, horizontalSpeed = 0) {
    return new Section(nbEnemies, Math.randRange(300.0001, 600), false, Math.randRange((600 - minRange), 600), 0, 1, -80, Math.randRange(50, 150))
  }

  // constructor (nbEnemies, dist, top, verticalMoveRange, verticalOffset, nbColumns, gapSize = 1.1, verticalSpeed = 2, growing = false, horizontalSpeed = 0) {
  static Floaters () {
    var nbEnemies = Math.randRange(1, 3)
    var maxRange = -250
    return new Section(nbEnemies, Math.randRange(400.0001, 1000), Math.random() < 0.5, 0, Math.randRange(0, maxRange), 1, -80, 2, false, 0)
  }

  static FloatersHard () {
    var nbEnemies = Math.randRange(1, 3)
    var maxRange = -350
    return new Section(nbEnemies, Math.randRange(400.0001, 1000), Math.random() < 0.5, 0, Math.randRange(0, maxRange), 1, -80, 2, false, 0)
  }

  static DoubleColumnFloaters () {
    var nbEnemies = Math.randRange(1, 3)
    var top = Math.random() < 0.25
    var minRange = top ? -150 : 0
    var maxRange = -250
    return new Section(nbEnemies, Math.randRange(400.0001, 800), top, 0, Math.randRange(0, maxRange), 2, -80, 2, false, 0)
  }

  static VerticalMoversRangedAndOffset () {
    var nbEnemies = Math.biasedLowRandom(1, 4)
    var minRange = nbEnemies * 75
    var movementRange = Math.randRange(minRange, 200)
    var offsetRange = -100 - movementRange
    // constructor (nbEnemies, dist, top, verticalMoveRange, verticalOffset, nbColumns, gapSize = 1.1, verticalSpeed = 2, growing = false, horizontalSpeed = 0) {
    return new Section(nbEnemies, Math.randRange(400.0001, 1000), false, movementRange, Math.randRange(-offsetRange, offsetRange), 1, -80, Math.randRange(50, 250), false, 0)
  }

  static RotatingFloaters () {
    var nbEnemies = Math.randRange(2, 4)
    var maxRange = -375
    return new Section(nbEnemies, Math.randRange(500.0001, 900), Math.random() < 0.5, 0, Math.randRange(0, maxRange), 1, -80, 2, false, 0)
  }

  static DoubleVerticalMovers () { return new Section(2, Math.randRange(500.01, 900), false, 410, 0, 1, Math.randRange(-300, -450), Math.randRange(50, 250), false, 0) }

  // These are still lacking, includes grid and column-enemies
  // constructor (nbEnemies, dist, top, verticalMoveRange, verticalOffset, nbColumns, gapSize = 1.1, verticalSpeed = 2, growing = false, horizontalSpeed = 0)
  static DoubleNonMoving () {
    var nbEnemies = 2
    var nbColumns = Math.randRange(1, 6)
    var gapSize = -(nbColumns * 30) - Math.randRange(400, 475.001)
    var verticalOffset = 0

    if (nbColumns === 1) {
      var extra = -Math.random() * 100
      verticalOffset = 0
      gapSize += extra * 0.75
    }

    return new Section(nbEnemies, Math.randRange(500.0001, 900), false, 0, verticalOffset, nbColumns, gapSize, 0, false, 0)
  }

  static RandomDifficulty () {
    var nbEnemies = Math.biasedLowRandom(1, 6)
    var moving = nbEnemies <= 3 && Math.random() < 0.5
    var top = !moving && Math.random() < 0.5
    if (top) nbEnemies = Math.biasedLowRandom(3, 7)
    var nbColumns = Math.random() > 0.5 ? 1 : Math.randRange(1, Math.max(1, MaxColumnsForNumEnemies(nbEnemies) + (moving ? -1 : 1)))
    var minVerticalRange = Math.min(150 + nbEnemies * nbColumns * 10, 375)
    var maxDist = (moving || nbColumns >= 2 || top) ? 750 : 950

    return new Section(nbEnemies, Math.randRange(250.0001, maxDist), top, moving ? Math.randRange(minVerticalRange, 375) : 0, 0, nbColumns, -80, Math.randRange(150, 350), false, 0)
  }
}

export default class EntityManager extends Phaser.GameObjects.GameObject {
  constructor (scene, player, combo) {
    super(scene, 'EntityManager')
    this.player = player
    this.enemySpawner = new EnemySpawner(scene, player.shield)
    this.enemySpawner.activeCheck = (scene, go) => go.x > this.player.x - this.scene.cameras.main.centerX
    this.enemySpawner.initializer = window.initializer0Enemy
    this.coinSpawner = new CoinSpawner(scene, player)
    this.coinSpawner.activeCheck = (scene, go) => go.x > this.player.x - this.scene.cameras.main.centerX
    this.powerUpSpawner = new PowerUpSpawner(scene, this)
    this.powerUpSpawner.activeCheck = (scene, go) => go.x > this.player.x - this.scene.cameras.main.centerX
    this.checkpointSpawner = new CheckpointSpawner(scene, player, combo)
    this.checkpointSpawner.activeCheck = (scene, go) => go.x > this.player.x - this.scene.cameras.main.centerX

    this.initialDistance = 600
    this.genIndex = 0
    this.distance = 0
    this.counter = 0
    // The start of the next Section
    this.nextSection = 0

    this.generationFunctions = [
      Section.SimpleSection, // 0
      Section.SimpleCloseSection, // 1
      Section.TallSection, // 2
      Section.TopSection, // 3
      Section.CloseTopSection, // 4
      Section.VerticalMover, // 5
      Section.MultipleColumns, // 6
      Section.VerticalMoversRanged, // 7
      Section.VerticalMoversRangedAndOffset, // 8
      Section.Floaters, // 9
      Section.CloseTopSectionPlusPlus, // 10
      Section.DoubleColumnFloaters, // 11
      Section.FloatersHard, // 12
      Section.RandomDifficulty // 13
    ]

    this.sectionsToSpawn = [] // Section buffer
    this.sectionsToPlay = [] // Section buffer
    this.climberToPlay = [] // Climber
    this.verticalMoverToPlay = [] // Climber
    this.coinGroups = [] // Climber

    this.nextMarker = 0
    this.nextPickup = 0

    this.GenerateFirstSections()

    scene.anims.create({
      key: 'coin-normal-anim',
      frameRate: 16,
      frames: scene.anims.generateFrameNames('coins', {
        prefix: 'coin_',
        suffix: '.png',
        start: 1,
        end: 24,
        zeroPad: 4
      }),
      repeat: -1
    })

    scene.anims.create({
      key: 'coin-super-anim',
      frameRate: 16,
      frames: scene.anims.generateFrameNames('coins', {
        prefix: 'coin_super_',
        suffix: '.png',
        start: 1,
        end: 24,
        zeroPad: 4
      }),
      repeat: -1
    })

    scene.anims.create({
      key: 'powerup-faster-anim',
      frameRate: 16,
      frames: scene.anims.generateFrameNames('powerups', {
        prefix: 'FasterFish_',
        suffix: '.png',
        start: 1,
        end: 24,
        zeroPad: 4
      }),
      repeat: -1
    })

    scene.anims.create({
      key: 'powerup-shield-anim',
      frameRate: 16,
      frames: scene.anims.generateFrameNames('powerups', {
        prefix: 'ShieldTurtle_',
        suffix: '.png',
        start: 1,
        end: 24,
        zeroPad: 4
      }),
      repeat: -1
    })

    scene.anims.create({
      key: 'powerup-x2-anim',
      frameRate: 16,
      frames: scene.anims.generateFrameNames('powerups', {
        prefix: 'ScoreDouble_',
        suffix: '.png',
        start: 1,
        end: 24,
        zeroPad: 4
      }),
      repeat: -1
    })

    scene.anims.create({
      key: 'powerup-coin-bonanza-anim',
      frameRate: 16,
      frames: scene.anims.generateFrameNames('powerups', {
        prefix: 'CoinBonanza_',
        suffix: '.png',
        start: 1,
        end: 24,
        zeroPad: 4
      }),
      repeat: -1
    })

    scene.anims.create({
      key: 'powerup-star-boost-anim',
      frameRate: 16,
      frames: scene.anims.generateFrameNames('powerups', {
        prefix: 'StarBoost2_',
        suffix: '.png',
        start: 1,
        end: 24,
        zeroPad: 4
      }),
      repeat: -1
    })

    scene.anims.create({
      key: 'powerup-heart-anim',
      frameRate: 16,
      frames: scene.anims.generateFrameNames('powerups', {
        prefix: 'HeartFish_',
        suffix: '.png',
        start: 1,
        end: 24,
        zeroPad: 4
      }),
      repeat: -1
    })

    scene.anims.create({
      key: 'powerup-magnet-anim',
      frameRate: 16,
      frames: scene.anims.generateFrameNames('powerups', {
        prefix: 'magnetpickup_1_',
        suffix: '.png',
        start: 1,
        end: 24,
        zeroPad: 4
      }),
      repeat: -1
    })
  }

  /**
     * Generates the next section of the level
     */
  GenerateNext () {
    var sectionIndex = this.genIndex < 2 ? this.genIndex : Math.randRange(0, Math.min(this.genIndex, 13))
    var numSections = Math.biasedHighRandom(1, Math.max(4, 10 - (this.genIndex / 10)))

    if (sectionIndex === 0) { numSections = Math.randRange(1, 5) }

    for (var i = 0; i < numSections; i++) { this.sectionsToSpawn.push(this.generationFunctions[sectionIndex]()) }

    if (this.genIndex > 12 && Math.random() > 0.66) {
      this.sectionsToSpawn.push(Section.DoubleVerticalMovers())
    } else if (this.genIndex > 6 && Math.random() > 0.66) {
      this.sectionsToSpawn.push(Section.DoubleNonMoving())
    }

    this.genIndex++
  }

  /**
     * Generates the first sections of the level
     */
  GenerateFirstSections () {
    this.nextSection = 10
    this.nextSection = this.player.x + this.initialDistance
    this.genIndex = 0
    this.nextPickup = 4500
    this.nextMarker = 5000

    for (var i = 0; i < 2; i++) { this.GenerateNext() }
  }

  /**
   * Create an Enemy
   * @param {Vector3} position
   * @param {boolean} isHead
   * Is the enemy the head of the obstacle ?
   * @param {boolean} flip
   * Is the enemy upside-down ?
   * @param {boolean} hasFeet
   * Does the enemy have feet ?
   * @param {boolean} hasPropellor
   * Does the enemy has propellor ?
   * @param {float} delay
   * Only for climbing enemies
   * @param {float} horizontalSpeed
   * Horizontal move speed
   * @param {integer} nbEnemies
   * Number of enemies
   * @param {integer} index
   * The index of enemy in the obstacle
   * @param {boolean} ignoreOffset
   * @param {object} bounds
   * Links with other enemies (for grid enemies)
   * @param {integer} columnIndex
   * X index for grid enemies
   * @param {boolean} isFloating
   * Is the enemy floating ?
   */
  SpawnEnemy (position, isHead, flip, hasFeet, hasPropellor, delay, horizontalSpeed, nbEnemies, index, ignoreOffset, bounds, columnIndex, isFloating) {
    var isMoving = horizontalSpeed < 0
    var step = 0.15

    // Parts of the functions below could also be done in the EnemyGroup.js
    var enemy = this.enemySpawner.spawn()

    // Since the speed is set negative the signatur was changed from +1.5 to -1.5
    enemy.x = position.x - 1.5 * horizontalSpeed
    if (!ignoreOffset) {
      enemy.y = position.y + (isMoving ? -step : step) / (nbEnemies * 2) * (nbEnemies - 1 - index * 2)
      enemy.y += (isMoving ? -step : step) / 2
    } else { enemy.y = position.y }

    // enemy.setVelocityX(horizontalSpeed)
    enemy.horizontalSpeed = horizontalSpeed

    // if it is a wall enemy
    if (bounds.left || bounds.right || bounds.top || bounds.btm) {
      if (isFloating) { enemy.isFloating = true }
      if (!isMoving) {
        enemy.SetWall() // still wall enemy
        enemy.type = enemy.EnemyTypes.WALL
        // return enemy
      } else {
        enemy.SetWallMove() // moving wall enemy
        enemy.type = enemy.EnemyTypes.BLUEWALLMOVER
        // return enemy
      }
    } else {
      // Register enemy as a floater
      if (isFloating) { enemy.isFloating = true }

      if (isHead && !isMoving && !flip && delay === 0) {
        enemy.type = enemy.EnemyTypes.NONE
        enemy.SetHead() // red enemy head
        // return enemy
        // this.scene.add.text(enemy.x, enemy.y, ' depth: ' + enemy.depth)
        // scene.add.text(enemy.x, enemy.y, ' redhead ' + ' position y ' + position.y + ' ishead: ' + isHead + ' flip: ' + flip + ' hasFeet: ' + hasFeet + ' hasPropellor: ' + hasPropellor + ' delay: ' + delay + ' horizontalSpeed: ' + horizontalSpeed + ' nbEnemies: ' + nbEnemies + ' index: ' + index + ' ignoreOffset: ' + ignoreOffset + ' bounds: ' + bounds + ' columnIndex: ' + columnIndex + ' isFloating: ' + isFloating)
      }
      if (isHead && !isMoving && flip && delay === 0) {
        enemy.type = enemy.EnemyTypes.NONE
        enemy.SetUpsideHead()
        // return enemy
        // scene.add.text(enemy.x, enemy.y, ' redheadupside ')
      } // upside-down red enemy head

      if (!isHead && !isMoving && !flip && delay === 0) {
        enemy.type = enemy.EnemyTypes.NONE
        enemy.SetBody() // red enemy body
        // return enemy
        // this.scene.add.text(enemy.x, enemy.y, ' depth: ' + enemy.depth)
        // scene.add.text(enemy.x, enemy.y, ' redbody ')
      }

      if (!isHead && !isMoving && flip && delay === 0) {
        enemy.type = enemy.EnemyTypes.NONE
        enemy.SetUpsideBody()
        // return enemy
        // scene.add.text(enemy.x, enemy.y, ' redbodyupside')
      } // upside-down red enemy body

      // ******** Moving vertical enemies *********************
      if (isHead && isMoving && !flip && delay === 0) {
        if (this.scene.anims.exists('playEnemy1') && this.scene.anims.exists('playEnemy1Head')) {
          enemy.type = enemy.EnemyTypes.BLUEMOVER
          enemy.SetBlueHead() // blue enemy head moving
          // return enemy
        // this.scene.add.text(enemy.x, enemy.y, ' depth: ' + enemy.depth)
        // scene.add.text(enemy.x, enemy.y, ' bluehead ')
        } else {
          // If animation does not yet exist, then play "red-enemy"
          enemy.type = enemy.EnemyTypes.NONE
          // We have to correct the position
          enemy.x = position.x
          enemy.setVelocityX(0)
          enemy.SetHead() // blue enemy head not moving
          // return enemy
        }
      }
      if (isHead && isMoving && flip && delay === 0) {
        enemy.type = enemy.EnemyTypes.BLUEMOVER
        enemy.SetBlueUpsideHead()
        // return enemy
        // scene.add.text(enemy.x, enemy.y, ' blueheadupside ')
      } // upside-down blue enemy head moving

      if (!isHead && isMoving && !flip && delay === 0) {
        if (this.scene.anims.exists('playEnemy1') && this.scene.anims.exists('playEnemy1Head')) {
          enemy.type = enemy.EnemyTypes.BLUEMOVER
          // this.scene.add.text(enemy.x, enemy.y, ' depth: ' + enemy.depth)
          enemy.SetBlueBody() // blue enemy body moving
          return enemy
        // scene.add.text(enemy.x, enemy.y, ' bluebody ')
        } else {
          // If animation does not yet exist, then play "red-enemy"
          enemy.type = enemy.EnemyTypes.NONE
          enemy.x = position.x
          enemy.setVelocityX(0)
          enemy.SetBody() // blue enemy head moving
          // return enemy
        }
      }

      if (!isHead && isMoving && flip && delay === 0) {
        enemy.type = enemy.EnemyTypes.BLUEMOVER
        enemy.SetBlueUpsideBody()
        // return enemy
        // scene.add.text(enemy.x, enemy.y, ' bluebodyupside ')
      } // upside-down blue enemy body moving
    }

    if (delay > 0) {
      // enemy.anims.play('player_jetregular')
      enemy.type = enemy.EnemyTypes.CLIMB
      enemy.anims.stop()
      // return enemy
      // scene.add.text(enemy.x, enemy.y, ' climber ')
      // console.log('climber enemy')
      // TODO: show floating
    }

    if (hasPropellor) {
      // TODO: add propellor
    }

    // if none of the above enemies was spawned
    // this.scene.add.text(enemy.x, enemy.y, 'type: ' + enemy.type + ' sectionnr. ' + sectionnumber)
    // console.log(' position ' + position + ' isHead ' + isHead + ' flip ' + flip + ' hasFeet ' + hasFeet + ' hasPropellor ' + hasPropellor + ' delay ' + delay + ' horizontalSpeed ' + horizontalSpeed + ' nbEnemies ' + nbEnemies + ' index ' + index + ' ignoreOffset ' + ignoreOffset + ' columnIndex ' + columnIndex + ' isFloating ' + isFloating)

    // this.scene.add.text(enemy.x, enemy.y, 'type: ' + enemy.type + ' sectionnr. ' + sectionnumber)
    return enemy
  }

  // SpawnEnemy (position, isHead, flip, hasFeet, hasPropellor, delay, horizontalSpeed, nbEnemies, index, ignoreOffset, bounds, columnIndex, isFloating) {
  SpawnVerticalMover (position, isHead, flipV, nEnemies, index, bounds, columnIndx = 0, isFloating = false) {
    // If a vertical mover has a head, it always has a propellor
    // It has no delay and no horizontal speed.
    // console.log('The position y inside is: ' + position.y)
    const enemyMover = this.SpawnEnemy(position, isHead, flipV, false, isHead, 0, 0, nEnemies, index, true, bounds, columnIndx, isFloating)
    enemyMover.type = enemyMover.EnemyTypes.VERTICALMOVER
    if (isHead) {
      enemyMover.SetHead()
    } else {
      enemyMover.SetBody() // red enemy body
    }
    // this.scene.add.text(enemyMover.x, enemyMover.y, 'type: ' + enemyMover.type)
    return enemyMover
  }

  /**
   * Create a coin
   * @param {Vector3} position
   * @param {number} value
   * @param {float} timeOffset
   * @param {float} animateOffset
   * @param {integer} groupId
   */
  SpawnCoin (position, isSuper, timeOffset, animateOffset, index) {
    var coin = this.coinSpawner.spawn()
    coin.x = position.x
    coin.originalY = position.y

    coin.setIsSuper(isSuper)
    coin.timeOffset = timeOffset
    coin.setAnimationDelay(animateOffset)
    coin.setIndex(index)
    return coin
  }

  /**
   * Creates coins
   * @param {Vector3} position
   */
  SpawnCoins (position) {
    var isSuper = Math.randRange(0.0, 1.00001) < 0.1

    const coinGroup = []
    let coinout
    var timeOffset = Math.randRange(0, Math.PI * 2)
    var step = 32
    for (var i = 0; i < 12; i++) {
      var x = -step / 2 + (i % 4) * 50
      var y = -step / 2 + Math.floor(i / 4) * 42
      var pos = position.add(new Vector3(x, y, 2))
      coinout = this.SpawnCoin(pos, isSuper, timeOffset + x * 3, (3 - (i % 4)) / 4, i)
      coinout.coingroup = coinGroup
      coinGroup.push(coinout)
    }
    this.coinGroups.push(coinGroup)
  }

  SpawnCoinTrail () {
    var pos = new Vector3(this.player.x, this.player.y, this.player.z)
    var height = 2000

    const coinGroup = []
    let coinout
    var x = 0
    var y = 0
    var jump = false

    for (y = 0; y <= height; y += 100) {
      coinout = this.SpawnCoin(pos.add(new Vector3(x, -y, 2)), y < height - 200, 0, 0)
      if (jump || (y > 600 && Math.random() < 0.25)) {
        x += 100
        jump = !jump && Math.random() < 0.75
      }
      coinout.coingroup = coinGroup
      coinGroup.push(coinout)
    }
    this.coinGroups.push(coinGroup)

    x += 100
    jump = false
    for (y = height; y > 0; y -= 100) {
      coinout = this.SpawnCoin(pos.add(new Vector3(x, -y, 2)), y < height - 200, 0, 0)
      if (jump || (Math.random() < 0.25)) {
        x += 100
        jump = !jump && Math.random() < 0.75
      }
      coinout.coingroup = coinGroup
      coinGroup.push(coinout)
    }
    this.coinGroups.push(coinGroup)
  }

  /**
     * Setup a section in the scene
     * @param {Section} section
     * @param {Vector3} position
     */
  SpawnSection (scene, section, position) {
    sectionnumber++
    function IsClimber (section) {
      return section.nbColumns === 1 && section.verticalMoveRange <= 0 && !section.top && section.gapSize <= -80 && section.horizontalSpeed === 0
    }

    // Check for section-top if top-animations exist, else set section.top = false
    if (section.top) {
      // If the upsidedown red enemy does not exist
      if (!scene.anims.exists('playEnemy0upside') && !scene.anims.exists('playEnemyHead0upside') && section.horizontalSpeed >= 0) {
        section.top = false
      }

      // If the upsidedown blue enemy does not exist
      if (!scene.anims.exists('playEnemy1Upside') && !scene.anims.exists('playEnemy1HeadUpside') && section.horizontalSpeed < 0) {
        section.top = false
      }
    }

    var offset = 0.0
    var maxEnemies = section.top ? 6 : 5
    var nbEnemies = section.nbEnemies

    if (section.verticalMoveRange <= 0 && this.nextSection > 5000 && Math.random() < 0.5) {
      section.horizontalSpeed = Math.randRange(window.global.enemyHorizontalSpeedHigh, window.global.enemyHorizontalSpeedLow)
    }

    if (this.genIndex <= 6 && nbEnemies >= 4) {
      nbEnemies = 4
      if (section.top) {
        section.horizontalSpeed = 0
        if (this.genIndex <= 4) { nbEnemies = 3 }
      }
    }

    // Can we turn the obstacle into a climber ? and does the animation exist already?
    if (IsClimber(section) && this.genIndex > 3 && Math.random() < 0.25 && scene.anims.exists('playEnemy4') && scene.anims.exists('playEnemy4final') && scene.anims.exists('playEnemy4idle')) {
      nbEnemies = 5
      // console.log('Climber')
      section.growing = true // Otherwise, Limit obstacles
      section.verticalOffset = 0
      section.gapSize = -80
    } else if (nbEnemies >= maxEnemies) {
      nbEnemies = maxEnemies - 1
      offset = section.top ? Math.randRange(50, 100) - 100 : Math.randRange(-100, -50) + 100
    }

    // Limit obstacles
    if (nbEnemies >= maxEnemies) {
      // Limit number of obstacles:
      nbEnemies = maxEnemies - 1
      if (section.top) { offset = Math.randRange(50, 100) - 100 } else { offset = Math.randRange(50, -100) + 100 }
    }

    // Limit obstacles
    if (nbEnemies * section.nbColumns >= 12) {
      if (section.top) { offset = Math.randRange(15, 50) } else {
        offset = Math.randRange(-15, -50) + 100
        nbEnemies--
      }
    }

    var pos = new Vector3(position.x, position.y, position.z)
    var delay = 0.5

    var lastEnemy = null
    // section.nColums means, that the grid-enemies get a propellor
    var hasFeet = section.gapSize >= -80 && section.verticalOffset === 0
    // console.log('verticalOffset: ' + section.verticalOffset)
    // console.log('gapsize: ' + section.gapSize)
    // console.log('hasFeet: ' + hasFeet)
    // var hasPropellor = (!hasFeet && !section.top && section.verticalOffset <= 0) || (section.nColumns > 1 && section.verticalOffset <= 0)
    var hasPropellor = (!hasFeet && !section.top) || (section.nbColumns > 1 && section.verticalOffset < 0) && section.verticalMoveRange <= 0
    // var hasPropellor = false
    // console.log('verticalOffset ' + section.verticalOffset)
    // console.log('section.nColumns ' + section.nbColumns)
    // console.log('hasPropellor ' + hasPropellor)

    // Variables for vertical mover.
    var speed
    var start
    var end
    var startposy = 0

    // console.log('vertical move range: ' + section.verticalMoveRange)
    // console.log('has Propellor' + hasPropellor)
    const collGroup = new CollisionGroup(groupConfig, this.scene, this.player)
    for (var i = 0; i < nbEnemies; i++) {
      // If animations for red wall enemy do not exist yet
      if (section.nbColumns > 1 && !scene.anims.exists('playEnemy2') && section.horizontalSpeed >= 0) {
        section.nbColumns = 1
      }

      // If animations for blue wall enemy do not exist yet
      if (section.nbColumns > 1 && !scene.anims.exists('playEnemy2') && section.horizontalSpeed < 0) {
        section.nbColumns = 1
      }

      for (var j = 0; j < section.nbColumns; j++) {
        // The 'j' is used for the wall-enemy
        pos.x = position.x + j * 100
        pos.y = (section.top ? -section.gapSize * i + 96 : 2 * this.scene.cameras.main.centerY + section.gapSize * i - 140)

        var bounds = {
          left: false,
          right: false,
          top: false,
          bottom: false
        }
        // Wall/Grid red Enemies && check if animation already exists
        if (section.nbColumns > 1) {
          if (j < section.nbColumns - 1) { bounds.right = true }
          if (j > 0) { bounds.left = true }
          // console.log('gapsize: ' + section.gapSize)
          if (section.gapSize <= -79) {
            // console.log('bounds top/bttm')
            if (section.top) {
              if (i > 0) { bounds.top = true }
              if (i < nbEnemies - 1) { bounds.bottom = true }
            } else {
              if (i > 0) { bounds.bottom = true } else if (i < nbEnemies - 1) { bounds.top = true }
            }
          }
        }
        if (nbEnemies === 2) {
          // console.log('bounds bottom: ' + bounds.bottom + 'bounds top: ' + bounds.top + 'bounds left: ' + bounds.left + 'bounds right: ' + bounds.right)
        }
        // offset is mostly 0
        // Check if section is vertical and if animation already exists
        if (section.verticalMoveRange > 0 && scene.anims.exists('playPropellor') && scene.textures.exists('accessoires') && scene.textures.exists('fire') && scene.textures.exists('stripe')) {
          var offsetBottom = section.gapSize * nbEnemies * 2
          var offsetTop = section.gapSize * nbEnemies * 2
          // var offsetTop = (section.gapSize * (nbEnemies * i)) + offset
          speed = section.verticalSpeed
          // The verticalMoveRange is the centre of the moving space.
          start = section.verticalMoveRange - offset + offsetBottom
          end = section.verticalMoveRange - offset - offsetTop
          // console.log('verticalMoveRange: ' + section.verticalMoveRange)
          // console.log('offsetBottom: ' + offsetBottom)
          // console.log('offset: ' + offset)
          // console.log('start: ' + start)
          // console.log('end: ' + end)
          start += Math.abs((section.top ? -1 : 1) * (-section.verticalOffset))
          end += Math.abs((section.top ? -1 : 1) * (-section.verticalOffset))
          // console.log('vertical offset: ' + section.verticalOffset)

          if (start < end) {
            let temporary
            temporary = start
            start = end
            end = temporary
          }

          if (end < 100) { end = 100 }
          if (start > 650) { start = 650 }

          // console.log('start after: ' + start)
          // console.log('end after: ' + end)

          const randomNumber = Math.random()
          // Interpolate linearly:
          // 2 * this.scene.cameras.main.centerY - 80 * i - 140
          if (i === 0) {
            pos.y = start * randomNumber + (1 - randomNumber) * end
            startposy = pos.y
          } else {
            pos.y = startposy - 80 * i
          }
          // console.log('the y-position is: ' + pos.y)
          lastEnemy = this.SpawnVerticalMover(pos, i >= nbEnemies - 1, section.top, nbEnemies, i, bounds, j, i === 0)
          lastEnemy.propellorActive = false
          lastEnemy.flameActive = false
          if (i === 0) { lastEnemy.isBottom = true }
          if (i === (nbEnemies - 1)) { lastEnemy.isHead = true }
          lastEnemy.body.setSize(50, 50)
          lastEnemy.body.setOffset(25, 25)
          lastEnemy.group = collGroup
          // console.log('the y-position after is: ' + lastEnemy.y)

          // If we are at the bottom of the vertical enemy, add a flame, if we are at the top, add a propellor
          // this.addPropellorAndFlame(i, pos, section, nbEnemies, bounds, collGroup, lastEnemy)

          this.addFlame(i, pos, section, nbEnemies, bounds, collGroup, lastEnemy, lastEnemy.type)
          collGroup.members.push(lastEnemy)
          this.addPropellor(i, nbEnemies, pos, section, bounds, collGroup, lastEnemy, lastEnemy.type)
          // If the enemy is a climber, then the group contains climbers.
          if (lastEnemy.type === 6) {
            // console.log('vertical mover group')
            collGroup.type = collGroup.EnemyTypes.VERTICALMOVER
          }
          // Enemies have to be in the right order.
          lastEnemy.depth += i + lastEnemy.depthOffset
          // ********ADD collider**********/
          scene.physics.add.overlap(this.player, lastEnemy, window.hitEnemy)

          // ***********************
        } else {
          pos.y += (section.top ? -1 : 1) * section.verticalOffset

          if (nbEnemies === 2) {
            // console.log('position y 2: ' + pos.y)
          }

          if (section.verticalOffset < 0) {
            // console.log('vertical offset' + section.verticalOffset + ' position y ' + pos.y)
          }
          // isFloating checks if the enemy has a flame at the bottom
          var isFloating = hasPropellor && pos.y < 650
          var flipTop = section.top && section.verticalOffset > 0
          var flipV = section.top && !flipTop
          // All enemies which belong to the same section are put into a group
          lastEnemy = this.SpawnEnemy(pos, (flipTop ? i === 0 : i >= nbEnemies - 1) && !section.growing, flipV, false, false, section.growing ? delay : 0, section.horizontalSpeed, nbEnemies, i, false, bounds, j, isFloating)

          // Enemy knows to which group it belongs. For this, a parameter is created in the enemy, called group.
          // A collision box is added to the enemy.
          // ********ADD collider**********/
          scene.physics.add.overlap(this.player, lastEnemy, window.hitEnemy)
          lastEnemy.body.setSize(50, 50)
          lastEnemy.body.setOffset(25, 25)
          // Assign the enemy to a collision group
          // lastEnemy.group = collGroup.members

          lastEnemy.group = collGroup

          if (i === 0) { lastEnemy.isBottom = true } else { lastEnemy.isBottom = true }
          if (i === (nbEnemies - 1)) { lastEnemy.isHead = true } else { lastEnemy.isBottom = true }
          // Flames or Propellors will only be added if the isBottom or isHead is satisfied
          if (isFloating && i === 0) { lastEnemy.flameActive = true } else { lastEnemy.flameActive = false }
          collGroup.members.push(lastEnemy)
          // console.log('before adding: ' + hasPropellor)
          if (hasPropellor && i === nbEnemies - 1) { lastEnemy.propellorActive = true } else { lastEnemy.propellorActive = false }

          lastEnemy.depthOffset = 1

          if (lastEnemy.type === 1) {
            collGroup.type = collGroup.EnemyTypes.WALL
          }

          // If the enemy is a climber, then the group contains climbers.
          if (lastEnemy.type === 3) {
            // console.log('climber group')
            collGroup.type = collGroup.EnemyTypes.CLIMB
          }

          if (lastEnemy.type === 4) {
            // console.log('bluemover')
            // A moving enemy is put in the foreground of all other enemies
            lastEnemy.depthOffset = 20
            collGroup.type = collGroup.EnemyTypes.BLUEMOVER
          }

          if (lastEnemy.type === 5) {
            // console.log('bluewallmover')
            // A moving enemy is put in the foreground of all other enemies
            lastEnemy.depthOffset = 30
            collGroup.type = collGroup.EnemyTypes.BLUEWALLMOVER
          }

          // The upside down enemies have to be in the right order.
          if (flipV) {
            lastEnemy.depth += nbEnemies - i + lastEnemy.depthOffset
          } else { lastEnemy.depth += i + lastEnemy.depthOffset }

          // scene.add.text(lastEnemy.x, lastEnemy.y, ' depth ' + lastEnemy.depth + ' type ' + lastEnemy.type + ' position y  ' + lastEnemy.y)
          // scene.add.text(lastEnemy.x, lastEnemy.y, ' position y ' + lastEnemy.y)

          if (section.growing) {
            delay += 1.5
            lastEnemy.y += 60 * nbEnemies
            // If the climbing-enemy is for some reason not on the bottom
            // of the screen, just remove it to the very start of the game.
            if (lastEnemy.y < 650) {
              lastEnemy.x = 0
            }
            // A still image of the climbing enemy is
            lastEnemy.setScale(1.25, 1.25)
          }
        }

        // TODO: Spawn shadow
      }
    }

    // TODO: Create checkpoint (lines 460-463)

    var checkpoint
    if (lastEnemy.type !== 3) {
      checkpoint = this.checkpointSpawner.spawn()
      checkpoint.x = position.x + 100 * (section.nbColumns - 1) + 50
      checkpoint.y = this.scene.cameras.main.centerY
      if (lastEnemy) checkpoint.x = lastEnemy.x + 50
    } else {
      if (lastEnemy.y > 800) {
        checkpoint = this.checkpointSpawner.spawn()
        checkpoint.x = position.x + 100 * (section.nbColumns - 1) + 50
        checkpoint.y = this.scene.cameras.main.centerY
        if (lastEnemy) checkpoint.x = lastEnemy.x + 50
      } else {
        checkpoint = this.checkpointSpawner.spawn()
        checkpoint.x = position.x - 10000 * (section.nbColumns - 1) + 50
        checkpoint.y = this.scene.cameras.main.centerY
        if (lastEnemy) checkpoint.x = lastEnemy.x + 50
      }
    }

    collGroup.checkpoint = checkpoint

    if (collGroup.type === 3) {
      this.climberToPlay.push(collGroup)
    }

    // The Begin() of the VerticalMover.cs of the Unity-Project
    if (collGroup.type === 6) {
      collGroup.up = true
      if (start > end) {
        collGroup.up = false
        const temp = end
        end = start
        start = temp
      }
      collGroup.bottom = start
      collGroup.top = end
      collGroup.speed = speed
      collGroup.wait = false
      collGroup.enabled = true
      this.verticalMoverToPlay.push(collGroup)
      // Create stripes
      collGroup.CreateVerticalStripeGroup()
      // this.scene.add.text(collGroup.members[0].x, collGroup.members[0].y, 'groupsize ' + collGroup.members.length + ' bottom ' + collGroup.bottom + ' top ' + collGroup.top)
      // console.log('memberslength: ' + collGroup.members.length)
      for (var q = 0; q < collGroup.members.length; q++) {
      //  console.log('' + q + ' position is ' + collGroup.members[q].y)
      }
    }

    // TODO: Replace checkpoints on obstacles

    if (Math.random() > 0.5 && section.distToNext >= 325) {
      this.SpawnCoins(new Vector3(pos.x + Math.randRange(124.999, section.distToNext - 200), Math.randRange(this.scene.cameras.main.centerY - 225, this.scene.cameras.main.centerY + 175), 0))
    }

    if (section.verticalMoveRange > 0) {
      pos.x = (0.55 * (section.nbColumns - 1))
      pos.y = 20 + 1
      pos.z = 2.3
      // TODO: Spawn range indicator
    } else if (section.horizontalSpeed !== 0) {
      // Move checkpoint and shadow
      checkpoint.setVelocityX(section.horizontalSpeed)
    }
    return collGroup
  }

  addPropellor (i, nbEnemies, pos, section, bounds, collGroup, lastEnemy, type) {
    if (lastEnemy.isHead) {
      var propellorPosition = new Vector3(lastEnemy.x, lastEnemy.y - 40, lastEnemy.depth)
      const enemyPropellor = this.SpawnEnemy(propellorPosition, false, section.top, false, false, 0, 0, nbEnemies, i, true, bounds, 0, false)
      enemyPropellor.type = type
      enemyPropellor.SetPropellor()
      enemyPropellor.setScale(0.75)
      enemyPropellor.body.setSize(50, 25)
      enemyPropellor.body.setOffset(25, 10)
      enemyPropellor.propellorActive = false
      enemyPropellor.flameActive = false
      enemyPropellor.horizontalSpeed = lastEnemy.horizontalSpeed
      enemyPropellor.group = collGroup
      enemyPropellor.depth += i + 1 + lastEnemy.depthOffset
      // ********ADD collider**********/
      this.scene.physics.add.overlap(this.player, enemyPropellor, window.hitEnemy)
      collGroup.members.push(enemyPropellor)
    }
  }

  addFlame (i, pos, section, nbEnemies, bounds, collGroup, lastEnemy, type) {
    if (lastEnemy.isBottom) {
      var flamePosition = new Vector3(lastEnemy.x, lastEnemy.y + 50, lastEnemy.depth)
      const enemyFlame = this.SpawnEnemy(flamePosition, false, section.top, false, false, 0, 0, nbEnemies, i, true, bounds, 0, false)
      enemyFlame.type = type
      enemyFlame.anims.stop()
      enemyFlame.setScale(0.75)
      enemyFlame.angle = -5
      enemyFlame.body.setSize(50, 50)
      enemyFlame.body.setOffset(30, 50)
      enemyFlame.propellorActive = false
      enemyFlame.flameActive = false
      enemyFlame.horizontalSpeed = lastEnemy.horizontalSpeed
      enemyFlame.group = collGroup
      enemyFlame.depth = lastEnemy.depth
      enemyFlame.TweenFlame(enemyFlame)
      // ********ADD collider**********/
      this.scene.physics.add.overlap(this.player, enemyFlame, window.hitEnemy)
      collGroup.members.push(enemyFlame)
    }
  }

  /**
   * Spawn a power-up
   * @param {Vector3} position
   */
  SpawnPowerUp (position, amplitude) {
    var powerUp = this.powerUpSpawner.spawn()
    powerUp.x = position.x
    powerUp.y = position.y
    powerUp.z = position.z
    powerUp.offset = this.scene.cameras.main.centerY
    powerUp.amplitude = amplitude

    // Random power-up type
    var rates = {}
    rates[PowerUpType.INVINCIBILITY] = 35
    rates[PowerUpType.FASTER] = 65
    rates[PowerUpType.COIN_BONANZA] = 35
    rates[PowerUpType.X2] = 50
    rates[PowerUpType.MAGNET] = 75
    rates[PowerUpType.HEART] = 0
    rates[PowerUpType.SHIELD] = 50

    if (this.player.shield.active) {
      rates[PowerUpType.HEART] = rates[PowerUpType.SHIELD]
      rates[PowerUpType.SHIELD] = 0
    }

    var type = 0
    var total = 0
    var i = 0
    for (i = PowerUpType.INVINCIBILITY; i <= PowerUpType.SHIELD; i++) {
      total += rates[i]
    }

    var r = Math.randRange(0.0001, total)
    var threshold = 0
    for (i = PowerUpType.INVINCIBILITY; i <= PowerUpType.SHIELD; i++) {
      threshold += rates[i]
      if (r < threshold) {
        type = i
        break
      }
    }
    powerUp.setType(type)

    // If progressive loaded animation type for invincibility does not exist, choose another type
    if (!this.scene.anims.exists('player-jet-blast') && powerUp.type === PowerUpType.INVINCIBILITY) {
      powerUp.type = PowerUpType.COIN_BONANZA 
    }
  }

  preUpdate () {
    this.coinSpawner.update()
    this.enemySpawner.update()
    this.powerUpSpawner.update()
    this.checkpointSpawner.update()

    if (this.coinGroups.length > 20) {
      this.coinGroups.shift()
    }

    if (this.sectionsToSpawn.length === 0 && this.player.x > this.nextSection - this.scene.cameras.main.centerX - 400) {
      this.GenerateNext()
    }

    // Spawn next section
    if (this.sectionsToSpawn.length === 0) return

    // no spawn till the player is close enough to the end of the previous enemy spawn.
    if (this.player.x < this.nextSection - this.initialDistance - this.scene.cameras.main.width - 300) return

    var oldPos = this.nextSection

    var section = this.sectionsToSpawn.shift()

    // this.sectionsToPlay.push(this.SpawnSection(section, new Vector3(this.nextSection, 0, 0)))
    this.sectionsToPlay.push(this.SpawnSection(this.enemySpawner.sceneForEnemy, section, new Vector3(this.nextSection, 0, 0)))
    this.nextSection += section.distToNext + (section.nbColumns - 1) * 128

    // if the initial position is the player position, then these distances are added to the initial player position.
    if (oldPos < this.nextMarker && this.nextSection > this.nextMarker) {
      // TODO: Spawn distance marker
      this.nextMarker += 25
    }

    if (oldPos < this.nextPickup && this.nextSection > this.nextPickup) {
      if (!this.player.isBoostActive && this.genIndex >= 2) {
        this.SpawnPowerUp(new Vector3(this.nextPickup, 0, 1), 200)
      }
      this.nextPickup += Math.randRange(3500, 10000)
    }
  }
}
