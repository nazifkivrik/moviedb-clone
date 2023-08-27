<script setup>
import MovieView from './MovieView.vue';
import TVShowView from '../views/TVShowView.vue'
import PersonView from '../views/PersonView.vue'
import { useDbStore } from '../stores/dbStore';
const store = useDbStore
</script>


<template>
    <div class="movie" v-if="$route.params.type === 'movie'">
        <MovieView />
    </div>
    <div class="tvshow" v-if="$route.params.type === 'tv'">
        <TVShowView />
    </div>
    <div class="person" v-if="$route.params.type === 'person'">
        <PersonView />
    </div>
</template>