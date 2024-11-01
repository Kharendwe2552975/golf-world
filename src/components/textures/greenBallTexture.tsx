import greenBall from '@/assets/greenBall.jpg';
import { RepeatWrapping, TextureLoader } from 'three';
// Load the green ball texture from the public folder
const textureLoader = new TextureLoader();
export const greenBallTexture = textureLoader.load(greenBall);

// Set the wrapping and repeat for the green ball texture
greenBallTexture.wrapS = greenBallTexture.wrapT = RepeatWrapping;
greenBallTexture.repeat.set(1, 1);
