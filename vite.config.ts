import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';

const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		open: true,
		port: 3005,
		host: "0.0.0.0",
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
