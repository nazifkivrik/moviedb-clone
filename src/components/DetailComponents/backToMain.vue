<script setup>
import { useRoute } from 'vue-router';
import { useDbStore } from '../../stores/dbStore';
const store = useDbStore()
import { toRefs, onBeforeMount } from 'vue'
const { movie } = toRefs(store)

const route = useRoute()


onBeforeMount(() => {
    if (!movie.value) { store.getMovie(route.params.id) }

})

</script>

<template>
    <template v-if="movie">
        <div class="goBack" :style="{ 'background-color': movie.color }">
            <img :src="store.imageURL('w92', movie.poster_path)" alt="">
            <div class="movieTitle">
                <app-link :to="'/' + route.params.type + '/' + route.params.id">
                    <h2>{{ movie.title }}</h2>
                </app-link>
                <app-link :to="'/' + route.params.type + '/' + route.params.id">
                    <icon-lib icon="fa-solid fa-arrow-left" /> Back to Main
                </app-link>

            </div>
        </div>
    </template>
</template>


<style scoped> .goBack {
     padding: 15px;
     padding-left: 80px;
     display: flex;
     flex-direction: row;
     align-items: center;
     column-gap: 30px;


 }

 .goBack img {
     border-radius: 8px;

 }

 .movieTitle {
     display: flex;
     row-gap: 20px;
     flex-direction: column;
     color: white;

 }

 .movieTitle a {
     color: white;
 }

 a:hover {
     text-decoration: none;
     color: gray;
 }

 .movieTitle h2 {

     margin: 0;
     height: max-content;
     width: max-content;
 }

 .movieTitle h2 {
     font-size: x-large;
 }
</style>