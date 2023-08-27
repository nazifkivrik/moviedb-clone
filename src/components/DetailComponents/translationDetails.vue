<script setup>
import navbar from '../NavigationBar.vue';
import subNav from '../subNavigationBar.vue';
import backToMain from './backToMain.vue';
import { useRoute } from 'vue-router';
import { onBeforeMount, ref, inject, toRefs } from 'vue'
import { useDbStore } from '@/stores/dbStore';

const route = useRoute()
const store = useDbStore()
const options = inject('fetchOptions')
const { movie } = toRefs(store)
const focusElement = ref(null)
const translations = ref(null)
let translationCount

async function getTranslations(id) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/translations`,

        options
    )
    const data = await response.json()

    translations.value = data.translations
    translationCount = translations.value.length
}
onBeforeMount(() => {
    if (!movie.value) {
        store.getMovie(route.params.id)


    }
    getTranslations(route.params.id)


})
function scrollFocus(index) {

    window.scroll(0, focusElement.value[index].offsetTop)

}
function runtimeChange(runtime) {
    if (runtime != 0)
        return Math.floor(runtime / 60) + 'h ' + runtime % 60 + 'm'
    else return '-'
}

</script>

<template>
    <navbar />
    <subNav />
    <backToMain />

    <template v-if="translations && movie">
        <div class="translations">
            <div class="translationSum">
                <h2 :style="{ 'background-color': movie.color }">Translations <span class="translationCount">{{
                    translationCount }}</span></h2>
                <ul>

                    <li v-for=" languages, index in translations" :key="index" @click="scrollFocus(index)">{{
                        languages.english_name }} <span class="translationCount">{{
        languages.iso_639_1 + '-' + languages.iso_3166_1 }}</span></li>

                </ul>
            </div>
            <div class="translationDetails">

                <table v-for=" languages, index in translations" :key="index" ref="focusElement">
                    <tr>
                        <th colspan="5" style="font-weight: 700;"> {{
                            languages.english_name }} <span style="font-weight: 300;">{{ '(' + languages.iso_639_1 + '-' +
        languages.iso_3166_1 + ')' }}</span></th>
                    </tr>
                    <tr>
                        <th>Title</th>
                        <td>{{ languages.data.title }}</td>
                    </tr>
                    <tr>
                        <th>Taglines</th>
                        <td>{{ languages.data.tagline }}</td>
                    </tr>
                    <tr>
                        <th>Overview</th>
                        <td>{{ languages.data.overview }}</td>
                    </tr>
                    <tr>
                        <td style="width: 70px;">{{ runtimeChange(languages.data.runtime) }}</td>
                        <td><app-link :to="languages.data.homepage">{{ languages.data.homepage }}</app-link></td>
                    </tr>


                </table>
            </div>
        </div>
    </template>
</template>
<style scoped>
.translations {
    display: flex;
    flex-direction: row;
}

.translationSum {
    margin-left: 40px;
    margin-top: 30px;
    width: 210px;
    position: relative;


}

.translationSum h2 {

    width: 210px;
    padding: 12px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    color: white;
    font-weight: 500;
    font-size: 1.3em;
    margin: 0;
    display: flex;
    align-items: center;
}

.translationSum ul {
    list-style: none;
    padding-inline-start: 0;
    padding-left: 12px;
    width: 210px;



}

.translationSum li {
    margin-bottom: 15px;
    font-weight: 400;
    cursor: pointer;
}

.translationCount {
    position: absolute;
    right: 0;
    font-weight: 300;
}

.translationDetails {
    margin-left: 60px;
}

table {

    text-align: left;
    margin: 20px;
    max-width: 1100px;
    min-width: 500px;
    box-shadow: 1px 2px 8px rgba(0, 0, 0, .1);


}

td {
    padding: 2px 15px;
}

th {
    font-weight: 500;
}
</style>



