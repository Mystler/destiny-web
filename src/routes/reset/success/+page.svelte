<script lang="ts">
  import { resolve } from "$app/paths";
  import ButtonLink from "$lib/components/ButtonLink.svelte";
</script>

<p>Your password has been reset! You can now go and log in with it.</p>
<p class="mt-4"><ButtonLink href={resolve("/login")}>Login</ButtonLink></p>
