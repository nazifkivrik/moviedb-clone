<script setup>
import { useRoute, useRouter } from "vue-router"
const router = useRouter()
const route = useRoute()
function goBack() {
    router.back()
}
</script>


<template>
    <div class="videoPlayer">
        <div class="header">{{ route.query.name }} <icon-lib icon="fa-regular fa-circle-xmark " size="xl" @click="goBack"
                class="xmark" />

        </div>
        <iframe :src="`https://www.youtube.com/embed/${route.query.key}?autoplay=0&enablejsapi=1`" frameborder="0"
            width="1280px" height="720px" allowfullscreen></iframe>

    </div>
</template>


<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    background-color: black;
    color: white;
    font-size: 1.2em;
    width: 1280px;
}

.xmark {
    color: gray;
    cursor: pointer;

}

.xmark:hover {
    color: white;
}

.videoPlayer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>