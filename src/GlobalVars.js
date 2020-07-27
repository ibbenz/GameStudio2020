
// Variables implemented without a Decimal-dot are Integers.
// The values of the globalstorable variables must probably be read written from/to some
// file in the Browser Cache, maybe a .json-file created in the Cache, which contains Session-Info

// playerEnemydist: Distance between player and next spawn Object

window.global = {
  player: null,
  playerVelocity: 100,
  playerSpawndist: 500,
  playerStartX: 200,
  // playerStartY: 700,
  playerCamOffSet: 400,
  catPileGap: 80, // The thickness of a catpile-element
  catHeadGap: 150, // The thickness of a catpile-element
  gameScene: null,
  soundMap: null,
  enemyHorizontalSpeedLow: -150,
  enemyHorizontalSpeedHigh: -350,
  keyboard: 0,
  startBoost: false,
  startGameOver: false,
  gameOver: false,
  missionLevel: 0,
  pause: false,
  restart: false,
  isStarting: true,
  isDailyChallenge: true,
  muted: false,
  todayIdentifier: 0,
  scoreMultiplier: 1,
  thisRunComboDouble: 0,
  thisRunComboTriple: 0,
  thisRunDistance: 0,
  thisRunScore: 0,
  thisRunFinalScore: 0,
  thisRunNumCoins: 0,
  enemiesPassed: 0,
  skipTitleScreen: false,
  firstPlay: true,
  heartItemCost: 1000,
  startBoostItemCost: 500,
  titleMusicFadeTime: 0,
  titleMusicFadeOutTime: 0
}

window.globalArray = {
  invincibilityUpgradeCosts: [1000, 2000, 3000, 4000, 5000, 'Max'],
  fasterUpgradeCosts: [500, 1000, 1500, 2000, 2500, 'Max'],
  startBoostUpgradeCosts: [1000, 2000, 3000, 4000, 5000, 'Max'],
  coinMagnetUpgradeCosts: [500, 1000, 1500, 2000, 2500, 'Max'],
  x2UpgradeCosts: [750, 1500, 2250, 3000, 3750, 'Max'],
  invincibilityPickupDurations: [2.0, 4.0, 6.0, 8.0, 10.0, 12.0],
  fasterPickupDurations: [5.0, 10.0, 15.0, 20.0, 25.0, 30.0],
  startBoostDistances: [200, 300, 400, 500, 600, 700],
  coinMagnetPickupDurations: [5, 10, 15, 20, 25, 30],
  x2PickupDurations: [5, 10, 15, 20, 25, 30]
}

// export default class GlobalVars{
// Here for example, the session-variables of the game (globalstorable), stored in the cache or the server
// will be loaded.

// The Functions for the Enemiegeneration are put into the Enemy.js

function preload () {

}
window.preload = preload

function showRewardedBreak (test) {

}
window.showRewardedBreak = showRewardedBreak

function showCommercialBreak () {

}
window.showCommercialBreak = showCommercialBreak

// Save Session Variables (-->writing it to Cache-file, Server-file whatsoever)
function save () {

}
window.save = save

// Reset the storage-Variables within the Session (--> not in the storage itself)
function deleteProgress () {
  // nCoins.Value = 0
  // bestScore.Value = 0
  // bestDistance.Value = 0
  // nNearMisses.Value = 0
  // nTotalPoints.Value = 0
  // nTotalDoubles.Value = 0
  // nTotalTriples.Value = 0
  // nTotalNearMisses.Value = 0
  // totalDistance.Value = 0

  // nContinues.Value = 0
  // nStartBoosts.Value = 0
  // nScoreMultipliers.Value = 0

  // startBoostLevel.Value = 0
  // invincibilityLevel.Value = 0
  // X2Level.Value = 0
  // coinMagnetLevel.Value = 0
  // // higherLevel.Value = 0;
  // fasterLevel.Value = 0
  // Save()
}
window.deleteProgress = deleteProgress



function playTitleMusic () {

}
window.playTitleMusic = playTitleMusic

function pauseTitleMusic () {

}
window.pauseTitleMusic = pauseTitleMusic

// Stop Title Music
function stopTitleMusic (fadeTime = 0) {

}
window.stopTitleMusic = stopTitleMusic

// Update Title Music
function updateTitleMusic () {

}
window.updateTitleMusic = updateTitleMusic

// }
