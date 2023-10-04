<script setup>
  import subNav from '@/components/subNavigationBar.vue'
  import backToMain from '@/components/backToMain.vue'
  import { useRoute } from 'vue-router'
  import { onBeforeMount, ref, inject, toRefs } from 'vue'
  import { useDbStore } from '@/stores/dbStore'
  const route = useRoute()
  const store = useDbStore()
  const options = inject('fetchOptions')
  const titles = ref(null)
  const { shared } = toRefs(store)
  const titleCount = ref(null)
  const focusElement = ref(null)

  let regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
  async function gettitleSummary(type, id) {
    const response = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}/alternative_titles`,
      options
    )
    const data = await response.json()
    if (data.titles) {
      titles.value = data.titles
    } else {
      titles.value = data.results
    }

    console.log(titles.value)
    titleCount.value = titles.value.length
    titles.value = regionReduce(titles.value)
  }
  onBeforeMount(() => {
    gettitleSummary(route.params.type, route.params.id)
  })

  function regionReduce(array) {
    let reduced = array.reduce((obj, item) => {
      if (obj[item.iso_3166_1]) {
        obj[item.iso_3166_1].push(item)
      } else {
        obj[item.iso_3166_1] = [item]
      }
      return obj
    }, {})
    return reduced
  }
  function scrollFocus(index) {
    console.log(focusElement.value[index].offsetLeft)
    window.scroll(0, focusElement.value[index].offsetTop)
  }
</script>

<template>
  <subNav />
  <backToMain />

  <template v-if="titles">
    <div class="titles">
      <div class="titleSummary">
        <h2 :style="{ 'background-color': shared.color }">
          {{ $t('Alternative Titles') }} <span class="titleCount">{{ titleCount }}</span>
        </h2>
        <ul>
          <li v-for="(country, key, index) in titles" :key="index" @click="scrollFocus(index)">
            {{ regionNames.of(country[0].iso_3166_1) }}
            <span class="titleCount">{{ country.length }}</span>
          </li>
        </ul>
      </div>
      <div class="titleDetails">
        <table v-for="(countries, index) in titles" :key="index" ref="focusElement">
          <tr class="country">
            <th class="flag">
              <span :class="'fi fi-' + countries[0].iso_3166_1.toLowerCase()"></span>
            </th>
            <th class="countryName">{{ regionNames.of(countries[0].iso_3166_1) }}</th>
          </tr>
          <tr>
            <th>{{ $t('Title') }}</th>
            <th>{{ $t('Type') }}</th>
          </tr>
          <tr v-for="country in countries" :key="country">
            <td class="title">{{ country.title }}</td>
            <td>{{ country.type }}</td>
          </tr>
        </table>
      </div>
    </div>
  </template>
</template>

<style scoped lang="scss">
  $color_1: white;

  @media all and (min-width: 751px) {
    .titles {
      display: flex;
      flex-direction: row;
      .titleSummary {
        margin-left: 40px;
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
        }
        li {
          margin-bottom: 15px;
          font-weight: 400;
          cursor: pointer;
        }
        .titleCount {
          position: absolute;
          right: 0;
          font-weight: 300;
        }
      }
      .title {
        width: 40em;
      }
    }
  }
  @media all and (max-width: 750px) {
    .titles {
      display: flex;
      flex-direction: column;
      .titleSummary {
        h2 {
          color: white;
          position: relative;
          font-size: 1.7em;
          margin: 0;
          padding: 5px 20px;
          display: flex;
          align-items: center;
          .titleCount {
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

          .titleCount {
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
      .title {
        width: 20em;
      }
    }
  }

  .titleDetails {
    margin-left: 3em;
    table {
      width: max-content;
      text-align: left;
      margin: 20px;
      box-shadow:
        5px 5px 5px 0 rgba(0, 0, 0, 0.1),
        -5px -5px 5px 0 rgba(0, 0, 0, 0.1);
    }
    .country {
      display: flex;
      flex-direction: row;
    }
    .flag {
      margin-right: 10px;
    }
    .countryName {
      font-weight: 600;
    }

    th {
      font-weight: 500;
    }

    tr {
      margin: 2px;
    }
  }
</style>
