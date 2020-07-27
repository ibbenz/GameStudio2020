import Spawner from './EnemyFolder/Spawner'
import PowerUp from './PowerUp'

export default class PowerUpSpawner extends Spawner {
  constructor (scene, entityManager) {
    super(scene,
      (scene) => new PowerUp(scene, entityManager),
      (powerup) => {
        powerup.body.checkCollision.none = false
      },
      (powerup) => powerup.x > 0)
    this.name = 'powerupspawner'
  }
}
