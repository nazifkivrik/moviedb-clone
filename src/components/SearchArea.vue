<script setup>
import { ref, onBeforeMount } from 'vue';
const randomNumber = Math.round(Math.random() * 500);
let randomMovie = ref(null);
let backgroundImageText = null
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjYTM5ZmQxNzgyMTM2NzQwMjgxZThmOTg2MzliZjhjMyIsInN1YiI6IjY0MmRkMzBhYTZhNGMxMDBmNDJjNzkyNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pH71dmpF1xMXUASRPcJ_WUCcoTEK-4t9bloC61L07fo'
    }
};
async function fetchData() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${randomNumber}&sort_by=popularity.desc`, options)
        const data = await response.json()
        randomMovie.value = data.results[Math.round(Math.random() * 20)]
        backgroundImageText = 'url(' + `https://image.tmdb.org/t/p/original${randomMovie.value.backdrop_path}` + ')'
    } catch (error) {
        console.log(error)
    }
}

onBeforeMount(() => {
    fetchData()
})
</script>

<template>
    <div class="searchSection" v-if="randomMovie" :style="{ 'background-image': backgroundImageText }">
        <div class="content">
            <div class="motto">
                <h1>Welcome.</h1>
                <h2>Millions of movies,TV shows and people to discover.</h2>
                <h3>Explore now.</h3>
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
    height: 350px;
    padding-top: 30px;
}

.motto {
    width: 50vw;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    margin-left: 150px;
}

.motto h1,
h2,
h3 {
    margin: 0;
}

.motto h1 {
    font-size: 45px;
    color: white;
}

.motto h2 {
    display: inline;
    color: white;
}

.motto h3 {
    color: brown;
    font-size: 40px;
    display: inline-block;
    text-decoration: underline;
}



.innerSearchInput {
    width: 100vw;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 25px;

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
    position: relative;
    z-index: 2;
    margin-left: 47vw;
    border-style: none;
    background-image: linear-gradient(to right, #1bd2af, #03b6e0);
}
</style>