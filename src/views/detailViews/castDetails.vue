<script setup>
  import backToMain from '@/components/backToMain.vue'
  import subNavigationBar from '@/components/subNavigationBar.vue'
  import { useDbStore } from '@/stores/dbStore'
  import { onBeforeMount, toRefs, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { GroupBy, GroupObject, sortObjByKeys } from '@/utils/functions'
  const route = useRoute()
  const store = useDbStore()
  const { shared } = toRefs(store)
  const crews = ref()
  const crewCount = ref()
  async function initialize() {
    if (!store.shared) {
      await store.getShared(route.params.type, route.params.id, localStorage.getItem('language'))
    }
    crewCount.value = shared.value.credits.crew.length
    crews.value = GroupBy(shared.value.credits.crew, 'department')
    for (const obj in crews.value) {
      crews.value[obj] = GroupObject(crews.value[obj], 'name', 'job')
    }
    crews.value = sortObjByKeys(crews.value)
  }

  onBeforeMount(() => {
    initialize()
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
                :src="store.imageURL('w66_and_h66_face', castMember.profile_path,'person')"
                alt=""
                />
              
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
            {{ $t('Crew') }} <span class="count">{{ crewCount }}</span>
          </h2>
          <ol>
            <li v-for="(members, department) in crews" :key="members" class="departments">
              {{ $t(department) }}
              <ol>
                <li v-for="crewMember in members" :key="crewMember" class="crewMember">
                  <img
                    :src="store.imageURL('w66_and_h66_face', crewMember.profile_path, 'person')"
                    alt="" />

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
      margin-left: 15vw;

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
      margin-left: 5em;
    }

    .Crew {
      width: max-content;
    }
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
