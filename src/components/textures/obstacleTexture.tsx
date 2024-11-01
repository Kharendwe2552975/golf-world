import obstacleImage from '@/assets/obstacle.png';
import { RepeatWrapping, TextureLoader } from 'three';
// Load the obstacle texture from the public folder
const textureLoader = new TextureLoader();
export const obstacle = textureLoader.load(obstacleImage);

// Set the wrapping and repeat for the obstacle texture
obstacle.wrapS = obstacle.wrapT = RepeatWrapping;
obstacle.repeat.set(1, 1);
