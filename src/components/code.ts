//  添加一个plane
import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'
export const add_plane = () => {
    const planeGeometry = new PlaneGeometry(50, 50, 500, 500);
    const material = new MeshBasicMaterial({
        color: 0x0fff0f
    });
    planeGeometry.rotateX(-Math.PI / 2)
    const mesh = new Mesh(planeGeometry, material)
    return mesh;
}