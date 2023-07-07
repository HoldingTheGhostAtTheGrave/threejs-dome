import { useEffect } from 'react';

import * as THREE from 'three';

import { createMaterial } from './rain-material.js';
import { createGeomerty } from './random-rectangle.js';

const district = (AMap: any, map: any) => {
    const district = new AMap.DistrictSearch({
        subdistrict: 0,   //获取边界不需要返回下级行政区
        extensions: 'all',  //返回行政区边界坐标组等具体信息
        level: 'district'  //查询行政级别为 市
    });
    district.search('东方市', function (status: string, result: any) {
        if (status === 'complete') {
            const data = result.districtList[0].boundaries;
            for (let i = 0; i < data.length; i += 1) {//构造MultiPolygon的path
                data[i] = [data[i]]
            }
            const polygon = new AMap.Polygon({
                strokeWeight: 1,
                path: data,
                fillOpacity: 0.2,
                fillColor: '#80d8ff',
                strokeColor: '#0091ea'
            });
            map.add(polygon)
            // map.setFitView(polygon);//视口自适应
        }
    });
}

const effect = () => {
    let AMap = (window as any).AMap;

    // 创建折线对象
    const path = [
        [121.730822, 39.013415],
    ];


    var clock = new THREE.Clock();

    const localhostPaths = [
        [121.722157, 39.02801],
        [121.739981, 39.033793],
        [121.745269, 39.027206],
        [121.74945, 39.028461],
        [121.752733, 39.024014],
        [121.749324, 39.021794],
        [121.751034, 39.019229],
        [121.753729, 39.020563],
        [121.753967, 39.019599],
        [121.751629, 39.018262],
        [121.753351, 39.016055],
        [121.757478, 39.017193],
        [121.757986, 39.015286],
        [121.755388, 39.013853],
        [121.757685, 39.010465],
        [121.762778, 39.012196],
        [121.764063, 39.010701],
        [121.748387, 39.003794],
        [121.746424, 39.006141],
        [121.744005, 39.005549],
        [121.741356, 39.005996],
        [121.735256, 39.002426],
        [121.726832, 39.002952],
        [121.721497, 39.003529],
        [121.717279, 39.005626],
        [121.706772, 39.003177],
        [121.702581, 39.001835],
        [121.706005, 39.004367],
        [121.710328, 39.006425],
        [121.713933, 39.015368],
        [121.708567, 39.016179],
        [121.70671, 39.012272],
        [121.70486, 39.011307],
        [121.7041, 39.013593],
        [121.705859, 39.017871],
        [121.707622, 39.018352],
        [121.710776, 39.026444],
        [121.72156, 39.027896]
    ];

    const map = new AMap.Map('app', {
        center: path[0],
        viewMode: '3D',
        pitch: 50,
        rotation: -35,
        // 隐藏默认楼块
        features: ['bg', 'road', 'point'],
        mapStyle: 'amap://styles/light',
        layers: [
            // 高德默认标准图层
            new AMap.TileLayer.Satellite(),
            // 楼块图层
            new AMap.Buildings({
                zooms: [16, 18],
                zIndex: 10,
                heightFactor: 2 //2倍于默认高度，3D下有效
            })
        ],
        zoom: 14,
    });


    let camera: any, renderer: any, scene: any ,materialAll: any;
    // 数据转换工具
    const customCoords = map.customCoords;

    map.on('complete', () => {

        const polygon = new AMap.Polygon({
            strokeWeight: 1,
            path: localhostPaths,
            fillOpacity: 0.2,
            fillColor: '#80d8ff',
            strokeColor: '#0091ea'
        });
        map.add(polygon);

        createRain();
    });


    //创建雨
    function createRain() {

        const geometry = createGeomerty();
        const material = createMaterial();
        materialAll = material;
        var mesh = new THREE.Mesh(geometry, material);
        const coords = customCoords.lngLatsToCoords([121.727491,39.014097]);

        mesh.scale.set(0.6,0.6,0.5);


        mesh.position.set(coords[0][0], coords[0][1],0);
        mesh.rotation.x = Math.PI / 2.2

        scene.add(mesh);

        return mesh;
    }

   
    

    // 天气预报
    AMap.plugin('AMap.Weather', function () {
        const weather = new AMap.Weather();
        weather.getLive('东方市', function (err: string, data: any) {
            console.log(data);
        });
    });
    let time  =0;

    let gllayer = new AMap.GLCustomLayer({
        zIndex: 10,
        init: (gl: any) => {
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 100, 1 << 30);
            renderer = new THREE.WebGLRenderer({ context: gl }); // 地图的 gl 上下文 
            renderer.autoClear = false; // 自动清空画布这里必须设置为 false，否则地图底图将无法显示
            scene = new THREE.Scene();

        },
        render: () => {


            renderer.resetState();
            customCoords.setCenter([116.52, 39.79]);
            const { near, far, fov, up, lookAt, position } = customCoords.getCameraParams();

            
            camera.near = near;
            camera.far = far;
            camera.fov = fov;
            camera.position.set(...position);
            camera.up.set(...up);


            if(materialAll && materialAll.uniforms){
                time = (time + clock.getDelta() * 0.4) % 1;
                materialAll.uniforms.time.value = time;
            }

            camera.lookAt(...lookAt);
            camera.updateProjectionMatrix();

            renderer.render(scene, camera);
            renderer.resetState();

            
        },
    });

    map.add(gllayer);
    // 监听地图点击事件
    map.on('click', function (e: { lnglat: { getLng: () => number, getLat: () => number } }) {
        // 获取点击位置的经纬度坐标
        const lnglat = e.lnglat;
        const lng = lnglat.getLng(); // 经度
        const lat = lnglat.getLat(); // 纬度
        // 在控制台输出经纬度信息
        console.log('点击位置经度：', lng);
        console.log('点击位置纬度：', lat);

    });

    // 动画
    function animate() {
        map.render();
        
        requestAnimationFrame(animate);
    }
    animate();



}

const MapCar = () => {
    useEffect(effect, []);
    return (
        <div id='app'></div>
    )
}


export default MapCar;
