/*
 *
 *  file: Phaser3 官网的第一个小游戏 吃星星
 *  description:
 *
 */

import Phaser from "phaser";
import sky from '@/assets/background/sky.png'
import platform from '@/assets/background/platform.png'
import bomb from '@/assets/sprites/bomb.png'
import star from '@/assets/sprites/star.png'
import dude from '@/assets/sprites/dude.png'

let player = null
let stars = null
let score = 0;
let scoreText = null;
let bombs = null
let gameOver = false

function preload() {
  this.load.image('sky', sky);
  this.load.image('ground', platform);
  this.load.image('star', star);
  this.load.image('bomb', bomb);
  this.load.spritesheet('dude',
    dude,
    {frameWidth: 32, frameHeight: 48}
  );
}

function create() {
  // 添加天空背景图，注意在Phaser 3 中，所有游戏对象的定位都默认基于它们的中心点
  this.add.image(400, 300, 'sky');

  // 添加星星图，注意这里是有顺序的，后添加的对象会盖住之前的对象
  // this.add.image(400, 300, 'star');

  // 创建游戏中让玩家在上面来回跑动的绿色地板对象（静态物理组对象）
  const platforms = this.physics.add.staticGroup();
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();
  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

  // 生成玩家小人儿player
  player = this.physics.add.sprite(100, 450, 'dude');
  // 设置player的反弹值
  player.setBounce(0.2);
  // 设置player是否与世界边界碰撞
  player.setCollideWorldBounds(true);
  // 设置 player 的垂直重力（值越大你的对象感觉越重，下落越快）
  player.body.setGravityY(300)
  // 碰撞器（Collider）接收两个对象，检测二者之间的碰撞，并使二者分开
  this.physics.add.collider(player, platforms);

  // 创建一个新动画并将其添加到动画管理器
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [{key: 'dude', frame: 4}],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
    frameRate: 10,
    repeat: -1
  });

  // 创建一个物理组对象stars
  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: {x: 12, y: 0, stepX: 70}
  });

  stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });
  this.physics.add.collider(stars, platforms);
  // 检测player和start重叠
  this.physics.add.overlap(player, stars, collectStar, null, this);

  // 创建分数文本
  scoreText = this.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});

  // 创建坏蛋组
  bombs = this.physics.add.group();
  this.physics.add.collider(bombs, platforms);
  // player碰到坏蛋就凉凉
  this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update() {
  const cursors = this.input.keyboard.createCursorKeys();

  if (cursors.left.isDown) {
    player.setVelocityX(-160);

    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);

    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);

    player.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-500);
  }
}

function collectStar(player, star) {
  // 停止并禁用star 此处的效果是player碰到star，star就消失
  star.disableBody(true, true);

  score += 10;
  scoreText.setText('Score: ' + score);

  console.log(`📢stars.countActive`, stars.countActive(true))
  if (stars.countActive(true) === 0) {
    stars.children.iterate(function (child) {
      child.enableBody(true, child.x, 0, true, true);
    });

    const x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    const bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
  }
}

function hitBomb(player, bomb) {
  // 物理效果暂停，画面看起来会静止不动
  this.physics.pause();
  // player染上红色
  player.setTint(0xff0000);
  // player动作设置为站着的姿势
  player.anims.play('turn');

  gameOver = true;
}

const config = {
  type: Phaser.AUTO,
  // 生成的画布元素的尺寸，这是屏幕上用于显示游戏的区域尺寸，而你的游戏世界（world）可以是任意尺寸
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 300},
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);
