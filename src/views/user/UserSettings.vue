<script setup>
  import { useDbStore } from '@/stores/dbStore'
  import { useAuthStore } from '@/stores/authStore'
  import { ref, watch } from 'vue'
  const sessionId = ref()
  const counter = ref()
  const success = ref(false)
  const store = useDbStore()
  const authStore = useAuthStore()
  const LinkTmdbAccount = async () => {
    const token = await store.createRequestToken()
    console.log(token)
    window.open(`https://www.themoviedb.org/authenticate/${token.request_token}`)
    const getSessionId = async (token) => {
      sessionId.value = await store.createSession(token)

      if (sessionId.value.success) {
        success.value = true
        authStore.user.sessionId = sessionId.value.session_id
        await authStore.addDocument('users', authStore.user.email, {
          sessionId: sessionId.value.session_id
        })
      }
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
