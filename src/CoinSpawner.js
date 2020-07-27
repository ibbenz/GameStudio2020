import Spawner from './EnemyFolder/Spawner'
import Coin from './Coin'

export default class CoinSpawner extends Spawner {
  constructor (scene, player) {
    super(scene,
      (scene) => new Coin(scene, player),
      (coin) => {
        coin.body.setEnable(true)
        coin.body.setVelocityX(0)
        coin.body.setVelocityY(0)
        coin.collected = false
        coin.collectedNormal = false
        coin.speed = 500
      },
      (coin) => {
        return coin.x > 0
      })
    this.name = 'coinspawner'
  }
}
