/// <reference types="vite/client" />

import {
  Camera,
  Renderer,
  Scene,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface ThreejsType {
    scene:Scene,
    controls:OrbitControls,
    camera:Camera,
    renderer:Renderer
}


type proThreejsType<T> = {
    [p in keyof T]: any
}