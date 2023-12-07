<script setup>
  import { ref, reactive, onMounted, watch } from 'vue'
  import { useAuthStore } from '@/stores/authStore.js'
  import { useRouter } from 'vue-router'
  const router = useRouter()
  const authStore = useAuthStore()
  const modeVar = ref('Login')
  const credentials = reactive({ email: '', password: '', username: '' })
  const err = ref()
  const onSubmit = async () => {
    if (modeVar.value === 'Register') {
      err.value = await authStore.registerUser(credentials)
    } else {
      err.value = await authStore.loginUser(credentials)
    }
  }
  watch(
    () => modeVar.value,
    () => (err.value = null)
  )
 
</script>

<template>
  <main>
    <div class="loginOrRegister">
      <template v-for="mode in ['Login', 'Register']" :key="mode">
        <h2
          @click="modeVar = mode"
          :style="[modeVar === mode ? 'text-decoration: underline;' : '']">
          {{ mode }}
        </h2>
      </template>
    </div>
    <div class="form">
      <div v-if="modeVar === 'Register'">
        <label for="username">Username:</label>
        <input
          type="text"
          name="username"
          placeholder="username"
          v-model="credentials.username"
          required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" name="email" placeholder="Email" v-model="credentials.email" required />
      </div>
      <div>
        <label for="password">Password:</label>

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          v-model="credentials.password" />
      </div>
      <div v-if="modeVar === 'Login'">
        <label for="rememberMe">Remember Me</label>
        <input type="checkbox" name="rememberMe" />
      </div>
      <input type="submit" :value="modeVar" @click="onSubmit()" />
      <span style="color: red" v-if="err">{{ err.code }}</span>
    </div>
  </main>
</template>

<style scoped lang="scss">
  main {
    padding-top: 3.5em;
    height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;

    .loginOrRegister {
      display: flex;
      flex-direction: row;
      margin-top: 10%;
      h2 {
        margin: 0 30px;
        font-weight: 500;
        cursor: pointer;
      }
    }
    .form {
      margin-top: 5%;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      row-gap: 10px;
      input[type='submit'] {
        cursor: pointer;
      }
      input[type='checkbox'] {
        cursor: pointer;
      }
    }
  }
</style>
