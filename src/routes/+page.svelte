<script lang="ts">
	import '../reset.css';
	import '../global.css';

	import GithubIcon from '~icons/bi/github';
	import XIcon from '~icons/bi/twitter-x';
	import DiscordIcon from '~icons/bi/discord';
</script>

<svelte:head>
	<title>Ole (Zyrakia) \\ Hello World</title>

	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Azeret+Mono:ital,wght@0,100..900;1,100..900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<main>
	<h1>✨ Construction Underway ✨</h1>
	<p>For now, you can catch me here:</p>
	<ul>
		<li><a href="https://github.com/zyrakia"><GithubIcon font-size={24} color="inherit" /> </a></li>
		<li><a href="https://twitter.com/zyrakia"><XIcon font-size={24} color="inherit" /> </a></li>
		<li>
			<a href="https://discord.com/users/243522319664807937"
				><DiscordIcon font-size={24} color="inherit" /></a
			>
		</li>
	</ul>
</main>

<style>
	main {
		height: 100%;
		padding: 5rem;

		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 1rem;

		text-align: center;
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
		transition: color 150ms ease;
	}

	a:hover, a:active {
		color: gold;
	}
</style>
