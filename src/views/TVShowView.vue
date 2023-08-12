<script setup>
import navbar from "../components/NavigationBar.vue"
import subNav from "../components/subNavigationBar.vue";
import { onBeforeMount } from 'vue'
import { useDbStore } from "../stores/dbStore";
import { storeToRefs } from 'pinia';
const store = useDbStore()
const { movie } = storeToRefs(store)
import { useRoute } from "vue-router"
const route = useRoute()
const id = route.params.id
const type = route.name

onBeforeMount(() => {
    store.getMovie(id)
    console.log(type)
})

</script>

<template>
    <navbar />
    <subNav :type="type" />
    <div>
        {{ id }}
    </div>
</template>