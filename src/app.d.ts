/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	interface Locals {
		persistent: boolean;
		user: UserSettings;
	}

	// interface Platform {}

	interface Session {
		persistent: boolean;
		user: UserSettings;
	}

	// interface Stuff {}
}

interface UserSettings {
	username: string;
	color: string;
}
type TCookies = {
	[key: string]: string;
};
