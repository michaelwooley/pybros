<script lang="ts">
	import { PROJECT_EMOJI, PROJECT_NAME } from '$lib/constants';
	import * as routes from '$lib/routes';
	import InviteButtons from './InviteButtons.svelte';

	export let slug: string;
	export let href: string;

	let isActive = false;
</script>

<nav class="navbar" aria-label="main navigation">
	<div class="navbar-brand">
		<a class="navbar-item" href={routes.BASE} title={`${PROJECT_NAME} home`}>
			{PROJECT_EMOJI}
		</a>
		<a
			role="button"
			class="navbar-burger"
			class:is-active={isActive}
			aria-label="menu"
			aria-expanded="false"
			data-target="navbarBasicExample"
			{href}
			on:click|preventDefault={() => {
				isActive = !isActive;
			}}
		>
			<span aria-hidden="true" />
			<span aria-hidden="true" />
			<span aria-hidden="true" />
		</a>
	</div>

	<div id="navbarBasicExample" class="navbar-menu" class:is-active={isActive}>
		<div class="navbar-start">
			<a
				class="navbar-item"
				{href}
				title="Meeting settings"
				on:click|preventDefault={() => alert('To do: Add meeting settings')}
			>
				meet: <span class="ml-2 has-font-monospace has-text-weight-bold">{slug}</span>
			</a>
			<a
				class="navbar-item"
				title="Meeting settings"
				on:click|preventDefault={() => alert('To do: Add meeting settings')}
				{href}
			>
				⚙️
			</a>
		</div>

		<div class="navbar-end">
			<!-- TODO #30 Add list of meeting participants in meeting navbar -->
			<div class="navbar-item">
				<InviteButtons {href} />
			</div>
		</div>
	</div>
</nav>
