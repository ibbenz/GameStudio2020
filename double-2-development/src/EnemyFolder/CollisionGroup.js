
import { deltaFrame } from '../player'
// When e.g. the Columnparts and the Head of a Cat are stiched together, they form  a group
export class CollisionGroup {
  // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/group/
  // By the group it is possible to set a group visible or invisible,
  // active or passive, and change its position.
  constructor (configIn, sceneIn, playerIn) {
    this.currScene = sceneIn
    this.player = 0
    this.collision = 0
    this.currentClimber = 0
    this.active = true
    this.members = []
    this.checkpoint = null
    this.deltaTime = 0
    // For climber
    this.oldPositiony = 0

    // Parameters for vertical mover
    this.bottom = 0
    this.top = 0
    this.speed = 0
    this.up = false
    this.wait = false
    this.enabled = false
    this.hasReachedTop = false
    this.hasReachedBottom = false
    // How much has the enemy moved above the top?
    this.diffToTop = 0
    this.diffToBottom = 0
    // The stripes
    this.stripeGroup = []

    // Change this in Enemy.js too
    this.EnemyTypes = {
      NONE: 0,
      WALL: 1,
      CLIMB: 3,
      BLUEMOVER: 4,
      BLUEWALLMOVER: 5,
      VERTICALMOVER: 6
    }

    this.type = this.EnemyTypes.NONE
    // If a member of the group is collided or not
    this.collided = false
  }

  // Remove old groups which are not used anymore.
  GarbageGroup () {
    if (this.currScene.entityManager.sectionsToPlay.length > 50) { this.currScene.entityManager.sectionsToPlay.shift() }
  }

  // preUpdate () {
  //   this.GarbageGroup()
  //   console.log('delta: ' + delta)
  // }

  CreateVerticalStripeGroup () {
    const stripelength = this.top - this.bottom
    const numberOfStripes = Math.abs(Math.floor(stripelength / 45))
    const positionX = this.members[0].x
    let positionY = this.bottom
    let stripeImage
    // var endMark = this.currScene.textures.getFrame('accessoires', 5)
    stripeImage = this.currScene.add.image(positionX, positionY, 'accessoires', 'MoverRange_Edge.png')
    stripeImage.setScale(2)
    this.stripeGroup.push(stripeImage)

    for (let i = 0; i < numberOfStripes; i++) {
      positionY = this.bottom + i * stripelength / numberOfStripes
      stripeImage = this.currScene.add.image(positionX, positionY, 'stripe')
      stripeImage.setScale(2)
      this.stripeGroup.push(stripeImage)
    }

    stripeImage = this.currScene.add.image(positionX, this.bottom + (numberOfStripes - 1) * stripelength / numberOfStripes, 'accessoires', 'MoverRange_Edge.png')
    stripeImage.setScale(2)
    this.stripeGroup.push(stripeImage)
  }

  // Based on the VerticalMover-Script of the Unity-Project
  PlayVerticalMover (sceneIn) {
    if (this.members[0].collided) {
      this.members[0].body.setVelocity(0, 300)
      return
    }

    for (let i = 0; i < this.members.length; i++) {
      if (this.up) {
        this.members[i].setVelocityY(-this.speed)
        this.members[0].setVisible(true)
      } else {
        this.members[i].setVelocityY(this.speed)
        this.members[0].setVisible(false)
      }
    }

    // If any enemy of the group reaches the top position
    // Since y=0 is on the top of the window, this means, that
    // if the position of the head falls below the bottom position, then it reaches the top
    if (this.members[this.members.length - 1].y < this.bottom) {
      this.members[this.members.length - 1].setVelocityY(0)
      this.up = false
      this.hasReachedTop = true
      // console.log('has reached Top')
      this.diffToTop = this.members[this.members.length - 1].y - this.bottom
      this.members[this.members.length - 1].y = this.bottom
      // The "fire boost is not displayed anymore"
      // GetComponent<Obstacle>().HideFloating()
    }

    // The other bodies are aligned with the top element
    if (this.hasReachedTop) {
      for (let i = 0; i < this.members.length - 1; i++) {
        this.members[i].setVelocityY(0)
        this.members[i].y = this.members[i].y - this.diffToTop
      }
    }

    // If enemy has reached his bottom position, this means, since the y=0 is at the
    // top of the window, that the foot of the enemy has a position greater than the top value
    if (this.members[0].y > this.top) {
      // console.log('has reached Bottom')
      this.members[0].setVelocityY(0)
      this.up = true
      this.hasReachedBottom = true
      this.diffToBottom = this.members[0].y - this.top
      this.members[0].y = this.top
      // The "fire boost" is activated
      // GetComponent<Obstacle>().ShowFloating(false);
    }

    // The other bodies are aligned with the bottom element
    if (this.hasReachedBottom) {
      for (let i = 1; i < this.members.length; i++) {
        this.members[i].setVelocityY(0)
        this.members[i].y = this.members[i].y - this.diffToBottom
      }
    }

    this.hasReachedTop = false
    this.hasReachedBottom = false
  }

  // In case of low-performance processors, this enemy does not work well.
  // The reason is that the animation is very slow in that case and therefore the climbing of 
  // the enemies is slow too.
  PlayClimber (sceneIn) {
    let velocity = -480
    if (deltaFrame > 18) {
      velocity = -480 * 16 / deltaFrame
    }
    // console.log('play the climber 1')
    if (this.active === true) {
      // console.log('group active')
      if (sceneIn.anims.exists('playEnemy4') && sceneIn.anims.exists('playEnemy4idle')) {
        // console.log('animation exists')
        // Objects outside of the sceneview are invisible
        for (let i = 0; i < this.members.length; i++) {
          if ((this.members[i].body.y > (sceneIn.scale.height * 0.8)) && (this.members[i].anims.getCurrentKey() !== 'playEnemy4')) {
            this.members[i].setVisible(false)
          } else { this.members[i].setVisible(true) }
        }

        if (this.currentClimber < this.members.length && !this.members[this.currentClimber].anims.isPlaying) {
          // console.log('first play')
          for (let i = this.members.length - 1; i >= 0; i--) {
            // Animation shall not loop --> 'false'
            if (this.members[i].active === true) {
              // console.log('child active')
              this.members[i].anims.play('playEnemy4idle')
              // The size of the collision box.
              this.members[i].depth = 0
              this.members[i].body.setVelocityY(0)
              // this.members[i].body.setSize(this.members[i].anims.currentFrame.frame.width, this.members[i].anims.currentFrame.frame.height)
            }
            this.members[this.currentClimber].anims.play('playEnemy4')
            this.members[this.currentClimber].body.setVelocityY(velocity)
            this.members[this.currentClimber].anims.setRepeat(this.members.length - 1)
            this.members[this.currentClimber].depth = 1
            this.oldPositiony = this.members[this.currentClimber].y
            // The size of the collision box.
            // this.members[this.currentClimber].body.setSize(this.members[this.currentClimber].anims.currentFrame.frame.width, this.members[this.currentClimber].anims.currentFrame.frame.height)
          }
        }

        // When the anim has ended the climbing should end too.
        const climbedHeight = this.oldPositiony - this.members[this.currentClimber].y
        // console.log('difference ' + climbedHeight)
        if ((this.currentClimber === this.members.length - 1) && this.members[this.currentClimber].anims.getProgress() > 0.97 && this.currentClimber < this.members.length && this.members[this.currentClimber].anims.getCurrentKey() === 'playEnemy4final') {
          this.currentClimber = 0
          this.members[this.currentClimber].anims.stop()
        }

        // console.log('repeat counter ' + this.members[this.currentClimber].anims.repeatCounter)
        // console.log('progress: ' + this.members[this.currentClimber].anims.getProgress())
        if (this.currentClimber < (this.members.length - 1) && this.members[this.currentClimber].anims.getProgress() > 0.97 && this.currentClimber < this.members.length && this.members[this.currentClimber].anims.getCurrentKey() === 'playEnemy4final') {
          this.currentClimber++
          this.members[this.currentClimber].anims.stop()

          // For the climbing enemies, start climbing into the gamescene
          if (this.members[this.currentClimber].body.y < sceneIn.scale.height) {
            if (this.currentClimber !== 0) {
              this.members[this.currentClimber - 1].setVisible(true)
            } else { this.members[this.members.length - 1].setVisible(true) }
          }
        }

        if (this.members[this.currentClimber].anims.getProgress() > 0.97) {
        // if (climbedHeight > 200) {
          // console.log('repeat counter ' + this.members[this.currentClimber].anims.repeatCounter)
          // Then next cat starts to climb a soon as all repetitions are done by its predecessor.
          if (this.members[this.currentClimber].anims.repeatCounter <= 0 || climbedHeight > 300) {
            this.members[this.currentClimber].body.setVelocityY(0)
            this.members[this.currentClimber].anims.play('playEnemy4final')
          }

          // For the climbing enemies, start climbing into the gamescene
          if (this.members[this.currentClimber].body.y < sceneIn.scale.height) {
            if (this.currentClimber !== 0) {
              this.members[this.currentClimber - 1].setVisible(true)
            } else { this.members[this.members.length - 1].setVisible(true) }
          }
        }
      }
    }
  }

  PlayClimberIdle (sceneIn) {
    // console.log('play the climber 1')
    if (this.active === true) {
      // console.log('group active')
      if (sceneIn.anims.exists('playEnemy4idle')) {
        // console.log('animation exists')
        // Objects outside of the sceneview are invisible
        // for (let i = 0; i < this.members.length; i++) {
        this.members[this.members.length - 1].setActive(true)
        this.members[this.members.length - 1].setVisible(true)
        this.members[this.members.length - 1].anims.play('playEnemy4idle', false)
        this.members[this.members.length - 1].propellorActive = false
        this.members[this.members.length - 1].flameActive = false
        // }
        // If it is a climber-column already existing in the gameplane
        if (this.members[0].y < 700) {
          for (let i = 0; i < this.members.length; i++) {
            this.members[i].setActive(true)
            this.members[i].setVisible(true)
            this.members[i].anims.play('playEnemy4idle', false)
            this.members[i].propellorActive = false
            this.members[i].flameActive = false
          }
        }
        // If it is a climber-column climbing inside the gameplane
        for (let i = 0; i < this.members.length - 1; i++) {
          if (this.members[this.members.length - 1].y > 680) {
            this.members[i].setVisible(false)
          }
        }
      }
    }
  }

  PlayClimberStop (sceneIn) {
    // console.log('play the climber 1')
    if (this.active === true) {
      // console.log('group active')
      if (sceneIn.anims.exists('playEnemy4') && sceneIn.anims.exists('playEnemy4idle')) {
        // console.log('animation exists')
        // Objects outside of the sceneview are invisible
        // for (let i = 0; i < this.members.length; i++) {
        for (let i = 0; i < this.members.length; i++) {
          this.members[i].anims.stop()
        }
        // }
      }
    }
  }
}
