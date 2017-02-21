
let userId = Math.floor(Math.random() * 100000 )
const players = {}

var mainState = {

  preload: function() {
    game.load.image('nyan', 'phaser/assets/NyanCat.png')
    game.load.image('bird', 'phaser/assets/bird.png')
    game.load.image('bullet', 'phaser/assets/bullet.png')
    game.load.image('pipe', 'phaser/assets/pipe.png')
    game.load.image('titan', 'phaser/assets/titanMuffin.png')
    game.load.image('p2sheepsheep', 'phaser/assets/p2sheepsheep.png')

    game.load.audio('jump', 'phaser/assets/jump.wav')
    game.load.audio('jazz', 'phaser/assets/NyanCatSmoothJazz.mp3')
  },

  create: function() {

    game.stage.backgroundColor = '#71c5cf'

    game.physics.startSystem(Phaser.Physics.ARCADE)

    players[userId] = game.add.sprite(100, 245, 'nyan')
    nyanCatSprite = players[userId]
    this.initializeCharacter(nyanCatSprite)

    for( let id in players ){
      if ( id != userId ){
        this.initializeSprite(id)
      }
    }

    var spaceKey = game.input.keyboard.addKey(
                   Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.emitJump, this);

    var upArrow = game.input.keyboard.addKey(
                   Phaser.Keyboard.UP);
    upArrow.onDown.add(this.teleportUp, this);

    var downArrow = game.input.keyboard.addKey(
                   Phaser.Keyboard.DOWN);
    downArrow.onDown.add(this.teleportDown, this);

    this.pipes = game.add.group()

    this.timer = game.time.events.loop(1500, this.addRowOfPipes, this)

    this.score = 0
    this.labelScore = game.add.text(20, 20, '0', { font: '30px Arial', fill: '#ffffff' })


    this.jumpSound = game.add.audio('jump')
    this.jumpSound.volume = .05
    this.backgroundMusic = game.add.audio('jazz')

    this.sound.stopAll()
    this.backgroundMusic.play()

    weaponOne = game.add.weapon(1, 'titan')
    weaponOne.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
    weaponOne.bulletSpeed = 600
    weaponOne.fireRate = 100
    weaponOne.trackSprite(nyanCatSprite, 0, 0, true)

    var fireButton = game.input.keyboard.addKey(
                    Phaser.KeyCode.W)
    fireButton.onDown.add(this.fireWeapon, this)

  },

  update: function() {

    for ( let key in players ) {
      if (players[key].angle < 20)
        players[key].angle += 1

        game.physics.arcade.overlap(
          players[key], this.pipes, this.emitHitPipe, null, this)

    }
    if (players[userId].y < 0 || players[userId].y > 735)
      this.restartGame()

    game.physics.arcade.overlap(
      weaponOne.bullets, this.pipes, this.bulletHitPipe, null, this)

  },

  initializeCharacter: function(actor) {
    actor.alive = true
    actor.scale.setTo(.2, .2)
    game.physics.arcade.enable(actor);
    actor.body.gravity.y = 1000;
    actor.anchor.setTo(-.2, .5)
    actor.fallen = false
    console.log( 'players', players );
  },

  initializeSprite: function(externalId) {
    players[externalId] = game.add.sprite(100, 345, 'p2sheepsheep');
    this.initializeCharacter(players[externalId])
  },

  sendId: function() {
    socket.emit('sendId', {userId: userId})
    socket.on('sendId', function (data) {
      mainState.initializeSprite(data.userId)
    })
  },

  emitSignal: function(functionName) {
    const functions = { jump: this.jump, hitPipe: this.hitPipe}

    socket.emit('signal', {sendingId: userId, function: functionName})
    socket.on('signal', function (data) {
      console.log('Received jump signal from', data.sendingId);
      functions[data.function](players[data.sendingId])
    })
  },

  emitHitPipe: function() {
    this.hitPipe(players[userId])
  },

  hitPipe: function(actor) {
    if (actor.alive == false)
      return

    actor.alive = false
    actor.body.velocity.x = -200
  },

  emitJump: function() {
    this.emitSignal('jump')
    this.jump(players[userId])
  },

  jump: function (actor) {
    if (actor.alive === false)
      return

    actor.body.velocity.y = -350
    game.add.tween(actor).to({angle: -20}, 100).start()
  },


  teleportUp: function() {
    if (nyanCatSprite.alive == false)
      return

    nyanCatSprite.y -= 100
    nyanCatSprite.body.velocity.y = 0

  },

  teleportDown: function() {
    if (nyanCatSprite.alive == false)
      return

    nyanCatSprite.y += 100
    nyanCatSprite.body.velocity.y = 0

  },

  fireWeapon: function() {
    if (nyanCatSprite.alive == false)
      return

    weaponOne.fire()
  },

  bulletHitPipe: function(bullet, pipes) {
    pipes.kill()
  },

  addOnePipe: function(x, y) {
      var pipe = game.add.sprite(x, y, 'pipe');

      this.pipes.add(pipe);

      game.physics.arcade.enable(pipe);

      pipe.body.velocity.x = -200;

      pipe.checkWorldBounds = true;
      pipe.outOfBoundsKill = true;
  },

  addRowOfPipes: function() {

    var holeOne = Math.floor(Math.random() * 5) + 1;

    var holeTwo = Math.floor(Math.random() * 5) + 5;

    for (var i = 0; i < 10; i++)
        if ((i != holeOne && i != holeOne + 1) && (i != holeTwo && i != holeTwo + 1))
            this.addOnePipe(600, i * 60 + 10);

    this.score += 1
    this.labelScore.text = this.score
},

  restartGame: function() {
      game.state.start('main')
  }
}

var game = new Phaser.Game(600, 610)

game.state.add('main', mainState)

game.state.start('main')

const gameState = game.state.states.main;

var socket = io.connect();
socket.on('news', function (data) {
  gameState.sendId()
});

socket.on('jumped', function (data) {
})
