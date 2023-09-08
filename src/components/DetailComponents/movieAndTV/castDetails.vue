<script setup>
  import subNavigationBar from '@/components/subNavigationBar.vue'
  import backToMain from '@/components/DetailComponents/movieAndTV/backToMain.vue'
  import { useDbStore } from '@/stores/dbStore'
  import { toRefs, onBeforeMount } from 'vue'
  import { useRoute } from 'vue-router'
  const route = useRoute()
  const store = useDbStore()
  const { shared } = toRefs(store)

  onBeforeMount(() => {
    if (!shared.value) {
      store.getShared(route.params.type, route.params.id)
    }
  })
</script>

<template>
  <div>
    <subNavigationBar />
    <backToMain />
    <template v-if="shared">
      <div class="castAndCrew">
        <div class="Cast">
          <h2 class="header">
            {{ $t('Cast') }} <span class="count">{{ shared.credits.cast.length }}</span>
          </h2>
          <ol>
            <li v-for="castMember in shared.credits.cast" :key="castMember">
              <img
                :src="store.imageURL('w66_and_h66_face', castMember.profile_path)"
                alt=""
                v-if="castMember.profile_path" />
              <img
                src="https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg"
                alt=""
                v-else />
              <app-link :to="`/person/${castMember.id}`">
                <div class="info">
                  <p class="name">{{ castMember.original_name }}</p>
                  <p class="character">{{ castMember.character }}</p>
                </div>
              </app-link>
            </li>
          </ol>
        </div>

        <div class="Crew">
          <h2 class="header">
            {{ $t('Crew') }} <span class="count">{{ shared.crewCount }}</span>
          </h2>
          <ol>
            <li
              v-for="(members, department) in shared.credits.crew"
              :key="members"
              class="departments">
              {{ $t(department) }}
              <ol>
                <li v-for="crewMember in members" :key="crewMember" class="crewMember">
                  <img
                    :src="store.imageURL('w66_and_h66_face', crewMember.profile_path)"
                    alt=""
                    v-if="crewMember.profile_path" />
                  <img
                    src="https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg"
                    alt=""
                    v-else />
                  <app-link :to="`/person/${crewMember.id}`">
                    <div class="info">
                      <p class="name">{{ crewMember.original_name }}</p>
                      <p class="character">{{ crewMember.job.toString() }}</p>
                    </div>
                  </app-link>
                </li>
              </ol>
            </li>
          </ol>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
  @media all and (min-width: 751px) {
    .castAndCrew {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 900px;
    }
  }
  @media all and (max-width: 750px) {
    .castAndCrew {
      display: flex;
      flex-direction: column;
      width: max-content;
    }
    .Crew {
      width: max-content;
    }
  }
  .castAndCrew {
    margin-left: 5em;
  }
  .Cast {
    ol {
      padding-inline-start: 0;
      display: flex;
      flex-direction: column;
      row-gap: 15px;
      li {
        height: 66px;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
  }
  img {
    width: 66px;
  }
  .header {
    font-size: 1.5em;
    width: max-content;
    font-weight: 700;
    display: flex;
    flex-direction: row;
    align-items: center;
    .count {
      margin-left: 10px;
      font-weight: 300;
    }
  }
  li {
    p {
      margin: 0;
    }
    > ol {
      padding-inline-start: 0;
    }
  }
  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;

    margin-left: 15px;
    .character {
      overflow: hidden;
      width: 150px;
      word-wrap: break-word;
    }
  }
  .name {
    font-weight: 500;
  }
  .character {
    font-weight: 300;
  }
  .Crew {
    > ol {
      padding-inline-start: 0;
    }
  }
  .departments {
    list-style: none;
    font-size: 1.2em;
  }
  .crewMember {
    list-style: none;
    height: 66px;
    display: flex;
    flex-direction: row;
    margin: 15px 0;
    width: max-content;
  }
</style>
