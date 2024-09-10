<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy } from 'svelte';

	export let text: string;
	export let renderAsHtml = false;
	export let charPerSecond = 15;

	let renderedText = '';

	const computeNextRenderedText = () => {
		let targetRenderedChars = 1;
		for (let i = 0; i < text.length; i++) {
			targetRenderedChars++;
			if (text[i] !== renderedText[i]) break;
		}

		return text.slice(0, Math.min(text.length, targetRenderedChars));
	};

	const renderTick = () => {
		if (text === renderedText) return;
		renderedText = computeNextRenderedText();
	};

	let renderTicker: number | undefined;
	const startRender = (interval: number) => {
		if (!browser) return;
		stopRender();
		renderTicker = setInterval(renderTick, interval);
	};

	const stopRender = () => {
		if (renderTicker === undefined) return;
		clearInterval(renderTicker);
		renderTicker = undefined;
	};

	$: startRender(1000 / charPerSecond);
	onDestroy(stopRender);
</script>

<p>
	{#if renderAsHtml}
		{@html renderedText}
	{:else}
		{renderedText}
	{/if}
</p>
