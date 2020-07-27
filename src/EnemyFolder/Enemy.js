
import Phaser from 'phaser'

// An Enemy with Physics
export class Enemy extends Phaser.Physics.Arcade.Sprite {
  // visibility and activeness of every single GameObject ca be handelt by config-data.
  // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/group/
  // Every Enemy knows its Index in the Array and the scene to belong to.
  // Every Enemy knows of what type it is.
  constructor (sceneIn, shield) {
    super(sceneIn, 0, 0)

    sceneIn.add.existing(this)
    sceneIn.physics.add.existing(this)
    // this.body.setSize(100, 100)

    this.IndexEnemy = 0
    this.type = 0
    this.group = null
    this.currScene = sceneIn
    this.collided = false
    this.depthOffset = 1
    this.horizontalSpeed = 0
    this.isFloating = false
    this.isHead = false
    this.isBottom = false
    this.body.setAllowGravity(false)

    // For the floaters, grid enemies and wall enemies:
    this.propellor = this.currScene.physics.add.sprite(this.x, this.y - 40)
    this.propellor.body.setAllowGravity(false)
    this.flame = this.currScene.physics.add.sprite(this.x, this.y + 50)
    this.flame.body.setAllowGravity(false)
    this.separatorUp = this.currScene.physics.add.sprite(this.x, this.y)
    this.separatorUp.body.setAllowGravity(false)
    this.separatorDown = this.currScene.physics.add.sprite(this.x, this.y)
    this.separatorDown.body.setAllowGravity(false)
    this.separatorLeft = this.currScene.physics.add.sprite(this.x, this.y)
    this.separatorLeft.body.setAllowGravity(false)
    this.separatorRight = this.currScene.physics.add.sprite(this.x, this.y)
    this.separatorRight.body.setAllowGravity(false)

    this.propellorActive = false
    this.flameActive = false
    this.flameActivated = false
    this.separatorUpActive = false
    this.separatorDownActive = false
    this.separatorLeftActive = false
    this.separatorRightActive = false

    // Change this in CollisionGroup.js too
    this.EnemyTypes = {
      NONE: 0,
      WALL: 1,
      CLIMB: 3,
      BLUEMOVER: 4,
      BLUEWALLMOVER: 5,
      VERTICALMOVER: 6
    }

    this.top = false
    this.type = this.EnemyTypes.NONE

    this.body.setAllowGravity(false)

    sceneIn.physics.add.overlap(shield, this, () => {
      shield.disable()
    })
  }

  preUpdate (time, delta) {
    super.preUpdate(time, delta)

    this.activatePropellor()
    this.activateFlame()

    // Check if all enemies of the collision group are within sight
    const grouplength = this.group.members.grouplength
    let checkvisible = true
    for (let k = 0; k < grouplength; k++) {
      if (this.group.members[k].x > this.currScene.player.x + 1100) {
        checkvisible = false
      }
    }
    // If all elements are within the visibility range:
    if (checkvisible) {
      this.setVelocityX(this.horizontalSpeed)
    }
  }

  activateFlame () {
    if (this.currScene.textures.exists('fire') && this.flameActive && !this.flameActivated) {
      this.flame.setVisible(true)
      this.flame.setVelocityX(this.horizontalSpeed)
      this.flame.x = this.x
      this.flame.y = this.y + 50
      this.flame.setScale(0.75)
      this.flame.body.setSize(50, 25)
      this.flame.body.setOffset(25, 10)
      this.flame.depth = this.depth - 1
      this.TweenFlame(this.flame)
      this.flameActivated = true
    }
  }

  activatePropellor () {
    if (this.currScene.anims.exists('playPropellor') && this.propellorActive) {
      this.propellor.setVelocityX(this.horizontalSpeed)
      if (!this.propellor.anims.isPlaying) {
        this.propellor.x = this.x
        this.propellor.y = this.y - 40
        this.propellor.setScale(0.75)
        this.propellor.body.setSize(50, 25)
        this.propellor.body.setOffset(25, 10)
        this.propellor.depth = this.depth + 1
        this.propellor.anims.play('playPropellor')
      }
    }
  }

  // Red Body of static enemy
  SetBody () {
    this.setScale(1.25, 1.25)
    this.anims.stop()
    this.anims.play('playEnemy0')
  }

  // Red Head of static enemy.
  SetHead () {
    this.anims.stop()
    this.anims.play('playEnemyHead0')
  }

  // Red Head of static enemy.
  SetPropellor () {
    this.anims.stop()
    this.anims.play('playPropellor')
  }

  SetUpsideBody () {
    this.anims.stop()
    this.anims.play('playEnemy0upside')
  }

  SetUpsideHead () {
    this.anims.stop()
    this.anims.play('playEnemyHead0upside')
  }

  // Blue Body of moving enemy
  SetBlueBody () {
    this.setScale(1.25, 1.25)
    this.anims.stop()
    this.anims.play('playEnemy1')
  }

  // Blue head of moving enemy
  SetBlueHead () {
    this.anims.stop()
    this.anims.play('playEnemy1Head')
  }

  // Blue Body of moving enemy
  SetBlueUpsideBody () {
    this.anims.stop()
    this.anims.play('playEnemy1Upside')
  }

  // Blue head of moving enemy
  SetBlueUpsideHead () {
    this.anims.stop()
    this.anims.play('playEnemy1HeadUpside')
  }

  SetWall () {
    this.anims.stop()
    this.anims.play('playEnemy2')
  }

  SetWallMove () {
    this.anims.stop()
    this.anims.play('playEnemy3')
  }

  SetFlame () {
    this.anims.stop()
    this.anims.play('playEnemy3')
  }
  //   this.TweenBushesAngle(bushObject)
  //   this.TweenBushesScale(bushObject)
  //   container.add(bushObject)
  // }

  // return container
  // }

  TweenFlame (obj) {
    // A new texture is added to the game object
    this.flameTween = obj.setTexture('fire')
    obj.scene.tweens.add({
      targets: [obj],
      angle: 10,
      scale: 0.95,
      ease: 'Linear',
      duration: 400,
      yoyo: true,
      repeat: -1,
      callbackScope: obj
    })
  }
}

// alpha: 0.9,
