<script lang="ts">
	import TermLinkText from '$lib/components/term-link-text.svelte';
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
	<TermText text="This website is under active development and will gain more features in the future." />

	<br />

	<TermSection title="Runtime Overview">
		<TermText text="Administrator: Ole (Zyrakia)" />
		<TermText text="Operating region: British Columbia, Canada" />
		<!-- <TermSectionDivider /> -->
		<div style="display: flex;">
			<TermText text="Status: obtaining CST diploma from BCIT" />
		</div>
	</TermSection>

	<br />

	<TermSection title="Navigation">
		<TermLinkText text="Projects" url="/projects" />
		<TermLinkText text="Technologies" url="/tech" />
	</TermSection>
</main>

<style>
	main {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		padding: 1.5rem;
	}
</style>
