import { PathPointList, PathGeometry } from 'three.path';
import { TextureLoader, RepeatWrapping, Vector2, Vector3, CatmullRomCurve3, MeshBasicMaterial, Mesh, BufferGeometry, BoxGeometry, PerspectiveCamera } from 'three';
import { Tween, Group } from '@tweenjs/tween.js'
const cameraOffset = new Vector3(0, 2, -2);
export default class PathTool {
  person!: Mesh
  path_point:Vector3[] = []
  start = 0
  tween_animation!: Tween<Vector3>
  camera: PerspectiveCamera
  route_mesh!: Mesh
  constructor(camera: PerspectiveCamera) {
    this.camera = camera
  }
  load_person(): Mesh {
    const box = new BoxGeometry(1, 1)
    const material = new MeshBasicMaterial({
      color: 0xff0000
    })
    let mesh = this.person = new Mesh(box, material)
    return mesh
  }
  draw_path(): Mesh | undefined {

    // this.path_point = item
    const coord = this.path_point
    coord.map((item: any) => {
      // 稍微提高点高度
      item.y = item.y + 0.02;
    });
    const url = new URL('../WechatIMG541.jpg', import.meta.url)
    const texture = new TextureLoader().load(url.href);
    console.log(texture);
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.offset = new Vector2(0.1, 0);
    const up = new Vector3(0, 1, 0);
    const pathCurve = new CatmullRomCurve3(coord, false, 'catmullrom', 0);
    const pathPoints = new PathPointList();
    pathPoints.set(pathCurve.getPoints(500), 0.5, 10, up, false);
    const geometry = new PathGeometry();
    geometry.update(pathPoints, {
      width: 1,
      arrow: true,
    });
    if (this.route_mesh) {
      this.route_mesh.geometry = geometry as unknown as BufferGeometry
      return
    }
    const material = new MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    });
    this.route_mesh = new Mesh(geometry as unknown as BufferGeometry, material)
    return this.route_mesh;
  }

  start_roaming() {
    console.log(this.start, this.path_point.length, this.path_point[this.start + 1]);
    this.person.position.copy(this.path_point[this.start])
    this.tween_animation = new Tween(this.path_point[this.start])
      .to(this.path_point[this.start + 1], 1000)
      .onUpdate((newPosition) => {
        this.person.position.copy(newPosition);
        // 相机跟随
        this.camera_follow()
      }).onComplete(() => {
        if (this.start < this.path_point.length - 2) {
          this.start += 1
          this.start_roaming()
        }
      }).onStart(() => {
        this.person.lookAt(this.path_point[this.start + 1])
      })
    this.tween_animation.start()

    const group = new Group()
    group.add(this.tween_animation)
    requestAnimationFrame(function loop(time) {
      group.update(time)
      requestAnimationFrame(loop)
    })
  }
  // 相机跟随
  camera_follow() {
    const lerpFactor = 0.1; // 插值因子，越小移动越平滑
    // 动态调整相机位置，使用插值使移动更平滑
    const offsetPosition = this.person.position.clone().add(cameraOffset.clone().applyQuaternion(this.person.quaternion));
    // 更新相机位置
    // this.camera.position.copy(offsetPosition);
    this.camera.position.lerp(offsetPosition, lerpFactor);

    // 让相机始终看向模型
    this.camera.lookAt(this.person.position);
  }
  pause_animation() {
    this.tween_animation.pause()
  }
  start_animation() {
    this.tween_animation.start()
  }
  resume_animation() {
    this.tween_animation.resume()
  }
  // 更新路径
  // update_route_mesh() {
  //   const up = new Vector3(0, 1, 0);
  //   const pathCurve = new CatmullRomCurve3(this.path_point, false, 'catmullrom', 0);
  //   const pathPoints = new PathPointList();
  //   pathPoints.set(pathCurve.getPoints(500), 0.5, 10, up, false);
  //   console.log('update',this.path_point);
  //   let geometry = this.route_mesh.geometry as unknown as PathGeometry
  //   geometry.update(pathPoints, {
  //     width: 1,
  //     arrow: true,
  //   })
  // }
}