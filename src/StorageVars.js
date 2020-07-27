import Phaser from 'phaser'
import { Mission } from './MissionManager'
// Variables implemented without a Decimal-dot are Integers.
// The values of the globalstorable variables must probably be read written from/to some
// file in the Browser Cache, maybe a .json-file created in the Cache, which contains Session-Info

// The following variables are saved over several sessions in the browser

function initStorageVars () {
  if (localStorage.getItem('level') === null) { localStorage.setItem('level', 0) }
  if (localStorage.getItem('activeMissions') === null) {
  // In the beginning the active missions are the entries 0-2 in the missions-sheet
    const mis = [0, 1, 2]
    // console.log('set active missions')
    localStorage.setItem('activeMissions', JSON.stringify(mis))
  }
  if (localStorage.getItem('allCompletedMissions') === null) {
    const miscompl = []
    localStorage.setItem('allCompletedMissions', JSON.stringify(miscompl))
  }
  if (localStorage.getItem('nContinues') === null) { localStorage.setItem('nContinues', 0) }
  if (localStorage.getItem('nStartBoosts') === null) { localStorage.setItem('nStartBoosts', 0) }
  if (localStorage.getItem('nScoreMultipliers') === null) { localStorage.setItem('nScoreMultipliers', 0) }
  
  if (localStorage.getItem('startBoostLevel') === null) { localStorage.setItem('startBoostLevel', 1) }
  if (localStorage.getItem('invincibilityLevel') === null) { localStorage.setItem('invincibilityLevel', 1) }
  if (localStorage.getItem('X2Level') === null) { localStorage.setItem('X2Level', 1) }
  if (localStorage.getItem('coinMagnetLevel') === null) { localStorage.setItem('coinMagnetLevel', 1) }
  if (localStorage.getItem('fasterLevel') === null) { localStorage.setItem('fasterLevel', 1) }

  if (localStorage.getItem('nCoins') === null) { localStorage.setItem('nCoins', 0) }
  if (localStorage.getItem('nCoinsThisRun') === null) { localStorage.setItem('nCoinsThisRun', 0) }
  if (localStorage.getItem('nComboDoubleThisRun') === null) { localStorage.setItem('nComboDoubleThisRun', 0) }
  if (localStorage.getItem('nComboTripleThisRun') === null) { localStorage.setItem('nComboTripleThisRun', 0) }
  if (localStorage.getItem('bestScore') === null) { localStorage.setItem('bestScore', 0) }
  if (localStorage.getItem('bestDistance') === null) { localStorage.setItem('bestDistance', 0) }
  if (localStorage.getItem('nNearMisses') === null) { localStorage.setItem('nNearMisses', 0) }
  if (localStorage.getItem('nTotalPoints') === null) { localStorage.setItem('nTotalPoints', 0) }
  if (localStorage.getItem('nTotalDoubles') === null) { localStorage.setItem('nTotalDoubles', 0) }
  if (localStorage.getItem('nTotalTriples') === null) { localStorage.setItem('nTotalTriples', 0) }
  if (localStorage.getItem('nTotalNearMisses') === null) { localStorage.setItem('nTotalNearMisses', 0) }
  if (localStorage.getItem('totalDistance') === null) { localStorage.setItem('totalDistance', 0) }
  if (localStorage.getItem('todaysBestScore') === null) { localStorage.setItem('todaysBestScore', 0) }
  if (localStorage.getItem('todaysBestScoreDayIdentifier') === null) { localStorage.setItem('todaysBestScoreDayIdentifier', 0) }
}
window.initStorageVars = initStorageVars
