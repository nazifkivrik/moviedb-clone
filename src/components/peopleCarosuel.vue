<script setup>
  const props = defineProps({ cast: Array })
  import { toRefs, ref } from 'vue'
  import { useDbStore } from '../stores/dbStore'
  import AppLink from '../components/appLink.vue'
  const store = useDbStore()
  const { cast } = toRefs(props)
  const slider = ref(null)
  function arrSlice(arr) {
    arr = arr.slice(0, 9)
    return arr
  }
</script>

<template>
  <div class="peopleCarosuel">
    <h2 class="header">{{ $t('Cast') }}</h2>
    <div class="carosuel" v-if="cast" ref="slider">
      <div class="memberCard" v-for="(member, index) in arrSlice(cast)" :key="index">
        <div class="image">
          <AppLink :to="`/person/${member.id}`"
            ><img
              :src="store.imageURL('w138_and_h175_face', member.profile_path, 'person')"
              alt=""
              v-lazy-load />
          </AppLink>
        </div>
        <div class="text">
          <div class="name">
            <AppLink :to="`/person/${member.id}`">{{ member.original_name }}</AppLink>
          </div>
          <div class="role">{{ member.character }}</div>
        </div>
      </div>
      <div class="showMore" else>
        <AppLink :to="`/${$route.params.type}/${$route.params.id}/cast`">ShowMore</AppLink>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .peopleCarosuel {
    margin: 25px;
    margin-left: 0;
    margin-right: 0;
  }

  .header {
    font-size: 1.7em;
    font-weight: 500;
  }

  .carosuel {
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow-y: hidden;
    overflow-x: scroll;

    column-gap: 15px;
  }

  .memberCard {
    height: 330px;
    box-shadow:
      5px 5px 5px #e3e3e3,
      -5px -5px 5px #e3e3e3;
  }

  .image img {
    width: 138px;
    height: 175px;
    border-radius: 5px;
  }

  .name {
    a {
      font-weight: 600;
      font-size: 0.8em;
    }
  }

  .text {
    padding: 10px;
    display: flex;
    flex-direction: column;
  }
  .role {
    font-weight: 300;
    font-size: 0.8em;
  }
  .showMore {
    font-weight: 500;
  }
</style>
