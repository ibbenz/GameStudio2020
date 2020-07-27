import './GlobalVars'
import './StorageVars'
import './FilesToLoad'
import './Loader'
import './ProgressiveLoader1'
import Phaser from 'phaser'
import MainMenu from './MainMenu'
import LoadingScreen from './LoadingScreen'
import LoadingScreenMissions from './LoadingScreenMissions'
import GameOver from './GameOverSummary'
import MissionScreen from './MissionScreen'
import HighScoreScreen from './HighScoreScreen'
import LevelUpScreen from './LevelUpScreen'
import GameOverScreen from './GameOverScene'
import GameScene from './GameScene'
import PauseScene from './PauseScene'
import HomeScreen from './HomeScene'
import ReplayStartScene from './ReplayStartScreen'
import ShopScreen from './ShopScene'

var config = {
  type: Phaser.AUTO,
  width: 1380,
  height: 820,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: [MainMenu,
    ShopScreen,
    LoadingScreen,
    LoadingScreenMissions,
    GameScene,
    HighScoreScreen,
    MissionScreen,
    LevelUpScreen,
    HomeScreen,
    PauseScene,
    GameOverScreen,
    ReplayStartScene,
    GameOver]
}

export default new Phaser.Game(config)
