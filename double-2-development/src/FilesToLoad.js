
export const initialLoadfilesGameScene = []

// texture atlases (for animations)
initialLoadfilesGameScene.push(['atlas', 'playersheet', 'Spritesheets/PlayerSheet.png', 'Spritesheets/PlayerSheet.json'])
initialLoadfilesGameScene.push(['atlas', 'jet', 'Spritesheets/jet.png', 'Spritesheets/jet.json'])
initialLoadfilesGameScene.push(['image', 'enemy_0', 'EnemySpawner/Enemy0_vertical.png', 'none'])
initialLoadfilesGameScene.push(['atlas', 'power-up-bar', 'Spritesheets/power-up-bar.png', 'Spritesheets/power-up-bar.json'])

// The spriteatlas and the .json for the enemyanimation.
initialLoadfilesGameScene.push(['atlas', 'enemy0', 'Spritesheets/Enemies/Enemy0_sprite.png', 'Spritesheets/Enemies/Enemy0_sprite.json'])
// Atlases for coins
initialLoadfilesGameScene.push(['atlas', 'coins', 'Spritesheets/coins.png', 'Spritesheets/coins.json'])
// background generator
initialLoadfilesGameScene.push(['atlas', 'backgroundatlas', 'BackgroundGenerator/atlas_background.png', 'BackgroundGenerator/atlas_background.json'])
initialLoadfilesGameScene.push(['image', 'sky', 'BackgroundGenerator/Background_Sky.jpg', 'none'])
initialLoadfilesGameScene.push(['atlas', 'powerups', 'Spritesheets/powerups.png', 'Spritesheets/powerups.json'])
initialLoadfilesGameScene.push(['atlas', 'shopanims', 'ShopScreen/PowerUpsAnims.png', 'ShopScreen/PowerUpsAnims.json'])

// UI
initialLoadfilesGameScene.push(['atlas', 'buttonsatlas', 'GlobalUI/Buttons.png', 'GlobalUI/Buttons.json'])
initialLoadfilesGameScene.push(['atlas', 'UI0', 'GlobalUI/UI0.png', 'GlobalUI/UI0.json'])
initialLoadfilesGameScene.push(['atlas', 'UI1', 'GlobalUI/UI1.png', 'GlobalUI/UI1.json'])
initialLoadfilesGameScene.push(['atlas', 'shopbuttons', 'ShopScreen/ButtonStar.png', 'ShopScreen/ButtonStar.json'])
initialLoadfilesGameScene.push(['image', 'bghome', 'GlobalUI/BG_Home.jpg', 'none'])
initialLoadfilesGameScene.push(['atlas', 'mutebuttons', 'GlobalUI/MuteButtons.png', 'GlobalUI/MuteButtons.json'])
initialLoadfilesGameScene.push(['image', 'shield-texture', 'raw2d.png', 'none'])

// particles
initialLoadfilesGameScene.push(['atlas', 'particles', 'Spritesheets/particles.png', 'Spritesheets/particles.json'])
initialLoadfilesGameScene.push(['atlas', 'cb-blast', 'Spritesheets/CB_Blast.png', 'Spritesheets/CB_Blast.json'])

// combo
initialLoadfilesGameScene.push(['image', 'GUI_CooldownBar_Container', 'Combo/GUI_CooldownBar_Container.png', 'none'])
initialLoadfilesGameScene.push(['image', 'GUI_CooldownBar_Critical', 'Combo/GUI_CooldownBar_Critical.png', 'none'])
initialLoadfilesGameScene.push(['image', 'GUI_CooldownBar_Regular', 'Combo/GUI_CooldownBar_Regular.png', 'none'])
initialLoadfilesGameScene.push(['image', 'GUI_CooldownBar_Empty', 'Combo/GUI_CooldownBar_Empty.png', 'none'])

// soundfiles
initialLoadfilesGameScene.push(['sound', 'missionComplete', 'Soundfiles/Compressed_Sounds/Message_Achieved_Small.mp3', 'none'])
initialLoadfilesGameScene.push(['sound', 'pogobounce1', 'Soundfiles/Compressed_Sounds/Pogo_Bounce_01.mp3', 'none'])
initialLoadfilesGameScene.push(['sound', 'hitenemy2', 'Soundfiles/Compressed_Sounds/Hit_Enemy_Player_Dies_01.mp3', 'none'])
initialLoadfilesGameScene.push(['sound', 'hitenemy1', 'Soundfiles/Compressed_Sounds/Hit_Enemy_01.mp3', 'none'])
initialLoadfilesGameScene.push(['sound', 'jetmove', 'Soundfiles/Compressed_Sounds/Pogo_Jetpack_Move_loop.mp3', 'none'])

// In game missions
initialLoadfilesGameScene.push(['atlas', 'mission', 'Missions/mission.png', 'Missions/mission.json'])

// type, key, spritesheet, jsonsheet
export const progressiveLoadfiles = []

// Gamescene
progressiveLoadfiles.push(['atlas', 'jet-blast', 'Spritesheets/jet-blast.png', 'Spritesheets/jet-blast.json'])
progressiveLoadfiles.push(['sound', 'boost', 'Soundfiles/Compressed_Sounds_Progressive/Pickup_Powerup_Boost.mp3', 'none'])
progressiveLoadfiles.push(['sound', 'generic', 'Soundfiles/Compressed_Sounds_Progressive/Pickup_Powerup_Generic.mp3', 'none'])
progressiveLoadfiles.push(['sound', 'heart', 'Soundfiles/Compressed_Sounds_Progressive/Pickup_Powerup_Heart.mp3', 'none'])
progressiveLoadfiles.push(['sound', 'invincible', 'Soundfiles/Compressed_Sounds_Progressive/Pickup_Powerup_Invicible.mp3', 'none'])
progressiveLoadfiles.push(['sound', 'magnet', 'Soundfiles/Compressed_Sounds_Progressive/Pickup_Powerup_Magnet.mp3', 'none'])
progressiveLoadfiles.push(['image', 'ewallleftright', 'Spritesheets/Enemies/EWall_LeftRight.png', 'none'])
progressiveLoadfiles.push(['image', 'ewalltopbottom', 'Spritesheets/Enemies/EWall_BottomTop.png', 'none'])
progressiveLoadfiles.push(['atlas', 'enemy1Upsidedown', 'Spritesheets/Enemies/Enemy1_sprite_upsidedown.png', 'Spritesheets/Enemies/Enemy1_sprite_upsidedown.json'])
progressiveLoadfiles.push(['atlas', 'enemy0Upsidedown', 'Spritesheets/Enemies/Enemy0_sprite_upsidedown.png', 'Spritesheets/Enemies/Enemy0_sprite_upsidedown.json'])
progressiveLoadfiles.push(['atlas', 'enemy4', 'Spritesheets/Enemies/Enemy4_climb.png', 'Spritesheets/Enemies/Enemy4_climb.json'])
progressiveLoadfiles.push(['atlas', 'enemy3', 'Spritesheets/Enemies/Enemy3_wall_sprite.png', 'Spritesheets/Enemies/Enemy3_wall_sprite.json'])
progressiveLoadfiles.push(['atlas', 'enemy2', 'Spritesheets/Enemies/Enemy2_sprite_wall.png', 'Spritesheets/Enemies/Enemy2_sprite_wall.json'])
// loadfiles.push(['image', 'img2', 'Spritesheets/Enemies/Background2.png', 'none'])
progressiveLoadfiles.push(['atlas', 'enemy1', 'Spritesheets/Enemies/Enemy1_sprite.png', 'Spritesheets/Enemies/Enemy1_sprite.json'])

// These are needed for the vertical-mover, which is the standard-enemy, next to the red enemy, when other enemies are not yet loaded and animated.
progressiveLoadfiles.push(['image', 'stripe', 'EnemySpawner/stripe.png', 'none'])
progressiveLoadfiles.push(['image', 'fire', 'EnemySpawner/fire_small.png', 'none'])
progressiveLoadfiles.push(['atlas', 'accessoires', 'Spritesheets/Enemies/Enemy_Acessoires_sprite.png', 'Spritesheets/Enemies/Enemy_Acessoires_sprite.json'])

export const loadReplayStartScreen = []
loadReplayStartScreen.push(['atlas', 'missionAccomplished', 'Missions/mission_accomplished.png', 'Missions/mission_accomplished.json'])
loadReplayStartScreen.push(['atlas', 'mission', 'Missions/mission.png', 'Missions/mission.json'])
