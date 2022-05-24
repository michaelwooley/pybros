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
	name: string;
	color: string;
	emoji: string;
}

type TCookies = {
	[key: string]: string;
};

// Brilliant: https://stackoverflow.com/a/60301306/3422060
type GetInsidePromise<X> = X extends Promise<infer I> ? I : never;
