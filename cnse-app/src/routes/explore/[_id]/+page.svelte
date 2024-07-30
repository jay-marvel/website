
<script lang="ts">
    import { goto } from '$app/navigation';
  
    export let data;
  
    $: enviroment = data?.enviroment;
  
    const goBack = () => {
      goto('/explore');
    };
    
    $: fullLink = enviroment?.link?.startsWith('http://') || enviroment?.link?.startsWith('https://')
    ? enviroment.link
    : `http://${enviroment.link}`;
       
    
    
  </script>
  
  <main>
    <h1>{enviroment.name}</h1>
    <p>Author: {enviroment.contributors}</p>
    <p>Description: {enviroment.description}</p>
    <p>Link to enviroment: {enviroment.link}</p>
    <p>Link to environment: <a href={fullLink} target="_blank" rel="noopener noreferrer">{fullLink}</a></p>
    <p>How to expliot: {enviroment.exploit_directions}</p>
    <p>How to install: {enviroment.install_instructions}</p>
    <p>keywords: {enviroment.keywords.join(', ')}</p>
    
    <button on:click={goBack}>Back to Explore</button>
  </main>