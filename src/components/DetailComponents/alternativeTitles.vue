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
const titles = ref(null)
const { movie } = toRefs(store)
const titleCount = ref(null)
const focusElement = ref(null)

let regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
async function gettitleSummary(type, id) {
    const response = await fetch(
        `https://api.themoviedb.org/3/${type}/${id}/alternative_titles`,
        options
    )
    const data = await response.json()
    titles.value = data.titles
    titleCount.value = data.titles.length
    titles.value = regionReduce(data.titles)
}
onBeforeMount(() => {
    gettitleSummary(route.params.type, route.params.id)
    if (!movie.value) { store.getMovie(route.params.id) }


})


function regionReduce(array) {
    let reduced = array.reduce((obj, item) => {


        if (obj[item.iso_3166_1]) {

            obj[item.iso_3166_1].push(item)
        }
        else {
            obj[item.iso_3166_1] = [item]
        }
        return obj
    }, {})
    return reduced
}
function scrollFocus(index) {
    console.log(focusElement.value[index].offsetLeft)
    window.scroll(0, focusElement.value[index].offsetTop)

}

</script>


<template>
    <navbar />
    <subNav />
    <backToMain />

    <template v-if="titles">
        <div class="titles">
            <div class="titleSummary">
                <h2 :style="{ 'background-color': movie.color }">Alternative Titles <span class="titleCount">{{ titleCount
                }}</span></h2>
                <ul>

                    <li v-for=" country, key, index in titles" :key="index" @click="scrollFocus(index)">{{
                        regionNames.of(country[0].iso_3166_1) }} <span class="titleCount">{{
        country.length }}</span></li>

                </ul>
            </div>
            <div class="titleDetails">

                <table v-for=" countries, index in titles" :key="index" ref="focusElement">
                    <tr class="country">
                        <th class="flag"><span :class="'fi fi-' + countries[0].iso_3166_1.toLowerCase()"></span></th>
                        <th class="countryName">{{ regionNames.of(countries[0].iso_3166_1) }}</th>
                    </tr>
                    <tr>
                        <th>Title</th>
                        <th>Type</th>
                    </tr>
                    <tr v-for="country in countries" :key="country">
                        <td class="title">{{ country.title }}</td>
                        <td>{{ country.type }}</td>

                    </tr>
                </table>
            </div>



        </div>









    </template>
</template>

<style scoped>
.titles {
    display: flex;
    flex-direction: row;
}

.titleSummary {
    margin-left: 40px;
    margin-top: 30px;
    width: 210px;
    position: relative;


}

.titleSummary h2 {

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

.titleSummary ul {
    list-style: none;
    padding-inline-start: 0;
    padding-left: 12px;
    width: 210px;



}

.titleSummary li {
    margin-bottom: 15px;
    font-weight: 400;
    cursor: pointer;
}

.titleCount {
    position: absolute;
    right: 0;
    font-weight: 300;
}

.titleDetails {
    margin-left: 60px;
}

table {
    width: max-content;
    text-align: left;
    margin: 20px;
}

.country {
    display: flex;
    flex-direction: row;
}

.flag {
    margin-right: 10px;
}

.countryName {
    font-weight: 600;
}

.title {
    width: 500px;
}

th {
    font-weight: 500;
}

td {
    width: 345px;
    font-weight: 400;
}

tr {
    margin: 2px;
}
</style>


