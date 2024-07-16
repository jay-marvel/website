<script lang="ts">
    
    import SignUp from './signup.svelte';
    
    export let show = false;
    export let ispromo = true;
    const toggleshow = () => {
        show = !show
    }
</script>

{#if show}
    <div class = "backdrop" on:click|self>
        <div class="modal">
            <SignUp />
            
        </div>
    </div>
{/if}

<style>
    .backdrop{
        width: 100%;
        height: 100%;
        position: fixed;
        background: rgba(0, 0, 0, 0.8);
    }
    .modal{
        padding: 10px;
        border-radius: 10px;
        max-width: 400 px;
        margin: 10% auto;
        text-align: center;
        background: white;
    }
    .promo .modal{
        background: crimson;
        color: white
    }
</style>