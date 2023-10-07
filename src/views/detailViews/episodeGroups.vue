<script setup>
  import { onBeforeMount, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import backToMain from '@/components/backToMain.vue'
  import subNavigationBar from '@/components/subNavigationBar.vue'
  import { useDbStore } from '@/stores/dbStore'
  const episodeGroups = ref(null)
  const route = useRoute()
  const store = useDbStore()

  const parent = ref(null)

  async function initialize() {
    let res = await store.getMediaDetails('tv', route.params.id, 'episode_groups')
    episodeGroups.value = res.results
    // eslint-disable-next-line no-unused-vars
    for (const [key, value] of Object.entries(episodeGroups.value)) {
      value.details = await store.getTVEpisodeGroupsDetails(value.id)
    }
    episodeGroups.value = res.results
    if (!store.shared) {
      store.getShared(route.params.type, route.params.id, localStorage.getItem('language'))
    }
  }

  function toggleState(index) {
    if (parent.value[index]) {
      if (parent.value[index].children[4].className === 'open') {
        parent.value[index].children[4].className = 'close'
      } else {
        parent.value[index].children[4].className = 'open'
      }
    }
  }
  onBeforeMount(() => {
    initialize()
  })
</script>

<template>
  <template v-if="episodeGroups">
    <subNavigationBar />
    <backToMain />
    <div class="epGroups">
      <ul>
        <li
          v-for="(group, index) in episodeGroups"
          :key="group"
          ref="parent"
          @click="() => toggleState(index)">
          <h3>{{ group.name }}</h3>
          <span>{{ group.group_count }} Group,{{ group.episode_couny }} Episodes</span>
          <p>{{ group.description }}</p>
          <span class="arrow"><icon-lib icon="fa-solid fa-caret-down" size="xl"></icon-lib></span>
          <div class="close" v-if="group.details">
            <ul class="details">
              <li v-for="episodeGroup in group.details.groups" :key="episodeGroup">
                <app-link
                  :to="{
                    path: `/${route.params.type}/${route.params.id}/episode_groups/${group.id}`,
                    query: { group: episodeGroup.id }
                  }">
                  <span> {{ episodeGroup.name }}</span>
                  <span>{{ episodeGroup.episodes.length }} Episodes</span>
                </app-link>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </template>
</template>

<style scoped lang="scss">
  .close {
    height: 2px;
    overflow: hidden;
  }
  .open {
    overflow: visible;
  }
  .epGroups {
    padding-left: 80px;
    padding-top: 30px;
    ul {
      list-style: none;
      padding-inline-start: 0;
      display: flex;
      flex-direction: column;
      row-gap: 25px;
      li {
        position: relative;
        width: 500px;
        padding: 5px;
        box-shadow:
          -5px -5px 15px 0px rgba(0, 0, 0, 0.5),
          5px 5px 15px 0px rgba(0, 0, 0, 0.5);
        &:hover {
          box-shadow:
            -10px -10px 15px 0px rgba(0, 0, 0, 0.5),
            10px 10px 15px 0px rgba(0, 0, 0, 0.5);
        }
        h3 {
          font-weight: 500;
          font-size: 1.3em;
          margin: 0;
        }
        span {
          display: block;
        }
        .arrow {
          display: inline;
          position: absolute;
          right: 5px;
          top: 30px;
        }
        .details {
          li {
            box-shadow: none;
          }
        }
      }
    }
  }
</style>
