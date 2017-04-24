/// <reference path="../node_modules/phaser/typescript/phaser.d.ts"/>
/// <reference path="../node_modules/phaser/typescript/pixi.d.ts"/>

import 'pixi';
import 'p2';
import * as Phaser from 'phaser';

class SimpleGame {
  game: Phaser.Game;
  logo: Phaser.Sprite;
  cursors: Phaser.CursorKeys;
  newRect;

  constructor() {
    this.game = new Phaser.Game(800, 600, Phaser.AUTO, "content", this);
    this.newRect = null;
  }

  preload() {
    this.game.load.image("logo", "./assets/images/mushroom2.png");
    this.game.load.spritesheet('chain', 'assets/sprites/chain.png', 16, 26);
  }

  create() {
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.gravity.y = 100;
    this.game.time.desiredFps = 400;

    this.logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "logo");
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.createRope(10, 400, 64);
    const last = this.newRect;
    this.game.physics.p2.enable(this.logo, false);
    this.logo.body.mass = 100  ;
    this.game.physics.p2.createRevoluteConstraint(this.newRect, [0, 10], this.logo, [0, -30], 2000000);

  }

  update() {
    this.game.input.update();

    if (this.cursors.down.isDown)
      this.logo.body.velocity.y += 10;
    if (this.cursors.up.isDown)
      this.logo.body.velocity.y -= 10;
    if (this.cursors.left.isDown)
      this.logo.body.velocity.x -= 10;
    if (this.cursors.right.isDown)
      this.logo.body.velocity.x += 10;
  }

  createRope(length, xAnchor, yAnchor) {

    var lastRect;
    var height = 20;        //  Height for the physics body - your image height is 8px
    var width = 16;         //  This is the width for the physics body. If too small the rectangles will get scrambled together.
    var maxForce = 20000;   //  The force that holds the rectangles together.


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
      } else {
        //  Anchor the first one created
        this.newRect.body.velocity.x = 400;      //  Give it a push :) just for fun
        this.newRect.body.mass = 10;     //  Reduce mass for evey rope element
        // this.newRect.body.gravity.y = 100;     //  Reduce mass for evey rope element
      }

      //  After the first rectangle is created we can add the constraint
      if (lastRect) {
        this.game.physics.p2.createRevoluteConstraint(this.newRect, [0, -10], lastRect, [0, 10], maxForce);
        // this.game.physics.p2.createDistanceConstraint(this.newRect, lastRect, height);
      }

      lastRect = this.newRect;

    }

}
}


window.onload = () => {
  const game = new SimpleGame();
};
