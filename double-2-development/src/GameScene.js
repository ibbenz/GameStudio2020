import Phaser from 'phaser'
import EntityManager from './EntityManager'
import MissionManager from './MissionManager'
import Player from './Player'
import './EnemyFolder/Enemy0Functions'
import BackgroundGenerator from './BackgroundGenerator'
import { progressiveLoadfiles } from './FilesToLoad'
import PlayerManager from './PlayerManager'
import DeathFX from './FX/DeathFX'
import CoinBonanzaLandingFX from './FX/CoinBonanzaLandingFX'
import Combo from './Combo'
import ProgressBar from './ProgressBar'
import PowerUpBar from './PowerUpBar'
import { audioCoin1, audioCoin1p } from './Coin'

let counter = 0
var animsprite

export var audioGame = document.createElement('audio')

export default class GameScene extends Phaser.Scene {
  constructor () {
    super('game-scene') // The constructor of a Phaser.Scene has either a string or a config
    // The player is assigned to the GameScene.

    window.global.gameScene = this
    this.test = null
    this.testgroup = null
    this.audioGame = audioGame
  }

  preload () {
    this.load.glsl('shield-shader', 'shield.glsl.js')

    audioCoin1.src = 'Soundfiles/Compressed_Sounds/Pickup_Coin_Yellow_01.mp3'
    audioCoin1.loop = false
    audioCoin1.volume = 0.3
    audioCoin1.autoplay = false

    audioCoin1p.src = 'Soundfiles/Compressed_Sounds/Pickup_Coin_Purple01.mp3'
    audioCoin1p.loop = false
    audioCoin1p.volume = 0.3
    audioCoin1p.autoplay = false
  }

  create () {
    // Storage Variables are reset, since a new run has started.

    animsprite = this.physics.add.sprite(500, 500)
    animsprite.body.setAllowGravity(false)

    localStorage.setItem('nCoinsThisRun', 0)
    localStorage.setItem('nComboDoubleThisRun', 0)
    localStorage.setItem('nComboTripleThisRun', 0)

    this.player = new Player(this, -150, 200)
    this.player.Create()
    this.playerManager = new PlayerManager(this, this.player)

    this.backGroundGenerator = new BackgroundGenerator(this, this.player)
    this.backGroundGenerator.create()
    this.combo = new Combo(this, this.player)

    this.powerUpBar = new PowerUpBar(this)
    this.powerUpBar.SetLevel(5)
    this.powerUpBar.SetProgress(0.5)

    // The Animation for the first Enemytype is created (a segment)
    // This can't be done in Preload().
    window.AnimationEnemy(this, 'enemy0', 'playEnemy0', 'Body_Vertical_', '.png', 1, 6, 30)
    window.AnimationEnemy(this, 'enemy0', 'playEnemyHead0', 'Head_Vertical_', '.png', 1, 24, 30)

    this.physics.world.setFPS(500)

    // The Player and the first Enemytype are created.
    // this.entityManager = new EntityManager(this, this.player)
    // this.add.existing(this.entityManager) // otherwise the update in the Manager will not be executed.
    this.missionManager = new MissionManager(this, this.player)
    this.add.existing(this.missionManager)
    this.entityManager = new EntityManager(this, this.player, this.combo)
    this.add.existing(this.entityManager)

    this.audioGame.src = '/SoundFiles/Compressed_Music/Music_Ingame_loop.mp3'
    // audioGame.playbackRate = 2
    this.audioGame.loop = true
    this.audioGame.autoplay = true

    this.SetCamera()
    this.SetGameSceneUI()

    this.playerManager.create()

    // bounce fx
    this.player.bounceFx = this.add.particles('particles', 'particle_smoke.png', {
      x: 0,
      y: 0,
      quantity: 5,
      frequency: -1,
      lifespan: { min: 100, max: 350 },
      speedX: { min: -200, max: 200 },
      speedY: { min: -50, max: 100 },
      scale: (particle, key, t, value) => {
        if (!particle.initScale) particle.initScale = Math.randRange(0.2, 0.3)
        return particle.initScale * ((t < 0.15) ? t / 0.15 : 1 - (t - 0.15) / 0.85)
      }
    })
    this.player.bounceFx.setY(695)
    this.player.cbLanding = new CoinBonanzaLandingFX(this, this.player)

    this.deathFx = new DeathFX(this, this.player)

    this.events.on('resume', (sys, data) => {
      if (data === 'game-over-screen') this.player.Reset()
    })
  }

  update () {
    counter++
    if (counter === 1) {
      window.loadCoinSounds()
    }

    if (audioGame.paused && this.audioGame.autoplay) {
      audioGame.play()
    }

    // If the scene is started from the Home-Screen and not the Main/Intro-screen
    // first the replay-screen with the missions is shown.
    if (window.global.restart) {
      this.StartReplayScreen()
    }

    window.progressiveLoader1(this, progressiveLoadfiles)
    this.backGroundGenerator.update()
    this.playerManager.update()

    // Groups are activated/deactivated in update() of Spawner.js
    for (let i = 0; i < this.entityManager.climberToPlay.length; i++) {
      // If the elements are for sure climbers in the climberToPlay-array.
      // Due to the recycling objects in a climber-array could be suddendly
      // used for other purposes
      // If climbergroup is active, play the group, else remove the group
      // The group is checked on activity in Spawner.js

      const lengthClimber = this.entityManager.climberToPlay[i].members.length
      const membersElement = this.entityManager.climberToPlay[i].members

      // Climber enemies generated in the midth of the playfield should moved away
      if (membersElement[0].x > this.player.x + 1000 && membersElement[0].y < 800) {
        for (let j = 0; j < lengthClimber; j++) {
          membersElement[j].y = 2000
          membersElement[j].flame.y = 2000
          membersElement[j].propellor.y = 2000
        }
        continue
      }

      if (this.entityManager.climberToPlay[i].active) {
        // Climber starts only, when player is close enough
        if (this.entityManager.climberToPlay[i].members[0].x < this.player.x + 750 && this.entityManager.climberToPlay[i].members[0].x > this.player.x + 700) {
          this.entityManager.climberToPlay[i].PlayClimberStop(this)
        } else if (this.entityManager.climberToPlay[i].members[0].x < this.player.x + 700) {
          this.entityManager.climberToPlay[i].PlayClimber(this)
        } else { this.entityManager.climberToPlay[i].PlayClimberIdle(this) }
      } else { this.entityManager.climberToPlay.splice(i, 1) }
    }

    // Vertical Mover
    for (let i = 0; i < this.entityManager.verticalMoverToPlay.length; i++) {
      if (this.entityManager.verticalMoverToPlay[i].active) {
        this.entityManager.verticalMoverToPlay[i].PlayVerticalMover(this)
      } else { this.entityManager.verticalMoverToPlay.splice(i, 1) }
    }

    if (window.global.startGameOver) {
      if (this.player.y > this.scale.height * 1.5) {
        window.global.gameOver = true
        window.global.startGameOver = false
      }
    }

    if (window.global.gameOver) {
      this.StartGameOverScreen()
    }

    this.ManagePause()

    this.input.keyboard.on('keydown-ESC', () => this.Pause())

    if (window.global.muted) {
      this.audioGame.autoplay = false
      this.audioGame.pause()
    } else {
      this.audioGame.autoplay = true
    }
  }

  SetGameSceneUI () {
    this.add.image(this.scale.width * 0.07, this.scale.height * 0.88, 'UI0', 'PauseButton.png').setScrollFactor(0).setDepth(2).setInteractive().on('pointerdown', () => this.Pause())
    this.add.image(this.scale.width * 0.09, this.scale.height * 0.07, 'UI0', 'GUI_CoinContainer.png').setOrigin(0.5, 0.5).setScrollFactor(0).setDepth(1)
    this.add.image(this.scale.width * 0.05, this.scale.height * 0.07, 'UI0', 'Coin_Icon.png').setScrollFactor(0).setDepth(1)
  }

  SetCamera () {
    this.physics.world.setBounds(-1000, -4000, 10000000, 4820)
    this.cameras.main.setBounds(0, 0, 10000000, 820)
    this.cameras.main.startFollow(this.player)
    this.cameras.main.setFollowOffset(-window.global.playerCamOffSet, 0)
    this.cameras.main.setLerp(0.1, 0.1)
  }

  StartGameOverScreen () {
    this.audioGame.pause()
    this.scene.pause()
    // The total distance within a level.
    this.scene.launch('game-over-screen', { playerIn: this.player, gameAudio: this.audioGame })
    window.global.scoreMultiplier = 1
    window.global.gameOver = false
  }

  StartReplayScreen () {
    this.scene.pause()
    this.scene.launch('replay-start-scene')
    window.global.restart = false
  }

  ManagePause () {
    if (window.global.pause) {
      this.scene.pause()
      this.scene.launch('pause-scene', { player: this.player, gameAudio: this.audioGame })
      window.global.pause = false
    }
  }

  Pause () {
    window.global.pause = true
  }
}
