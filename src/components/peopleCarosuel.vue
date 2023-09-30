<script setup>
  const props = defineProps({ cast: Array })
  import { toRefs, ref, onMounted } from 'vue'
  import { useDbStore } from '../stores/dbStore'
  import AppLink from '../components/appLink.vue'
  const store = useDbStore()
  const { cast } = toRefs(props)
  const slider = ref(null)
  const renderCount = ref(null)
  function arrSlice(arr) {
    arr = arr.slice(0, 9)
    return arr
  }
  //lazy load ----------------
  const throttle = (callback, delay) => {
    let throttleTimeout = null
    let storedEvent = null

    const throttledEventHandler = (event) => {
      storedEvent = event

      const shouldHandleEvent = !throttleTimeout

      if (shouldHandleEvent) {
        callback(storedEvent)

        storedEvent = null

        throttleTimeout = setTimeout(() => {
          throttleTimeout = null

          if (storedEvent) {
            throttledEventHandler(storedEvent)
          }
        }, delay)
      }
    }

    return throttledEventHandler
  }
  let lazyLoad = throttle(function (event) {
    if (
      renderCount.value <
      Math.round((event.srcElement.offsetWidth + event.srcElement.scrollLeft) / 150)
    ) {
      renderCount.value = Math.round(
        (event.srcElement.offsetWidth + event.srcElement.scrollLeft) / 150
      )
    }
  }, 250)
  //------------------------------
  onMounted(() => {
    renderCount.value = Math.round((slider.value.offsetWidth + slider.value.scrollLeft) / 150)
  })
</script>

<template>
  <div class="peopleCarosuel">
    <h2 class="header">{{ $t('Cast') }}</h2>
    <div class="carosuel" v-if="cast" ref="slider" @scroll="(event) => lazyLoad(event)">
      <div class="memberCard" v-for="(member, index) in arrSlice(cast)" :key="index">
        <div class="image">
          <AppLink :to="`/person/${member.id}`"
            ><img
              :src="store.imageURL('w138_and_h175_face', member.profile_path)"
              alt=""
              v-if="renderCount >= index && member.profile_path" />
            <img
              src="https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg"
              alt=""
              v-else-if="!member.profile_path" />
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
