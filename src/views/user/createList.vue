<script setup>
  import { useAuthStore } from '@/stores/authStore.js'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  const listName = ref()
  const description = ref()
  const isPublic = ref()
  const authStore = useAuthStore()
  const router = useRouter()
  const createList = async () => {
    const listObject = {
      listName: listName.value,
      description: description.value,
      isPublic: isPublic.value,
      listItems: []
    }
    authStore.user.lists.push(listObject)
    authStore.addToArray('users', authStore.user.email, 'lists', listObject)
    router.replace({ path: '/edit' })
  }
</script>

<template>
  <div class="main">
    <form>
      <div class="input">
        <label for="listName">Name</label>
        <input type="text" name="listName" required v-model="listName" />
      </div>
      <div class="input">
        <label for="description">Description</label>
        <textarea name="description" id="" cols="25" rows="5" v-model="description"></textarea>
      </div>
      <div class="input">
        <label for="isPublic">Public List?</label>
        <input type="checkbox" name="isPublic" v-model="isPublic" />
      </div>
      <input type="button" value="Continue" @click="createList" />
    </form>
  </div>
</template>

<style scoped lang="scss">
  .main {
    width: 100%;
    height: 90vh;
    padding-top: 3.5em;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  form {
    flex-direction: column;
    display: flex;
    align-self: center;
    row-gap: 15px;
    width: 40%;
    .input {
      display: flex;
      flex-direction: row;
      justify-content: end;
    }
    input[type='button'] {
      background-color: #01b4e4;
      color: white;
      width: 8em;
      border-radius: 7px;
    }
    label {
      width: 100px;
    }
    input[type='text'] {
      width: 100%;
    }
    textarea {
      width: 100%;
    }
  }
</style>
