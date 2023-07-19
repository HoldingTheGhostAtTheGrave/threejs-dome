import { useEffect } from 'react';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Water } from 'three/examples/jsm/objects/Water';

import { Threejs } from '@/threejs';

const effect = () => {
    let threejs: Threejs | any;
    let water: Water;
    threejs = new Threejs({
        el: "app",
        isAxesHelper: false,
        orbitControls: true,
        cameraPosition: [40, 300, 300],
    });
    threejs.renderer.shadowMap.enabled = true; // 启用阴影
    threejs.renderer.shadowMap.type = THREE.VSMShadowMap; // 根据需要设置阴影贴图类型
    threejs.renderer.antialias = true;
    const loader = new GLTFLoader();
    loader.load(
        '/public/models/architecture/0.gltf',
        (gltf) => {
            const model = gltf.scene;
            model.scale.set(0.06, 0.06, 0.06);
            model.position.set(7,0 , 0)
            model.rotation.y = -(Math.PI / 0.9);
            model.traverse((object:any) => {
                if (object.isMesh) {
                    object.castShadow = true; // 让模型投射阴影
                    object.receiveShadow = true; // 让模型接收阴影（如果需要）
                }
            });
            threejs.scene.add(gltf.scene);
        }
    );
    loader.load(
        '/public/models/architecture/1.gltf',
        (gltf) => {
            const model = gltf.scene;
            model.scale.set(0.1, 0.1, 0.1);
            model.traverse((object:any) => {
                if (object.isMesh) {
                    object.castShadow = true; // 让模型投射阴影
                    object.receiveShadow = true; // 让模型接收阴影（如果需要）
                }
            });
            threejs.scene.add(gltf.scene);
        }
    );
    loader.load(
        '/public/models/architecture/2.gltf',
        (gltf) => {
            const model = gltf.scene;
            model.scale.set(0.1, 0.1, 0.1);
            model.position.set(-7,0 , 0)

            model.traverse((object:any) => {
                if (object.isMesh) {
                    object.castShadow = true; // 让模型投射阴影
                    object.receiveShadow = true; // 让模型接收阴影（如果需要）
                }
            });
            threejs.scene.add(gltf.scene);
        }
    );

    // // 创建平面几何体
    const geometry = new THREE.PlaneGeometry(1500,1500 );
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const plane = new THREE.Mesh(geometry, material);
    plane.receiveShadow = true; // 允许平面接收阴影
    plane.rotation.x = -(Math.PI / 2);
    plane.rotation.y = 0;
    threejs.scene.add(plane);



    threejs.controls.enableRotate = false;
    threejs.controls.enablePan = true;

    // 设置控制器的目标点
    threejs.controls.target.set(0, 0, 0);

    threejs.controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        RIGHT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
    };

    const ambientLight = new THREE.AmbientLight(0xffffff,0.8); // 参数：颜色，强度
    threejs.scene.add(ambientLight);
    // 创建灯光时启用阴影
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(-5,5, 8);
    light.castShadow = true; // 让灯光投射阴影
    threejs.scene.add(light);
    threejs.render(() => {
    });
}
const Architecture = () => {
    useEffect(effect, []);
    return <div id='app'></div>
}

export default Architecture