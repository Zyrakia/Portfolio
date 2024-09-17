<script lang="ts">
	import type client_InteractiveBackground from '$lib/components/animated-background/animated-background.svelte';
	import '../reset.css';
	import '../global.css';

	import { onMount } from 'svelte';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { browser } from '$app/environment';
	import NoScript from '$lib/components/no-script.svelte';

	let InteractiveBackground: typeof client_InteractiveBackground;
	onMount(async () => {
		InteractiveBackground = (
			await import('$lib/components/animated-background/animated-background.svelte')
		).default;
	});

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
			},
		},
	});
</script>

<QueryClientProvider client={queryClient}>
	<NoScript />

	<svelte:component this={InteractiveBackground} />

	<slot />
</QueryClientProvider>
