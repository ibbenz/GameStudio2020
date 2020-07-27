import { Howl } from 'howler'

let type
let key
let spritesheet
let jsonsheet
let currentFile
window.keyExists = true

// ['atlas', 'enemy0Upsidedown', 'Spritesheets/Enemies/Enemy0_sprite_upsidedown.png', 'Spritesheets/Enemies/Enemy0_sprite_upsidedown.json'],
// Don't load the files again, if they already exist.
function loader1 (scene, loadfilesIn) {
  let filesToLoad = 0
  while (loadfilesIn.length > 0) {
    currentFile = loadfilesIn.pop()
    // console.log('second entry: ' + currentFile[1])
    type = currentFile[0]
    key = currentFile[1]
    spritesheet = currentFile[2]
    jsonsheet = currentFile[3]
    // console.log('window loadfiles size: ' + loadfilesIn.length)
    // If the picture already exists, don't load it again.
    // This is useful, when we restart the game.
    // console.log('type ' + type + ' key ' + key + ' spritesheet ' + spritesheet + ' jsonsheet ' + jsonsheet)
    if (!scene.textures.exists(key) && ((type === 'image') || (type === 'atlas'))) {
      filesToLoad++
      // console.log('load file: ' + key)
      switch (type) {
        case ('atlas'):
          scene.load.atlas(key, spritesheet, jsonsheet)
          break
        case ('image'):
          scene.load.image(key, spritesheet)
          break
        default:
      }
    } else if ((type === 'sound') && !window.global.soundMap.has(key)) {
      // window.global.gameScene.load.audio(key, spritesheet)
      // If sound does not exist, load it
      window.global.soundMap.set(key, new Howl({ src: [spritesheet], preload: true, volume: 0.5, onload: function () { window.keyExists = true } }))
    } else { console.log('Double Entry of: ' + spritesheet) }
    // scene.load.start()
  }
  scene.load.start()
}
window.loader1 = loader1
