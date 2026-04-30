<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { enhance } from '$app/forms';
	import { toggleMode } from 'mode-watcher';
	import { Sun, Moon } from 'lucide-svelte';

	let { form } = $props();
</script>

<div class="fixed top-4 right-4">
	<Button variant="outline" size="icon" onclick={toggleMode}>
		<Sun
			class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
		/>
		<Moon
			class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
		/>
		<span class="sr-only">Toggle theme</span>
	</Button>
</div>

<form method="POST" action="?/login" use:enhance>
	<div class="flex h-screen w-full items-center justify-center">
		<Card.Root class="-my-4 w-full max-w-sm">
			<Card.Header>
				<Card.Title>Login</Card.Title>
				<Card.Description>Masukan user dan pass anda</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="flex flex-col gap-6">
					{#if form?.message}
						<div
							class="rounded-md border border-destructive/20 bg-destructive/15 p-3 text-sm text-destructive"
						>
							{form.message}
						</div>
					{/if}
					<div class="grid gap-2">
						<Label for="username">Username</Label>
						<Input
							id="username"
							name="username"
							type="text"
							placeholder="Masukan username anda"
							required
						/>
					</div>
					<div class="grid gap-2">
						<div class="flex items-center">
							<Label for="password">Password</Label>
						</div>
						<Input
							id="password"
							name="password"
							type="password"
							placeholder="Masukan password anda"
							required
						/>
					</div>
				</div>
			</Card.Content>
			<Card.Footer class="flex-col gap-2">
				<Button type="submit" class="w-full">Login</Button>
			</Card.Footer>
		</Card.Root>
	</div>
</form>
