<script lang="ts">
	import BxErrorAlt from '~icons/bx/error-alt';
	import MdiGithub from '~icons/mdi/github';
	import PrimeTwitter from '~icons/prime/twitter';
	import IcRoundDiscord from '~icons/ic/round-discord';
</script>

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

<style>
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
