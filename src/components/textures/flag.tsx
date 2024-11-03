import grass from '@/assets/grass.png';
import golfFabric from '@/assets/redFabric.jpg';
import { Color, MeshStandardMaterial, RepeatWrapping, TextureLoader } from 'three';

// Load the grass texture from the public folder
const textureLoader = new TextureLoader();
export const grassTexture = textureLoader.load(grass);

// Set the wrapping and repeat for the grass texture
grassTexture.wrapS = grassTexture.wrapT = RepeatWrapping;
grassTexture.repeat.set(4, 4);

// Load the golf fabric texture from the public folder
export const golfFabricTexture = textureLoader.load(golfFabric);

// Set the wrapping and repeat for the golf fabric texture
golfFabricTexture.wrapS = golfFabricTexture.wrapT = RepeatWrapping;
golfFabricTexture.repeat.set(1, 1);

// Create a shiny and glowing material for the golf fabric texture
export const golfFabricMaterial = new MeshStandardMaterial({
  map: golfFabricTexture,
  metalness: 1, // Maximum metalness for shininess
  roughness: 0, // Minimum roughness for shininess
  emissive: new Color(0xff0000), // Emissive color to make it glow (red in this case)
  emissiveIntensity: 1, // Adjust emissive intensity to make it glow more
});
