
import { Howl } from 'howler'
let type
let key
let spritesheet
let jsonsheet
let currentFile
window.keyExists = true

// ['atlas', 'enemy0Upsidedown', 'Spritesheets/Enemies/Enemy0_sprite_upsidedown.png', 'Spritesheets/Enemies/Enemy0_sprite_upsidedown.json'],
// Don't load the files again, if they already exist.
function progressiveLoader1 (scene, loadfilesIn) {
  // This loader has only to be started once. It ends as soon as all files in the loadfilesIn are loaded.
  if (loadfilesIn.length > 0) {
    // If the previous file finished loading, load the next file
    // Only if the previous file is loaded the next file will load.
    if (window.keyExists) {
      currentFile = loadfilesIn.pop()
      // console.log('second entry: ' + currentFile[1])
      type = currentFile[0]
      key = currentFile[1]
      spritesheet = currentFile[2]
      jsonsheet = currentFile[3]
      // console.log('window loadfiles size: ' + loadfilesIn.length)
      // If the picture already exists, don't load it again.
      // This is useful, when we restart the game.
      if (!scene.textures.exists(key) && ((type === 'image') || (type === 'atlas'))) {
        switch (type) {
          case ('atlas'):
            scene.load.atlas(key, spritesheet, jsonsheet)
            scene.load.on('complete', window.progressiveAdder2.bind(null, { scene: scene, key: key }))
            break
          case ('image'):
            // console.log('load key ' + key + '')
            scene.load.image(key, spritesheet)
            break
          default:
        }
      } else if ((type === 'sound') && !window.global.soundMap.has(key)) {
      // window.global.gameScene.load.audio(key, spritesheet)
      // If sound does not exist, load it
        window.global.soundMap.set(key, new Howl({ src: [spritesheet], preload: true, volume: 0.5, onload: function () { window.keyExists = true } }))
      } else { // console.log('Double Entry of: ' + spritesheet)
      }

      // We start the load now
      scene.load.start()
    }

    // console.log('key exists: ' + window.keyExists + 'key ' + key)

    // Checks if image or atlas is loaded
    if (((type === 'image') || (type === 'atlas'))) {
      // console.log('typecheck key: ' + key + ' exists ' + window.keyExists)
      if (scene.textures.exists(key)) {
        window.keyExists = true
      } else { window.keyExists = false }
    }

    // Checks if sound is loaded
    if (type === 'sound') {
      // console.log('typecheck key: ' + key + ' exists ' + window.keyExists)
      if (window.global.soundMap.has(key)) {
        window.keyExists = true
      } else { window.keyExists = false }
    }

    // End while
  }
}
window.progressiveLoader1 = progressiveLoader1

// -----------------------------------------------------------------
function progressiveAdder2 (caseIn) {
  switch (caseIn.key) {
    case ('enemy0Upsidedown'):
      window.AnimationEnemy(caseIn.scene, 'enemy0Upsidedown', 'playEnemy0upside', 'EUpsidedown_Body_', '.png', 1, 6, 30)
      window.AnimationEnemy(caseIn.scene, 'enemy0Upsidedown', 'playEnemyHead0upside', 'EUpsidedown_Head_', '.png', 1, 24, 30)
      break
    case ('enemy1'):
      // function AnimationEnemy (key, playKey, prefix, suffix)
      // console.log('create blue animation')
      window.AnimationEnemy(caseIn.scene, 'enemy1', 'playEnemy1', 'Body_Vertical_Blue_', '.png', 1, 6, 30)
      window.AnimationEnemy(caseIn.scene, 'enemy1', 'playEnemy1Head', 'Head_Vertical_Blue_', '.png', 1, 24, 30)
      break
    case ('enemy1Upsidedown'):
      // function AnimationEnemy (key, playKey, prefix, suffix)
      // console.log('create blue animation')
      window.AnimationEnemy(caseIn.scene, 'enemy1Upsidedown', 'playEnemy1Upside', 'EUpsidedown_Blue_Body_', '.png', 1, 6, 30)
      window.AnimationEnemy(caseIn.scene, 'enemy1Upsidedown', 'playEnemy1HeadUpside', 'EUpsidedown_Blue_Head_', '.png', 1, 24, 30)
      break
    case ('enemy2'):
      window.AnimationEnemy(caseIn.scene, 'enemy2', 'playEnemy2', 'EWall_Head_', '.png', 1, 24, 30)
      break
    case ('enemy3'):
      window.AnimationEnemy(caseIn.scene, 'enemy3', 'playEnemy3', 'EWall_Head_Blue_', '.png', 1, 24, 30)
      break
    case ('enemy4'):
      // Climber
      window.AnimationEnemy(caseIn.scene, 'enemy4', 'playEnemy4', 'Eclimb_', '.png', 1, 10, 45)
      window.AnimationEnemy(caseIn.scene, 'enemy4', 'playEnemy4final', 'Eclimb_', '.png', 11, 28, 45)
      window.AnimationEnemy(caseIn.scene, 'enemy4', 'playEnemy4idle', 'Eclimb_', '.png', 28, 38, 15)
      break
    case ('accessoires'):
      window.AnimationEnemy(caseIn.scene, 'accessoires', 'playPropellor', 'Propellor_', '.png', 1, 6, 30)
      break
    case ('jet-blast'):
      window.AnimationEnemy(caseIn.scene, 'jet-blast', 'player-jet-blast', 'JetBlast', '.png', 1, 23, 30)
      break
    default:
  }
}
window.progressiveAdder2 = progressiveAdder2
