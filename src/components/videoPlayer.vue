<script setup>
  import { useRoute, useRouter } from 'vue-router'
  import { ref, computed } from 'vue'
  const router = useRouter()
  const route = useRoute()
  function goBack() {
    router.back()
  }
  const width = computed(() => {
    if (window.innerWidth > 750) {
      return (window.innerWidth * 80) / 100
    } else {
      return window.innerWidth
    }
  })
  const height = computed(() => {
    if (window.innerWidth > 750) {
      return (window.innerHeight * 90) / 100
    } else return (window.innerHeight * 45) / 100
  })
</script>

<template>
  <div class="videoPlayer">
    <div class="header" :style="{ width: width + 'px' }">
      <span></span>
      {{ route.query.name }}
      <icon-lib icon="fa-regular fa-circle-xmark " size="xl" @click="goBack" class="xmark" />
    </div>
    <iframe
      :src="`https://www.youtube.com/embed/${route.query.key}?autoplay=0&enablejsapi=1`"
      frameborder="0"
      :width="width"
      :height="height"
      allowfullscreen></iframe>
  </div>
</template>

<style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    background-color: black;
    color: white;
    font-size: 1.2em;
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
