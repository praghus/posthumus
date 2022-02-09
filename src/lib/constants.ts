import loopSound from '../assets/sounds/loop.mp3'
import shootSound from '../assets/sounds/shoot.mp3'
import powerUpSound from '../assets/sounds/powerup.mp3'
import reloadSound from '../assets/sounds/reload.mp3'
import ammo from '../assets/images/ammo.png'
import bat from '../assets/images/bat.png'
import bullet from '../assets/images/bullet.png'
import bg1 from '../assets/images/bg1.png'
import bg2 from '../assets/images/bg2.png'
import clouds from '../assets/images/clouds.png'
import dust from '../assets/images/dust.png'
import energy from '../assets/images/energy.png'
import estrip from '../assets/images/energy_strip.png'
import font from '../assets/images/font_small.png'
import moon from '../assets/images/moon.png'
import player from '../assets/images/player.png'
import spider from '../assets/images/spider.png'
import shine from '../assets/images/shine.png'
import zombie from '../assets/images/zombie.png'
import tileset from '../assets/images/tileset.png'

export const ASSETS = {
    'ammo.png': ammo,
    'bat.png': bat,
    'bg1.png': bg1,
    'bg2.png': bg2,
    'dust.png': dust,
    'bullet.png': bullet,
    'clouds.png': clouds,
    'energy.png': energy,
    'estrip.png': estrip,
    'font.png': font,
    'moon.png': moon,
    'player.png': player,
    'spider.png': spider,
    'shine.png': shine,
    'tileset.png': tileset,
    'zombie.png': zombie,
    'shoot.mp3': shootSound,
    'powerup.mp3': powerUpSound,
    'reload.mp3': reloadSound,
    'loop.mp3': loopSound
}
export enum LAYERS {
    CUSTOM_BACKGROUND = 0,
    BACKGROUND = 1,
    MAIN = 2,
    OBJECTS = 3,
    FOREGROUND = 4,
    FLASH = 5,
    DARKNESS = 6,
    CUSTOM_OVERLAY = 7
}
export enum DIRECTIONS {
    UP = 'up',
    RIGHT = 'right',
    DOWN = 'down',
    LEFT = 'left'
}
export enum ENTITY_FAMILY {
    ENEMIES = 'enemies',
    PARTICLES = 'particles',
    TRAPS = 'traps'
}
export enum ENTITY_TYPES {
    AMMO = 'ammo',
    BAT = 'bat',
    BULLET = 'bullet',
    COIN = 'coin',
    DUST = 'dust',
    PARTICLE = 'particle',
    EMITTER = 'emitter',
    HEALTH = 'health',
    PLAYER = 'player',
    ITEM = 'item',
    SPIDER = 'spider',
    SPIKES = 'spikes',
    ZOMBIE = 'zombie'
}
export enum COLORS {
    BLACK = '#000',
    BLUE_SKY = '#7CF',
    BONUS = 'rgba(255,32,32,0.2)',
    DARK_GREY = '#222',
    DARK_RED = '#D00',
    GREEN = '#0F0',
    LIGHT_RED = '#F00',
    PURPLE = '#F0F',
    FLASH = 'rgba(255,255,255,0.6)',
    SPIDER_WEB = 'rgba(255,255,255,0.5)',
    TORCH = 'rgba(255,243,115,0.1)',
    TRANS_WHITE = 'rgba(255,255,255,0.15)',
    WATER = 'rgba(66,100,245,0.1)'
}
