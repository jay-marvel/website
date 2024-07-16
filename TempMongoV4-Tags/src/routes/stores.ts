import { writable } from 'svelte/store';

export let docName = writable();
export let docAuthor = writable();
export let docPages = writable();
export let docRating = writable();
export let docGenres = writable();
