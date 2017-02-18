
let userId = Math.floor(Math.random() * 100000 )
const players = {}

var mainState = {

  preload: function() {
    // Load the sprites
    game.load.image('nyan', 'phaser/assets/NyanCat.png')
    game.load.image('bird', 'phaser/assets/bird.png')
    game.load.image('bullet', 'phaser/assets/bullet.png')
    game.load.image('pipe', 'phaser/assets/pipe.png')
    game.load.image('titan', 'phaser/assets/titanMuffin.png')
    game.load.image('p2sheepsheep', 'phaser/assets/p2sheepsheep.png')

    game.load.audio('jump', 'phaser/assets/jump.wav')
    game.load.audio('jazz', 'phaser/assets/NyanCatSmoothJazz.mp3')
  },

  initializeCharacter: function(actor) {
    actor.alive = true
    actor.scale.setTo(.2, .2)
    game.physics.arcade.enable(actor);
    actor.body.gravity.y = 1000;
    actor.anchor.setTo(-.2, .5)
    actor.fallen = false
    // console.log('players', players);
  },

  initializeSprite: function(externalId) {
    players[externalId] = game.add.sprite(100, 345, 'p2sheepsheep');
    this.initializeCharacter(players[externalId])
  },

  create: function() {

   game.stage.backgroundColor = '#71c5cf';

    game.physics.startSystem(Phaser.Physics.ARCADE);

    players[userId] = game.add.sprite(100, 345, 'nyan');
    nyanCatSprite = players[userId]
    this.initializeCharacter(nyanCatSprite)


    // playerTwo = game.add.sprite(100, 445, 'p2sheepsheep');
    // playerTwo.scale.setTo(.2, .2)

    // Add physics to the bird
    // Needed for: movements, gravity, collisions, etc.

    // Add gravity to the bird to make it fall

    // Call the 'jump' function when the spacekey is hit
    var spaceKey = game.input.keyboard.addKey(
                   Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.emitJump, this);

    var upArrow = game.input.keyboard.addKey(
                   Phaser.Keyboard.UP);
    upArrow.onDown.add(this.teleportUp, this);

    var downArrow = game.input.keyboard.addKey(
                   Phaser.Keyboard.DOWN);
    downArrow.onDown.add(this.teleportDown, this);

    //create an empty group
    this.pipes = game.add.group()

    // add row of pipes every 1.5 seconds
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
    // This function is called 60 times per second
    // It contains the game's logic
    // If the bird is out of the screen (too high or too low)
    // Call the 'restartGame' function
    for ( let key in players ) {
      if (players[key].angle < 20)
        players[key].angle += 1

        game.physics.arcade.overlap(
          players[key], this.pipes, this.emitHitPipe, null, this)

          // if (players[key].y < 0 || players[key].y > 735)
          //   if (players[key].fallen === false) {
          //       players[key.fallen] = true
          //       restartGame()
          //   }
    }
    if (nyanCatSprite.y < 0 || nyanCatSprite.y > 735)
      nyanCatSprite.kill()

    // game.physics.arcade.overlap(
    //   nyanCatSprite, this.pipes, this.hitPipe, null, this)

    game.physics.arcade.overlap(
      weaponOne.bullets, this.pipes, this.bulletHitPipe, null, this)

  },

  sendId: function() {
    socket.emit('sendId', {userId: userId})
    socket.on('sendId', function (data) {
      mainState.initializeSprite(data.userId)
    })
  },

  bulletHitPipe: function(bullet, pipes) {

    pipes.kill()
    // bullet.kill()

  },

  emitSignal: function(functionName) {
    // const functions = {jump: (actor) => {mainState.jump(actor)} }
    const functions = { jump: this.jump, hitPipe: this.hitPipe}
    // functions.jump = this.jump


    socket.emit('signal', {userId: userId, function: functionName})
    socket.on('signal', function (data) {
      functions[data.function](players[data.userId])
    })
  },

  emitHitPipe: function() {
    this.emitSignal('hitPipe')
  },

  hitPipe: function(actor) {
    if (actor.alive == false)
      return

    //set the alive property of the bird to false
    actor.alive = false

    actor.body.velocity.x = -200
    //prevent new pipes from appearing
    game.time.events.remove(this.timer)

    //go through all the pipes and stop their movements
    this.pipes.forEach(function(p){
      p.body.velocity.x = 0
    }, this)
  },

  emitJump: function() {
    this.emitSignal('jump')
    //socket.emit('signal', { userId: userId, functionName: 'jump' })
     //socket.on('jumped', function (data) {
    //      mainState.jump(players[data.userId])
    // })
  },

  jump: function (actor) {
    if (actor.alive == false)
      return

    actor.body.velocity.y = -350
    game.add.tween(actor).to({angle: -20}, 100).start()
    this.jumpSound.play()
  },


  teleportUp: function() {
    if (nyanCatSprite.alive == false)
      return

    nyanCatSprite.y -= 100
    nyanCatSprite.body.velocity.y = 0

    this.jumpSound.play()
  },

  teleportDown: function() {
    if (nyanCatSprite.alive == false)
      return

    nyanCatSprite.y += 100
    nyanCatSprite.body.velocity.y = 0

    this.jumpSound.play()
  },

  fireWeapon: function() {
    if (nyanCatSprite.alive == false)
      return

    weaponOne.fire()
  },

  addOnePipe: function(x, y) {
      // Create a pipe at the position x and y
      var pipe = game.add.sprite(x, y, 'pipe');

      // Add the pipe to our previously created group
      this.pipes.add(pipe);

      // Enable physics on the pipe
      game.physics.arcade.enable(pipe);

      // Add velocity to the pipe to make it move left
      pipe.body.velocity.x = -200;

      // Automatically kill the pipe when it's no longer visible
      pipe.checkWorldBounds = true;
      pipe.outOfBoundsKill = true;
  },

  addRowOfPipes: function() {
    // Randomly pick a number between 1 and 5
    // This will be the hole position
    var holeOne = Math.floor(Math.random() * 5) + 1;

    var holeTwo = Math.floor(Math.random() * 5) + 5;

    // Add the 6 pipes
    // With one big hole at position 'hole' and 'hole + 1'
    for (var i = 0; i < 12; i++)
        if ((i != holeOne && i != holeOne + 1) && (i != holeTwo && i != holeTwo + 1))
            this.addOnePipe(600, i * 60 + 10);

  this.score += 1
  this.labelScore.text = this.score
},

  //restart the game
  restartGame: function() {
    //start the 'main' state, which restarts the game
    let graveyard = []

    for (var key in players) {
      if (players.fallen === true) {
        graveyard.push(players.userId)
      }
    }

    if (graveyard.length >= Object.keys(players).length) {
      game.state.start('main')
    }
  }
}

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(600, 735)

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState)

// Start the state to actually start the game
game.state.start('main')

const gameState = game.state.states.main;

var socket = io.connect();
socket.on('news', function (data) {
  gameState.sendId()
});

socket.on('jumped', function (data) {
  // console.log('io', io);
  // console.log("received jumped in browser", data.message);
})
// socket.on('pong', function (data) {
//   console.log("client side received pong", data);
// });
