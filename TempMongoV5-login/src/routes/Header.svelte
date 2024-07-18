<script lang="ts">
	
	import logo1 from '$lib/images/Drexel-logo.png';
	import { redirect } from '@sveltejs/kit';

	import Singup from './Signup/Modal.svelte';
	//import Signup from './Signup/signup.svelte';

	let showModal = false;
	let showLogIn = false;
	
	const toggleModal = () => {
		showModal = !showModal;
	};
	const toggleLogIn = () => {
		showLogIn = !showLogIn;
	}
	const addperson = () => {
		showModal = false;
	}
	const newScc = () =>{
		window.location.href = '/createAccount';
	}
	const backToMain = () =>{
		window.location.href = '/';
	}
</script>

<header>
	
		
	<img src={logo1} on:click={backToMain} alt="Drexel Logo" />
	<button on:click={newScc}>Create new sccount(one that works)</button>
	<button on:click={toggleModal}>Create a new account (desired version)</button>
	<button on:click={toggleLogIn}>Log in</button> <!--add stuff so that when it's clicked, something happens-->

	
</header>
<main>
	<Singup show={showModal} on:click={toggleModal}>
		
	</Singup>
	
</main>
<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 1rem; /* Add padding to prevent overflow */
    	box-sizing: border-box;
		
	}

	.corner {
		width: 3em;
		height: 3em;
		display: flex;
		gap: 0.5em;
		align-items: center;
		margin-right: auto;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}
	img{
        max-width: 180px;
    }
	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}
</style>
