<script setup lang="ts">
import { Scene, PerspectiveCamera, WebGLRenderer, DirectionalLight, AmbientLight, Color, Fog, Raycaster, Vector2 } from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { onBeforeUnmount, onMounted, ref } from 'vue';
const three = ref()
let scene: Scene,
  camera: PerspectiveCamera,
  renderer: WebGLRenderer,
  controls: OrbitControls;
let init_scene = () => {
  scene = new Scene();
  scene.background = new Color(0.5, 1, 0.875);
  scene.fog = new Fog(scene.background, 20, 45);
  camera = new PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
  let vHeight = 3;
  camera.position.set(0, vHeight + 2, 0).setLength(15);
  renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  three.value.appendChild(renderer.domElement);
  window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
  controls = new OrbitControls(camera, renderer.domElement);
  controls.update();
  controls.enablePan = false;
  let light = new DirectionalLight(0xffffff, 0.25);
  light.position.setScalar(1);
  scene.add(light, new AmbientLight(0xffffff, 0.75));
};

import { add_plane } from './code.ts'
import PathTool from '../lib/Path.ts';

import { GUI } from 'lil-gui'
let ready = false
const raycaster = new Raycaster();
const mouse = new Vector2();
function event_listener(event: MouseEvent) {
  // 将鼠标点击的屏幕坐标转换为归一化设备坐标
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  // 执行射线检测
  if (ready) {
    raycast();
    if (path_tool.path_point.length >= 2) {
      const mesh = path_tool.draw_path()
      if (mesh) {
        scene.add(mesh)
      }
    }
  }else{
    ready = true
  }

};
const start_draw = () => {
  if (path_tool.path_point.length) {
    path_tool.path_point = []
  }
  window.addEventListener('click', event_listener);
}
function stop_draw() {
  window.removeEventListener('click', event_listener)
  // path_tool.path_point = []
  ready = false
}
function raycast() {
  // 更新射线的方向，从相机到鼠标所在的点
  raycaster.setFromCamera(mouse, camera);
  // 检测场景中所有的物体（也可以指定需要检测的对象数组）
  const intersects = raycaster.intersectObjects(scene.children);
  // 如果有相交物体，处理交点
  if (intersects.length > 0) {
    path_tool.path_point.push(intersects[0].point)
    // drawed_v3_array.push(intersects[0].point)
  }
}


let path_tool: PathTool
let init = () => {
  path_tool = new PathTool(camera)
  const person = path_tool.load_person()
  scene.add(person)
  const gui = new GUI()
  let params = {
    draw: () => {
      start_draw()
    },
    stop_draw: () => {
      stop_draw()
    },
    start: () => { path_tool.start_roaming() },
    resume: () => { path_tool.resume_animation() },
    pause: () => { path_tool.pause_animation() }
  }
  gui.add(params, 'draw').name('绘制线')
  gui.add(params, 'stop_draw').name('结束绘制')
  gui.add(params, 'start').name('开始漫游')
  gui.add(params, 'resume').name('继续漫游')
  gui.add(params, 'pause').name('暂停漫游')
}

// const other_code = () => {
//   const test_points = [
//     new Vector3(0, 0, 0),
//     new Vector3(4, 0, 3),
//     new Vector3(8, 0, 4),
//     new Vector3(3, 0, 0),
//     new Vector3(5, 0, 0),
//   ]
//   const path_tool = new PathTool(camera)
//   const path = path_tool.draw_path(test_points)
//   scene.add(path)
//   const person = path_tool.load_person()
//   scene.add(person)
//   // path_tool.start_roaming()

// }

onMounted(() => {
  init_scene()
  render();
  const mesh = add_plane()
  scene.add(mesh)
  // other_code()
  init()
})
let rf: number;
const render = () => {
  renderer.render(scene, camera);
  rf = requestAnimationFrame(render);
};
onBeforeUnmount(() => {
  cancelAnimationFrame(rf);
});
</script>

<template>
  <div class="three-container" ref="three">

  </div>
</template>

<style scoped></style>
