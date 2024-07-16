<script>
    import { createEventDispatcher} from 'svelte';

    let dispatch = createEventDispatcher();

    let name;
    
    let password;
    
    
    const handleSubmit = () =>{
        const person = {
            name: name,
            
            password: password,
            
            //id: Math.random()
        }
        dispatch('addPerson');
    }
</script>

<form on:submit|preventDefault={handleSubmit}>
    <input type="text" placeholder="User Name" bind:value={name}>
    
    <input type="text" placeholder="Password" bind:value={password}>
    
    <button>Add Person</button>
</form>

<style>


</style>