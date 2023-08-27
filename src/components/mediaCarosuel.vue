<script setup>
import { toRefs, ref, onMounted } from 'vue'
import { useDbStore } from '../stores/dbStore';
import applink from './appLink.vue';
const store = useDbStore()
const props = defineProps({ 'movie': Object })
const { movie } = toRefs(props)
const selectedSection = ref("Most Popular")
const headArray = ['Most Popular', 'Videos', 'Backdrops', 'Posters']

function getFirstTen(arr) {
    if (arr.length >= 10) return 10
    else return arr.length - 1
}
onMounted(() => {
})
</script>


<template>
    <div class="mediaSection" v-if="movie !== undefined">

        <div class="mediaMenus">
            <div class="mediaHeader">Media</div>
            <div v-for="(head, index) in headArray" :key="index">
                <input type="button" :class="[selectedSection === head ? 'selectedButton' : '']" :value="head"
                    @click="(event) => selectedSection = event.target.value" class="mediaHeaderItem">
                <div class="count" v-if="head === 'Videos'">{{ movie.videos.length }}</div>
                <div class="count" v-if="head === 'Backdrops' && movie.backdrops">{{ movie.backdrops.length }}
                </div>
                <div class="count" v-if="head === 'Posters' && movie.backdrops">{{ movie.posters.length }}
                </div>
            </div>



            <div class="viewAllButton" v-if="selectedSection !== 'Most Popular'">View All {{ selectedSection }}</div>
        </div>

        <div class="mediaContainer">
            <div class="mostPopular" v-if="selectedSection === 'Most Popular' && movie.posters && movie.backdrops">


                <applink
                    :to="{ path: `/movie/${movie.id}/player`, query: { key: movie.videos[movie.videos.length - 1].key, name: movie.videos[movie.videos.length - 1].name } }">
                    <div class="videoPkg">
                        <img :src="`https://i.ytimg.com/vi/${movie.videos[movie.videos.length - 1].key}/maxresdefault.jpg`"
                            alt="">
                        <div class="play"><icon-lib icon="fa-regular fa-circle-play" size="xl" /></div>
                    </div>
                </applink>
                <img :src="store.imageURL('w780', movie.backdrops[0].file_path)" alt="">
                <img :src="store.imageURL('w500', movie.posters[0].file_path)" alt="">
            </div>
            <div class="videos" v-if="selectedSection === 'Videos'">
                <div class="video" v-for="index in getFirstTen(movie.videos)" :key="index">
                    <applink
                        :to="{ path: `/movie/${movie.id}/player`, query: { key: movie.videos[index].key, name: movie.videos[index].name } }">
                        <div class="videoPkg">
                            <img :src="`https://i.ytimg.com/vi/${movie.videos[index].key}/maxresdefault.jpg`" alt="">
                            <div class="play"><icon-lib icon="fa-regular fa-circle-play" size="xl" /></div>
                        </div>
                    </applink>

                </div>


            </div>

            <div class="backdrops" v-if="selectedSection === 'Backdrops'">

                <div class="backdrop" v-for="index in getFirstTen(movie.backdrops)" :key="index">
                    <img :src="store.imageURL('w500', movie.backdrops[index].file_path)" alt="">
                </div>


            </div>
            <div class="posters" v-if="selectedSection === 'Posters'">
                <div class="poster" v-for="index in getFirstTen(movie.posters)" :key="index">
                    <img :src="store.imageURL('w500', movie.posters[index].file_path)" alt="">
                </div>

            </div>
        </div>


    </div>
</template>

<style scoped>
.mediaMenus {

    list-style: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: bold;
    margin: 15px 0;
    position: relative;
    column-gap: 15px;
}

.mediaHeader {
    font-size: 1.3em;
    margin-right: 25px;

}



.mediaHeaderItem {
    background-color: white;
    border: none;
    font-size: 1.2em;
    font-weight: bold;
    cursor: pointer;


}

.count {
    font-weight: 400;
    display: inline;
    color: gray;
}

.viewAllButton {
    position: absolute;
    right: 0;
    font-weight: 400;
    font-size: 0.8em;
    text-decoration: underline;
    cursor: pointer;
    justify-self: flex-end;
}

.selectedButton {
    border-bottom: solid;
    border-width: 3px;
}

.mediaContainer img {
    height: 300px;
}

.mostPopular {
    display: flex;
    overflow-x: scroll;
    column-gap: 15px;
}

.videos,
.backdrops,
.posters {
    display: flex;
    flex-direction: row;
    overflow-x: scroll;
    column-gap: 15px;
    scroll-behavior: smooth;
    scroll-snap-align: end;
}



.videoPkg {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.play {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    z-index: 100;
}

.play:hover {

    color: black;
}

.play:before {
    content: "";
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: rgba(187, 182, 182, 0.1)
}
</style>





