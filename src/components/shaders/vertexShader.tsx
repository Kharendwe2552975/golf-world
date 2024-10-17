export const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;  // Pass the normal to the fragment shader
  varying vec3 vPosition;  // Pass the fragment position to the fragment shader

  void main() {
    vUv = uv;

    // Pass the normal vector and position to the fragment shader
    vNormal = normalMatrix * normal;  
    vPosition = vec3(modelViewMatrix * vec4(position, 1.0));

    // Calculate position on screen
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
