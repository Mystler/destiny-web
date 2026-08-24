<script lang="ts">
  import { resolve } from "$app/paths";
  import { login } from "./login.remote";
</script>

<svelte:head>
  <title>DestinyURU Login</title>
  <meta name="description" content="Log into your account for DestinyURU." />
</svelte:head>

<h1>Login to DestinyURU</h1>

<form class="flex flex-col items-center gap-2 text-left" {...login}>
  <label>
    Username:<br />
    <input required {...login.fields.username.as("text", login.result?.username ?? "")} />
  </label>
  <label>
    Password:<br />
    <input required {...login.fields._password.as("password")} />
  </label>
  {#each login.fields.allIssues() as issue (issue.path)}
    <p class="error">{issue.message}</p>
  {/each}
  {#if login.result?.error}
    <p class="error">Login failed!</p>
  {/if}
  <p class="text-center">
    <a href={resolve("/signup")} class="link-btn">I need an account</a><br />
    <a href={resolve("/reset")} class="link-btn">I forgot my password</a>
  </p>
  <input type="submit" />
</form>
