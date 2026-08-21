<script lang="ts">
  import { asset } from "$app/paths";
  import ButtonLink from "$lib/components/ButtonLink.svelte";
  import Card from "$lib/components/Card.svelte";
</script>

<svelte:head>
  <title>DestinyURU How To Play</title>
  <meta name="description" content="Learn how to get a client that works to play on DestinyURU." />
</svelte:head>

<h1>How To Play</h1>

<div class="p-1">
  <p>
    For DestinyURU, you are expected to bring your own client. As such, the shard has no fileserver or installer that
    will get all of the game files for you. However, you are not expected to know everything about URU clients, so there
    are two alternative ways of getting a client.
  </p>
  <div class="grid gap-2 md:grid-cols-2">
    <Card>
      <h3>Using GetUru</h3>
      <p>
        With the help of the <a href="https://github.com/Hoikas/GetUru" target="_blank" rel="noopener">GetUru</a> script by
        Hoikas, you can get the latest H-uru client and assets for the game and play on Destiny with full automation. This
        is the best way to get started if you simply want to get online and/or test a fan age.
      </p>
      <p>
        The script is a PowerShell script for Windows. Just follow the instructions on the GitHub page and you should be
        ready to go!
      </p>
      <p>
        Should you be on a different platform, you may have to consider building your own client instead or recreating
        what it does on your own.
      </p>
      <p>
        GetUru downloads the latest <a
          href="https://github.com/H-uru/Plasma/releases/tag/last-successful"
          target="_blank"
          rel="noopener">precompiled H-uru/Plasma client</a
        >
        and the game assets from
        <a href="https://github.com/H-uru/moul-assets" target="_blank" rel="noopener">H-uru/moul-assets</a>.
      </p>
      <p class="my-4 text-center">
        <ButtonLink href="https://github.com/Hoikas/GetUru" target="_blank" rel="noopener">GetUru</ButtonLink>
      </p>
    </Card>
    <Card>
      <h3>Compile your own Client</h3>
      <p>
        If you don't use GetUru, then you will have to source and build the client yourself. This is the original "bring
        your own client" approach, intended for developers. Thus, if this is your intended option, I would assume you
        have basic familiarity with building Myst Online clients already.
      </p>
      <p>
        The recommended client for Destiny is any client that is based on the <a
          href="https://github.com/H-uru/Plasma"
          target="_blank"
          rel="noopener">H-uru/Plasma</a
        > fork. See that GitHub page for more information.
      </p>
      <p>The following additional points are required to play with a custom client:</p>
      <ul class="list-inside list-disc">
        <li>
          In order for Destiny to not reject your client, the CMake product information (branch id, build id, build
          type, and uuid) has to match the default values.
        </li>
        <li>
          Since Destiny does not have a dataserver, you will have to launch the game with the "/LocalData" command-line
          argument. This will require you to build the client as an internal client (the default when building
          H-uru/Plasma).
        </li>
        <li>
          Lastly, you will need the correct <a href={asset("/server.ini")} download>server.ini</a> file for the Destiny shard.
        </li>
      </ul>
    </Card>
  </div>
</div>
