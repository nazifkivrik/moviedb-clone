<script setup>
import { onBeforeMount, ref } from 'vue';
const randomMovie = ref(null)
let randomNumber = Math.floor(Math.random() * 500);

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjYTM5ZmQxNzgyMTM2NzQwMjgxZThmOTg2MzliZjhjMyIsInN1YiI6IjY0MmRkMzBhYTZhNGMxMDBmNDJjNzkyNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pH71dmpF1xMXUASRPcJ_WUCcoTEK-4t9bloC61L07fo'
    }
};

async function fetchRandom() {
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${randomNumber}&sort_by=popularity.desc`, options)
    const data = await response.json()
    randomMovie.value = data.results[Math.round(Math.random() * 20)]
    randomMovie.value.backdrop_path = 'url(' + `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${randomMovie.value.backdrop_path}` + ')'

}


onBeforeMount(() => {
    fetchRandom()



})

</script>

<template>
    <div class="searchSection" :style="{ 'background-image': randomMovie.backdrop_path }" v-if="randomMovie">
        <div class="content">
            <h1>Welcome.</h1>
            <div class="motto">

                <h2>Millions of movies,TV shows and people to discover.</h2>

                <h3><router-link :to="`/movie/${randomMovie.id}`">Explore now.</router-link></h3>
            </div>

            <div class="innerSearchInput">
                <div class="searchArea"><input type="text" class="search"
                        placeholder="Search for a movie,tv show, person....."><button class="searchButton">Search</button>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
.searchSection {
    height: 350px;
    min-width: 750px;
    background-size: cover;
    background-blend-mode: color;
    display: flex;
    position: relative;
    background-position: center;
}

.searchSection::before {
    content: "";
    background: #032541;
    width: 100%;
    opacity: 0.8;
}

.content {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: start;
    height: 350px;
    padding-top: 30px;
}

.motto {
    min-width: 750px;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    margin-left: 150px;
}

.motto h1,
h2,
h3 {
    margin: 0;
}

h1 {
    margin-left: 150px;
    font-size: 45px;
    display: block;
    color: white;
}

.motto h2 {
    display: inline-flex;
    color: white;
    width: max-content;
    align-items: center;
}

h3 a {
    color: brown;
    font-size: 30px;
    display: inline-flex;
    width: max-content;
    text-decoration: underline;
    margin: 0;
}


.searchArea {
    min-width: 700px;
}

.innerSearchInput {


    display: flex;
    margin-left: 150px;
    margin-top: 25px;
    min-width: 750px;

}

.search {
    width: 50vw;
    height: 46px;
    position: absolute;
    z-index: 1;
    border-radius: 23px;
    border-style: none;
    font-size: larger;
    padding-left: 15px;
}

.search:focus {
    outline: none;
}

.searchButton {
    width: 100px;
    height: 48px;
    border-radius: 24px;
    position: absolute;
    z-index: 2;
    margin-left: 47vw;
    border-style: none;
    background-image: linear-gradient(to right, #1bd2af, #03b6e0);
}
</style>