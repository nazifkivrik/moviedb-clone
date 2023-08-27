<script setup>
import NavigationBar from '../NavigationBar.vue';
import subNavigationBar from '../subNavigationBar.vue';
import backToMain from '../DetailComponents/backToMain.vue'
import { useDbStore } from '../../stores/dbStore';
import { toRefs, onBeforeMount, onMounted, } from 'vue'
import { useRoute } from 'vue-router';
const route = useRoute()
const store = useDbStore()
const { movie } = toRefs(store)



onBeforeMount(() => {
    if (!movie.value) { store.getMovie(route.params.id) }


})
onMounted(() => {
})
</script>


<template>
    <div>
        <NavigationBar />
        <subNavigationBar />
        <backToMain />
        <template v-if="movie">
            <div class="castAndCrew">
                <div class="Cast">
                    <h2 class="header">Cast <span class="count">{{ movie.credits.cast.length }}</span></h2>
                    <ol v-for="castMember in movie.credits.cast" :key="castMember">
                        <li>
                            <img :src="store.imageURL('w66_and_h66_face', castMember.profile_path)" alt=""
                                v-if="castMember.profile_path">
                            <img src="https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg"
                                alt="" v-else>
                            <div class="info">
                                <p class="name">{{ castMember.original_name }}</p>
                                <p class="character">{{ castMember.character }}</p>
                            </div>

                        </li>


                    </ol>

                </div>

                <div class="Crew">
                    <h2 class="header">Crew <span class="count">{{ movie.crewCount }}</span></h2>
                    <ol>
                        <li v-for="(members, department) in movie.credits.crew" :key="members" class="departments">{{
                            department }}
                            <ol>
                                <li v-for="crewMember in members" :key=crewMember class="crewMember">
                                    <img :src="store.imageURL('w66_and_h66_face', crewMember.profile_path)" alt=""
                                        v-if="crewMember.profile_path">
                                    <img src="https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg"
                                        alt="" v-else>
                                    <div class="info">
                                        <p class="name">{{ crewMember.original_name }}</p>
                                        <p class="character">{{ crewMember.job.toString() }}</p>
                                    </div>
                                </li>
                            </ol>

                        </li>
                    </ol>


                </div>
            </div>

        </template>



    </div>
</template>

<style scoped>
.castAndCrew {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    min-width: 600px;
    max-width: 1200px;

}

.Cast {
    margin-left: 50px;
    width: 300px;
}

.header {
    font-size: 1.5em;
    font-weight: 700;
    display: flex;
    flex-direction: row;
    align-items: center;

}

.header .count {
    margin-left: 10px;
    font-weight: 300;
}

.Cast ol {
    padding-inline-start: 0;
}

.Cast li {
    list-style: none;
    height: 66px;
    display: flex;
    flex-direction: row;

}

li p {
    margin: 0;

}

.info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 15px;
}

.name {
    font-weight: 500;
}

.character {
    font-weight: 300;
}

.Crew>ol {
    padding-inline-start: 0;

}

.departments {
    list-style: none;
    font-size: 1.2em;
}

li>ol {
    padding-inline-start: 0;

}

.crewMember {
    list-style: none;
    height: 66px;
    display: flex;
    flex-direction: row;
    margin: 15px 0;
    width: max-content;
}
</style>




