import * as THREE from 'three'

export default class GradientMaterial {

  constructor(originMaterial, params) {
    this.originMaterial = originMaterial
    this.params = params
    this.shader = null
  }

  getMaterial() {
    const material = new THREE.MeshStandardMaterial({
      metalness: this.originMaterial.metalness,
      roughness: this.originMaterial.roughness,
      envMapIntensity: this.originMaterial.envMapIntensity,
      envMap: this.originMaterial.envMap,
      name: this.originMaterial.name,
      onBeforeCompile: (shader, renderer) => {
        shader.defines.USE_UV = true
        shader.uniforms.col1 = {
          value: new THREE.Color(this.params.color1)
        }
        shader.uniforms.col2 = {
          value: new THREE.Color(this.params.color2)
        }
        shader.uniforms.col3 = {
          value: new THREE.Color(this.params.color3)
        }
        shader.vertexShader = shader.vertexShader.replace(
          '#include <clipping_planes_pars_vertex>',
          `
            #include <clipping_planes_pars_vertex>
            varying vec3 vWorldPosition;
            varying vec3 vPosition;
          `
        )
        shader.vertexShader = shader.vertexShader.replace(
          '#include <fog_vertex>',
          `
            #include <fog_vertex>
            vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          `
        )
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <clipping_planes_pars_fragment>',
          `
            #include <clipping_planes_pars_fragment>
            varying vec3 vWorldPosition;
            varying vec3 vPosition;
            uniform vec3 col1;
            uniform vec3 col2;
            uniform vec3 col3;
          `
        )
        
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <output_fragment>',
          `
            #include <output_fragment>
            vec3 lightPos1 = vec3(-30.0, 0.0, 0.0);
            vec3 lightPos2 = vec3(30.0, 30.0, 0.0);

            vec3 lightPos3 = vec3(-10.0, 0.0, 20.0);
            vec3 lightPos4 = vec3(-10.0, 0.0, -20.0);

            vec3 lightPos5 = vec3(10.0, 0.0, 50.0);
            vec3 lightPos6 = vec3(10.0, 0.0, -20.0);

            vec3 lightPos7 = vec3(20.0, 0.0, 0.0);
           

            vec3 lightDir1 = normalize(lightPos1 - vWorldPosition);
            vec3 lightDir2 = normalize(lightPos2 - vWorldPosition);
            vec3 lightDir3 = normalize(lightPos3 - vWorldPosition);
            vec3 lightDir4 = normalize(lightPos4 - vWorldPosition);
            vec3 lightDir5 = normalize(lightPos5 - vWorldPosition);
            vec3 lightDir6 = normalize(lightPos6 - vWorldPosition);
            vec3 lightDir7 = normalize(lightPos7 - vWorldPosition);

            // vec3 col1 = vec3(c1/255.0, 23.0/255.0, 92.0/255.0);
            // vec3 col2 = vec3(8.0/255.0, 27.0/255.0, 39.0/255.0);
            // vec3 col3 = vec3(1.0, 27.0/255.0, 39.0/255.0);

            float color1 = max(0.0, dot(vNormal, lightDir1));
            float color2 = max(0.0, dot(vNormal, lightDir2));
            float color3 = max(0.0, dot(vNormal, lightDir3));
            float color4 = max(0.0, dot(vNormal, lightDir4));
            float color5 = max(0.0, dot(vNormal, lightDir5));
            float color6 = max(0.0, dot(vNormal, lightDir6));
            float color7 = max(0.0, dot(vNormal, lightDir7));

            vec3 c1 = color1 * col1;
            vec3 c2 = color2 * col2;
            vec3 c3 = color3 * col1;
            vec3 c4 = color4 * col1;
            vec3 c5 = color5 * col2;
            vec3 c6 = color6 * col2;
            vec3 c7 = color7 * col3;
          
            // float dist = length(vUv - vec2(0.5));
            // vec3 color = mix(color1, color2, vUv.x);
            //vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
            //vec3 finalColor = mix((totalSpecular + totalEmissiveRadiance) * 0.8, outgoingLight, 1.0);
            //vec3 finalColor = mix(outgoingLight / 2.0, color / 1.5, 0.9);
            vec3 finalColor = outgoingLight * c1 + outgoingLight * c2 + outgoingLight * c3 + outgoingLight * c4 + outgoingLight * c5 + outgoingLight * c6 + outgoingLight * c7 * 0.5;
            gl_FragColor = vec4(vec3(finalColor), 1.0);
          `
        )
        this.shader = shader
      }
    })

    return material

  }

}