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
const releaseDates = ref(null)
let releaseDateCount = 0

let regionNames = new Intl.DisplayNames(['en'], { type: 'region' })


async function getReleaseDates(id) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/release_dates`,

        options
    )
    const data = await response.json()
    for (let obj in data.results) {
        releaseDateCount = releaseDateCount + data.results[obj].release_dates.length

    }
    releaseDates.value = data.results
    releaseDates.value = sortObjByKeys(releaseDates.value)
}
onBeforeMount(() => {
    if (!movie.value) {
        store.getMovie(route.params.id)


    }
    getReleaseDates(route.params.id)

})




function sortObjByKeys(unorderedObj) {
    const ordered = Object.keys(unorderedObj)
        .sort()
        .reduce((obj, key) => {
            obj[key] = unorderedObj[key]
            return obj
        }, {})
    return ordered
}
function scrollFocus(index) {

    window.scroll(0, focusElement.value[index].offsetTop)

}
function typeOfReleaseDate(type) {
    switch (type) {
        case 1:
            return 'Premiere'
        case 2:
            return 'Theatrical (limited)'
        case 3:
            return 'Theatrical'
        case 4:
            return 'Digital'
        case 5:
            return 'Physical'
        case 6:
            return 'TV'


    }
}

</script>

<template>
    <navbar />
    <subNav />
    <backToMain />

    <template v-if="releaseDates && movie">
        <div class="releaseDates">
            <div class="datesSum">
                <h2 :style="{ 'background-color': movie.color }">Release Dates <span class="releaseDateCount">{{
                    releaseDateCount }}</span></h2>
                <ul>

                    <li v-for=" countries, index in releaseDates" :key="index" @click="scrollFocus(index)">{{
                        regionNames.of(countries.iso_3166_1) }} <span class="releaseDateCount">{{
        countries.release_dates.length }}</span></li>

                </ul>
            </div>
            <div class="releaseDateDetails">

                <table v-for=" countries, index in releaseDates" :key="index" ref="focusElement">
                    <tr class="country">
                        <th class="countryName" colspan="5"><span
                                :class="'fi fi-' + countries.iso_3166_1.toLowerCase()"></span> {{
                                    regionNames.of(countries.iso_3166_1) }}</th>
                    </tr>
                    <tr>
                        <td>Date</td>
                        <td>Certification</td>
                        <td>Type</td>
                        <td>Language</td>
                        <td style="  text-align: center;">Note</td>
                    </tr>



                    <tr v-for="date in countries.release_dates" :key="date">
                        <td class="date">{{ new Date(date.release_date).toLocaleDateString('en-us', {
                            day: "numeric", month: "numeric", year: "numeric"

                        }) }}
                        </td>
                        <td class="certification">{{ date.certification }}</td>
                        <td class="type">{{ typeOfReleaseDate(date.type) }}</td>
                        <td class="language"></td>
                        <td class="note">{{ date.note }}</td>

                    </tr>
                </table>
            </div>
        </div>
    </template>
</template>


<style scoped>
.releaseDates {
    display: flex;
    flex-direction: row;
}

.datesSum {
    margin-left: 40px;
    margin-top: 30px;
    width: 210px;
    position: relative;


}

.datesSum h2 {

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

.datesSum ul {
    list-style: none;
    padding-inline-start: 0;
    padding-left: 12px;
    width: 210px;



}

.datesSum li {
    margin-bottom: 15px;
    font-weight: 400;
    cursor: pointer;
}

.releaseDateCount {
    position: absolute;
    right: 0;
    font-weight: 300;
}


.releaseDateDetails {
    margin-left: 60px;
}

table {

    text-align: left;
    margin: 20px;
    max-width: 1100px;
    min-width: 500px;
    box-shadow: 1px 2px 8px rgba(0, 0, 0, .1);


}

.country {

    background-color: #ededed;
    width: 100%;



}



.countryName {
    font-weight: 600;
    height: 40px;


}



th {
    font-weight: 500;
    padding-left: 10px;
}

td {

    font-weight: 400;
    padding: 2px 10px;
}

tr {
    margin: 2px;
}


.certification {
    width: 170px;
}

.type {
    width: 200px;
}

.language {
    width: 87px;
}

.note {
    width: 400px;

}
</style>