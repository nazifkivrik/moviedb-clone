<script setup>
import navbar from "../components/NavigationBar.vue"
import subNav from "../components/subNavigationBar.vue";
import { onBeforeMount } from 'vue'
import { useDbStore } from "../stores/dbStore";
import { storeToRefs } from 'pinia';
const store = useDbStore()
const { movie } = storeToRefs(store)
import { useRoute } from "vue-router"
const route = useRoute()
const id = route.params.id
const type = route.name

const image = document.createElement('img')
image.src = "https://image.tmdb.org/t/p/w154/vB8o2p4ETnrfiWEgVxHmHWP9yRl.jpg"
function getDominantColor(img) {
    const context = document.createElement("canvas").getContext("2d");
    context.drawImage(img, 0, 0, 1, 1);
    const i = context.getImageData(0, 0, 1, 1).data;
    const rgba = `rgba(${i[0]},${i[1]},${i[2]},${i[3]})`;
    return rgba
}

onBeforeMount(() => {

    console.log(getDominantColor(image))
    store.getMovie(id)
})
</script>

<template>
    <navbar />
    <subNav :type="type" />
    <div class="container">
        <div class="background" :style="{ 'background-image': movie.backdrop_path }" v-if="movie">

        </div>

    </div>
</template>

<style scoped>
img {
    display: none;
}

.container {
    height: 300px;
}

.background {
    width: 100vw;
    height: 600px;
    background-size: cover;
    background-blend-mode: color;
    display: flex;
}

.background::before {
    content: "";
    background: #032541;
    width: 100%;
    opacity: 0.68;
}
</style>