import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import icons from 'unplugin-icons/vite';

export default defineConfig({
	plugins: [sveltekit(), icons({ compiler: 'svelte', autoInstall: true })],
});
