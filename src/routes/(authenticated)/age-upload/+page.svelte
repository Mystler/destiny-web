<script lang="ts">
  import { resolve } from "$app/paths";
  import { onMount } from "svelte";
  import { uploadAge } from "./ageUpload.remote";

  let uploadAgeResult = $derived(uploadAge.result);
  onMount(() => {
    uploadAge.element?.reset();
    uploadAgeResult = undefined;
  });
</script>

<svelte:head>
  <title>DestinyURU Age Upload</title>
  <meta name="description" content="Upload your own age to DestinyURU." />
</svelte:head>

<h1>Age Uploader</h1>

<div class="p-1">
  {#if !uploadAgeResult?.success}
    <p>Here you can submit your own age if you want to test it on Destiny!</p>
    <p>
      In order to provide the age for play, the server needs your <i>.age</i> and, if you have one, your <i>.sdl</i>
      file. You can use this form to send them in. I will get a notification and manually review your files to ensure they
      are in the proper format, then put them up on the server. I may send you an e-mail, or contact you on Discord if I know
      you there, once the server is ready. For any questions, feel free to
      <a href={resolve("/about")}>reach out to me</a>!
    </p>

    <form class="mt-8 flex flex-col items-center gap-2 text-left" enctype="multipart/form-data" {...uploadAge}>
      {#each uploadAge.fields.allIssues() as issue (issue.path)}
        <p class="error">{issue.message}</p>
      {/each}
      <label>
        Age File<br />
        <input type="file" name="agefile" required />
      </label>
      <label>
        SDL File <i class="text-sm text-slate-500">(only if you have one)</i><br />
        <input type="file" name="sdlfile" />
      </label>
      <input type="submit" value="Submit" />
    </form>
  {:else}
    <p class="success">{uploadAgeResult.success}</p>
  {/if}

  <p class="mt-8">
    Once your files are up on the server, you can put the data files for your age into your game folder and go there.
    The recommended way to do so is using the Plasma Console command <i>Net.LinkWithOriginalBook</i> (for a persistent
    instance) or <i>Net.LinkToAge</i> (for a temporary instance). See more about the console in the tips and tricks
    section
    <a href={resolve("/howto#tips")}>here</a>.
  </p>
  <p>
    Please note that you will only need to upload these files again if any of these specific two files change.<br />
    For .age file this means adding new PRP pages. For .sdl files this means that you have manually added new versions.
  </p>
  <p>
    <i>
      Special reminder: Generally speaking, you should never edit existing SDL version descriptors once they are on any
      server. Adding, removing, or just moving variables inside the same version block will cause issues. When doing any
      of these, make sure to create a new STATEDESC version in your SDL file and make your wanted changes there.
    </i>
  </p>
</div>
