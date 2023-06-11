<template>
  <Renderer
      ref="renderer"
      antialias
      resize="window"
  >
    <Camera ref="camera" :fov="35" :far="100" :near="0.1"/>
    <Scene ref="scene">
      <AmbientLight ref="ambientLight" :intensity="1" />
    </Scene>
  </Renderer>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {AmbientLight, Camera, Renderer, Scene} from 'troisjs';
import * as THREE from 'three/build/three.module.js';
import {vertexShader} from "../assets/shader/vertex";
import {fragmentShader} from "../assets/shader/fragment";

interface TextureImageObject {

  wrapS: number,
  wrapT: number,
  minFilter: number,
  magFilter: number,

}

const props = defineProps<{
  changeTo: number,
  transitionType: string,
  loop: boolean,
}>()

const renderer = ref();
const camera = ref();
const scene = ref();
const loader = new THREE.TextureLoader(undefined);
let currentSlide = 0;
let nextSlide = 0;
let progress = 0;
let direction = 0;
const velocity = 0.04;
const clock = new THREE.Clock();
let time = clock.getElapsedTime();
let isAnimating = false;

const resImage = new THREE.Vector2(1920, 1280);

const textureData = [
  {
    texture: loader.load("/assets/img/texture1.jpg/", undefined, undefined, undefined),
    resolution: resImage,
  },
  {
    texture: loader.load("/assets/img/texture2.jpg/", undefined, undefined, undefined),
    resolution: resImage,
  },
  {
    texture: loader.load("/assets/img/texture3.jpg/", undefined, undefined, undefined),
    resolution: resImage,
  },
  {
    texture: loader.load("/assets/img/texture4.jpg/", undefined, undefined, undefined),
    resolution: resImage,
  },
  {
    texture: loader.load("/assets/img/texture5.jpg/", undefined, undefined, undefined),
    resolution: resImage,
  },
  {
    texture: loader.load("/assets/img/texture6.jpg/", undefined, undefined, undefined),
    resolution: resImage,
  },
  {
    texture: loader.load("/assets/img/texture7.jpg/", undefined, undefined, undefined),
    resolution: resImage,
  },
]

const transitionTexture = loader.load("/assets/img/transition-texture.jpg/", undefined, undefined, undefined)

const geometry = new THREE.PlaneGeometry(2, 2);
const material = new THREE.ShaderMaterial({

  uniforms: {

    u_time: { value: 0 },
    u_progress: { value: 0 },
    u_currentTexture: { value: textureData[0].texture },
    u_nextTexture: { value: textureData[1].texture },
    u_transitionTexture: { value: transitionTexture },
    u_image_resolution: { value: textureData[0].resolution },
    u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    u_transitionType: { value: props.transitionType },

  },

  vertexShader: vertexShader,

  fragmentShader: fragmentShader,

})

const mesh = new THREE.Mesh(geometry, material);

onMounted(()=> {

  scene.value.scene.add(mesh)

  renderer.value.onBeforeRender(()=> {

    const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);

    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - time;
    time = elapsedTime;

    if (isAnimating) {
      progress = THREE.MathUtils.lerp(progress, 1, velocity * 0.5) + 0.01;
    } else {
      progress = THREE.MathUtils.lerp(progress, -1.5, velocity * 0.5) + 0.01;
    }

    material.uniforms.u_resolution.value = resolution;
    material.uniforms.u_time.value = time;
    material.uniforms.u_transitionType.value = props.transitionType;
    material.uniforms.u_currentTexture.value = textureData[currentSlide].texture;
    material.uniforms.u_nextTexture.value = textureData[nextSlide].texture;
    material.uniforms.u_progress.value = progress;

    if (progress > 1) {
      isAnimating = false;
      currentSlide = nextSlide;
    }

  })

})

watch(()=> props.changeTo, ()=> {

  if (isAnimating) return

  isAnimating = true;
  progress = 0;

  direction = Math.sign(props.changeTo);

  nextSlide = currentSlide + direction;

  if (nextSlide > textureData.length -1) props.loop ? nextSlide = 0 : nextSlide = textureData.length -1;

  if (nextSlide < 0) props.loop ? nextSlide = textureData.length -1 : nextSlide = 0;

})

</script>
