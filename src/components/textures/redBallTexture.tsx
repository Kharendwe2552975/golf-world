import redBall from '@/assets/redBall.jpg';
import { RepeatWrapping, TextureLoader } from 'three';
// Load the red ball texture from the public folder
const textureLoader = new TextureLoader();
export const redBallTexture = textureLoader.load(redBall);

// Set the wrapping and repeat for the red ball texture
redBallTexture.wrapS = redBallTexture.wrapT = RepeatWrapping;
redBallTexture.repeat.set(1, 1);
