<script lang="ts">
	import type client_InteractiveBackground from '$lib/components/animated-background/animated-background.svelte';
	import '../reset.css';
	import '../global.css';

	import { onMount } from 'svelte';

	import BxErrorAlt from '~icons/bx/error-alt';
	import MdiGithub from '~icons/mdi/github';
	import PrimeTwitter from '~icons/prime/twitter';
	import IcRoundDiscord from '~icons/ic/round-discord';
	import TermSection from '$lib/components/term-section.svelte';
	import TermText from '$lib/components/term-text.svelte';

	let InteractiveBackground: typeof client_InteractiveBackground;
	onMount(async () => {
		InteractiveBackground = (
			await import('$lib/components/animated-background/animated-background.svelte')
		).default;
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Azeret+Mono:ital,wght@0,100..900;1,100..900&display=swap"
		rel="stylesheet"
	/>

	<title>Ole (Zyrakia) \\ Hello World</title>
	<meta
		name="description"
		content="I'm Ole, a german-born aspiring software developer, interested in everything computers."
	/>
</svelte:head>

<noscript>
	<div class="no-script-icon">
		<BxErrorAlt font-size="xx-large" color="red" />
		<h1>JavaScript is required.</h1>
	</div>
	<p class="no-script-text">
		This website makes use of JavaScript for core functionality. If JavaScript is unavailable, you can
		still reach me at these places:
	</p>
	<hr class="no-script-divider" />
	<ul>
		<li>
			<a href="https://github.com/zyrakia"><MdiGithub font-size={24} /> </a>
		</li>
		<li>
			<a href="https://x.com/zyrakia"><PrimeTwitter font-size={24} /> </a>
		</li>
		<li>
			<a href="https://discord.com/users/243522319664807937"><IcRoundDiscord font-size={24} /> </a>
		</li>
	</ul>
</noscript>

<svelte:component this={InteractiveBackground} />
<main>
	<TermSection title="Runtime Overview">
		<TermText text="Administrator: Ole (Zyrakia)" />
		<TermText text="Operating region: British Columbia, Canada" />
		<!-- <TermSectionDivider /> -->
		<div style="display: flex;">
			<TermText text="Status: obtaining CST diploma from BCIT" />
		</div>
	</TermSection>
</main>

<style>
	main,
	noscript {
		width: 100%;
		height: 100%;
		padding: 1.5rem;
	}

	noscript {
		position: absolute;
		left: 0;
		top: 0;

		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 1rem;

		text-align: center;
		background-color: #121212;
	}

	.no-script-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	@media (max-width: 800px) {
		.no-script-icon {
			flex-direction: column;
			gap: 0.5rem;
		}
	}

	.no-script-text {
		max-width: 800px;
	}

	.no-script-divider {
		width: 100%;
		max-width: 800px;
		opacity: 0.5;
	}

	ul {
		list-style: none;

		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	li {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	li:not(:last-of-type)::after {
		content: '//';
		padding-left: 1.5rem;
	}

	a {
		text-decoration: none;
		color: white;
		transition: all 150ms ease;
	}

	a:hover,
	a:active {
		color: gold;
		scale: 1.15;
	}
</style>
