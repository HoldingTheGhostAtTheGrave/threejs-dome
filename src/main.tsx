import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import ReactDOM from 'react-dom';

import { BrowserRouter } from 'react-router-dom';

import App from './App';

// const vConsole = new VConsole();
// 或者使用配置参数来初始化，详情见文档
// const vConsole = new VConsole({ theme: 'dark' });

ReactDOM.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
	document.getElementById("root")
);
