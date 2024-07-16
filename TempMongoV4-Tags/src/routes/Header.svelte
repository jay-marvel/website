<script>
	
	import logo1 from '$lib/images/Drexel-logo.png';

	import Modal from './Modal.svelte';
	import AddPerson from './AddPersonForm.svelte';

	import Singup from './Signup/Modal.svelte';
	//import Signup from './Signup/signup.svelte';

	let showModal = false;
	let showLogIn = false;
	let users = [
		{ userName: "dzhang1", password: "dan@2023"}//, id: 1}
	]
	const toggleModal = () => {
		showModal = !showModal;
	};
	const toggleLogIn = () => {
		showLogIn = !showLogIn;
	}
	const addperson = () => {
		showModal = false;
	}
	const logIn = (e) =>{
		const { userName, password} = e.detail;
		const user = users.find(user => user.userName === userName && user.password === password);
		
		if (user) {
			console.log("Logged in");
			showLogIn = false;
		} else {
			console.log("Wrong username or password");
			showLogIn = false;
		}
	}
</script>

<header>
	
		
			<img src={logo1} alt="Drexel Logo" />
	
	<button on:click={toggleModal}>Create a new account</button>
	<button on:click={toggleLogIn}>Log in</button>

	
</header>
<main>
	<Singup  ispromo={false} show={showModal} on:click={toggleModal}>
		
	</Singup>
	<Modal  ispromo={false} show={showLogIn} on:click={toggleLogIn}>
		<h3>Log In</h3>
		<AddPerson on:addPerson={logIn}/>
		
	</Modal>
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
