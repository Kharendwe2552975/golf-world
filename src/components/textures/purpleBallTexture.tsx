import { RepeatWrapping, TextureLoader } from 'three';

// Load the purple ball texture from the public folder
const textureLoader = new TextureLoader();
export const purpleBallTexture = textureLoader.load('/purpleBall.png');

// Set the wrapping and repeat for the purple ball texture
purpleBallTexture.wrapS = purpleBallTexture.wrapT = RepeatWrapping;
purpleBallTexture.repeat.set(1, 1);
