import { RepeatWrapping, TextureLoader } from 'three';

// Load the grass texture from the public folder
const textureLoader = new TextureLoader();
export const grassTexture = textureLoader.load('/grass.png');

// Set the wrapping and repeat for the grass texture
grassTexture.wrapS = grassTexture.wrapT = RepeatWrapping;
grassTexture.repeat.set(4, 4);

// Load the golf ball texture from the public folder
export const ballTexture = textureLoader.load('/ball.png');

// Set the wrapping and repeat for the golf ball texture
ballTexture.wrapS = ballTexture.wrapT = RepeatWrapping;
ballTexture.repeat.set(1, 1);
