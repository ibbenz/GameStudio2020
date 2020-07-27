import { Enemy } from './Enemy'
import Spawner from './Spawner'

// Reminder:
export default class EnemySpawner extends Spawner {
  constructor (sceneIn, shield) {
    super(sceneIn, () => new Enemy(sceneIn, shield),
      (go) => {
        go.body.setEnable(true)
        go.x = 0
      }, (scene, go) => go.x > 0)
    this.sceneForEnemy = sceneIn
    this.name = 'enemyspawner'
  }
}
