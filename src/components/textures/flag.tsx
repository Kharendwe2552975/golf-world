import { RepeatWrapping, TextureLoader } from 'three';

// Load the grass texture from the public folder
const textureLoader = new TextureLoader();
export const grassTexture = textureLoader.load('/grass.png');

// Set the wrapping and repeat for the grass texture
grassTexture.wrapS = grassTexture.wrapT = RepeatWrapping;
grassTexture.repeat.set(4, 4);

// Load the golf fabric texture from the public folder
export const golfFabricTexture = textureLoader.load('/golfFabric.png');

// Set the wrapping and repeat for the golf fabric texture
golfFabricTexture.wrapS = golfFabricTexture.wrapT = RepeatWrapping;
golfFabricTexture.repeat.set(1, 1);
