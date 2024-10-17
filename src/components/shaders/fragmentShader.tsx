export const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform sampler2D uTexture;

  uniform vec3 uLightPosition;
  uniform vec3 uLightColor;
  uniform vec3 uAmbientLight;

  void main() {
    vec4 textureColor = texture2D(uTexture, vUv);
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(uLightPosition - vPosition);

    // Diffuse lighting
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * uLightColor;

    // Specular lighting (Phong model)
    vec3 viewDir = normalize(-vPosition);
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0); // Adjust shininess here
    vec3 specular = spec * uLightColor;

    // Combine diffuse, specular, and ambient lighting
    vec3 finalColor = (uAmbientLight + diffuse + specular) * textureColor.rgb;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
