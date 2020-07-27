
export default class Spawner {
  /**
     * Constructor
     * @param {Phaser.Scene} scene
     * scene is the name and Phaser.Scene is the Type
     * The gameObjectFactory from the current scene
     * @param {function(Phaser.Scene) => Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[]} goCreator
     * goCreator is a function with a Phaser.Scene-Input and a GameObject-Output. The function can also take
     * integers as input-value which define the number of tiers.
     * A function which creates a GameObject
     * @param {function(Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[])} goInitializer
     * A function which initializes/resets a GameObject
     * @param {function(Phaser.GameObjects.GameObject)} goActiveCheck
     * A function which checks if a GameObject is in active state
     */
  constructor (scene, goCreator, goInitializer, goActiveCheck) {
    this.scene = scene
    this.creator = goCreator
    this.initializer = goInitializer
    this.activeCheck = goActiveCheck
    this.elements = []
    this.obj = null
    this.name = 'null'
  }

  /**
     * Spawns an object
     * @return {Phaser.GameObjects.GameObject} Returns the GameObject (re)initialized
     */
  spawn () {
    if (!this.creator || !this.initializer) {
      console.warn('[EntityManager] No function to create/initialize a GameObject')
      return
    }

    // Destroy instead of recycle
    // if (this.elements.length > 50) {
    //   const toDestroy = this.elements.shift()
    //   if (this.name === 'enemyspawner') {
    //     window.global.gameScene.physics.world.removeCollider(toDestroy.collision)
    //   }
    //   toDestroy.destroy()
    // }

    var obj = this.findInactive()

    // set false, if we don't want recycling
    // obj = false

    // If we wanna just destroy and not recycle:
    // If every instance are active, create a new object
    if (!obj) {
      obj = this.creator(this.scene)
      if (!obj) return null // If no GameObject created
      if (Array.isArray(obj)) { obj.forEach(el => this.elements.push(el)) } else { this.elements.push(obj) } // Register the new GameObject
    }

    obj.setActive(true)
    if (typeof obj.visible !== 'undefined') { obj.setVisible(true) }

    // (Re)initialize the object
    this.initializer(obj)
    this.obj = obj
    return obj
  }

  /**
     * Find an existing inactive GameObject
     * @return {Phaser.GameObjects.GameObject} Returns an inactive GameObject if found, null if not
     */
  findInactive () {
    for (var i = 0; i < this.elements.length; i++) {
      if (!this.elements[i].active) {
        // Recycle instead of destroy
        return this.elements[i]
      }
    }
    return null
  }

  /**
     * Get an exisiting GameObject
     * @param {integer} index
     * @return {Phaser.GameObjects.GameObject} Returns the GameObject if index is in range
     */
  get (index) {
    if (index < 0 || index >= this.elements.length) {
      console.warn('[EntityManager] Index out of range')
      return null
    }
    return this.elements[index]
  }

  /**
     * Updates active state of every element
     */
  update () {
    if (!this.activeCheck) {
      console.warn('[EntityManager] No callback for checking GameObject active state')
      return
    }

    // console.log('anzahl elemente: ' + this.elements.length + ' name: ' + this.name)
    for (let i = (this.elements.length - 1); i > 0; i--) {
      if (!this.activeCheck(this.scene, this.elements[i])) {
        this.elements[i].setActive(false)
        this.elements[i].setVisible(false)
        // The collision group will be inactive if one element is inactive
        if (this.name === 'enemyspawner') {
          this.elements[i].group.active = false
        }
      }
    }
  }

  /**
     * Calls a function for each element
     * @param {function(Phaser.GameObjects.GameObject)} callback
     */
  forEach (callback) {
    this.elements.forEach((go, index, array) => {
      if (go.active) callback(go, index, array)
    })
  }
}
