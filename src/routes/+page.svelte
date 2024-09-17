<script lang="ts">
	import TermSection from '$lib/components/term-section.svelte';
	import TermText from '$lib/components/term-text.svelte';
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
	main {
		width: 100%;
		height: 100%;
		padding: 1.5rem;
	}
</style>
