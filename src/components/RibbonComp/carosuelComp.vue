<script setup>
  import { useDbStore } from '@/stores/dbStore'
  import rate from '../rateChart.vue'
  import { toRefs, ref, onBeforeMount } from 'vue'
  import { useAuthStore } from '@/stores/authStore'
  import selectMenu from '@/components/customSelectMenu.vue'
  const props = defineProps({ carosuelArray: Array })
  const { carosuelArray } = toRefs(props)
  const store = useDbStore()
  const authStore = useAuthStore()
  const isHide = ref()
  function arrayCheck(obj) {
    if ('release_date' in obj) {
      return 'movie'
    } else if ('first_air_date' in obj) {
      return 'tv'
    } else return 'person'
  }
  const baseOptions = {
    options: false,
    addToList: false,
    rating: false
  }
  isHide.value = Array(20)
    .fill()
    .map(() => ({ ...baseOptions }))
  const isInclude = (media) => {
    let mediaTypeInFavs = arrayCheck(media)
    return authStore.user.favorites.find(
      ({ Id, mediaType }) => Id === media.id && mediaType === mediaTypeInFavs
    )
  }
  const addToFavorites = async (media) => {
    let mediaTypeInFavs = arrayCheck(media)
    const mediaInFavorites = authStore.user.favorites.find(
      ({ Id, mediaType }) => Id === media.id && mediaType === mediaTypeInFavs
    )
    if (mediaInFavorites) {
      authStore.user.favorites = authStore.user.favorites.filter((el) => {
        return el.Id != mediaInFavorites.Id
      })
      authStore.removeFromArray('users', authStore.user.email, 'favorites', {
        mediaType: mediaTypeInFavs,
        Id: media.id
      })
    } else {
      authStore.user.favorites.push({
        mediaType: mediaTypeInFavs,
        Id: media.id
      })
      authStore.addToArray('users', authStore.user.email, 'favorites', {
        mediaType: mediaTypeInFavs,
        Id: media.id
      })
    }
  }
  const isIncludeWatchlist = (media) => {
    let mediaTypeInWatchlist = arrayCheck(media)
    return authStore.user.watchlist.find(
      ({ Id, mediaType }) => Id === media.id && mediaType === mediaTypeInWatchlist
    )
  }
  const addToWatchlist = async (media) => {
    let mediaTypeInWatchlist = arrayCheck(media)
    const mediaInWatchlist = authStore.user.watchlist.find(
      ({ Id, mediaType }) => Id === media.id && mediaType === mediaTypeInWatchlist
    )
    if (mediaInWatchlist) {
      authStore.user.watchlist = authStore.user.watchlist.filter((el) => {
        return el.Id != mediaInWatchlist.Id
      })
      authStore.removeFromArray('users', authStore.user.email, 'watchlist', {
        mediaType: mediaTypeInWatchlist,
        Id: media.id
      })
    } else {
      authStore.user.watchlist.push({
        mediaType: mediaTypeInWatchlist,
        Id: media.id
      })
      authStore.addToArray('users', authStore.user.email, 'watchlist', {
        mediaType: mediaTypeInWatchlist,
        Id: media.id
      })
    }
  }
</script>

<template>
  <div class="carosuel" v-if="carosuelArray.length">
    <div
      v-for="(i, index) in carosuelArray"
      :key="index"
      class="card"
      v-click-outside="() => (isHide[index].options = false)">
      <div>
        <div :class="[isHide[index].options ? 'blur' : '']">
          <router-link
            :to="{
              name: 'media',
              params: {
                type: arrayCheck(carosuelArray[index]),
                id: carosuelArray[index].id
              }
            }"
            ><img
              :src="store.imageURL('w220_and_h330_face', carosuelArray[index].poster_path)"
              alt=""
              v-lazy-load
          /></router-link>
          <rate
            :popularity="Math.round(carosuelArray[index].vote_average * 10)"
            :class="[{ blurrate: isHide[index].options }, 'rate']" />
        </div>

        <div v-if="authStore.isAuthenticated">
          <icon-lib
            icon="fa-solid fa-gears"
            size="lg"
            color="#aab8c3"
            class="optionsIcon"
            @click="() => (isHide[index].options = !isHide[index].options)"></icon-lib>

          <ul v-if="isHide[index].options" class="options">
            <li>
              <icon-lib icon="fa-list" />
              <span @click="() => (isHide[index].addToList = !isHide[index].addToList)"
                >Add to List</span
              >
              <div class="addToList" v-if="isHide[index].addToList">
                <span><app-link :to="'/list/new'">Create List</app-link> </span>
                <span v-if="authStore.user.lists.length != 0">
                  <span class="selectMenu">
                    <selectMenu
                      :dropdownArr="authStore.user.lists"
                      :defaultVal="authStore.user.lists[0]"
                      :objectKey="'listName'" />
                  </span>
                </span>
              </div>
            </li>
            <li @click="addToFavorites(carosuelArray[index])">
              <icon-lib
                icon="fa-heart"
                :class="[isInclude(carosuelArray[index]) ? 'colorRed' : '']" />
              Favorite
            </li>
            <li @click="addToWatchlist(carosuelArray[index])">
              <icon-lib
                icon=" fa-bookmark"
                :class="[isIncludeWatchlist(carosuelArray[index]) ? 'colorBlue' : '']" />
              Watchlist
            </li>
            <li
              @click="() => (isHide[index].rating = !isHide[index].rating)"
              v-if="authStore.user.sessionId">
              <icon-lib icon="fa-star" /> Your Rating
            </li>
          </ul>
        </div>
      </div>

      <div class="content">
        <div class="title">
          <h4 v-if="carosuelArray[index].title">
            <router-link
              :to="{
                name: 'media',
                params: {
                  type: 'movie',
                  id: carosuelArray[index].id
                }
              }"
              >{{ carosuelArray[index].title }}</router-link
            >
          </h4>
          <h4 v-if="carosuelArray[index].name">
            <router-link
              :to="{
                name: 'media',
                params: {
                  type: 'tv',
                  id: carosuelArray[index].id
                }
              }"
              >{{ carosuelArray[index].name }}</router-link
            >
          </h4>
        </div>
        <div class="releaseDate">
          <h5 v-if="carosuelArray[index].release_date">
            {{ $d(carosuelArray[index].release_date, 'short') }}
          </h5>
          <h5 v-if="carosuelArray[index].first_air_date">
            {{ $d(carosuelArray[index].first_air_date, 'short') }}
          </h5>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  @media all and (max-width: 750px) {
    .carosuel {
      height: 30em;
    }

    .rate {
      width: 3.4em;
      height: 3.4em;
    }
  }
  @media all and (min-width: 751px) {
    .carosuel {
      height: 23em;
    }
    .rate {
      width: 2.2em;
      height: 2.2em;
    }
  }
  .colorRed {
    color: red;
  }
  .colorBlue {
    color: #01b4e4;
  }
  .carosuel {
    display: inline-flex;
    overflow-x: scroll;
    overflow-y: hidden;
  }
  .blurrate {
    filter: blur(15px);
  }
  .blur::before {
    width: 154px;
    height: 358px;
    content: '';
    backdrop-filter: blur(15px);
    border-radius: 15px;
    position: absolute;
    z-index: 15;
  }
  .addToList {
    position: absolute;
    display: flex;
    flex-direction: column;
    background-color: white;
    width: 5em;
    padding: 7px;
    right: calc(-5.2em - 7px);
    border-radius: 7px;
    top: -20px;
  }
  .selectMenu {
    position: relative;
    z-index: 850;
  }
  .card {
    margin-left: 11px;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .optionsIcon {
    position: absolute;
    top: 10px;
    right: 15px;
    z-index: 20;
  }

  .options {
    display: flex;
    flex-direction: column;
    padding: 15px;
    row-gap: 5px;
    background-color: white;
    padding-inline-start: 10px;
    list-style: none;
    position: absolute;
    top: 20px;
    left: 10px;
    border-radius: 10px;
    color: black;
    z-index: 20;
  }
  .rate {
    display: inline;
    position: absolute;
    top: 210px;
    left: 10px;

    z-index: 50;
  }

  img {
    border-radius: 12px;
    width: 154px;
    height: 230px;
  }

  .title {
    margin-top: 1em;
    margin-bottom: 5px;
  }

  .title h4 {
    margin: 0;
    text-align: center;
    font-weight: 500;
  }

  .releaseDate h5 {
    margin: 0;
    font-weight: 300;
  }

  .content {
    width: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: end;
    flex-wrap: wrap;
  }
</style>
