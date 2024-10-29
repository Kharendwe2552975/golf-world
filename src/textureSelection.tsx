import { RepeatWrapping, TextureLoader } from 'three';

// Load the golf ball textures from the public folder
const textureLoader = new TextureLoader();
const greenBallTexture = textureLoader.load('/greenBall.png');
const redBallTexture = textureLoader.load('/redBall.png');
const purpleBallTexture = textureLoader.load('/purpleBall.png');
const orangeBallTexture = textureLoader.load('/orangeBall.png');

// Set the wrapping and repeat for the golf ball textures
[greenBallTexture, redBallTexture, purpleBallTexture, orangeBallTexture].forEach((texture) => {
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(1, 1);
});

export { greenBallTexture, orangeBallTexture, purpleBallTexture, redBallTexture };
