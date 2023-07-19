import {
  lazy,
  Suspense,
} from 'react';

import Nprogress from '@/components/Nprogress';
import { RouteObjectCustomize } from '@/vite-env';
import { AppstoreOutlined } from '@ant-design/icons';

const routes: RouteObjectCustomize[] = [
	{
		path: "/",
		label: "three",
		element: lazy(() => import("@/pages/layout")),
		icon: <AppstoreOutlined />,
		children: [
			{
				label: "不好看房",
				index: true,
				element: lazy(() => import("@/pages/3d-vr-house-viewing")),
			},
			{
				path: "/car",
				label: "很小汽车",
				element: lazy(() => import("@/pages/index")),
			},
			{
				path: "/ocean",
				label: "日出夕颜",
				element: lazy(() => import("@/pages/ocean-sun")),
			},
			{
				path: "/map",
				label: "看看世界",
				element: lazy(() => import("@/pages/map")),
			},
			{
				path: "/water",
				label: "不一样的水",
				element: lazy(() => import("@/pages/water")),
			},
			{
				path: "/about",
				label: "看看我",
				element: lazy(() => import("@/pages/about")),
			},
			{
				path: "/architecture",
				label: "建筑",
				element: lazy(() => import("@/pages/architecture")),
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
