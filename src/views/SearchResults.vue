<script setup>
  import { useRoute, useRouter } from 'vue-router'
  import { onBeforeMount, inject, ref, reactive } from 'vue'
  import { useDbStore } from '../stores/dbStore'

  const store = useDbStore()
  const options = inject('fetchOptions')
  const route = useRoute()
  const router = useRouter()
  const query = ref(route.query.query)
  const results = reactive({
    movie: null,
    tv: null,
    person: null,
    company: null,
    collection: null,
    keyword: null
  })
  const SearchResultsItems = {
    movie: 'Movie',
    tv: 'TV Shows',
    person: 'People',
    company: 'Companies',
    collection: 'Collections',
    keyword: 'Keywords'
  }
  async function getSearchResults(type, query, page) {
    switch (type) {
      case 'tv':
      case 'movie':
      case 'person':
      case 'collection': {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/${type}?query=${query}&include_adult=false&language=en-US&page=${page}`,
          options
        )
        const data = await response.json()
        results[type] = data
        break
      }

      case 'keyword':
      case 'company': {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/${type}?query=${query}&page=${page}`,
          options
        )
        const data = await response.json()
        results[type] = data
        break
      }
    }
  }
  function searchQuery() {
    getSearchResults('movie', route.query.query, '1')
    getSearchResults('tv', route.query.query, '1')
    getSearchResults('person', route.query.query, '1')
    getSearchResults('collection', route.query.query, '1')
    getSearchResults('keyword', route.query.query, '1')
    getSearchResults('company', route.query.query, '1')
  }
  onBeforeMount(() => {
    searchQuery()
  })
  function search() {
    router.push({
      path: `/search`,
      query: { query: query.value, type: 'movie' }
    })
    searchQuery()
  }
</script>

<template>
  <div class="searchResults">
    <div class="searchArea">
      <div class="innerSearchArea">
        <input
          type="text"
          :value="query"
          @input="(event) => (query = event.target.value)"
          @keypress.enter="search" />
        <button @click="search">Search</button>
      </div>
    </div>
    <div class="sumArea">
      <ul>
        <h2>Search Results</h2>
        <li
          v-for="(item, key) in SearchResultsItems"
          :key="item"
          :class="{ selectedClass: route.query.type === key.toLowerCase() }">
          <template v-if="results[key]">
            <app-link
              :to="{
                path: '/search',
                query: { query: route.query.query, type: key.toLocaleLowerCase() }
              }"
              >{{ item }}</app-link
            >
            <span>{{ results[key].total_results }}</span>
          </template>
        </li>
      </ul>
    </div>
    <div class="detailsArea">
      <ul v-if="route.query.type === 'movie'">
        <template v-for="(item, key) in SearchResultsItems" :key="key">
          <template v-if="key === 'movie' && results['movie']">
            <li v-for="(object, index) in results[key].results" :key="index" class="movie">
              <app-link :to="{ path: `/${key}/${object.id}` }">
                <span class="image">
                  <img :src="store.imageURL('w92', object.poster_path)" alt="" />
                </span>
                <span class="cardDetail">
                  <h2 class="title">{{ object.original_title }}</h2>
                  <h4 class="date">{{ object.release_date }}</h4>
                  <p class="overview">{{ object.overview }}</p>
                </span>
              </app-link>
            </li>
          </template>
        </template>
      </ul>
      <ul v-if="route.query.type === 'tv'">
        <template v-for="(item, key) in SearchResultsItems" :key="key">
          <template v-if="key === 'tv' && results['tv']">
            <li v-for="(object, index) in results[key].results" :key="index" class="tv">
              <app-link :to="{ path: `/${key}/${object.id}` }">
                <span class="image">
                  <img :src="store.imageURL('w92', object.poster_path)" alt="" />
                </span>
                <span class="cardDetail">
                  <h2 class="title">{{ object.name }}</h2>
                  <h4 class="date">{{ object.release_date }}</h4>
                  <p class="overview">{{ object.overview }}</p>
                </span>
              </app-link>
            </li>
          </template>
        </template>
      </ul>
      <ul v-if="route.query.type === 'person'">
        <template v-for="(item, key) in SearchResultsItems" :key="key">
          <template v-if="key === 'person' && results['person']">
            <li v-for="(object, index) in results[key].results" :key="index" class="person">
              <app-link :to="{ path: `/${key}/${object.id}` }">
                <span class="image">
                  <img
                    :src="store.imageURL('w90_and_h90_face', object.profile_path, 'person')"
                    alt="" />
                </span>
                <span class="cardDetail">
                  <h2 class="title">{{ object.name }}</h2>
                  <h4 class="knownForDepartment">{{ object.known_for_department }}</h4>
                  <span
                    class="known_for"
                    v-for="(known_for, known_for_index) in object.known_for"
                    :key="known_for">
                    {{ known_for.original_title }} {{ known_for.original_name }}
                    <span v-if="known_for_index < object.known_for.length - 1"> , </span>
                  </span>
                </span>
              </app-link>
            </li>
          </template>
        </template>
      </ul>
      <ul v-if="route.query.type === 'company'">
        <template v-for="(item, key) in SearchResultsItems" :key="key">
          <template v-if="key === 'company' && results['company']">
            <li v-for="(object, index) in results[key].results" :key="index" class="company">
              <app-link :to="{ path: `/${key}/${object.id}` }">
                <img
                  :src="store.imageURL('h30', object.logo_path)"
                  alt=""
                  v-if="object.logo_path" />
                <template v-if="!object.logo_path">
                  {{ object.name }}
                </template>
                <span class="origin_country" v-if="object.origin_country">{{
                  object.origin_country
                }}</span>
              </app-link>
            </li>
          </template>
        </template>
      </ul>
      <ul v-if="route.query.type === 'collection'">
        <template v-for="(item, key) in SearchResultsItems" :key="key">
          <template v-if="key === 'collection' && results['collection']">
            <li v-for="(object, index) in results[key].results" :key="index" class="collection">
              <app-link :to="{ path: `/${key}/${object.id}` }">
                <span class="image">
                  <img :src="store.imageURL('w92', object.poster_path)" alt="" />
                </span>
                <span class="cardDetail">
                  <h2 class="title">{{ object.original_title }}</h2>
                  <p class="overview">{{ object.overview }}</p>
                </span>
              </app-link>
            </li>
          </template>
        </template>
      </ul>
      <ul v-if="route.query.type === 'keyword'">
        <template v-for="(item, key) in SearchResultsItems" :key="key">
          <template v-if="key === 'keyword' && results['keyword']">
            <li v-for="(object, index) in results[key].results" :key="index" class="keyword">
              <app-link :to="{ path: `/${key}/${object.id}` }">
                {{ object.name }}
              </app-link>
            </li>
          </template>
        </template>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
  a {
    text-decoration: none;
  }
  .selectedClass a {
    font-size: 1.3em;
    font-weight: 500;
  }

  .searchResults {
    display: grid;
    grid-template-columns: 1fr 4fr;
    padding-top: calc(3em + 30px);

    .searchArea {
      grid-column: 1/3;
      width: 100%;
      display: flex;
      justify-content: center;

      .innerSearchArea {
        width: max-content;
        position: relative;

        input {
          max-width: none;
          min-width: 40vw;
          height: 46px;
          border-radius: 23px;
          border-width: 0.5px;
          font-size: larger;
          padding-left: 15px;

          &:focus {
            outline: none;
          }
        }

        button {
          width: 100px;
          height: 50px;
          border-radius: 24px;
          position: absolute;
          right: 0;
          border-style: none;
          background-image: linear-gradient(to right, #1bd2af, #03b6e0);
          cursor: pointer;
        }
      }
    }

    .sumArea {
      grid-column: 1;
      display: flex;
      justify-content: center;
      margin-top: 15px;
      margin-left: 70px;

      ul {
        list-style: none;
        padding-inline-start: 0;
        display: flex;
        flex-direction: column;
        row-gap: 20px;

        h2 {
          background-color: #01b4e4;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          width: 258px;
          padding: 15px;
          font-size: 1.4em;
          color: white;
        }

        li {
          padding-left: 25px;
          position: relative;
          font-weight: 400;
          span {
            position: absolute;
            right: 15px;
            font-weight: 300;
          }
        }
      }
    }

    .detailsArea {
      grid-column: 2;
      padding-left: 30px;
      padding-top: 30px;
      ul {
        list-style: none;
        padding-inline-start: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        row-gap: 20px;
        .movie,
        .tv,
        .collection {
          a {
            display: flex;
            flex-direction: row;
            justify-content: center;
            .image {
              img {
                width: 92px;
                height: 138px;
              }
            }
            .cardDetail {
              height: 138px;
              padding-left: 15px;
              overflow: hidden;
              h2 {
                margin-top: 10px;
                margin-bottom: 0;
                font-weight: 500;
                font-size: 1.2em;
              }
              h4 {
                margin: 0;
                font-weight: 300;
              }
              p {
                @include line-clamp(3);
              }
            }
          }
        }

        .person {
          a {
            display: flex;
            flex-direction: row;
            justify-content: center;
            .image {
              width: 90px;
              height: 90px;
            }
            .cardDetail {
              height: 90px;
              padding-left: 15px;
              overflow: hidden;
              h2 {
                margin-top: 10px;
                margin-bottom: 0;
                font-weight: 500;
                font-size: 1.2em;
              }
              h4 {
                margin: 0;
                font-weight: 300;
              }
              .known_for {
                text-overflow: clip;
              }
            }
          }
        }
        .company {
          a {
            display: flex;
            align-items: center;
          }
          .origin_country {
            background-color: gray;
            color: white;
            padding: 3px;
            border-radius: 3px;
            opacity: 0.6;
            height: max-content;
          }
        }
      }
    }
  }
</style>
