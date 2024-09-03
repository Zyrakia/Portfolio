<script lang="ts">
	import { onDestroy } from 'svelte';
	import Typewriter from './typewriter.svelte';

	export let text: string;
	export let done = false;
	export let animTickDelay = 200;

	let elipsis = '...';
	const tickElipsis = () => (elipsis.length >= 3 ? (elipsis = '') : (elipsis += '.'));

	let interval: number | undefined;
	const startElipsisTick = () => {
		if (interval !== undefined) return;
		interval = setInterval(tickElipsis, animTickDelay);
	};

	const stopElipsisTick = () => {
		if (interval === undefined) return;
		clearInterval(interval);
		interval = undefined;
	};

	$: if (done) {
		stopElipsisTick();
	} else {
		startElipsisTick();
	}

	onDestroy(stopElipsisTick);
</script>

{#if done}
	<slot />
{:else}
	<Typewriter text={text + elipsis} />
{/if}
