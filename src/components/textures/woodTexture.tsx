// woodTexture.tsx
import { RepeatWrapping, TextureLoader } from 'three';

// Load the wood texture from the public folder
const textureLoader = new TextureLoader();
export const woodTexture = textureLoader.load('/wood.png'); // Ensure your wood texture image is named 'wood.png'

// Set the wrapping and repeat for the wood texture
woodTexture.wrapS = woodTexture.wrapT = RepeatWrapping;
woodTexture.repeat.set(4, 4);
