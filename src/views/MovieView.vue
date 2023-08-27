<script setup>
import navbar from "../components/NavigationBar.vue"
import subNav from "../components/subNavigationBar.vue";
import rate from "../components/rateChart.vue"
import peopleCarosuel from "../components/peopleCarosuel.vue";
import mediaCarosuel from "../components/mediaCarosuel.vue"
import { onBeforeMount, ref } from 'vue'
import { useDbStore } from "../stores/dbStore";
import { storeToRefs } from 'pinia';
const store = useDbStore()
const { movie } = storeToRefs(store)
import { useRoute } from "vue-router"
import AppLink from "../components/appLink.vue";
const route = useRoute()
const id = route.params.id
const type = route.name
const randomColor = ref(null)
function getRandomColor() {
    var letters = '01234567'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}
function genreAndDuration(movie) {
    let text = ""
    let arr = new Array()
    movie.genres.map((element) => {
        arr.push(element.name)
    })
    text = arr.toString() + ' • ' + Math.floor(movie.runtime / 60) + 'h' + movie.runtime % 60 + 'm'
    return text
}


onBeforeMount(() => {
    randomColor.value = getRandomColor()

    store.getMovie(id)


})


</script>

<template>
    <navbar />
    <subNav :type="type" />
    <div class="player" v-if="route.query.name"><router-view></router-view></div>
    <div class="background" :style="{ 'background-image': movie.backdrop_path }" v-if="movie">
        <div class="container">
            <div class="poster"><img :src="store.imageURL('w342', movie.poster_path)" alt=""></div>
            <div class="info">
                <h3 class="title">{{ movie.original_title }}</h3>
                <span class="genres">{{ movie.release_date }} &bull; {{ genreAndDuration(movie) }}
                </span>
                <div class="rate">
                    <rate :popularity="Math.round(movie.vote_average * 10)" style="height: 60px;width: 60px;" />
                    <span style="width: 40px;">User Score</span>
                </div>

                <div class="tagline">{{ movie.tagline }}</div>
                <h2>Overview</h2>
                <p>{{ movie.overview }}</p>
                <div class="crewContainer">
                    <div class="crew" v-for="(member, index) in movie.reduced" :key="index">
                        <div class="crewName">{{ member.name
                        }}</div>
                        <div class="cewJob"> {{ member.job.toString() }}</div>
                    </div>
                </div>


            </div>
        </div>
    </div>

    <div class="detailedInfo" v-if="movie">
        <div class="whiteColumn">
            <div class="castCarosuel">
                <peopleCarosuel :cast="movie.credits.cast" :id="movie.id" :type="type" />
            </div>
            <div class="showFullCast">
                <AppLink :to="`/${type}/${id}/cast`">Full Cast&Crew</AppLink>
            </div>
            <mediaCarosuel :movie="movie" />
        </div>

        <div class="greyColumn">
            <div class="links">
                <app-link :to="movie.homepage" v-if="movie.homepage"><icon-lib icon="link" size="xl" /></app-link>
                <app-link :to="'https://www.facebook.com/' + movie.external_ids.facebook_id"
                    v-if="movie.external_ids.facebook_id">
                    <icon-lib icon="fa-brands fa-facebook" size="xl" />
                </app-link>
                <app-link :to="'https://www.instagram.com/' + movie.external_ids.instagram_id"
                    v-if="movie.external_ids.instagram_id"><icon-lib icon="fa-brands fa-instagram" size="xl" /></app-link>
                <app-link :to="'https://www.twitter.com/' + movie.external_ids.twitter_id"
                    v-if="movie.external_ids.twitter_id">
                    <icon-lib icon="fa-brands fa-twitter" size="xl" /></app-link>
                <app-link :to="'https://www.imdb.com/' + movie.external_ids.imdb_id"
                    v-if="movie.external_ids.imdb_id"><icon-lib icon="fa-brands fa-imdb" size="2xl" /></app-link>
            </div>
            <p><strong>Status</strong>{{ movie.status }}</p>
            <p><strong>Original Language</strong>{{ movie.original_language }}</p>
            <p><strong>Budget</strong>{{ movie.budget }}</p>
            <p><strong>Revenue</strong>{{ movie.revenue }}</p>
            <p><strong>Keywords</strong></p>
            <div class="keywords">
                <div class="keyword" v-for="keyword in movie.keywords.keywords" :key="keyword.id"> {{ keyword.name }}</div>
            </div>





        </div>
    </div>
</template>

<style scoped>
.background {
    max-width: 100%;
    height: 600px;
    background-size: cover;
    background-blend-mode: color;
    display: flex;
    justify-content: center;
    position: absolute;
    z-index: 10;
    right: 0;
    left: 0;
}

.background::before {
    content: "";
    background: v-bind('randomColor');
    max-width: 100%;
    min-width: 1265px;
    opacity: 0.8;
    position: absolute;
    right: 0;
    left: 0;
    z-index: 5;
    height: 600px;
}

.container {
    z-index: 20;
    display: flex;
    flex-direction: row;
    align-items: center;
    min-width: 1000px;
    max-width: 75vw;
}

.poster img {


    border-radius: 10px;

}

.info {
    margin-left: 48px;
    color: white;
    height: 510px;
    font-size: 1.2em;

}

.title {
    font-size: 2em;
    width: max-content;
    margin: 0;
}

.genres {
    font-size: 1em;
    font-weight: 300;
    display: block;
    width: max-content;

}

.rate {
    margin-top: 20px;
    display: inline-flex;
    width: 115px;
    justify-content: space-between;
    align-items: center;
}

.tagline {
    display: block;
    color: #b2a6b6;
    margin-top: 20px;
}

.info h2 {
    font-size: 1.3em;
}

.crewContainer {
    display: grid;
    grid-template-columns: repeat(3, 3fr);
    grid-template-rows: max-content;
    column-gap: 10px;
    row-gap: 50px;
}



.crew {
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* detailed Info*/
.detailedInfo {
    position: relative;
    top: 615px;
    display: flex;
    width: 100%;
    justify-content: center;
    column-gap: 50px;
}

/*whiteColumn*/
.whiteColumn {
    max-width: calc(80vw - 260px);
    min-width: 700px;
}


.showFullCast {
    margin-top: 20px;
    font-size: 1.2em;
    border-bottom: solid;
    border-width: 1px;
    padding-bottom: 15px;
    font-weight: bold;
    margin-left: 25px;
}



/* Grey Column*/
.links {

    width: 260px;
    justify-content: space-between;
}

.links a {
    margin-right: 15px;
}

.greyColumn {
    width: 280px;
    display: flex;
    flex-direction: column;
    margin-left: 25px;
}

.greyColumn p {
    display: block;
}

.greyColumn p strong {
    display: block;
}

.keywords {
    display: inline-flex;
    flex-wrap: wrap;
}

.keyword {
    display: inline-block;
    width: max-content;

    margin: 3px;
    box-shadow: 2px 1px 3px black;
    padding: 1px;
}

.player {
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    position: fixed;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(127, 127, 127, 0.95);
}
</style>



