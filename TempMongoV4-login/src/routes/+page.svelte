<script lang="ts">
	import type { PageData } from './$types';
	import Tabs from './shared/Tabs.svelte';
	import Info from './DocInfo.svelte';
	
	export let data: PageData;
	$: ({
		tutorials, users} = data)
	let title;
	let author;
	let pages;
	let ratings;
	let genres;
	
	

	//tabs stuff
	let items = ["Search cloud", "Get more details", "upload stuff"	];
	let activeItem = "Search cloud";

	const tabChange = (e) => {
		activeItem = e.detail;
	}
	const switchTabs = (id) =>{
		title = id.title;
		author = id.author
		pages = id.pages
		ratings = id.ratings
		genres = id.genres
		console.log(genres)
		activeItem = "Get more details";
	}
	const backToSearch = () =>{
		activeItem = "Search cloud";
	}
	
	


</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>
{#if users.length}
<p>Check out all of these registered users!</p>
<form>
    
    {#each users as URL}
        <p>{URL.firstName} {URL.email}</p>
    {/each}
    
</form> 
{/if}

<Tabs {activeItem} {items} on:tabChange={tabChange}/>

	{#if activeItem === 'Search cloud'}
	
	{#each tutorials as tutorial}
		
		<article>
			<h2>{tutorial.title}</h2>
			<button on:click={() =>{switchTabs(tutorial)}}>Get more info</button>
				
		</article>
			
	{/each}
	{:else if activeItem == "Get more details"}
		<Info name={title} author={author} pages={pages} ratings={ratings} genres={genres}/>
		<button on:click={backToSearch}>Back to Seach Cloud</button>
	{:else if activeItem === 'upload stuff'}
		<p> upload services</p>
	{/if}
<section>
	
	
</section>

<style>
	.search-input {
    width: 300px; 
  }
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
