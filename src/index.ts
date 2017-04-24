/// <reference path="../node_modules/phaser/typescript/phaser.d.ts"/>
/// <reference path="../node_modules/phaser/typescript/pixi.d.ts"/>

import 'pixi';
import 'p2';
import * as Phaser from 'phaser';

class SimpleGame {
  game: Phaser.Game;
  logo: Phaser.Sprite;
  cursors: Phaser.CursorKeys;
  mouse: Phaser.Mouse;
  space: Phaser.Key;
  newRect;
  head;

  constructor() {
    this.game = new Phaser.Game(800, 600, Phaser.AUTO, "content", this);
    this.newRect = null;
    this.mouse = new Phaser.Mouse(this.game);
  }

  preload() {
    this.game.load.image("logo", "./assets/images/mushroom2.png");
    this.game.load.spritesheet('chain', 'assets/sprites/chain.png', 16, 26);
  }

  create() {
    this.space = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    // this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.p2.gravity.y = 1000;
    // this.game.time.desiredFps = 400;

    this.logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "logo");
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.game.input.onDown.add(this.fireRope, this);

    this.createRope(16, 400, 50);
    const last = this.newRect;
    this.game.physics.p2.enable(this.logo, false);
    this.logo.body.mass = 1;
    this.logo.body.x = this.newRect.body.x;
    this.logo.body.y = this.newRect.body.y + 30;
    this.game.physics.p2.createRevoluteConstraint(this.newRect, [0, 10], this.logo, [0, -30], 2000000);
  }

  stopHead() {
    this.head.body.velocity.x = 0;
    this.head.body.velocity.y = 0;
    this.head.body.angularVelocity = 0;
    this.head.body.static = true;
  }

  fireRope(event: MouseEvent) {
    const angle = this.game.physics.arcade.angleToPointer(this.head.body);
    const force = 5000;
    this.head.body.velocity.x = Math.cos(angle) * force;
    this.head.body.velocity.y = Math.sin(angle) * force;
    this.head.body.static = false;
  }
  update() {
    this.game.input.update();
    const c = this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
    if ( c ) {
      this.stopHead()
    }

    if (this.cursors.down.isDown)
      this.logo.body.velocity.y += 30;
    if (this.cursors.up.isDown)
      this.logo.body.velocity.y -= 30;
    if (this.cursors.left.isDown)
      this.logo.body.velocity.x -= 30;
    if (this.cursors.right.isDown)
      this.logo.body.velocity.x += 30;
  }

  createRope(length, xAnchor, yAnchor) {

    var lastRect;
    var height = 20;        //  Height for the physics body - your image height is 8px
    var width = 16;         //  This is the width for the physics body. If too small the rectangles will get scrambled together.
    var maxForce = 200000000;   //  The force that holds the rectangles together.


    for (var i = 0; i <= length; i++) {
      var x = xAnchor;                    //  All rects are on the same x position
      var y = yAnchor + (i * height);     //  Every new rect is positioned below the last

      if (i % 2 === 0) {
        //  Add sprite (and switch frame every 2nd time)
        this.newRect = this.game.add.sprite(x, y, 'chain', 1);
      } else {
        this.newRect = this.game.add.sprite(x, y, 'chain', 0);
        lastRect.bringToTop();
      }

      //  Enable physicsbody
      this.game.physics.p2.enable(this.newRect, false);
      //  Set custom rectangle
      this.newRect.body.setRectangle(width, height);

      if (i === 0) {
        this.newRect.body.static = true;
        // this.newRect.body.velocity.y = -1000;
      } else {
        //  Anchor the first one created
        this.newRect.body.velocity.y = -1000;
        this.newRect.body.velocity.x = 0;      //  Give it a push :) just for fun
        // this.newRect.body.gravity.y = 100;     //  Reduce mass for evey rope element
      }
      this.newRect.body.mass = 1;     //  Reduce mass for evey rope element

      //  After the first rectangle is created we can add the constraint
      if (lastRect) {
        this.game.physics.p2.createRevoluteConstraint(this.newRect, [0, -10], lastRect, [0, 10], maxForce);
        this.game.physics.p2.createDistanceConstraint(this.newRect, lastRect, height);
      } else {
        this.head = this.newRect;
        this.head.body.mass = 10;
      }

      lastRect = this.newRect;

    }

  }
}


window.onload = () => {
  const game = new SimpleGame();
};
