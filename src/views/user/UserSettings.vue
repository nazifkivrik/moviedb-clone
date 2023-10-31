<script setup>
  import { useDbStore } from '@/stores/dbStore'
  import { useAuthStore } from '@/stores/authStore'
  import { useRouter } from 'vue-router'
  import { ref, watch } from 'vue'
  const sessionId = ref()
  const counter = ref()
  const success = ref(false)
  const store = useDbStore()
  const authStore = useAuthStore()
  const router = useRouter()
  const LinkTmdbAccount = async () => {
    const token = await store.createRequestToken()
    console.log(token)
    const test = window.open(`https://www.themoviedb.org/authenticate/${token.request_token}`)
    const getSessionId = async (token) => {
      sessionId.value = await store.createSession(token)
      console.log(sessionId.value)

      if (sessionId.value.success) {
        console.log(authStore.user)
        success.value = true
        await authStore.addDocument(authStore.user.email, { sessionId: sessionId.value.session_id })
      }
      console.log(sessionId.value)
    }
    counter.value = setInterval(() => getSessionId(token.request_token), 30000)
  }
  watch(
    () => success.value,
    () => {
      clearInterval(counter.value)
    }
  )
</script>

<template>
  <main>
    <div><strong @click="LinkTmdbAccount">Link</strong> your TMDB account</div>
  </main>
</template>
<style scoped lang="scss">
  main {
    padding-top: 3.5em;
  }
</style>
