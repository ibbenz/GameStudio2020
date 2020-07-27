import { Howl } from 'howler'
// .....................

let playCollideSoundID = null
let playCollideSound = null

// This function creates the animation of the Enemy0-Column-Element (a column-segment) of an Enemy0 in the GameScene.js
// of all Enemy0-Column-Elements in the Game-Scene.
function AnimationEnemy (scene, keyIn, playKey, prefixIn, suffixIn, startIn, endIn, frameRateIn) {
  // Animations are globally created and can be accessed by any sprite afterwards.
  // The subsequent animation can therefore be accessed also by other gameObjects than physicalEnemy.
  // console.log('keyIn: ' + keyIn + '  playKey: ' + playKey + '  prefixIn ' + prefixIn + '  suffixIn ' + suffixIn + '  startIn ' + startIn + '  endIn ' + endIn + '')
  // keyIn: enemy0Upsidedown  playKey: playEnemy1  prefixIn EUpsidedown_Body_  suffixIn .png  startIn 1  endIn 6
  return scene.anims.create({
    key: playKey,
    frameRate: frameRateIn,
    // @ts-ignore
    // The key 'enemy0' is from the LoadEnemy0()-Function, the atlas where the images are stored
    frames: scene.anims.generateFrameNames(keyIn, {
      // For the Prefix take the names as defined in the atlas .json-script
      prefix: prefixIn,
      suffix: suffixIn,
      start: startIn,
      end: endIn
    }),
    repeat: -1
  })
}
window.AnimationEnemy = AnimationEnemy

// ------------------------------------------------------------------------------------------

// Moves all Types of Enemies to the right position.
function initializer0Enemy (enemyIn) {
// The initialiser resets the enemy-object so that it can be reused.
  // console.log('initialize')
  enemyIn.body.setEnable(true)
  enemyIn.body.setVelocityX(0)
  enemyIn.body.setVelocityY(0)
  enemyIn.body.setAllowGravity(false)
  enemyIn.anims.stop()
  this.scene.tweens.killTweensOf(enemyIn)
  this.scene.tweens.killTweensOf(enemyIn.flame)
  enemyIn.angle = 0
  enemyIn.depth = 0
  enemyIn.setDepth(0)
  enemyIn.depthOffset = 1
  enemyIn.x = 0
  enemyIn.y = 0
  enemyIn.setScale(1.0, 1.0)
  enemyIn.type = enemyIn.EnemyTypes.NONE
  enemyIn.body.angularVelocity = 0
  enemyIn.body.angularDrag = 0
  enemyIn.collided = false
  enemyIn.isFloating = false
  enemyIn.isHead = false
  enemyIn.isBottom = false
  // The accessoires of the Enemy and its animations
  enemyIn.propellor.anims.stop()
  enemyIn.flame.setVisible(false)
  enemyIn.separatorUp.anims.stop()
  enemyIn.separatorDown.anims.stop()
  enemyIn.separatorLeft.anims.stop()
  enemyIn.separatorRight.anims.stop()

  enemyIn.flameActivated = true
  enemyIn.propellorActive = false
  enemyIn.flameActive = false
  enemyIn.flameActivated = false
  enemyIn.separatorUpActive = false
  enemyIn.separatorDownActive = false
  enemyIn.separatorLeftActive = false
  enemyIn.separatorRightActive = false

  enemyIn.update()

  // Destroy the stripe-group of a vertical enemy climpber
  if (enemyIn.group !== null) {
    if (enemyIn.group.stripeGroup.length !== 0) {
      for (let m; m < enemyIn.group.stripeGroup.length; m++) {
        enemyIn.group.stripeGroup[m].destroy()
      }
      enemyIn.group.stripeGroup.splice(0, enemyIn.group.stripeGroup.length)
    }
  }
  enemyIn.group = null
}
window.initializer0Enemy = initializer0Enemy

// ------------------------------------------------------------------------------------------

// The Callbackfunction has to be defined locally, since it cannot have variables in the Parantheses
// When it is called in the isCollided-Variable.
function hitEnemy (playerIn, enemyIn) {
  if (enemyIn.collided) return

  // Destroys the checkpoint
  enemyIn.group.checkpoint.x = 0

  if (playCollideSoundID === null) {
    playCollideSound = window.global.soundMap.get('hitenemy2')
    playCollideSoundID = playCollideSound.play()
  }

  if (playCollideSoundID !== null) {
    playCollideSound.on('end', function () {
      playCollideSoundID = null
    })
  }

  // console.log('length of group: ' + enemyIn.group.members.length)
  enemyIn.group.members.forEach(function (child) {
    // The reaction of a true collision is executed in the Gamescene
    child.body.angularVelocity = -60
    child.body.angularDrag = 45
    child.body.setVelocity(0, 300)
    child.body.setAllowGravity(true)
    child.collided = true
    child.update()
  }, this)

  // The sound has to be set before shield and invincible, otherwise it will cause problemns

  if (playerIn.shield.active) {
    playerIn.shield.disable()
    return
  }
  if (playerIn.isInvincible) return

  playerIn.gameOverMoveup = true
  window.global.startGameOver = true
}
window.hitEnemy = hitEnemy
