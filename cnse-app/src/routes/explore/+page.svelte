<script lang="ts">
    export let data;
    
    import { goto } from '$app/navigation';
    $: enviroments = data?.enviroments
    
    let tagTitle = "";
    let tagGenre = "";
    let desctibe = "";
    const tagName = (event) => {
      tagTitle = event.target.value;
    }
    const tagGenreChange = (event) => {
      tagGenre = event.target.value;
    }
    const decribeChange = (event) => {
      desctibe = event.target.value;
    }
    
    const goTo = (id) => {
    goto(`/explore/${id}`);
  };
  
  </script>
    
    <main>
      <h1>Explore</h1>
      <p>This is the explore page.</p>
      
      
  
      //description
      //keywords
      <input type="text" on:input={tagName} placeholder="Search titles">
      <input type="text" on:input={tagGenreChange} placeholder="Search genres">
      <ul>
        
        {#each enviroments as enviroment}
        {#if enviroment.name.includes(tagTitle) || tagTitle === ""}
        {#if enviroment.keywords.some(keywords => keywords.includes(tagGenre)) || tagGenre == ""}
        <h2>{enviroment.name}</h2>
              
        <button on:click={() => goTo(enviroment._id)}>Go to {enviroment.name}</button>
        {/if}
        {/if}
        {/each}
      </ul>
      
      
    </main>
  
  
  
  
  <style>
     
  </style>