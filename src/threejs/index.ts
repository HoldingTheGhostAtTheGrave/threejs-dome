import * as THREE from 'three';
import {
  Camera,
  Renderer,
  Scene,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface threeQuery {
	el: string;
	isAxesHelper: boolean;
	orbitControls: boolean;
	cameraPosition?:Array<number>
}


export class Threejs {
	scene: Scene | null = null;
	renderer: Renderer | null = null;
	camera: Camera | null = null;
	isAxesHelper: boolean;
	controls: OrbitControls | null = null;
	el: HTMLElement | null;
	orbitControls = false;
	cameraPosition:number[] = [];
	constructor({ el, isAxesHelper = false, orbitControls = false , cameraPosition }: threeQuery) {
		this.isAxesHelper = isAxesHelper;
		this.el = document.getElementById(el);
        this.cameraPosition = cameraPosition || [0, 0, 0];
		this.orbitControls = orbitControls;
		this._init();
        window.addEventListener('resize',() =>  this.resize());

	}
	// 初始化
	_init() {
		this.createScene();
		this.createCamera();
		this.createRenderer();
	}
	// 创建场景
	createScene() {
		this.scene = new THREE.Scene();
		// this.scene.background = new THREE.Color(0xcccccc);
		if (this.isAxesHelper) {
			// 添加坐标
			const axesHelper = new THREE.AxesHelper(10);
			this.scene.add(axesHelper);
		}
	}
	resize(){
        this.renderer!.setSize(this.el!.offsetWidth, this.el!.offsetHeight);
        this.renderer!.render(this.scene as any, this.camera as any);
		// 更新相机的纵横比
		(this.camera as any).aspect = window.innerWidth / window.innerHeight;
		(this.camera as any).updateProjectionMatrix();
    }
	// 创建相机
	createCamera() {
		this.camera = new THREE.PerspectiveCamera(
			75,
			(this.el as HTMLDivElement).offsetWidth /
				(this.el as HTMLDivElement).offsetHeight,
			0.1,
			1000
		);
        this.camera.position.set(this.cameraPosition[0],this.cameraPosition[1],this.cameraPosition[2]);
	}
	// 创建渲染器
	createRenderer() {
		this.renderer = new THREE.WebGLRenderer({
			antialias: false,
		});
		this.renderer.setSize(
			(this.el as HTMLDivElement).offsetWidth,
			(this.el as HTMLDivElement).offsetHeight
		);
		this.renderer.render(this.scene as Scene, this.camera as Camera);
		// (this.renderer as any).outputEncoding = THREE.sRGBEncoding; // 设置为内光 大型模型内观看适用
		(this.renderer as any).setPixelRatio(window.devicePixelRatio);

		(this.el as HTMLElement).appendChild(this.renderer.domElement);
		this.orbitControls && this.creacteOrbitControls();
	}
	// 添加控制器
	creacteOrbitControls() {
		this.controls = new OrbitControls(
			this.camera as Camera,
			(this.renderer as any).domElement
		);
		this.controls.enableDamping = true;
		this.controls.maxDistance = 9;
		this.controls.update();
	}
	// render
	render(callback?:() => void){
		this.controls?.update?.();
        (this.camera as any ).updateProjectionMatrix();
        this.renderer!.render(this.scene as any, this.camera as any);
        requestAnimationFrame(() => this.render(callback));
		callback?.();
	}
}
