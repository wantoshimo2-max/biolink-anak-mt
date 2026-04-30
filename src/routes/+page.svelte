<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import * as LucideIcons from 'lucide-svelte';
	import {
		Trophy,
		Zap,
		Gauge,
		Tv,
		LogIn,
		UserPlus,
		ArrowUpRight,
		ExternalLink
	} from 'lucide-svelte';
	import { enhance } from '$app/forms';

	let { data } = $props();
	// Gunakan data langsung agar reaktif di Svelte 5

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});

	// Function to get icon component by name
	function getIconComponent(name: string) {
		return (LucideIcons as any)[name] || LucideIcons.ExternalLink;
	}

	// Konfigurasi Salju (Ditingkatkan)
	const snowflakes = Array.from({ length: 60 }).map((_, i) => ({
		id: i,
		left: Math.random() * 100,
		duration: 4 + Math.random() * 10,
		delay: Math.random() * -20,
		size: 2 + Math.random() * 3,
		opacity: 0.4 + Math.random() * 0.5
	}));
</script>

<svelte:head>
	<title>{data.config?.siteTitle || 'Premium Bio Link'}</title>
	<meta name="description" content={data.config?.metaDescription || 'A modern glassmorphism bio link page'} />
	{#if data.config?.headerScripts}
		{@html data.config.headerScripts}
	{/if}
</svelte:head>

<div
	class="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] p-0"
>
	<!-- Background Gradients -->
	<div
		class="absolute -top-24 -left-24 h-96 w-96 animate-pulse rounded-full bg-red-600/20 blur-[120px]"
	></div>
	<div
		class="absolute -right-24 -bottom-24 h-96 w-96 animate-pulse rounded-full bg-red-900/20 blur-[120px]"
	></div>

	<!-- Snowfall Particles -->
	{#if mounted}
		<div class="pointer-events-none absolute inset-0 overflow-hidden">
			{#each snowflakes as snow}
				<div
					class="snowflake"
					style="
						left: {snow.left}%; 
						width: {snow.size}px; 
						height: {snow.size}px; 
						opacity: {snow.opacity};
						animation-duration: {snow.duration}s;
						animation-delay: {snow.delay}s;
					"
				></div>
			{/each}
		</div>
	{/if}

	<!-- Main Container -->
	<main
		class="relative flex h-screen w-full flex-col items-center overflow-y-auto scroll-smooth border-x border-white/10 bg-black/60 p-5 shadow-[0_0_60px_rgba(255,255,255,0.1)] backdrop-blur-2xl sm:max-w-[420px]"
	>
		{#if mounted}
			<!-- Header / Logo -->
			<div in:fly={{ y: -20, duration: 800, delay: 200 }} class="mb-4 flex flex-col items-center">
				<form action="?/trackClick" method="POST" use:enhance>
					<input type="hidden" name="target" value="logo" />
					<button type="submit" class="group relative mb-3 block h-24 w-24 cursor-pointer">
						<a href={data.config?.logoLink} target="_blank" rel="noopener noreferrer" class="block h-full w-full">
							<div
								class="absolute inset-0 bg-red-600 opacity-30 blur-md transition-opacity duration-500 group-hover:opacity-60"
							></div>
							<img
								src={data.config?.logoUrl}
								alt="Logo"
								class="relative h-full w-full object-contain"
							/>
						</a>
					</button>
				</form>
				<h1 class="flex items-center gap-2 text-xl font-bold tracking-tighter text-white uppercase">
					{data.config?.bioTitle || 'ArwanaGaming'}
				</h1>
				<p class="mt-0.5 px-4 text-center text-[11px] leading-relaxed font-light text-gray-400">
					{data.config?.bioDescription || 'Official Digital Gateway of Arwanagaming.'}
				</p>
			</div>

			<!-- Featured Image -->
			<div
				in:scale={{ start: 0.9, duration: 1000, delay: 400, easing: cubicOut }}
				class="group relative mb-6 h-[350px] w-[350px]"
			>
				<form action="?/trackClick" method="POST" use:enhance class="h-full w-full">
					<input type="hidden" name="target" value="featured_image" />
					<button type="submit" class="h-full w-full">
						<div
							class="absolute inset-0 bg-gradient-to-tr from-red-600/30 to-transparent blur-xl transition-all duration-700 group-hover:blur-2xl"
						></div>
						<div
							class="relative h-full w-full overflow-hidden rounded-lg border border-white/10 shadow-2xl"
						>
							<img
								src={data.config?.featuredImageUrl}
								alt="Featured"
								class="h-full w-full transform border object-cover transition-transform duration-1000 group-hover:scale-110"
							/>
							<div class="shine-overlay"></div>
							<div
								class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"
							></div>
						</div>
					</button>
				</form>
			</div>

			<!-- Auth Buttons -->
			<div in:fly={{ y: 20, duration: 800, delay: 600 }} class="mb-4 flex w-full flex-row gap-2">
				<form action="?/trackClick" method="POST" use:enhance class="flex-1">
					<input type="hidden" name="target" value="login_button" />
					<button type="submit" class="w-full">
						<a
							href={data.config?.loginLink}
							target="_blank"
							rel="noopener noreferrer"
							class="btn-shake flex transform cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-white bg-red-600 py-3 text-xs font-bold text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all duration-300 hover:bg-red-700 active:scale-95"
						>
							<LogIn size={16} />
							LOGIN
						</a>
					</button>
				</form>
				<form action="?/trackClick" method="POST" use:enhance class="flex-1">
					<input type="hidden" name="target" value="register_button" />
					<button type="submit" class="w-full">
						<a
							href={data.config?.registerLink}
							target="_blank"
							rel="noopener noreferrer"
							class="flex transform cursor-pointer items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 py-3 text-xs font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10 active:scale-95"
						>
							<UserPlus size={16} />
							DAFTAR
						</a>
					</button>
				</form>
			</div>

			<!-- Social Links Grid -->
			<div in:fly={{ y: 20, duration: 800, delay: 800 }} class="mb-6 grid w-full grid-cols-2 gap-2">
				{#each data.buttons as btn, i}
					{@const IconComp = getIconComponent(btn.icon)}
					<form action="?/trackClick" method="POST" use:enhance>
						<input type="hidden" name="target" value={`btn_${btn.name}`} />
						<button type="submit" class="w-full text-left">
							<a
								href={btn.link}
								target="_blank"
								rel="noopener noreferrer"
								class="group relative flex flex-row items-center justify-between overflow-hidden rounded-md border border-white/5 bg-white/5 px-4 py-3.5 transition-all duration-500 hover:border-white/20 hover:bg-white/[0.08]"
							>
								<span
									class="text-[10px] font-bold tracking-[0.1em] text-gray-300 uppercase transition-colors duration-300 group-hover:text-white"
								>
									{btn.name}
								</span>
								<div
									class="flex items-center justify-center text-gray-400 transition-colors duration-500 {btn.color} group-hover:scale-110"
								>
									<IconComp size={16} strokeWidth={2} />
								</div>
							</a>
						</button>
					</form>
				{/each}
			</div>

			<!-- Footer -->
			<footer
				in:fade={{ duration: 1000, delay: 1000 }}
				class="mt-auto w-full border-t border-white/5 pt-4 pb-4 text-center"
			>
				<p class="text-[10px] font-medium tracking-[0.4em] text-gray-500 uppercase">
					{@html data.config?.footerText || '&copy; 2026 ARWANAGAMING <span class=" text-red-600">|</span> BOS SANDI'}
				</p>
			</footer>
		{/if}
	</main>
</div>

<style>
	/* Animasi Kilauan (Shine) Diagonal */
	@keyframes shine {
		0% {
			transform: translate(100%, 100%) rotate(45deg);
		}
		35%,
		100% {
			transform: translate(-100%, -100%) rotate(45deg);
		}
	}

	.shine-overlay {
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: linear-gradient(
			to right,
			transparent,
			rgba(255, 255, 255, 0.05) 40%,
			rgba(255, 255, 255, 0.4) 50%,
			rgba(255, 255, 255, 0.05) 60%,
			transparent
		);
		transform: translate(100%, 100%) rotate(45deg);
		animation: shine 4s infinite cubic-bezier(0.3, 0, 1, 1);
		pointer-events: none;
		z-index: 10;
	}

	/* Memastikan container gambar adalah context untuk z-index */
	.group {
		isolation: isolate;
	}

	/* Animasi Goyang Tombol Login */
	@keyframes periodic-shake {
		0%,
		70%,
		100% {
			transform: rotate(0deg) scale(1);
		}
		75%,
		85%,
		95% {
			transform: rotate(-2deg) scale(1.02);
		}
		80%,
		90% {
			transform: rotate(2deg) scale(1.02);
		}
	}

	.btn-shake {
		animation: periodic-shake 3s infinite ease-in-out;
	}

	/* Animasi Salju Berjatuhan */
	@keyframes fall {
		0% {
			transform: translateY(-10vh) translateX(0);
		}
		25% {
			transform: translateY(25vh) translateX(15px);
		}
		50% {
			transform: translateY(50vh) translateX(-15px);
		}
		75% {
			transform: translateY(75vh) translateX(15px);
		}
		100% {
			transform: translateY(110vh) translateX(0);
		}
	}

	.snowflake {
		position: absolute;
		top: -10px;
		background: white;
		border-radius: 50%;
		box-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
		animation: fall linear infinite;
		z-index: 99;
	}

	:global(body) {
		background-color: #050505;
		margin: 0;
		padding: 0;
		font-family: 'Inter', sans-serif;
	}

	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
