/// <reference types="vite/client" />
import { ReactNode } from 'react';

import { RouteObject } from 'react-router';
import {
  Camera,
  Renderer,
  Scene,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface RouteObjectCustomizeChildren extends RouteObjectCustomize {}

// 配置路由的类型
export interface RouteObjectCustomize extends RouteObject {
	label?: string;
	path?: string;
	icon?: ReactNode;
	children?: RouteObjectCustomizeChildren[];
}

declare module './random-rectangle' // declare module 'xxx'路径或者模块名

interface ThreejsType {
    scene:Scene,
    controls:OrbitControls,
    camera:Camera,
    renderer:Renderer
}


type proThreejsType<T> = {
    [P in keyof T]: any
}
