<script lang="ts">
	import Konva from 'konva';
	import { onDestroy } from 'svelte';
	import { Rect } from 'svelte-konva';

	let ref: Konva.Rect | undefined;
	export let width: number;
	export let height: number;
	export let color: string;
	export let blur = 1;
	export let flicker = true;
	export let flickerSpeed = 0.1;
	export let flickerRandomness = -0.175;

	let flickerInterval: number | undefined;
	const flickerTick = () => {
		if (!ref) return;

		const newBlur = blur + Math.random() * flickerRandomness;
		ref.to({
			ease: Konva.Easings.EaseInOut,
			duration: flickerSpeed,
			fillRadialGradientStartRadius: Math.max(width, height) * newBlur,
		});
	};

	const startFlicker = () => {
		if (flickerInterval !== undefined) return;
		flickerInterval = setInterval(flickerTick, flickerSpeed * 1000);
	};

	const stopFlicker = () => {
		if (flickerInterval === undefined) return;
		clearInterval(flickerInterval);
		flickerInterval = undefined;
	};

	$: if (ref) {
		if (flicker) startFlicker();
		else stopFlicker();
	}

	onDestroy(() => stopFlicker());
</script>

<Rect
	bind:handle={ref}
	config={{
		width,
		height,
		fillRadialGradientStartPoint: { x: width / 2, y: height / 2 },
		fillRadialGradientEndPoint: { x: width / 2, y: height / 2 },
		fillRadialGradientStartRadius: Math.max(width, height) * blur,
		fillRadialGradientColorStops: [0, color, 1, 'transparent'],
	}}
/>
