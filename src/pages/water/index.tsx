import { useEffect } from 'react';

import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water';

import { Threejs } from '@/threejs';

const effect = () => {
    let threejs: Threejs | any;
    let water: Water;
    threejs = new Threejs({
        el: "app",
        isAxesHelper: true,
        orbitControls: true,
        cameraPosition: [0, 0, 10],
    });
    // 禁用控制器的旋转功能
    // 启用控制器的平移功能
    // threejs.controls.enableRotate = false;
    // threejs.controls.enablePan = true;

    // // 设置控制器的目标点
    // threejs.controls.target.set(0, 0, 0);

    // threejs.controls.mouseButtons = {
    //     LEFT: THREE.MOUSE.PAN,
    //     RIGHT: THREE.MOUSE.ROTATE,
    //     MIDDLE: THREE.MOUSE.DOLLY,
    // };
    // // 创建平面几何体
    // var geometry = new THREE.PlaneGeometry(10, 10);
    // var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // var plane = new THREE.Mesh(geometry, material);
    // threejs.scene.add(plane);
   
    // itemSize = 3 因为每个顶点都是一个三元组。
    const geometry = new THREE.BufferGeometry();
// 创建一个简单的矩形. 在这里我们左上和右下顶点被复制了两次。
// 因为在两个三角面片里，这两个顶点都需要被用到。
const vertices = new Float32Array( [
	-1.0, -1.0,  1.0,
	 1.0, -1.0,  1.0,
	 1.0,  1.0,  1.0,

	 1.0,  1.0,  1.0,
	-1.0,  1.0,  1.0,
	-1.0, -1.0,  1.0
] );

// itemSize = 3 因为每个顶点都是一个三元组。
geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
const mesh = new THREE.Mesh( geometry, material );
    threejs.scene.add(mesh)
    threejs.render(() => {
    });


}



const WaterComponent = () => {
    useEffect(effect, []);
    return <div id='app'></div>
}

export default WaterComponent;