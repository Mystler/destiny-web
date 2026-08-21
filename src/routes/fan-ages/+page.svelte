<script lang="ts">
  import { resolve } from "$app/paths";
</script>

<svelte:head>
  <title>DestinyURU Fan Ages</title>
  <meta name="description" content="See which fan ages are currently supported by Destiny." />
</svelte:head>

<h1>Fan Ages</h1>

<div class="p-1">
  <p>Here is a list of the currently supported fan ages and their unique sequence prefix numbers.</p>
  <p>
    These ages can be visited on Destiny, but be aware that you still need to get the game files for them yourself and
    put them into the game folder in order to actually play there.
  </p>
  <p>
    If you are logged into the site, you can upload your own fan age using the <a
      href={resolve("/(authenticated)/age-upload")}>Age Uploader</a
    > form. I will add it to this list once I have processed your age.
  </p>
  <p>
    Sequence prefixes below 100 should be considered reserved by Cyan and not used for fan ages. Likewise, do not use
    numbers at 32768 or higher.
  </p>
  <table class="mx-auto text-left">
    <tbody>
      <tr><td>101</td><td>learningcurve</td></tr>
      <tr><td>200</td><td>vothol</td></tr>
      <tr><td>253</td><td>Pod5</td></tr>
      <tr><td>280</td><td>Ascreth</td></tr>
      <tr><td>402</td><td>Fens</td></tr>
      <tr><td>478</td><td>EderBahvanter</td></tr>
      <tr><td>479</td><td>Loft</td></tr>
      <tr><td>481</td><td>Elonin</td></tr>
      <tr><td>492</td><td>Mahrngestoy</td></tr>
      <tr><td>600</td><td>mareinExperience</td></tr>
      <tr><td>618</td><td>Pod12Cal618</td></tr>
      <tr><td>620</td><td>ReischuApartment</td></tr>
      <tr><td>888</td><td>Puput</td></tr>
      <tr><td>1234</td><td>GoMePubNew</td></tr>
      <tr><td>1236</td><td>ChisoPreniv</td></tr>
      <tr><td>1618</td><td>GahlonRahm</td></tr>
      <tr><td>3183</td><td>Sahnkep</td></tr>
      <tr><td>5343</td><td>TsoidahlPrad</td></tr>
      <tr><td>6500</td><td>test</td></tr>
      <tr><td>7136</td><td>EmorCH01</td></tr>
      <tr><td>7137</td><td>EmorTest01</td></tr>
      <tr><td>7243</td><td>DescentMystV</td></tr>
      <tr><td>8511</td><td>ScreenAge</td></tr>
      <tr><td>9999</td><td>TrgnAgsGrp</td></tr>
      <tr><td>10034</td><td>Tosholek</td></tr>
      <tr><td>10159</td><td>Nilodnam</td></tr>
      <tr><td>10199</td><td>Cidoirep</td></tr>
      <tr><td>10228</td><td>trebivdil</td></tr>
      <tr><td>10262</td><td>Moysenland</td></tr>
      <tr><td>10263</td><td>Tiam</td></tr>
      <tr><td>10264</td><td>Learning</td></tr>
      <tr><td>10271</td><td>Abmortoxas</td></tr>
      <tr><td>10322</td><td>KohOrp</td></tr>
      <tr><td>10439</td><td>FahetsShallows</td></tr>
      <tr><td>10484</td><td>testRelto</td></tr>
      <tr><td>10485</td><td>Mirtahm</td></tr>
      <tr><td>10532</td><td>Sameehn</td></tr>
      <tr><td>10536</td><td>Rigilahs</td></tr>
      <tr><td>12801</td><td>PipelineTest</td></tr>
      <tr><td>20001</td><td>Orma</td></tr>
      <tr><td>22021</td><td>ExplorersEmporium</td></tr>
      <tr><td>22022</td><td>Venalem</td></tr>
      <tr><td>22024</td><td>POD56</td></tr>
      <tr><td>22025</td><td>BugCave</td></tr>
      <tr><td>22099</td><td>TestAge</td></tr>
      <tr><td>22100</td><td>Kalamee</td></tr>
      <tr><td>30305</td><td>Cyrill</td></tr>
      <tr><td>40006</td><td>GoMePubNew</td></tr>
    </tbody>
  </table>
</div>

<style lang="postcss">
  @reference "../../routes/layout.css";

  tr {
    @apply odd:bg-slate-700;
  }

  td {
    padding: 4px 8px;
  }
</style>
