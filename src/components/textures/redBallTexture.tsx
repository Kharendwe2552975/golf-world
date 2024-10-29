import { RepeatWrapping, TextureLoader } from 'three';

// Load the golf ball texture from the public folder
const textureLoader = new TextureLoader();
export const ballTexture = textureLoader.load('/redBall.png');

// Set the wrapping and repeat for the golf ball texture
ballTexture.wrapS = ballTexture.wrapT = RepeatWrapping;
ballTexture.repeat.set(1, 1);
