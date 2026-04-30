<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { 
        Eye, MousePointerClick, Activity, LayoutDashboard, 
        LogOut, Settings, Trash2, Save, Plus, ImageIcon
    } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import ImageUpload from '$lib/components/ImageUpload.svelte';

	let { data, form } = $props();
	// Gunakan data langsung agar reaktif di Svelte 5

    let editingButton = $state<any>(null);

    // Custom enhance function to handle toasts and prevent form reset
    const handleEnhance = ({ action }: { action: URL }) => {
        const actionName = action.searchParams.get('/') || action.search.split('?/')[1] || 'Action';
        return async ({ result, update }: { result: any, update: any }) => {
            if (result.type === 'success') {
                toast.success('Berhasil menyimpan perubahan!');
                // Prevent form from resetting and clearing inputs
                await update({ reset: false });
                // Ensure data is fresh
                await invalidateAll();
                
                // If it was a button save, clear the edit state
                if (action.search.includes('saveButton') || action.search.includes('deleteButton')) {
                    editingButton = null;
                }
            } else if (result.type === 'failure' || result.type === 'error') {
                toast.error(result.data?.message || 'Terjadi kesalahan saat menyimpan.');
            } else {
                await update();
            }
        };
    };

    function startAddButton() {
        editingButton = { name: '', link: '', icon: 'ExternalLink', color: 'hover:text-white', order: data.buttons.length + 1, isActive: true };
    }

    function startEditButton(btn: any) {
        editingButton = { ...btn };
    }
</script>

<div class="min-h-screen bg-background p-6">
	<div class="mx-auto max-w-6xl space-y-8">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<div class="rounded-lg bg-primary p-2 text-primary-foreground">
					<LayoutDashboard size={24} />
				</div>
				<div>
					<h1 class="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
					<p class="text-muted-foreground text-sm">Manage your bio link and view analytics</p>
				</div>
			</div>
			<form action="/login?/logout" method="POST">
				<Button variant="outline" type="submit" class="flex items-center gap-2">
					<LogOut size={16} />
					Logout
				</Button>
			</form>
		</div>

		<Tabs.Root value="analytics" class="w-full">
			<Tabs.List class="grid w-full max-w-[400px] grid-cols-2">
				<Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
				<Tabs.Trigger value="config">Configuration</Tabs.Trigger>
			</Tabs.List>

			<!-- Analytics Tab -->
			<Tabs.Content value="analytics" class="space-y-6 pt-6">
				<!-- Stats Grid -->
				<div class="grid gap-4 md:grid-cols-3">
					<Card.Root>
						<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
							<Card.Title class="text-sm font-medium">Total Views</Card.Title>
							<Eye class="text-muted-foreground h-4 w-4" />
						</Card.Header>
						<Card.Content>
							<div class="text-2xl font-bold">{data.stats.totalViews}</div>
							<p class="text-muted-foreground text-xs">Total page visits</p>
						</Card.Content>
					</Card.Root>

					<Card.Root>
						<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
							<Card.Title class="text-sm font-medium">Total Clicks</Card.Title>
							<MousePointerClick class="text-muted-foreground h-4 w-4" />
						</Card.Header>
						<Card.Content>
							<div class="text-2xl font-bold">{data.stats.totalClicks}</div>
							<p class="text-muted-foreground text-xs">Clicks on all buttons</p>
						</Card.Content>
					</Card.Root>

					<Card.Root>
						<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
							<Card.Title class="text-sm font-medium">CTR (Approx)</Card.Title>
							<Activity class="text-muted-foreground h-4 w-4" />
						</Card.Header>
						<Card.Content>
							<div class="text-2xl font-bold">
								{data.stats.totalViews > 0
									? ((Number(data.stats.totalClicks) / Number(data.stats.totalViews)) * 100).toFixed(1)
									: 0}%
							</div>
							<p class="text-muted-foreground text-xs">Click-through rate</p>
						</Card.Content>
					</Card.Root>
				</div>

				<div class="grid gap-6 md:grid-cols-2">
					<!-- Clicks by Target -->
					<Card.Root>
						<Card.Header>
							<Card.Title>Detailed Button Analytics</Card.Title>
							<Card.Description>Click counts per button/link</Card.Description>
						</Card.Header>
						<Card.Content>
							<Table.Root>
								<Table.Header>
									<Table.Row>
										<Table.Head>Target Button</Table.Head>
										<Table.Head class="text-right">Total Click</Table.Head>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{#each data.stats.clicksByTarget as item}
										<Table.Row>
											<Table.Cell class="font-medium">
												<Badge variant={item.target.includes('login') ? 'default' : 'outline'} class="capitalize">
													{item.target.replace('btn_', '').replace('_', ' ')}
												</Badge>
											</Table.Cell>
											<Table.Cell class="text-right font-bold text-primary">{item.count}</Table.Cell>
										</Table.Row>
									{/each}
                                    {#if data.stats.clicksByTarget.length === 0}
                                        <Table.Row>
                                            <Table.Cell colspan={2} class="text-center text-muted-foreground py-8">
                                                No clicks recorded yet.
                                            </Table.Cell>
                                        </Table.Row>
                                    {/if}
								</Table.Body>
							</Table.Root>
						</Card.Content>
					</Card.Root>

					<!-- Recent Activity -->
					<Card.Root>
						<Card.Header>
							<Card.Title>Live Activity Log</Card.Title>
							<Card.Description>Recent views and interactions</Card.Description>
						</Card.Header>
						<Card.Content>
							<div class="space-y-4">
								{#each data.recentActivity as log}
									<div class="flex items-center justify-between border-b border-muted pb-2 last:border-0">
										<div class="flex flex-col">
											<span class="text-sm font-medium capitalize">{log.type}</span>
											<span class="text-muted-foreground text-xs">
												{log.target === 'page'
													? 'Viewed Bio Page'
													: `Clicked ${log.target.replace('btn_', '')}`}
											</span>
										</div>
										<div class="text-right">
											<span class="text-xs text-gray-500">
												{new Date(log.timestamp).toLocaleTimeString()}
											</span>
										</div>
									</div>
								{/each}
                                {#if data.recentActivity.length === 0}
                                    <p class="text-center text-muted-foreground py-8">No activity yet.</p>
                                {/if}
							</div>
						</Card.Content>
					</Card.Root>
				</div>
			</Tabs.Content>

			<!-- Configuration Tab -->
			<Tabs.Content value="config" class="space-y-8 pt-6">
				<!-- Bio Config Form -->
				<Card.Root>
					<Card.Header>
						<div class="flex items-center justify-between">
							<div>
								<Card.Title>Master Configuration</Card.Title>
								<Card.Description>Global settings for your Bio Link page</Card.Description>
							</div>
							<Settings class="text-muted-foreground h-5 w-5" />
						</div>
					</Card.Header>
					<Card.Content>
						<form action="?/updateConfig" method="POST" enctype="multipart/form-data" use:enhance={handleEnhance} class="space-y-6">
							<div class="grid gap-6 md:grid-cols-2">
								<div class="space-y-4">
									<div class="space-y-2">
										<Label for="siteTitle">Site Title (SEO)</Label>
										<Input id="siteTitle" name="siteTitle" value={data.config?.siteTitle} />
									</div>
									<div class="space-y-2">
										<Label for="metaDescription">Meta Description</Label>
										<Input id="metaDescription" name="metaDescription" value={data.config?.metaDescription} />
									</div>
									<div class="space-y-2">
										<Label for="bioTitle">Bio Title</Label>
										<Input id="bioTitle" name="bioTitle" value={data.config?.bioTitle} />
									</div>
									<div class="space-y-2">
										<Label for="bioDescription">Bio Description</Label>
										<Input id="bioDescription" name="bioDescription" value={data.config?.bioDescription} />
									</div>
								</div>

								<div class="grid grid-cols-2 gap-4">
									<ImageUpload label="Logo Image" name="logoUrl" bind:value={data.config.logoUrl} />
									<ImageUpload label="Featured Image (Profile)" name="featuredImageUrl" bind:value={data.config.featuredImageUrl} />
								</div>
							</div>

							<div class="grid gap-4 md:grid-cols-2">
								<div class="space-y-2">
									<Label for="logoLink">Logo Click Link</Label>
									<Input id="logoLink" name="logoLink" value={data.config?.logoLink} />
								</div>
								<div class="space-y-2">
									<Label for="footerText">Footer Text (HTML supported)</Label>
									<Input id="footerText" name="footerText" value={data.config?.footerText} />
								</div>
								<div class="space-y-2">
									<Label for="loginLink">LOGIN Button Link</Label>
									<Input id="loginLink" name="loginLink" value={data.config?.loginLink} />
								</div>
								<div class="space-y-2">
									<Label for="registerLink">REGISTER Button Link</Label>
									<Input id="registerLink" name="registerLink" value={data.config?.registerLink} />
								</div>
							</div>
							<div class="space-y-2">
								<Label for="headerScripts">Header Scripts (Pixel/Analytics)</Label>
								<Textarea id="headerScripts" name="headerScripts" rows={4} value={data.config?.headerScripts} placeholder="<script>...</script>" />
							</div>
							<div class="flex justify-end">
								<Button type="submit" class="flex items-center gap-2">
									<Save size={16} />
									Save Configuration
								</Button>
							</div>
						</form>
					</Card.Content>
				</Card.Root>

				<!-- Buttons Management -->
				<Card.Root>
					<Card.Header>
						<div class="flex items-center justify-between">
							<div>
								<Card.Title>Custom Buttons</Card.Title>
								<Card.Description>Manage your social links and custom buttons</Card.Description>
							</div>
							<Button size="sm" onclick={startAddButton} class="flex items-center gap-1">
								<Plus size={16} />
								Add Button
							</Button>
						</div>
					</Card.Header>
					<Card.Content>
						<div class="space-y-6">
							<!-- Edit Form (Only shows when editing/adding) -->
							{#if editingButton}
								<div class="bg-muted/50 rounded-lg border p-4 space-y-4">
									<div class="flex items-center justify-between">
										<h3 class="font-bold">{editingButton.id ? 'Edit Button' : 'Add New Button'}</h3>
										<Button variant="ghost" size="sm" onclick={() => editingButton = null}>Cancel</Button>
									</div>
									<form action="?/saveButton" method="POST" use:enhance={handleEnhance} class="grid gap-4 md:grid-cols-2">
										<input type="hidden" name="id" value={editingButton.id} />
										<div class="space-y-2">
											<Label>Button Name</Label>
											<Input name="name" bind:value={editingButton.name} required />
										</div>
										<div class="space-y-2">
											<Label>Link URL</Label>
											<Input name="link" bind:value={editingButton.link} required />
										</div>
										<div class="space-y-2">
											<Label>Lucide Icon Name</Label>
											<Input name="icon" bind:value={editingButton.icon} />
										</div>
										<div class="space-y-2">
											<Label>Order</Label>
											<Input type="number" name="order" bind:value={editingButton.order} />
										</div>
										<div class="flex items-center gap-2 pt-8">
											<Checkbox id="isActive" name="isActive" bind:checked={editingButton.isActive} />
                                            <input type="hidden" name="isActive" value={editingButton.isActive ? 'on' : 'off'} />
											<Label for="isActive">Is Active</Label>
										</div>
										<div class="md:col-span-2 flex justify-end">
											<Button type="submit">Save Button</Button>
										</div>
									</form>
								</div>
							{/if}

							<!-- Buttons Table -->
							<Table.Root>
								<Table.Header>
									<Table.Row>
										<Table.Head>Order</Table.Head>
										<Table.Head>Name</Table.Head>
										<Table.Head>Status</Table.Head>
										<Table.Head class="text-right">Actions</Table.Head>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{#each data.buttons as btn}
										<Table.Row>
											<Table.Cell>{btn.order}</Table.Cell>
											<Table.Cell class="font-medium">{btn.name}</Table.Cell>
											<Table.Cell>
												<Badge variant={btn.isActive ? 'default' : 'secondary'}>
													{btn.isActive ? 'Active' : 'Inactive'}
												</Badge>
											</Table.Cell>
											<Table.Cell class="text-right flex justify-end gap-2">
												<Button variant="outline" size="icon" onclick={() => startEditButton(btn)}>
													<Settings size={14} />
												</Button>
												<AlertDialog.Root>
													<AlertDialog.Trigger asChild>
														{#snippet child({ props })}
															<Button {...props} variant="destructive" size="icon">
																<Trash2 size={14} />
															</Button>
														{/snippet}
													</AlertDialog.Trigger>
													<AlertDialog.Content>
														<AlertDialog.Header>
															<AlertDialog.Title>Hapus Tombol?</AlertDialog.Title>
															<AlertDialog.Description>
																Apakah Anda yakin ingin menghapus tombol "{btn.name}"? Tindakan ini tidak dapat dibatalkan.
															</AlertDialog.Description>
														</AlertDialog.Header>
														<AlertDialog.Footer>
															<AlertDialog.Cancel>Batal</AlertDialog.Cancel>
															<form action="?/deleteButton" method="POST" use:enhance={handleEnhance}>
																<input type="hidden" name="id" value={btn.id} />
																<Button type="submit" variant="destructive">Hapus</Button>
															</form>
														</AlertDialog.Footer>
													</AlertDialog.Content>
												</AlertDialog.Root>
											</Table.Cell>
										</Table.Row>
									{/each}
								</Table.Body>
							</Table.Root>
						</div>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>

		<!-- Back Button -->
		<div class="flex justify-center pt-4">
			<Button href="/" variant="link">View Live Bio Page</Button>
		</div>
	</div>
</div>
