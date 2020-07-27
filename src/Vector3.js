export default class Vector3 {
  constructor (x = 0, y = 0, z = 0) {
    this.x = x
    this.y = y
    this.z = z
  }

  /**
     * Addition
     * @return {Vector3} Result
     */
  add (other) {
    return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z)
  }

  /**
     * Substraction
     * @return {Vector3} result
     */
  sub (other) {
    return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z)
  }

  /**
     * Dot product
     * @param {Vector3} other
     */
  dot (other) {
    return this.x * other.x + this.y * other.y + this.z * other.z
  }

  /**
     * Normalizes a vector
     * @return {Vector3} Normalized vector
     */
  normalize () {
    var m = this.magnitude()
    return new Vector3(this.x / m, this.y / m, this.z / m)
  }

  /**
     * Computes the magnitude of the vector
     * @return {float} Magnitude
     */
  magnitude () {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
  }
}
