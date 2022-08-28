/*
 *
 *  file: Phaser3官网的hello world demo
 *  description:
 *
 */

import Phaser from "phaser";
import star_08 from "@/assets/particles/particlePack_1.1/PNG (Transparent)/star_08.png";
import flare_01 from "@/assets/particles/particlePack_1.1/PNG (Transparent)/flare_01.png";
import symbol_02 from "@/assets/particles/particlePack_1.1/PNG (Transparent)/symbol_02.png";

// 预加载hooks，可以在此时加载游戏需要的资源
function preload() {
    // 设置baseURL，load资源时会根据路径，从baseURL服务器上加载资源文件
    this.load.setBaseURL('http://labs.phaser.io')

    this.load.image('sky', 'assets/skies/space3.png')
    this.load.image('logo', 'assets/sprites/phaser3-logo.png')
    this.load.image('red', 'assets/particles/red.png')
    this.load.image('star_08', star_08)
    this.load.image('flare_01', flare_01)
    this.load.image('symbol_02', symbol_02)
}

function create() {
    this.add.image(400, 300, 'sky')

    // 创建粒子对象
    const particles = this.add.particles('flare_01');

    // 创建粒子发射器
    const emitter = particles.createEmitter({
        // 设置发射粒子的初始径向速度，将发射器更改为径向模式，以每秒像素为单位
        speed: 600,
        // 设置发射粒子的比例
        scale: {start: 1, end: 0},
        // 设置粒子的混合模式
        blendMode: 'ADD'
    });

    // 创建一个游戏图像对象
    const logo = this.physics.add.image(400, 100, 'logo');

    // logo的水平和垂直速度
    logo.setVelocity(100, 200)
    // logo碰撞的反弹量
    logo.setBounce(1, 1)
    // logo是否与世界边界碰撞
    logo.setCollideWorldBounds(true)
    // 连续移动粒子原点以跟随logo的位置
    emitter.startFollow(logo)
}

const config = {
    // 此设置将自动检测浏览器是否能够支持 WebGL。如果是，它将使用 WebGL 渲染器。如果没有，它将回退到 Canvas Renderer
    type: Phaser.AUTO,
    // 游戏的父容器
    parent: document.querySelector('#app'),
    // 生成的画布元素的尺寸
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            // 重力
            gravity: {y: 200}
        }
    },
    scene: {
        preload,
        create
    }
}


const game = new Phaser.Game(config)

