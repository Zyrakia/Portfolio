<script lang="ts">
	import type client_InteractiveBackground from '$lib/components/konva/animated-background/animated-background.svelte';
	import '../reset.css';
	import '../global.css';

	import { onMount } from 'svelte';
	import NoScript from '$lib/components/no-script.svelte';

	let InteractiveBackground: typeof client_InteractiveBackground;
	onMount(async () => {
		InteractiveBackground = (
			await import('$lib/components/konva/animated-background/animated-background.svelte')
		).default;
	});
</script>

<NoScript />

<svelte:component this={InteractiveBackground} />

<slot />
