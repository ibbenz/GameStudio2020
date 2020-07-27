import Phaser from 'phaser'
import { Howl } from 'howler'

// https://phaser.io/examples/v2/audio/audio-sprite-json

// The html-Audio-Element allows playing sound during streaming.
// const audio = document.createElement('audio')
// var event = new KeyboardEvent('keydown')

export default class MainMenu extends Phaser.Scene {
  constructor () {
    super('main-menu')
    this.introSound = null
  }

  preload () {
    this.load.image('background', '/MainMenu/Background.jpg')
    this.load.image('pogologo', '/MainMenu/pogologo.png')
    this.load.image('controls', '/MainMenu/control_space.png')
    // this.load.audioSprite('intro', '/SoundFiles/mygameaudio.json', '/SoundFiles/jetfast.mp3')
    // this.load.audio('intro', '/SoundFiles/Music_Menu_loop_short_loopd.mp3')
  }

  create () {
    window.global.keyboard = this.input.keyboard.createCursorKeys()
    window.global.soundMap = new Map()
    this.add.image(690, 410, 'background')
    this.add.image(250, 600, 'pogologo').setScale(0.35)
    this.add.image(1100, 725, 'controls').setScale(0.5)
    window.global.keyboard = this.input.keyboard.createCursorKeys()

    this.introSound = document.createElement('audio')
    this.introSound.src = '/Missions/silence.mp3'
    this.input.keyboard.on('keydown', () => { this.introSound.play() })

    // The Browser-Variables are set, if not yet available from a previous session:
    window.initStorageVars()
    // introSound = new Howl({ src: ['/SoundFiles/Compressed_Music/Music_Menu_loop.mp3'], autoplay: true, loop: true, html: true, preload: false })
    // introSound = new Howl({ src: ['/SoundFiles/Compressed_Music/Music_Menu_loop_short_loopd.mp3'], autoplay: true, loop: true, preload: true })
    // introSound.load()
    // introSound.play()
    // // The real file we want to play
    // /// audio.src = '/SoundFiles/Music_Ingame_loop.wav'
    // // In a standalone Website the Audioplay works, sometimes
    // audio.src = '/SoundFiles/Compressed_Music/Music_Menu_loop.mp3'
    // audio.loop = true
    // audio.autoplay = true
    // audio.play()

    // In Netlify a User Input is required to start the Music

    // introSound.play()

    // Don't use 'pointerdown' does not work well!
    // this.input.on('pointermove', function (pointer, currentlyOver) {
    // this.input.on('pointerdown', function (pointer) {
    // audio.play()
    // })

    // this.input.keyboard.on('keydown', function (pointer, currentlyOver) {
    // audio.play()
    // })

    // this.intro = this.sound.add('intro')

    // If I do it with the inbuild phaser then looping will show a skip
    // when it loops and it does not work with npm start, but only with npm run start-prod
    // this.intro.setLoop(true)
    // this.intro.play()
  }

  update () {
    if (window.global.keyboard.space.isDown) {
      // Abort loading of initial audio.
      // audio.src = ''
      // introSound.stop()
      this.scene.start('loading-screen')
    }
  }
}
