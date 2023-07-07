import * as THREE from 'three';

// 创建几何体
export function createGeomerty() {
    const box = new THREE.Box3(
        new THREE.Vector3(-4000, 0, -4000),
        new THREE.Vector3(4000, 5000, 4000)
    );


    // 创建几何体
    let geometry1 = new THREE.BufferGeometry();

    const vertices = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    for (let i = 0; i < 2000; i++) {
        const pos = new THREE.Vector3();
        pos.x = Math.random() * (box.max.x - box.min.x) + box.min.x;
        pos.y = Math.random() * (box.max.y - box.min.y) + box.min.y;
        pos.z = Math.random() * (box.max.z - box.min.z) + box.min.z;

        const height = 200;
        const width = 20;

        const rect = [
            pos.x + width,
            pos.y + height / 2,
            pos.z,
            pos.x - width,
            pos.y + height / 2,
            pos.z,
            pos.x - width,
            pos.y - height / 2,
            pos.z,
            pos.x + width,
            pos.y - height / 2,
            pos.z
        ];

        // 定义旋转轴
        const axis = new THREE.Vector3(0, 0, 1).normalize();
        //定义旋转角度
        const angle = 0;
        // 创建旋转矩阵
        const rotationMatrix = new THREE.Matrix4().makeRotationAxis(axis, angle);

        for (let index = 0; index < rect.length; index += 3) {
            const vec = new THREE.Vector3(rect[index], rect[index + 1], rect[index + 2]);
            //移动到中心点
            vec.sub(new THREE.Vector3(pos.x, pos.y, pos.z))
            //绕轴旋转
            vec.applyMatrix4(rotationMatrix);
            //移动到原位
            vec.add(new THREE.Vector3(pos.x, pos.y, pos.z))
            rect[index] = vec.x;
            rect[index + 1] = vec.y;
            rect[index + 2] = vec.z;
        }

        vertices.push(...rect)
        normals.push(
            pos.x,
            pos.y,
            pos.z,
            pos.x,
            pos.y,
            pos.z,
            pos.x,
            pos.y,
            pos.z,
            pos.x,
            pos.y,
            pos.z
        );

        uvs.push(1, 1, 0, 1, 0, 0, 1, 0);

        indices.push(
            i * 4 + 0,
            i * 4 + 1,
            i * 4 + 2,
            i * 4 + 0,
            i * 4 + 2,
            i * 4 + 3
        );
    }
    geometry1.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(vertices), 3)
    );
    geometry1.setAttribute(
        "normal",
        new THREE.BufferAttribute(new Float32Array(normals), 3)
    );
    geometry1.setAttribute(
        "uv",
        new THREE.BufferAttribute(new Float32Array(uvs), 2)
    );
    geometry1.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));

    return geometry1
}
