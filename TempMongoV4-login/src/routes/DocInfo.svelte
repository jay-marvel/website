<script lang="ts">    
    export let name = "";
    export let author = "";
    export let ratings = "";
    export let pages = "";
    export let genres = [];
</script>

        <h2>Title: {name}</h2>
		<h2>Author: {author}</h2>
		<h2>Pages: {pages}</h2>
		<h2>Rating: {ratings}</h2>
		<h2>Genres: {genres.join(', ')}</h2>