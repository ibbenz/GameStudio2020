import Spawner from './EnemyFolder/Spawner'
import Checkpoint from './Checkpoint'

export default class CheckpointSpawner extends Spawner {
  constructor (scene, player, combo) {
    super(scene,
      () => new Checkpoint(scene, player, combo),
      (cp) => { cp.reached = false },
      (scene, cp) => cp.x > 0)
  }
}
