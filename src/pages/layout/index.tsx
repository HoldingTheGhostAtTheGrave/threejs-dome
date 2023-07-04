import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import type { MenuProps } from 'antd';
import { Layout } from 'antd';
import {
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router';

import SiderComponents from '@/components/Sider';
import routes from '@/routes';
import { RouteObjectCustomize } from '@/type/index.type';

import layoutScss from './index.module.scss';

type MenuItem = Required<MenuProps>["items"][number];
const { Header, Sider, Content } = Layout;

function getItem(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[],
	type?: "group"
): MenuItem {
	return {
		key,
		icon,
		children,
		label,
		type,
	} as MenuItem;
}

const setItemsSider = (routes: RouteObjectCustomize[]): MenuProps["items"] => {
	return routes.map((element) => {
		return getItem(
			element.label,
			element.path || "",
			element.icon,
			element.children && setItemsSider(element.children)
		);
	});
};

const itemsSider: MenuProps["items"] = setItemsSider(routes);

const LayoutComponents = () => {
	const [activeKey, setActiveKey] = useState("");
	const [slideWidth, setSlideWidth] = useState("200");

	const location = useLocation();
	const navigate = useNavigate();

	const onMenuClick = useCallback((event: { key: string }) => {

		// if (event.key === location.pathname) {
		// 	return;
		// }
		navigate({ pathname: event.key });
		setActiveKey(event.key);
	}, []);
	useEffect(() => {
		setActiveKey(location.pathname);
	}, []);
	return (
		<div>
			<Layout>
				<Sider
					collapsedWidth='50'
					theme='light'
					className={layoutScss.sider}
					width={slideWidth}
				>
					<SiderComponents
						itemsSider={itemsSider}
						onMenuClick={onMenuClick}
						activeKey={activeKey}
					></SiderComponents>
				</Sider>
				<Layout>
					<Content>
						<Outlet></Outlet>
					</Content>
				</Layout>
			</Layout>
		</div>
	);
};

export default LayoutComponents;
