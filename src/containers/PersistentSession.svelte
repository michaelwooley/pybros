<!-- Handles global session. In particular, changes in persistence. -->
<script lang="ts">
    import { browser } from '$app/env';

    import { session } from '$app/stores';
    import { setCookiesFromSessionLocals } from '$lib/util/sessionCookies';
    // $: persist = $session.persistent;

    session.subscribe((s) => {
        // if (browser && persist != s.persistent) {
        // 	console.log('changing persistence');
        // 	setCookiesFromSessionLocals(s, (c) => {
        // 		document.cookie = c;
        // 	});
        // }
        if (browser) {
            setCookiesFromSessionLocals(s, (c) => {
                document.cookie = c;
            });
        }
    });
</script>

<slot />
