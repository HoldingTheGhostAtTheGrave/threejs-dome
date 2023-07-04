import {
  lazy,
  Suspense,
} from 'react';

import Nprogress from '@/components/Nprogress';
import { RouteObjectCustomize } from '@/type/index.type';
import { AppstoreOutlined } from '@ant-design/icons';

const routes: RouteObjectCustomize[] = [
	{
		path: "/",
		label: "threeJS 案例列表",
		element: lazy(() => import("@/pages/layout")),
		icon: <AppstoreOutlined />,
		children: [
			
			{
				label: "3d 看房",
				index: true,
				element: lazy(() => import("@/pages/3d-vr-house-viewing")),
			},
			{
				path: "/car",
				label: "汽车",
				element: lazy(() => import("@/pages/index")),
			},
			{
				path: "/ocean",
				label: "海洋",
				element: lazy(() => import("@/pages/ocean-sun")),
			},
			{
				path: "/map",
				label: "地图",
				element: lazy(() => import("@/pages/map")),
			},
			{
				path: "/about",
				label: "关于我",
				element: lazy(() => import("@/pages/about")),
			},
		],
	},
];

// 处理动态路由
export const syncRouter = (
	table: RouteObjectCustomize[]
): RouteObjectCustomize[] => {
	let mRouteTable: RouteObjectCustomize[] = [];
	table.forEach((route: any) => {
		mRouteTable.push({
			index: route.index,
			path: route.path ?? '/',
			element: route.element && (
				<Suspense fallback={<Nprogress />}>
					<route.element />
				</Suspense>
			),
			icon: route.icon,
			label: route.label,
			children: route.children && syncRouter(route.children),
		});
	});
	return mRouteTable;
};

export default syncRouter(routes);
