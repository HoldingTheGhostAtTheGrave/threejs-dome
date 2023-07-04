import { useEffect } from 'react';

import * as THREE from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Sky } from 'three/examples/jsm/objects/Sky';
import { Water } from 'three/examples/jsm/objects/Water';

import { Threejs } from '@/threejs';
import {
  proThreejsType,
  ThreejsType,
} from '@/vite-env';

const effect = () => {
    let threejs: proThreejsType<ThreejsType>;
    let water: Water;
    const sky = new Sky();
    let sun = new THREE.Vector3();
    let moonMesh: any = null;
    const parameters = {
        elevation: 300,
        azimuth: 180,
    };
    // 创建 海面
    const createWater = () => {
        const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
        water = new Water(waterGeometry, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load(
                "/public/models/waternormals.jpg",
                function (texture) {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                }
            ),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f, // 太阳光的颜色
            distortionScale: 3.7,
            fog: threejs.scene.fog !== undefined,
        });
        water.material.uniforms["sunDirection"].value.copy(sun).normalize();
        water.rotation.x = -Math.PI / 2;
        threejs.scene.add(water);
    };
    let isCreateSphereGeometry = false;
    // 渲染函数
    const render = () => {
        threejs!.controls && threejs!.controls.update();
        (threejs!.camera as any).updateProjectionMatrix();
        threejs!.renderer!.render(threejs!.scene, threejs!.camera);
        (water as Water).material.uniforms["time"].value += 1.0 / 60.0;

        const now = new Date();
        const interpolatedValue = linearInterpolation(dateTime(now.getHours(), now.getMinutes(), now.getSeconds()));
        if (interpolatedValue == -92.4 || interpolatedValue == 92.4) {
            if (isCreateSphereGeometry) return;
            createSphereGeometry();
            isCreateSphereGeometry = true;
        } else {
            moonMesh && (threejs!.scene).remove(moonMesh);
            moonMesh = null;
            isCreateSphereGeometry = false;
        }
        parameters.elevation = interpolatedValue;
        updateSun();
        requestAnimationFrame(render);
    };

    // 创建天空盒
    const createSky = () => {
        sky.scale.setScalar(10000);
        (threejs?.scene).add(sky);
        const skyUniforms = sky.material.uniforms;
        skyUniforms["turbidity"].value = 10;
        skyUniforms["rayleigh"].value = 2;
        skyUniforms["mieCoefficient"].value = 0.005;
        skyUniforms["mieDirectionalG"].value = 0.8;
    };
    function updateSun() {
        const phi = THREE.MathUtils.degToRad(parameters.elevation);
        const theta = THREE.MathUtils.degToRad(parameters.azimuth);
        sun.setFromSphericalCoords(1, phi, theta);
        sky.material.uniforms["sunPosition"].value.copy(sun);
        (water as Water).material.uniforms["sunDirection"].value.copy(sun).normalize();
    }

    const createSpotLight = () => {
        const spotLight1 = new THREE.SpotLight(0xffffff);
        spotLight1.position.set(-50, 100, 0);
        (threejs?.scene).add(spotLight1);

        const spotLight2 = new THREE.SpotLight(0xffffff);
        spotLight2.position.set(550, 500, 0);
        (threejs?.scene).add(spotLight2);

        const spotLight3 = new THREE.SpotLight(0xffffff);
        spotLight3.position.set(150, 50, -200);
        (threejs?.scene).add(spotLight3);

        const spotLight4 = new THREE.SpotLight(0xffffff);
        spotLight4.position.set(150, 50, 200);
        (threejs?.scene).add(spotLight4);

        const spotLight5 = new THREE.SpotLight(0xffffff);
        spotLight5.position.set(-500, 10, 0);
        (threejs?.scene).add(spotLight5);
    };


    // 加载船模型
    const createMTLLoader = () => {
        let createLoader = new MTLLoader();
        createLoader.load("/public/models/工程船.mtl", (materials) => {
            const objLoader = new OBJLoader();
            materials.preload();
            objLoader.setMaterials(materials);
            objLoader.load("/public/models/工程船.obj", function (object) {
                object.position.x = -40;
                object.position.z = -80;
                object.position.y = 0;
                object.rotation.y = -22;
                object.scale.set(0.005, 0.005, 0.005);
                object.name = "engineerShip";
                (threejs?.scene).add(object);
            });
        });
    };
    // 返回几点钟的时间戳
    const dateTime = (hour: number, minute = 0, second = 0) => {
        const sixAM = new Date();
        sixAM.setHours(hour, minute, second);
        return sixAM.getTime();
    };
    // 计算角度
    const linearInterpolation = (
        value = dateTime(10),
        startValue = dateTime(6),
        endValue = dateTime(19),
        startRange = 92.4,
        endRange = -92.4
    ) => {
        if (value < startValue) {
            return startRange;
        }
        if (value > endValue) {
            return endRange;
        }
        const range = endRange - startRange;
        const relativePosition = (value - startValue) / (endValue - startValue);
        const interpolatedValue = startRange + relativePosition * range;
        return interpolatedValue;
    };
    const createSphereGeometry = () => {
        // 创建月亮的几何体
        const moonGeometry = new THREE.SphereGeometry(3, 32, 16);
        const moonMaterial = new THREE.MeshBasicMaterial({ color: 0xf7f7f7 });
        // 创建月亮的网格
        moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
        // 设置月亮的位置和旋转角度
        moonMesh.position.set(10, 60, -200);

        const spotLight = new THREE.SpotLight(0xffffff, 6);
        spotLight.position.set(10, 60, -200);

        // 将月亮添加到场景中
        (threejs?.scene).add(moonMesh);
        (threejs?.scene).add(spotLight);
    };


    threejs = new Threejs({
        el: "app",
        isAxesHelper: true,
        orbitControls: true,
        cameraPosition: [0, 0, 0],
    });
    threejs!.controls!.target.set(0, 6, -40);
    (threejs!.renderer as any).toneMapping = THREE.ACESFilmicToneMapping; // 渲染器会使用该算法对渲染的图像进行色彩映射，以产生更加真实和逼真的视觉效果。
    (threejs.renderer as any).toneMappingExposure = 1; // 用于设置渲染器的色调映射曝光值

    createSky();
    createWater();
    createMTLLoader();
    createSpotLight();
    updateSun();
    render();
    createSphereGeometry();
}

const OceanSun = () => {
    useEffect(effect, [])
    return (
        <div id="app"></div>
    )
}


export default OceanSun;