<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	export let backgroundDim = 0.95;
	export let fadeMs = 300;

	const emit = createEventDispatcher();
	const close = () => emit('close');

	let overlayRef: HTMLDivElement | undefined;
	const handleKey = (e: KeyboardEvent) => {
		if (e.key === 'Escape') close();

		if (overlayRef !== undefined && document.activeElement === overlayRef) {
			if (e.key === ' ') close();
		}
	};

	let width = 0;
	let height = 0;
</script>

<svelte:window on:keydown={handleKey} />

<div
	bind:this={overlayRef}
	bind:clientWidth={width}
	bind:clientHeight={height}
	class="screen-overlay"
	style="background-color: rgba(0, 0, 0, {backgroundDim});"
	on:click={() => close()}
	on:keypress={handleKey}
	role="button"
	tabindex="0"
	transition:fade={{ duration: fadeMs }}
>
	<div class="container" on:click|stopPropagation on:keypress|stopPropagation role="button" tabindex="0">
		<div class="corner top left" style={`height: 100vh;`}></div>
		<div class="corner left top" style={`width: 100vw;`}></div>
		<div class="corner bottom right" style={`width: 100vw;`}></div>
		<div class="corner right bottom" style={`height: 100vh;`}></div>
		<div class="content">
			<slot />
		</div>
	</div>
</div>

<style>
	.screen-overlay {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;

		display: flex;
		align-items: center;
		justify-content: center;

		overflow: hidden;

		z-index: 100;
	}

	.container {
		position: relative;
		max-width: 90%;
		max-height: 80%;

		display: flex;
		align-items: center;
		justify-content: center;

		padding: 2.5rem;
	}

	.content {
		max-height: 60vh;
		overflow-y: auto;
	}

	.corner {
		position: absolute;
		border: 1px solid darkgreen;
		animation: green-color-flow 1s infinite alternate;
		animation-timing-function: cubic-bezier(0.99, 0.02, 0.66, 1.36);
	}

	.corner.top {
		top: 0;
	}

	.corner.left {
		left: 0;
	}

	.corner.bottom {
		bottom: 0;
	}

	.corner.right {
		right: 0;
	}

	@keyframes green-color-flow {
		0% {
			border-color: rgba(0, 100, 0, 0.3);
		}
		100% {
			border-color: rgba(0, 100, 0, 0.8);
		}
	}
</style>
