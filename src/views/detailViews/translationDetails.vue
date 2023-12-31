<script setup>
  import backToMain from '@/components/backToMain.vue'
  import subNav from '@/components/subNavigationBar.vue'
  import { useDbStore } from '@/stores/dbStore'
  import { minuteToFull } from '@/utils/functions.js'
  import { onBeforeMount, ref, toRefs } from 'vue'
  import { useRoute } from 'vue-router'
  const route = useRoute()
  const store = useDbStore()
  const { shared } = toRefs(store)
  const focusElement = ref(null)
  const translations = ref(null)
  let translationCount

  async function initialize() {
    if (!store.shared) {
      await store.getShared(route.params.type, route.params.id, localStorage.getItem('language'))
    }
    let res = await store.getMediaDetails(route.params.type, route.params.id, 'translations')
    translations.value = res.translations
    translationCount = translations.value.length
  }
  onBeforeMount(() => {
    initialize()
  })
  function scrollFocus(index) {
    window.scroll(0, focusElement.value[index].offsetTop)
  }
</script>

<template>
  <subNav />
  <backToMain />

  <template v-if="translations && shared">
    <div class="translations">
      <div class="translationSum">
        <h2 :style="{ 'background-color': shared.color }">
          {{ $t('Translations') }} <span class="translationCount">{{ translationCount }}</span>
        </h2>
        <ul>
          <li v-for="(languages, index) in translations" :key="index" @click="scrollFocus(index)">
            {{ languages.english_name }}
            <span class="translationCount">{{
              languages.iso_639_1 + '-' + languages.iso_3166_1
            }}</span>
          </li>
        </ul>
      </div>
      <div class="translationDetails">
        <table v-for="(languages, index) in translations" :key="index" ref="focusElement">
          <tr>
            <th colspan="5" class="language">
              {{ languages.english_name }}
              <span style="font-weight: 300">{{
                '(' + languages.iso_639_1 + '-' + languages.iso_3166_1 + ')'
              }}</span>
            </th>
          </tr>
          <tr>
            <th>{{ $t('Title') }}</th>
            <td>{{ languages.data.title }}</td>
          </tr>
          <tr>
            <th>{{ $t('Taglines') }}</th>
            <td>{{ languages.data.tagline }}</td>
          </tr>
          <tr>
            <th>{{ $t('Overview') }}</th>
            <td>{{ languages.data.overview }}</td>
          </tr>
          <tr>
            <td v-if="route.params.type === 'movie'" style="width: 70px">
              {{ minuteToFull(languages.data.runtime) }}
            </td>

            <td>
              <app-link :to="languages.data.homepage">{{ languages.data.homepage }}</app-link>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </template>
</template>
<style scoped lang="scss">
  $color_1: white;
  @media all and (max-width: 751px) {
    .translations {
      display: flex;
      flex-direction: column;
      .translationSum {
        h2 {
          color: white;
          position: relative;
          font-size: 1.7em;
          margin: 0;
          padding: 5px 20px;
          display: flex;
          align-items: center;
          .translationCount {
            position: absolute;
            font-weight: 300;
            right: 30px;
          }
        }
        ul {
          list-style: none;
          padding-inline-start: 0;
          display: flex;
          flex-direction: row;
          overflow-x: scroll;
          column-gap: 0.8em;
          box-shadow:
            5px 5px 5px 0 rgba(0, 0, 0, 0.1),
            -5px -5px 5px 0 rgba(0, 0, 0, 0.1);

          .translationCount {
            position: absolute;
            font-weight: 300;
            right: 0;
          }

          li {
            position: relative;
            padding: 5px 35px 5px 0;

            height: 1.2em;
            box-shadow: 5px 5px 5px 0 rgba(0, 0, 0, 0.1);
          }
          &::-webkit-scrollbar {
            display: none;
          }
        }
      }
    }
  }
  @media all and (min-width: 750px) {
    .translationDetails {
      padding: 0 60px;
    }
    .translations {
      display: flex;
      flex-direction: row;
    }
    .translationSum {
      margin-left: 10vw;
      margin-top: 30px;

      position: relative;
      box-shadow:
        5px 5px 10px 0 #edededff,
        -5px -5px 10px 0 #edededff;
      h2 {
        width: 210px;
        padding: 12px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        color: $color_1;
        font-weight: 500;
        font-size: 1.3em;
        margin: 0;
        display: flex;
        align-items: center;
      }
      ul {
        list-style: none;
        padding-inline-start: 0;
        padding-left: 12px;
        li {
          margin-bottom: 15px;
          font-weight: 400;
          cursor: pointer;
        }
      }
      .translationCount {
        position: absolute;
        right: 10px;
        font-weight: 300;
      }
    }
  }
  .language {
    font-weight: 700;
    padding: 0.5em;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    background-color: #edededff;
  }
  table {
    text-align: left;
    width: 100%;
    margin: 20px;
    border-radius: 10px;
    box-shadow: 1px 2px 8px rgba(0, 0, 0, 0.1);
  }
  td {
    padding: 2px 0.5em;
    font-weight: 300;
  }
  th {
    font-weight: 500;
  }
</style>
