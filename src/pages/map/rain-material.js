// 创建雨材质
import * as THREE from 'three';

export function createMaterial(materialAll) {

    const material = new THREE.MeshBasicMaterial({
        color: '#fff',
        transparent: true,
        opacity: 0.5,

        depthWrite: false,
    });

    material.onBeforeCompile = function (shader, renderer) {
        const getFoot = `
            uniform float top;
            uniform float bottom;
            uniform float time;
            uniform mat3 rotationMatrix;

            #include <common>
            float angle(float x, float y){
            return atan(y, x);
            }
            vec2 getFoot(vec2 camera,vec2 normal,vec2 pos){
            vec2 position;

            float distanceLen = distance(pos, normal);

            float a = angle(camera.x - normal.x, camera.y - normal.y);

            pos.x > normal.x ? a -= 0.785 : a += 0.785;

            position.x = cos(a) * distanceLen;
            position.y = sin(a) * distanceLen;

            return position + normal;
        }
        `;
        const begin_vertex = `
            vec2 foot = getFoot(vec2(cameraPosition.x, cameraPosition.z),  vec2(normal.x, normal.z), vec2(position.x, position.z));
            // 计算目标当前高度
            float height = top - bottom;
            // 落地后重新开始，保持运动循环
            float y = normal.y - bottom - height * time;
            y = y + (y < 0.0 ? height : 0.0);
            // 利用自由落体公式计算目标高度
            float ratio = (1.0 - y / height) * (1.0 - y / height);
            y = height * (1.0 - ratio);
            // debuge: 水平面上朝着z轴匀速移动
            float z = foot.y + 1200.0 * ratio;
            // 调整坐标参考值
            y += bottom;
            y += position.y - normal.y;
            // 生成变换矩阵
            vec3 transformed = vec3(  foot.x , y, z) ; 
        `;
        shader.vertexShader = shader.vertexShader.replace(
            "#include <common>",
            getFoot
        );
        shader.vertexShader = shader.vertexShader.replace(
            "#include <begin_vertex>",
            begin_vertex
        );

        shader.uniforms.cameraPosition = {
            value: new THREE.Vector3(0, 200, 0),
        };
        shader.uniforms.top = {
            value: 4000,
        };
        shader.uniforms.bottom = {
            value: -1000,
        };
        shader.uniforms.time = {
            value: 0,
        };

        material.uniforms = shader.uniforms;

    };

    return material
}