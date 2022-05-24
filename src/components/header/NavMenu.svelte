<script>
	import { page } from '$app/stores';
	import { user, showLogin } from '@stores/sessionStore.js';
	import { supabase } from '@utils/supabaseClient.js';
	import { routeToPage } from '@utils/router';

	/* COMPONENTS */

	import Cross from '@assets/img/cross.svelte';

	import { fade, slide } from 'svelte/transition';

	import { clickOutside } from '@utils/clickOutside';

	/* LOCAL VARS */

	let showMenu = false;

	/* FUNCTIONS */
	const signOut = async () => {
		//const from = ($location.state && $location.state.from) || '/';

		routeToPage(``);
		try {
			let { error } = await supabase.auth.signOut();
			if (error) throw error;
		} catch (error) {
			console.error(error);
		}
	};
	// Development toggle for logged in/out for navmenu
	// const menuItems = true
	$: menuItems = $user
		? [
				{ text: 'Home', target: '/' },
				{ text: 'Scheduled Events', target: '/events' },
				{ text: 'Common Events', target: '/commons' },
				{ text: 'Log Out', target: '/' }
		  ]
		: [{ text: 'Login', target: '/' }];
</script>

<div class="z-100 ml-auto md:hidden">
	{#if showMenu}
		<div
			transition:fade={{ duration: 200 }}
			class={`bg-white px-12 pt-24 pb-16 fixed top-0 left-0 flex flex-col items-start justify-start z-[120] w-full h-full gap-y-9`}
		>
			<button
				class="bg-black text-white rounded-full hover:bg-[#959595] hover:text-white p-1.5 select-none transition-all duration-300 ml-auto flex justify-center items-center z-[110]  absolute top-[39px] right-[16px]"
				on:click={() => {
					showMenu = false;
				}}
			>
				<Cross class="w-2.5 h-2.5" />
			</button>
			{#each menuItems as item}
				{#if item.text === 'Log Out'}
					<!-- Login/Logout Button -->
					<button
						class="bg-white text-gray-400 rounded-xl font-semibold text-xl hover:drop-shadow-lg py-1.5 px-3 leading-none tracking-wide select-none transition-all duration-300 w-full text-center"
						on:click={() => {
							signOut();
						}}
					>
						{item.text}
					</button>
				{:else}
					<!-- Other menu items -->
					<a
						class={`rounded-xl font-semibold text-xl hover:drop-shadow-lg py-1.5 px-3 leading-none tracking-wide select-none transition-all duration-300 w-full text-center ${
							$page.url.pathname == item.target
								? 'bg-[#959595] text-white'
								: 'bg-white text-gray-400'
						}`}
						href={item.target}
					>
						{item.text}
					</a>
				{/if}
			{/each}
		</div>
	{/if}
	{#if $user}
		<div
			class="flex gap-x-3.75 items-end relative"
			use:clickOutside
			on:click_outside={() => {
				showMenu = false;
			}}
		>
			<button
				class="bg-white text-gray-400 rounded-xl font-semibold text-sm hover:drop-shadow-lg py-1.5 px-3 leading-none tracking-wide select-none transition-all duration-300"
				on:click={() => {
					showMenu = true;
				}}
			>
				Menu
			</button>
		</div>
	{:else}
		<button
			class="bg-white text-gray-400 hover:drop-shadow-lg rounded-xl font-semibold text-sm  py-1.5 px-3 leading-none tracking-wide select-none transition-all duration-300 w-full text-center"
			on:click={() => {
				showLogin.set(true);
			}}>Login</button
		>
	{/if}
</div>

<div class="z-100 ml-auto hidden md:block lg:hidden">
	{#if $user}
		<div
			class="flex gap-x-3.75 items-end relative"
			use:clickOutside
			on:click_outside={() => {
				showMenu = false;
			}}
		>
			<button
				class="bg-white text-gray-400 rounded-xl font-semibold text-sm hover:drop-shadow-lg py-1.5 px-3 leading-none tracking-wide select-none transition-all duration-300"
				on:click={() => {
					showMenu = true;
				}}
			>
				Menu
			</button>
			{#if showMenu}
				<div
					transition:slide={{ duration: 200 }}
					class={`bg-white rounded-xl p-4 pt-9 absolute top-0 right-0 shadow-lg flex flex-col items-start z-[100] w-56 gap-y-2`}
				>
					{#if showMenu}
						<button
							class="bg-black text-white rounded-full hover:bg-[#959595] hover:text-white p-1.5 select-none transition-all duration-300 ml-auto flex justify-center items-center z-[110]  absolute top-0 right-0 m-2"
							on:click={() => {
								showMenu = false;
							}}
							transition:fade={{ duration: 200, delay: 200 }}
						>
							<Cross class="w-2 h-2" />
						</button>
					{/if}
					{#each menuItems as item}
						{#if item.text === 'Log In'}
							<button
								on:click={() => {
									showLogin.set(true);
								}}>{item.text}</button
							>
						{:else if item.text === 'Log Out'}
							<!-- Login/Logout Button -->
							<button
								class="bg-white text-gray-400 rounded-xl font-semibold text-sm hover:drop-shadow-lg py-1.5 px-3 leading-none tracking-wide select-none transition-all duration-300 w-full text-left"
								on:click={() => {
									signOut();
								}}
							>
								{item.text}
							</button>
						{:else}
							<!-- Other menu items -->
							<a
								class={`rounded-xl font-semibold text-sm hover:drop-shadow-lg py-1.5 px-3 leading-none tracking-wide select-none transition-all duration-300 w-full text-left ${
									$page.url.pathname == item.target
										? 'bg-[#959595] text-white'
										: 'bg-white text-gray-400'
								}`}
								href={item.target}
							>
								{item.text}
							</a>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	{:else}
		<button
			class="rounded-xl font-semibold text-sm bg-white hover:drop-shadow-lg py-1.5 px-3 leading-none tracking-wide select-none transition-all duration-300 w-full text-center"
			on:click={() => {
				showLogin.set(true);
			}}>Login</button
		>
	{/if}
</div>

<div class="z-100 ml-auto hidden lg:block ">
	<div class="flex gap-x-3.75 items-end">
		{#each menuItems as item}
			{#if item.text === 'Login'}
				<button
					class={`rounded-xl font-semibold text-sm bg-white hover:drop-shadow-lg py-1.5 px-3 leading-none tracking-wide select-none transition-all duration-300`}
					on:click={() => {
						showLogin.set(true);
					}}>{item.text}</button
				>
			{:else if item.text === 'Log Out'}
				<!-- Login/Logout Button -->
				<button
					class={`rounded-xl font-semibold text-sm hover:drop-shadow-lg py-1.5 px-3 leading-none tracking-wide select-none transition-all duration-300 bg-white text-gray-400`}
					on:click={() => {
						signOut();
					}}
				>
					{item.text}
				</button>
			{:else}
				<!-- Other menu items -->
				<a href={item.target}>
					<button
						class={`rounded-xl font-semibold text-sm  hover:drop-shadow-lg py-1.5 px-3 leading-none tracking-wide select-none transition-all duration-300 ${
							$page.url.pathname == item.target
								? 'bg-[#959595] text-white'
								: 'bg-white text-gray-400'
						}`}
						on:click={() => {
							// do something?
						}}
						class:active={$page.url.pathname == item.target}
					>
						{item.text}
					</button>
				</a>
			{/if}
		{/each}
	</div>
</div>

<style>
	.nav-menu {
		/* temporary */
		z-index: 200;
		margin-left: auto;
		display: flex;
		column-gap: 15px;
		align-items: flex-end;
	}
</style>
