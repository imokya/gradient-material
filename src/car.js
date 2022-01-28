import Env from './env'
import * as THREE from 'three'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader'
import Tip from './objects/tip'

import GradientMaterial from './common/gradientMaterial'

export default class Car {
  
  constructor() {
    this.env = new Env()
    this.pane = this.env.pane
    this.scene = this.env.scene
    this.camera = this.env.camera
    this.renderer = this.env.renderer
    //this._setRenderCubeCamera()
    this.gms = []
    this._setConfig()
    this._setLights()
    this._loadEnvMap()
  }

  _setConfig() {
    const params = {
      color1: 0x2c175c,
      color2: 0x081b27,
      color3: 0x011b27
    }
    this.pane.addInput(params, 'color1', {
      label: '颜色1',
      view: 'color'
    }).on('change', e => {
      this._changeColor({
        name: 'col1',
        value: new THREE.Color(e.value)
      })
    })
    this.pane.addInput(params, 'color2', {
      label: '颜色2',
      view: 'color'
    }).on('change', e => {
      this._changeColor({
        name: 'col2',
        value: new THREE.Color(e.value)
      })
    })
    this.pane.addInput(params, 'color3', {
      label: '颜色2',
      view: 'color'
    }).on('change', e => {
      this._changeColor({
        name: 'col3',
        value: new THREE.Color(e.value)
      })
    })
    this.params = params
  }

  _changeColor(obj) {
    if(this.gms.length) {
      this.gms.forEach(gm => {
        console.log(obj.name)
        gm.shader.uniforms[obj.name].value = obj.value
      })
    }
  }

  _createTips(mesh) {
    this.tip = new Tip(mesh)
  }

  _setRenderCubeCamera() {
    this.cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
      format: THREE.RGBFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter
    })
    this.cubeCamera = new THREE.CubeCamera(
      0.1,
      1000,
      this.cubeRenderTarget
    )
    this.scene.add(this.cubeCamera)
  }

  _loadEnvMap() {

    const pmremGenerator = new THREE.PMREMGenerator(this.renderer)
    const loader = new EXRLoader().load('textures/interior.exr', texture => {
      this.envRenderTarget = pmremGenerator.fromEquirectangular(texture)
      this._loadModel()
    })
  }

  _setLights() {
    //const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
    //this.scene.add(ambientLight)

    // const dirLight1 = new THREE.DirectionalLight(0xffffff, 1)
    // dirLight1.position.set(0, 2, 0)
    // this.scene.add(dirLight1)
  }

  _loadModel() {
    this.scene.environment = this.envRenderTarget.texture
    //this.scene.background = this.cubeRenderTarget.texture
    
    // const normalMap = new THREE.TextureLoader().load('textures/normal.png')
    // normalMap.wrapS = THREE.RepeatWrapping
    // normalMap.wrapT = THREE.RepeatWrapping

    
    const roughnessMap = new THREE.TextureLoader().load('textures/roughness.png')
    roughnessMap.wrapS = THREE.RepeatWrapping
    roughnessMap.wrapT = THREE.RepeatWrapping
    roughnessMap.repeat.set(1, 1)



    const floorMap = new THREE.TextureLoader().load('textures/floormap.png')
    floorMap.wrapS = THREE.RepeatWrapping
    floorMap.wrapT = THREE.RepeatWrapping

    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x820000, 
      metalness: 0.75, 
      roughness: 0.2, 
      envMapIntensity: 0.8,
      envMap: this.envRenderTarget.texture
    })

    const body2Material = new THREE.MeshPhysicalMaterial({
      color: 0xff0000, 
      metalness: 0.8, 
      roughness: 0.5,
      envMapIntensity: 0.6,
      envMap: this.envRenderTarget.texture
    })

    const detailsMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff, 
      metalness: 0.8, 
      roughness: 0.3,
      envMap: this.envRenderTarget.texture
    })

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, 
      metalness: 0, 
      roughness: 0.01, 
      transmission: 1, 
      transparent: true,
      envMapIntensity: 0.3,
      envMap: this.envRenderTarget.texture
    })

    const lightGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, 
      metalness: 0, 
      roughness: 0.2, 
      transmission: 1, 
      transparent: true,
      envMap: this.envRenderTarget.texture
    })

    const tierMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x000000, 
      metalness: 0.1, 
      roughness: 0.5
    })

    const wheelMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, 
      metalness: 1, 
      roughness: 0.1,
      envMapIntensity: 0.5,
      envMap: this.envRenderTarget.texture
    })

    const floor1Material = new THREE.MeshStandardMaterial({
      color: 0x020202,
      metalness: 0,
      roughness: 0.5,
      roughnessMap,
      envMap: this.envRenderTarget.texture,
      envMapIntensity: 0.2,
    })

    const floor2Material = new THREE.MeshStandardMaterial({
      color: 0x000000, 
      metalness: 0.2, 
      roughness: 0.7,
      envMapIntensity: 0.1,
      envMap: this.envRenderTarget.texture,
      roughnessMap
    })

    const floor3Material = new THREE.MeshPhysicalMaterial({
      color: 0x000000, 
      metalness: 0.1, 
      roughness: 0.7,
      envMapIntensity: 0.1,
      envMap: this.envRenderTarget.texture,
      roughnessMap,
      reflectivity: 0,
    })

    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('draco/')
    loader.setDRACOLoader(dracoLoader)
    loader.load('models/car.glb', gltf => {
      gltf.scene.traverse(child => {
        if(child instanceof THREE.Mesh) {
          child.material.envMapIntensity = 0.3

          if(child.material.name == 'Material.041' ||
            child.material.name == 'Material.031') {
            const gm = new GradientMaterial(child.material, this.params) 
            child.material = gm.getMaterial()
            child.material.roughness = 0.03
            child.material.metalness = 1
            child.material.envMapIntensity = 0.5
            this.gms.push(gm)
          }
          if(child.name == 'glass') {
            child.material = glassMaterial
          }
          if(child.name == 'glass2') {
            child.material = lightGlassMaterial
          }
          if(child.name.indexOf('tier') !== -1) {
            child.material = tierMaterial
          }
          if(child.name.indexOf('wheel') !== -1) {
            child.material = wheelMaterial
          }
          if(child.name == 'pipe') {
            child.material = wheelMaterial
          }
          if(child.name == 'floor1') {
            child.material = floor1Material
          }
          if(child.name == 'floor2') {
            child.material = floor2Material
          }
          if(child.name == 'floor3') {
            child.material = floor3Material
          }
        }
      })
      this._createTips(gltf.scene.children[0].children[0])
      this.scene.add(gltf.scene)
    })
  }

  update() {
    if(this.tip && this.tip.update) {
      this.tip.update()
    }
  }

}


