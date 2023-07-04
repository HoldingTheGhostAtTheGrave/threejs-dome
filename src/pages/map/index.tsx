import { useEffect } from 'react';

import * as THREE from 'three';

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
            map.setFitView(polygon);//视口自适应
        }
    });
}

const effect = () => {
    let AMap = (window as any).AMap;

    // 创建折线对象
    const path = [
        [108.64, 19.09],
    ]
    const map = new AMap.Map('app', {
        center: path[0],
        zooms: [2, 20],
        zoom: 18,
        pitch: 45,
        viewMode: '3D', //开启3D视图,默认为关闭
        buildingAnimation: true,
    });


    let camera: any, renderer: any, scene: any, geometry: any;
    // 数据转换工具
    const customCoords = map.customCoords;
    // 添加卫星图层
    // const satelliteLayer = new AMap.TileLayer.Satellite();
    // map.add(satelliteLayer);
    // // 添加城市建筑图层
    // const roadNetLayer = new AMap.TileLayer.RoadNet();
    // map.add(roadNetLayer);

    map.on('complete', () => {
        district(AMap, map);
        const coords = customCoords.lngLatsToCoords([[108.499296, 18.972772]]);


        // 创建雨滴的几何体
        geometry = new THREE.BufferGeometry();
        const positions = [];
        for (var i = 0; i < 1000; i++) {
            var x = Math.random() * 130;
            var y = Math.random() * 100;
            var z = Math.random() * -300;
            positions.push(x, y, z);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        // 创建雨滴的材质
        const material = new THREE.PointsMaterial({ color: 0xccc });
        // 创建雨滴的点云对象
        const points = new THREE.Points(geometry, material);
        points.position.set(coords[0][0], coords[0][1], 0)
        points.scale.set(500, 500, 500);
        points.rotation.set(-100 , 0 ,0)
        scene.add(points);
    });

    // 天气预报
    AMap.plugin('AMap.Weather', function () {
        const weather = new AMap.Weather();
        weather.getLive('东方市', function (err: string, data: any) {
            console.log(data);
        });
    });

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
            camera.lookAt(...lookAt);
            camera.updateProjectionMatrix();
            renderer.render(scene, camera);
            renderer.resetState();

            if (geometry) {
                // 遍历所有雨滴的位置，使其向下移动
                const positions = geometry.attributes.position.array;
                for (let i = 1; i < positions.length; i += 3) {
                    positions[i] -= 0.5;
                    if (positions[i] < 0) {
                        positions[i] = 100;
                    }
                }
                // 更新雨滴的位置
                geometry.attributes.position.needsUpdate = true;
            }

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