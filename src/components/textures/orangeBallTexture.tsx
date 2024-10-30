import { RepeatWrapping, TextureLoader } from 'three';

// Load the orange ball texture from the public folder
const textureLoader = new TextureLoader();
export const orangeBallTexture = textureLoader.load('/orangeBall.png');

// Set the wrapping and repeat for the orange ball texture
orangeBallTexture.wrapS = orangeBallTexture.wrapT = RepeatWrapping;
orangeBallTexture.repeat.set(1, 1);
