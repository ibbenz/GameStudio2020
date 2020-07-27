/**
 * Clamps a value
 * @param {float} value Value to clamp
 * @param {float} min Minimal value
 * @param {float} max Maximal value
 */
Math.clamp = function (value, min, max) {
  if (value < min) return min
  if (value > max) return max
  return value
}

/**
 * Linear approximation
 * @param {float} a
 * @param {float} b
 * @param {float} t
 * @return {float} Approximated value
 */
Math.lerp = function (a, b, t) {
  return a + (b - a) * Math.clamp(t, 0, 1)
}

/**
 * Returns a random integer number between min [inclusive] and max [exclusive], biased towards max
 * @param {int} min Minimal value
 * @param {int} max Maximal value
 * @return {integer} Random biased value
 */
Math.biasedHighRandom = function (min, max) {
  var r = 1 - Math.random()
  var biased = 1 - r * r
  return Math.floor(Math.lerp(min, max, biased))
}

/**
 * Returns a random integer number between min [inclusive] and max [exclusive], biased towards min
 * @param {int} min Minimal value
 * @param {int} max Maximal value
 * @return {integer} Random biased value
 */
Math.biasedLowRandom = function (min, max) {
  var r = Math.random()
  var biased = r * r
  return Math.floor(Math.lerp(min, max, biased))
}

/**
 * Generates a random number between two values
 * @param {float} min Minimal value
 * @param {float} max Maximal value
 * @return {float} Random value
 */
Math.randRange = function (min, max) {
  var r = min + (max - min) * Math.random()
  return (Number.isInteger(min) && Number.isInteger(max)) ? Math.floor(r) : r
}
