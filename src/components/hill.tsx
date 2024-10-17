//@ts-nocheck
import { usePlane } from '@react-three/cannon';
import { DoubleSide, Vector3 } from 'three';

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    float distanceFromCenter = length(vec2(position.x, position.y)) / 50.0; // Adjust divisor for the width

    // Displacement with falloff factor to flatten near edges
    float falloff = 1.0 - smoothstep(0.5, 1.0, distanceFromCenter);
    float displacement = falloff * sin(position.x * 0.1) * cos(position.y * 0.1) * 10.0;

    vec3 newPosition = position + normal * displacement;

    vNormal = normalize(normalMatrix * normal);
    vPosition = vec3(modelViewMatrix * vec4(newPosition, 1.0));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;

  uniform vec3 lightPosition;
  uniform vec3 lightColor;
  uniform vec3 hillColor;

  void main() {
    vec3 lightDir = normalize(lightPosition - vPosition);
    float diffuse = max(dot(vNormal, lightDir), 0.0);
    float shadow = diffuse * 0.5 + 0.5;
    vec3 color = hillColor * diffuse * lightColor * shadow;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function Hill({ scaleFactor }: { scaleFactor: number }) {
  const baseY = -10; // Base level for the planes
  const hillWidth = 100; // Width of the hill
  const hillThickness = 10; // Height of the vertical side planes
  const lightPosition = new Vector3(30, 60, 30); // Position of your light source
  const lightColor = new Vector3(1.0, 1.0, 1.0); // White light
  const hillColor = new Vector3(0.4, 0.8, 0.4); // Green hill color
  const s = scaleFactor ? scaleFactor : 1;
  console.log(scaleFactor);
  const [ref] = usePlane(() => ({
    position: [0, 20, 0],
    rotation: [-Math.PI / 2, 0, 0], // Flat horizontal plane
  }));

  return (
    <group scale={s}>
      {/* Main Hill */}
      <mesh
        position={[0, 10, 0]}
        scale={1}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[hillWidth, hillWidth, 100, 100]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            lightPosition: { value: lightPosition },
            lightColor: { value: lightColor },
            hillColor: { value: hillColor },
          }}
          wireframe={false}
        />
      </mesh>

      {/* Vertical side planes for thickness */}
      <mesh position={[-hillWidth / 2, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[hillWidth, hillThickness]} />
        <meshStandardMaterial color={'#8B4513'} side={DoubleSide} />
      </mesh>

      <mesh position={[hillWidth / 2, 5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[hillWidth, hillThickness]} />
        <meshStandardMaterial color={'#8B4513'} side={DoubleSide} />
      </mesh>

      <mesh position={[0, 5, -hillWidth / 2]} rotation={[0, 0, 0]}>
        <planeGeometry args={[hillWidth, hillThickness]} />
        <meshStandardMaterial color={'#8B4513'} side={DoubleSide} />
      </mesh>

      <mesh position={[0, 5, hillWidth / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[hillWidth, hillThickness]} />
        <meshStandardMaterial color={'#8B4513'} side={DoubleSide} />
      </mesh>
    </group>
  );
}
