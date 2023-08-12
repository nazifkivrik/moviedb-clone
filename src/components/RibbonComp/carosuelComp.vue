<script setup>
import rate from "../rateChart.vue";
import { toRefs, onMounted, ref } from "vue"
const props = defineProps({ 'carosuelArray': Array })
const { carosuelArray } = toRefs(props)
const typeOfArray = ref(null)
function arrayCheck(obj) {
    if ('release_date' in obj) { return 'movie' }
    else if ('first_air_date' in obj) { return 'tv' }
    else return 'person'
}
onMounted(() => {
    typeOfArray.value = arrayCheck(carosuelArray.value[0])

})

</script>


<template>
    <div v-for="( item) in carosuelArray" :key="item" class="card">
        <div class="imageArea"><router-link :to="`/movie/${item.id}`" v-if="item.release_date"><img
                    :src="`https://image.tmdb.org/t/p/w154${item.poster_path}`" alt=""></router-link>
            <router-link :to="`/tv/${item.id}`" v-if="item.first_air_date"><img
                    :src="`https://image.tmdb.org/t/p/w154${item.poster_path}`" alt=""></router-link>
            <div class="rate">
                <rate :popularity="Math.round(item.vote_average * 10)" />
            </div>
        </div>



        <div class="content">

            <div class="title">

                <h4 v-if="item.original_title"><router-link :to="`/movie/${item.id}`">{{ item.original_title
                }}</router-link></h4>
                <h4 v-if="item.name"><router-link :to="`/tv/${item.id}`">{{ item.name }}</router-link></h4>
            </div>
            <div class="releaseDate">
                <h5 v-if="item.release_date">{{ new Date(item.release_date).toLocaleDateString('en-us', {
                    month: "short", day: "numeric",
                    year: "numeric"
                }) }}</h5>
                <h5 v-if="item.first_air_date">{{ new Date(item.first_air_date).toLocaleDateString('en-us', {
                    month: "short", day: "numeric",
                    year: "numeric"
                }) }}</h5>
            </div>


        </div>


    </div>
</template>


<style scoped>
.card {
    height: 260px;
    margin-left: 11px;
    display: flex;
    flex-direction: column;
    position: relative;
}

.rate {
    display: inline;
    position: absolute;
    top: 210px;
    left: 10px;
    z-index: 50;

}

img {
    border-radius: 12px;
}

.title {
    margin-top: 17px;
    margin-bottom: 5px;
}

.title h4 {
    margin: 0;
    text-align: center;
}

.releaseDate {
    display: inline-flex;
}

.releaseDate h5 {
    margin: 0;
    font-weight: 200;
}





.content {
    width: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: end;
    flex-wrap: wrap;
}
</style>




