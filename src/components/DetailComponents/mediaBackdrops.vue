<script setup>
import navbar from '../NavigationBar.vue';
import subNav from '../subNavigationBar.vue';
import backToMain from './backToMain.vue';
import { onBeforeMount, ref, toRefs, computed, inject } from 'vue'
import { useDbStore } from '@/stores/dbStore';
import { useRoute } from 'vue-router';
const store = useDbStore()
const route = useRoute()
const options = inject('fetchOptions')
const { movie } = toRefs(store)
const languages = ref(null)
const selectedOption = ref('en')
const filteredBackdrops = computed(() => {
  return filterByLanguage(movie.value.backdrops)



})

onBeforeMount(() => {
  if (!movie.value) {
    store.getMovie(route.params.id)
  }
  iso_639_1_languages()
})
async function iso_639_1_languages() {

  const response = await fetch('https://api.themoviedb.org/3/configuration/languages', options)
  const data = await response.json()
  languages.value = data

}
function convertLanguage(key) {
  function checklanguage(obj) { return obj.iso_639_1 == key }


  let matched = languages.value.find(checklanguage)
  if (matched) { return matched.english_name }
  else return 'No Language'






}

function filterByLanguage(array) {
  let reduced = array.reduce((obj, item) => {


    if (obj[item.iso_639_1]) {

      obj[item.iso_639_1].push(item)
    }
    else {
      obj[item.iso_639_1] = [item]
    }
    return obj
  }, {})



  return reduced
}
</script>

<template >
  <navbar />
  <subNav />
  <backToMain />



  <template v-if="movie && languages">
    <div class="backdrops">
      <div class="backdropSum">
        <h2 :style="{ 'background-color': movie.color }">Backdrops </h2>
        <ul v-if="movie.backdrops">
          <li v-for=" language, key in filteredBackdrops" :key="key"> <span
              :class="{ selectedClass: key === selectedOption }" @click="() => { selectedOption = key }">
              {{
                convertLanguage(key) }}
            </span> <span class="translationCount">{{ Object.keys(language).length }}</span></li>
        </ul>
      </div>
      <div class="backdropsContainer">
        <div v-for="backdrops, key in filteredBackdrops" :key="key" class="backdropsDetails"> <template
            v-if="key === selectedOption">
            <template v-for="backdrop in backdrops" :key="backdrop">
              <div class="card"> <app-link :to="store.imageURL('original', backdrop.file_path)"><img
                    :src="store.imageURL('w300', backdrop.file_path)" alt=""></app-link>
                <div class="section"> <span style="font-weight: 300;">Size</span> {{ backdrop.width + 'x' +
                  backdrop.height
                }}
                </div>
                <div class="section" v-if="movie.backdrops"> <span style="font-weight: 300;">Language</span> {{
                  convertLanguage(key) }}</div>
              </div>

            </template>
          </template></div>

      </div>
    </div>
  </template>
</template>

<style scoped>
.backdrops {
  display: flex;
  flex-direction: row;
}

.backdropSum {
  margin-left: 40px;
  margin-top: 30px;
  width: 210px;
  position: relative;


}

.backdropSum h2 {

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

.backdropSum ul {
  list-style: none;
  padding-inline-start: 0;
  padding-left: 12px;
  width: 210px;



}

.backdropSum li {
  margin-bottom: 15px;
  font-weight: 400;
  cursor: pointer;
}

.selectedClass {
  font-weight: 600;
  font-size: 1.1em;
}

.translationCount {
  position: absolute;
  right: 0;
  font-weight: 300;
}

.backdropsContainer {
  width: 100%;
  padding-left: 40px;
  padding-top: 40px;
}

.backdropsDetails {
  display: flex;
  flex-wrap: wrap;
  column-gap: 15px;
  row-gap: 15px;
}

.section {
  display: flex;
  flex-direction: column;
  row-gap: 5px;
}
</style>




