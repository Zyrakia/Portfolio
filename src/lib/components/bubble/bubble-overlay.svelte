<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Overlay from '../overlay.svelte';

	import MdiClose from '~icons/mdi/close';

	export let title: string;
	export let iconUrl: string | undefined = undefined;
	export let links: { text: string; url: string; external: boolean }[] = [];

	let visible = true;
	const close = () => (visible = false);

	const emit = createEventDispatcher();
	$: visible === false && emit('close');
</script>

<Overlay on:close>
	<div class="container">
		<div class="title-bar">
			{#if iconUrl}
				<div>
					<img src={iconUrl} alt={title} />
				</div>
			{/if}

			<h1>{title}</h1>
		</div>

		<div class="content">
			<slot />
		</div>

		<div class="links">
			<button class="btn" on:click={close}><MdiClose /></button>

			<div style="min-height: 100%; border: 1px solid darkgreen;"></div>

			{#each links as link}
				<a
					class="btn"
					href={link.url}
					target={link.external ? '_blank' : '_self'}
					rel={link.external ? 'noopener' : ''}>{link.text}</a
				>
			{/each}
		</div>
	</div>
</Overlay>

<style>
	.container {
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.title-bar {
		width: 100%;
		border-bottom: 2px solid darkgreen;

		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1rem;

		padding: 0.5rem;
	}

	.title-bar h1 {
		width: 100%;
	}

	.title-bar img {
		width: 64px;
		object-fit: contain;
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1rem;
	}

	.links a {
		text-decoration: none;
		color: initial;
	}

	.btn {
		position: relative;
		padding: 0.5rem 1rem;

		border: 1px solid darkgreen;
		border-radius: 2px;

		background: transparent;
		overflow: hidden;

		cursor: pointer;

		--gradient-color: darkgreen;
	}

	.btn::before {
		content: '';

		position: absolute;
		width: 100%;
		height: 100%;

		top: 0;
		bottom: 0;
		left: -100%;

		background: linear-gradient(90deg, transparent 0, var(--gradient-color) 100%);
		transition: all 300ms ease-in;
	}

	.btn:hover::before {
		--gradient-color: darkred;
		left: 100%;
	}

	.btn:active::before {
		left: 0;
	}

	.btn:hover {
		border-color: darkred;
	}

	.btn:active {
		transform: scale(0.95);
	}

	.content {
		padding: 0 0.5rem;
	}
</style>
