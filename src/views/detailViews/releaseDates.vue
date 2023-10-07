<script setup>
  import subNav from '@/components/subNavigationBar.vue'
  import backToMain from '@/components/backToMain.vue'
  import { useRoute } from 'vue-router'
  import { onBeforeMount, ref, toRefs } from 'vue'
  import { useDbStore } from '@/stores/dbStore'

  const route = useRoute()
  const store = useDbStore()
  const { shared } = toRefs(store)
  const focusElement = ref(null)
  const releaseDates = ref(null)
  let releaseDateCount = 0

  let regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
  async function initialize() {
    let dates = await store.getMediaDetails(route.params.type, route.params.id, 'release_dates')
    for (let obj in dates.results) {
      releaseDateCount = releaseDateCount + dates.results[obj].release_dates.length
    }
    releaseDates.value = dates.results
    if (!store.shared) {
      await store.getShared(route.params.type, route.params.id, localStorage.getItem('language'))
    }
  }

  onBeforeMount(() => {
    initialize()
  })

  // function sortObjByKeys(unorderedObj) {
  //   const ordered = Object.keys(unorderedObj)
  //     .sort()
  //     .reduce((obj, key) => {
  //       console.log(obj)
  //       obj[key] = unorderedObj[key]
  //       return obj
  //     }, {})
  //   return ordered
  // }
  function scrollFocus(index) {
    window.scroll(0, focusElement.value[index].offsetTop)
  }
  function typeOfReleaseDate(type) {
    switch (type) {
      case 1:
        return 'Premiere'
      case 2:
        return 'Theatrical (limited)'
      case 3:
        return 'Theatrical'
      case 4:
        return 'Digital'
      case 5:
        return 'Physical'
      case 6:
        return 'TV'
    }
  }
</script>

<template>
  <subNav />
  <backToMain />

  <template v-if="releaseDates && shared">
    <div class="releaseDates">
      <div class="datesSum">
        <h2 :style="{ 'background-color': shared.color }">
          {{ $t('Release Dates') }} <span class="releaseDateCount">{{ releaseDateCount }}</span>
        </h2>
        <ul>
          <li v-for="(countries, index) in releaseDates" :key="index" @click="scrollFocus(index)">
            {{ regionNames.of(countries.iso_3166_1) }}
            <span class="releaseDateCount">{{ countries.release_dates.length }}</span>
          </li>
        </ul>
      </div>
      <div class="releaseDateDetails">
        <table v-for="(countries, index) in releaseDates" :key="index" ref="focusElement">
          <tr class="country">
            <th class="countryName" colspan="5">
              <span :class="'fi fi-' + countries.iso_3166_1.toLowerCase()"></span>
              {{ regionNames.of(countries.iso_3166_1) }}
            </th>
          </tr>
          <tr>
            <td>{{ $t('Date') }}</td>
            <td>{{ $t('Certification') }}</td>
            <td>{{ $t('Type') }}</td>
            <td>{{ $t('Language') }}</td>
            <td style="text-align: center">{{ $t('Note') }}</td>
          </tr>

          <tr v-for="date in countries.release_dates" :key="date">
            <td class="date">
              {{ $d(date.release_date, 'short') }}
            </td>
            <td class="certification">{{ date.certification }}</td>
            <td class="type">{{ $t(typeOfReleaseDate(date.type)) }}</td>
            <td class="language"></td>
            <td class="note">{{ date.note }}</td>
          </tr>
        </table>
      </div>
    </div>
  </template>
</template>

<style scoped lang="scss">
  $color_1: white;
  $background-color_1: #ededed;
  @media all and (max-width: 750px) {
    .releaseDates {
      display: flex;
      flex-direction: column;
      .datesSum {
        h2 {
          color: white;
          position: relative;
          font-size: 1.7em;
          margin: 0;
          padding: 5px 20px;
          display: flex;
          align-items: center;
          .releaseDateCount {
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
          .releaseDateCount {
            position: absolute;
            font-weight: 300;
            right: 0;
          }

          li {
            position: relative;
            text-wrap: nowrap;
            padding: 5px 15px;
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
  @media all and (min-width: 751px) {
    .releaseDateDetails {
      padding: 0 4em;
    }
    .releaseDates {
      display: flex;
      flex-direction: row;
    }
    .datesSum {
      margin-left: 10vw;
      margin-top: 30px;
      width: 210px;
      position: relative;
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
        width: 210px;
        li {
          margin-bottom: 15px;
          font-weight: 400;
          cursor: pointer;
        }
      }
      .releaseDateCount {
        position: absolute;
        right: 0;
        font-weight: 300;
      }
    }
  }

  table {
    text-align: left;
    margin: 20px 0;
    box-shadow: 1px 2px 8px rgba(0, 0, 0, 0.1);
  }
  .country {
    background-color: $background-color_1;
    width: 100%;
  }
  .countryName {
    font-weight: 600;
    height: 40px;
  }
  th {
    font-weight: 500;
    padding-left: 10px;
  }
  td {
    font-weight: 400;
    padding: 2px 10px;
  }
  tr {
    margin: 2px;
  }
  .date {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: max-content;
  }
  .certification {
    width: 170px;
  }
  .type {
    width: 200px;
  }
  .language {
    width: 87px;
  }
  .note {
    width: 400px;
  }
</style>
