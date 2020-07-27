import Phaser from 'phaser'

// Missions are loaded from the storage

const MissionTypeDistance = 0
const MissionTypeCombo = 1
const MissionTypeCoins = 2
const MissionTypeGems = 3
const MissionTypeDoubles = 4
const MissionTypeTriples = 5
const MissionTypeNearMisses = 6
const MissionTypeHoldFwd = 7
const MissionTypeScorePoints = 8
const MissionModSingleRun = 0
const MissionModOverall = 1
const MissionModDailyChallenge = 2

// Add missions
export class Mission {
  constructor (type, mod, target, isCompleted = false, reward = 1000) {
    this.type = type
    this.mod = mod
    this.target = target
    this.isCompleted = isCompleted
    this.reward = reward
  }
}

// Array with possible missions
// A distance of x = 2500 is displayed as 25m in the game

const missions = []
// level 1
missions.push(new Mission(MissionTypeDistance, MissionModOverall, 20000, false, 100))
missions.push(new Mission(MissionTypeCombo, MissionModSingleRun, 5, false, 100))
missions.push(new Mission(MissionTypeScorePoints, MissionModSingleRun, 200, false, 100))

// level 2
missions.push(new Mission(MissionTypeDistance, MissionModSingleRun, 10000, false, 200))
missions.push(new Mission(MissionTypeDoubles, MissionModSingleRun, 1, false, 200))
missions.push(new Mission(MissionTypeCoins, MissionModSingleRun, 50, false, 200))
// level 3
missions.push(new Mission(MissionTypeDistance, MissionModOverall, 100000, false, 300))
missions.push(new Mission(MissionTypeTriples, MissionModSingleRun, 1, false, 300))
missions.push(new Mission(MissionTypeScorePoints, MissionModSingleRun, 1000, false, 300))
// level 4
missions.push(new Mission(MissionTypeScorePoints, MissionModOverall, 10000, false, 400))
missions.push(new Mission(MissionTypeCombo, MissionModSingleRun, 20, false, 400))
missions.push(new Mission(MissionTypeCoins, MissionModSingleRun, 200, false, 400))
// level 5
missions.push(new Mission(MissionTypeDistance, MissionModSingleRun, 250000, false, 500))
missions.push(new Mission(MissionTypeDoubles, MissionModSingleRun, 5, false, 500))
missions.push(new Mission(MissionTypeScorePoints, MissionModSingleRun, 7500, false, 500))
// level 6
missions.push(new Mission(MissionTypeDistance, MissionModOverall, 250000, false, 600))
missions.push(new Mission(MissionTypeTriples, MissionModOverall, 3, false, 600))
missions.push(new Mission(MissionTypeCombo, MissionModSingleRun, 50, false, 600))
// level 7
missions.push(new Mission(MissionTypeDistance, MissionModSingleRun, 500000, false, 700))
missions.push(new Mission(MissionTypeScorePoints, MissionModOverall, 50000, false, 700))
missions.push(new Mission(MissionTypeCombo, MissionModSingleRun, 50, false, 700))
// level 8
missions.push(new Mission(MissionTypeScorePoints, MissionModSingleRun, 10000, false, 800))
missions.push(new Mission(MissionTypeCoins, MissionModSingleRun, 400, false, 800))
missions.push(new Mission(MissionTypeDoubles, MissionModSingleRun, 10, false, 800))
// level 9
missions.push(new Mission(MissionTypeDistance, MissionModOverall, 500000, false, 900))
missions.push(new Mission(MissionTypeDoubles, MissionModOverall, 100, false, 900))
missions.push(new Mission(MissionTypeCombo, MissionModSingleRun, 100, false, 900))
// level 10
missions.push(new Mission(MissionTypeDistance, MissionModSingleRun, 1000000, false, 1000))
missions.push(new Mission(MissionTypeTriples, MissionModSingleRun, 3, false, 1000))
missions.push(new Mission(MissionTypeScorePoints, MissionModOverall, 200000, false, 1000))
// level 11
missions.push(new Mission(MissionTypeCombo, MissionModSingleRun, 150, false, 1100))
missions.push(new Mission(MissionTypeTriples, MissionModOverall, 10, false, 1100))
missions.push(new Mission(MissionTypeScorePoints, MissionModSingleRun, 100000, false, 1100))
// level 12
missions.push(new Mission(MissionTypeCoins, MissionModSingleRun, 800, false, 1200))
missions.push(new Mission(MissionTypeDoubles, MissionModSingleRun, 20, false, 1200))
missions.push(new Mission(MissionTypeScorePoints, MissionModOverall, 1000000, false, 1200))
// level 13
missions.push(new Mission(MissionTypeScorePoints, MissionModSingleRun, 1000000, false, 1300))
missions.push(new Mission(MissionTypeCombo, MissionModSingleRun, 250, false, 1300))
missions.push(new Mission(MissionTypeDistance, MissionModSingleRun, 2000000, false, 1300))

export { missions }

export default class MissionManager extends Phaser.GameObjects.GameObject {
  constructor (scene, player) {
    super(scene, 'MissionManager')
    this.player = player
    this.recentlyCompletedMissions = [false, false, false]
    // The completed missions during the run:
    this.completedMissions = []
    // The initial active missions are the missions 0, 1 and 2 for level 0
    this.activeMissions = JSON.parse(localStorage.getItem('activeMissions'))
  }

  preUpdate () {
    // console.log('preupdate Mission')
    // Use this for initialization
    // Completed missions are added to the localStorage-Variables in the update.
    // The value '1' simply means: true
    // In the very beginning, no mission is completed.
    for (let i = 0; i < missions.length; i++) {
      // console.log('completedMission ' + i + ' is ' + localStorage.getItem('completedMission' + i))
      if (parseInt(localStorage.getItem('completedMission' + i)) === 1) {
        // console.log('set true')
        missions[i].isCompleted = true
      }
    }
    // Update is called once per frame

    if (this.player === null) {
      return
    }

    // console.log('mission targed 1: ' + missions[this.activeMissions[0]].target)
    // console.log('mission targed 2: ' + missions[this.activeMissions[1]].target)
    // console.log('mission targed 3: ' + missions[this.activeMissions[2]].target)

    for (let i = 0; i < this.activeMissions.length; i++) {
      // Check if mission was already completed before.
      // If not, check if mission has been newly completed
      // console.log('is mission ' + this.activeMissions[i] + ' completed? ' + missions[this.activeMissions[i]].isCompleted)
      if (!missions[this.activeMissions[i]].isCompleted) {
        const complete = this.CheckCompletion(missions[this.activeMissions[i]])
        if (complete) {
          // The recentlyCompletedMissions is used to decide, if
          // There will be a reward after a game-over collision
          // console.log('mission completed, target: ' + missions[this.activeMissions[i]].target)
          // console.log('mission completed, penguin: ' + this.player.x)
          // console.log('i: ' + i)
          // console.log('active missions: ' + this.activeMissions[i])
          this.recentlyCompletedMissions[i] = true
          missions[this.activeMissions[i]].isCompleted = true
          // console.log('active missions status: ' + missions[this.activeMissions[i]].isCompleted)
          this.ShowMissionComplete(missions[this.activeMissions[i]])
          const newSessionKey = 'completedMission' + this.activeMissions[i]
          localStorage.setItem(newSessionKey, 1)
          const allCompletedMissions = JSON.parse(localStorage.getItem('allCompletedMissions'))
          // The number of the completed mission is added to the list of completed missions:
          allCompletedMissions.push(this.activeMissions[i])
          // And stored in the localStorage of the Browser
          localStorage.setItem('allCompletedMissions', JSON.stringify(allCompletedMissions))
        }
      }
    }

    // Update the mission-values in the storage.
  }

  // In case that all 36 missions were completed, the RefreshActiveMission
  // clears the activeMissions-array --> length is 0.
  AllMissionsComplete () { return this.activeMissions.length <= 0 }

  // If a mission is finished, a pop-up is shown, which tells us that.
  ShowMissionComplete (missionDone) {
    // The mission is saved for the final reward screen:
    this.completedMissions.push(missionDone)
    // console.log('mission: ' + missionDone.toString())
    // and now show the Popup on the right of the screen
  }

  // This function is called during the reward screen.
  // In the completedMissions-Array, all missions are stored, which were achieved during the run.
  ShowNextMission () {
    if (this.completedMissions.Count > 0) {
      // missionDescriptionTxt.text = completedMissions[0].ToString() + '\n\n<color=yellow>+' + completedMissions[0].reward + '</color>'
      // startTime = Time.time
      // bShow = true
      this.completedMissions.pop()
      return true
    }
    return false
  }

  // This function has to be called after the reward-screen. There will be checked if
  // all missions for a level were fulfilled and if we can switch to the next level.
  RefreshActiveMissions () {
    // console.log('refreshmissions')
    // The current level is read.
    const prevKnownLevel = window.global.scoreMultiplier
    let level = 0
    let levelCompleted = true
    while (levelCompleted) {
      for (let i = 0; i < 3; i++) {
        // Checks if all missions of the level 0 are completed,
        // If not: We set the levelCompleted = false
        // console.log('refresh: mission status: ' + missions[i + (level * 3)].isCompleted)
        // console.log('refresh: mission status 2: ' + missions[i].isCompleted)
        if (!missions[i + (level * 3)].isCompleted) {
          // console.log('mission ' + i)
          // If a level is not yet complete, finish the missions of this level
          levelCompleted = false
          break
        }
      } // *********** end of for

      // If all missions for e.g. level 0 were completed, increase the level
      // and check if the the missions for the next higher level are also complete.
      if (levelCompleted) { level++ }

      // If no more missions are available, stop the while loop
      if (level * 3 >= missions.length) { break }
    }
    // **************** end of while

    // In case that not yet all missions have been completed, the activeMissions-array is filled with the mission-numbers
    if (level * 3 >= missions.length) { this.activeMissions = [] } else { this.activeMissions = [(level * 3), (level * 3) + 1, (level * 3) + 2] }
    localStorage.setItem('activeMissions', JSON.stringify(this.activeMissions))

    // The array which contains the information, if a mission has been recently completed.
    // is cleared.
    this.recentlyCompletedMissions = [false, false, false]
    window.global.scoreMultiplier = (level + 1)

    // console.log('prevKnownLevel ' + prevKnownLevel)
    // console.log('global.scoreMultiplier ' + window.global.scoreMultiplier)
    if (prevKnownLevel > 0 && window.global.scoreMultiplier !== prevKnownLevel) {
      localStorage.setItem('nTotalPoints', 0)
      localStorage.setItem('nTotalDoubles', 0)
      localStorage.setItem('nTotalTriples', 0)
      localStorage.setItem('nTotalNearMisses', 0)
      localStorage.setItem('totalDistance', 0)
      localStorage.setItem('level', level)
      // console.log('new level is: ' + level)
      return true
    }
    return false
  }

  // Functions which help to analyse the mission
  // Overall: The points of previous runs are added to the points of the current run
  // Single Run: Only the points of the current run count
  GetProgress (missionIn, playerIn) {
    switch (missionIn.type) {
      case MissionTypeDistance:
        if (missionIn.mod === MissionModOverall) { return parseInt(localStorage.getItem('totalDistance')) + playerIn.x } else if (missionIn.mod === MissionModSingleRun) { return playerIn.x }
        break
      case MissionTypeScorePoints:
        if (missionIn.mod === MissionModOverall) { return parseInt(localStorage.getItem('nTotalPoints')) } else if (global.isDailyChallenge || missionIn.mod === MissionModSingleRun) { return Math.max(window.global.thisRunScore, window.global.thisRunFinalScore) }
        break
      case MissionTypeCombo:
        if (global.isDailyChallenge || missionIn.mod === MissionModSingleRun) { 
          // console.log('score Multiplier: ' + window.global.scoreMultiplier)
          return window.global.scoreMultiplier }
        break
      case MissionTypeCoins:
        if (missionIn.mod === MissionModOverall) { return parseInt(localStorage.getItem('nCoins')) } else if (global.isDailyChallenge || missionIn.mod === MissionModSingleRun) { return window.global.thisRunNumCoins }
        break
      case MissionTypeDoubles:
        if (missionIn.mod === MissionModOverall) { return parseInt(localStorage.getItem('nTotalDoubles')) } else if (global.isDailyChallenge || missionIn.mod === MissionModSingleRun) { return window.global.thisRunComboDouble }
        break
      case MissionTypeTriples:
        if (missionIn.mod === MissionModOverall) { return parseInt(localStorage.getItem('nTotalTriples')) } else if (global.isDailyChallenge || missionIn.mod === MissionModSingleRun) { return window.global.thisRunComboTriple }
        break
    }
    return 0
  }

  // Functions which help to analyse the mission
  GetProgressScaled (missionIn, playerIn) {
    switch (missionIn.type) {
      case MissionTypeDistance:
        if (missionIn.mod === MissionModOverall) { return parseInt(localStorage.getItem('totalDistance')) / 100 + playerIn.x / 100 } else if (missionIn.mod === MissionModSingleRun) { return playerIn.x / 100 }
        break
      case MissionTypeScorePoints:
        if (missionIn.mod === MissionModOverall) { return parseInt(localStorage.getItem('nTotalPoints')) } else if (global.isDailyChallenge || missionIn.mod === MissionModSingleRun) { return Math.max(window.global.thisRunScore, window.global.thisRunFinalScore) }
        break
      case MissionTypeCombo:
        if (global.isDailyChallenge || missionIn.mod === MissionModSingleRun) { return window.global.scoreMultiplier }
        break
      case MissionTypeCoins:
        if (missionIn.mod === MissionModOverall) { return parseInt(localStorage.getItem('nCoins')) } else if (global.isDailyChallenge || missionIn.mod === MissionModSingleRun) { return window.global.thisRunNumCoins }
        break
      case MissionTypeDoubles:
        if (missionIn.mod === MissionModOverall) { return parseInt(localStorage.getItem('nTotalDoubles')) } else if (global.isDailyChallenge || missionIn.mod === MissionModSingleRun) { return window.global.thisRunComboDouble }
        break
      case MissionTypeTriples:
        if (missionIn.mod === MissionModOverall) { return parseInt(localStorage.getItem('nTotalTriples')) } else if (global.isDailyChallenge || missionIn.mod === MissionModSingleRun) { return window.global.thisRunComboTriple }
        break
    }

    return 0
  }

  GetTarget (missionIn) {
    switch (missionIn.type) {
      case MissionTypeDistance: return missionIn.target / 100
      case MissionTypeScorePoints: return missionIn.target
      case MissionTypeCombo: return missionIn.target
      case MissionTypeCoins: return missionIn.target
      case MissionTypeDoubles: return missionIn.target
      case MissionTypeTriples: return missionIn.target
    }
    return 0
  }

  // Here we check if mission was successful
  CheckCompletion (missionIn) {
    // console.log('enter check')
    if (this.player !== null) {
      return this.GetProgress(missionIn, this.player) >= missionIn.target
    }
  }

  ToString (missionIn) {
    let ret = ''
    const trt = missionIn.target
    switch (missionIn.type) {
      case MissionTypeDistance:
        ret += 'travel ' + trt / 100 + 'm'
        break
      case MissionTypeCombo:
        ret += 'get a x' + missionIn.target + ' combo'
        break
      case MissionTypeCoins:
        ret += 'collect ' + trt + ' coins'
        break
      case MissionTypeGems:
        ret += 'collect ' + missionIn.target + ' gems'
        break
      case MissionTypeDoubles:
        if (missionIn.target === 1) { ret += 'score a double combo' } else { ret += 'score ' + missionIn.target + " double combo's" }
        break
      case MissionTypeTriples:
        if (missionIn.target === 1) { ret += 'score a triple combo' } else { ret += 'score ' + missionIn.target + " triple combo's" }
        break
      case MissionTypeNearMisses:
        if (missionIn.target === 1) { ret += 'perform a near miss' } else { ret += 'perform ' + missionIn.target + ' near misses' }
        break
      case MissionTypeHoldFwd:
        ret += 'hold move for ' + missionIn.target + ' consecutive seconds'
        break
      case MissionTypeScorePoints:
        ret += 'score ' + trt + ' points'
        break
    }

    // added to the previous mission targets. Defines time-range of the missions
    if (missionIn.mod === MissionModOverall) {
      ret += ' in total'
    } else if (missionIn.mod === MissionModDailyChallenge) {
      ret += ' in a daily challenge run'
    } else {
      if (missionIn.type === MissionTypeCombo ||
        missionIn.type === MissionTypeHoldFwd ||
        (missionIn.type === MissionTypeDoubles && missionIn.target === 1) ||
        (missionIn.type === MissionTypeTriples && missionIn.target === 1) ||
        (missionIn.type === MissionTypeNearMisses && missionIn.target === 1)) {
        // no post-script.
      } else { ret += ' in a single run' }
    }
    return ret
  }
}
