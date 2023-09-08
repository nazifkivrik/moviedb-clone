<script setup>
  import subNavigationBar from '../components/subNavigationBar.vue'
  import { ref, onBeforeMount, toRefs } from 'vue'
  import { useDbStore } from '../stores/dbStore'
  import { useRoute } from 'vue-router'
  const store = useDbStore()
  const { person } = toRefs(store)
  const route = useRoute()
  import carosuelComp from '../components/RibbonComp/carosuelComp.vue'
  const selectedMediaType = ref('Movie')
  const mediaTypes = ['Movie', 'TV Shows']
  const selectedDepartment = ref('Acting')
  function sortByReleaseDates(a, b) {
    if (a.vote_count < b.vote_count) {
      return 1
    }
    if (a.vote_count > b.vote_count) {
      return -1
    }
    return 0
  }
  function filterWorks(selectedMediaType, selectedDepartment) {
    switch (selectedMediaType) {
      case 'Movie':
        if (selectedDepartment === 'Acting') {
          return person.value.movie_credits.cast
        } else return person.value.movie_credits.crew[selectedDepartment]
      case 'TV Shows':
        if (selectedDepartment === 'Acting') {
          return person.value.tv_credits.cast
        } else return person.value.tv_credits.crew[selectedDepartment]
    }
  }
  onBeforeMount(() => {})
</script>

<template>
  <subNavigationBar />
  <template v-if="person">
    <div class="personView">
      <div class="leftSide">
        <div class="image">
          <img :src="store.imageURL('w185', person.profile_path)" alt="" />
        </div>
        <div class="links">
          <app-link
            v-if="person.external_ids.instagram_id"
            :to="'https://www.instagram.com/' + person.external_ids.instagram_id"
            ><icon-lib icon="fa-brands fa-instagram" size="xl" />
          </app-link>
          <app-link
            v-if="person.external_ids.facebook_id"
            :to="'https://www.facebook.com/' + person.external_ids.facebook_id"
            ><icon-lib icon="fa-brands fa-facebook" size="xl" />
          </app-link>
          <app-link
            v-if="person.external_ids.twitter_id"
            :to="'https://www.twitter.com/' + person.external_ids.twitter_id"
            ><icon-lib icon="fa-brands fa-twitter" size="xl" />
          </app-link>
          <app-link
            v-if="person.external_ids.imdb_id"
            :to="'https://www.imdb.com/' + person.external_ids.imdb_id"
            ><icon-lib icon="fa-brands fa-imdb" size="xl" />
          </app-link>
        </div>
        <div class="personalInfo">
          <h2>Personal Info</h2>
          <span><strong>Known For</strong>{{ person.known_for_department }}</span>
          <span
            ><strong>Known Credits</strong
            >{{ person.movie_credits.cast.length + person.tv_credits.cast.length }}
          </span>
          <span><strong>Gender</strong>{{ person.gender }}</span>
          <span><strong>Birthday</strong>{{ person.birthday }}({{ person.age }} years old)</span>
          <span><strong>Place of Birth</strong>{{ person.place_of_birth }}</span>
          <span
            ><strong>Also Known As</strong>
            <p v-for="known in person.also_known_as" :key="known">{{ known }}</p></span
          >
        </div>
      </div>
      <div class="rightSide">
        <h1>{{ person.name }}</h1>
        <h3>Biography</h3>
        <p>{{ person.biography }}</p>
        <h4>Known For</h4>
        <carosuelComp :carosuel-array="person.combined_credits.cast.sort(sortByReleaseDates)" />
        <div class="actingTable">
          <h2>{{ selectedDepartment }}</h2>
          <div class="mediaType">
            {{ selectedMediaType }}
            <ul>
              <template v-for="mediaType in mediaTypes" :key="mediaType">
                <li @click="() => (selectedMediaType = mediaType)">{{ mediaType }}</li>
              </template>
            </ul>
          </div>
          <div class="department">
            Department
            <ul>
              <template v-for="department in person.departments" :key="department">
                <li @click="() => (selectedDepartment = department)">{{ department }}</li>
              </template>
            </ul>
          </div>
          <div class="works">
            <ul>
              <li v-for="work in filterWorks(selectedMediaType, selectedDepartment)" :key="work">
                <span>{{ work.release_date }}{{ work.first_air_date }} &#9678;</span>
                <span>{{ work.original_title }}{{ work.name }}</span>
                <span class="character">
                  <span v-if="work.character">as</span> {{ work.character }}</span
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>
<style scoped lang="scss">
  .personView {
    display: flex;
    flex-direction: row;
    justify-content: center;
    max-width: 1300px;
    margin-left: 60px;
    margin-top: 30px;
    .leftSide {
      width: 350px;
      display: flex;
      flex-direction: column;
      align-items: start;
      .image {
        img {
          border-radius: 10px;
        }
      }
      .links {
        display: flex;
        flex-direction: row;
        justify-content: left;
        column-gap: 20px;
        margin: 25px 5px;
      }
      .personalInfo {
        h2 {
          font-size: 1.5em;
          margin-top: 0;
          display: flex;
          row-gap: 10px;
        }
        span {
          display: block;
          margin: 20px 0;
          strong {
            display: block;
            margin-bottom: 5px;
          }
        }
      }
    }
    .rightSide {
      margin-left: 40px;
      h1 {
        font-size: 2em;
      }
      h3 {
        font-size: 1.4em;
        font-weight: 400;
        margin-bottom: 0;
      }
      h4 {
        font-size: 1.3em;
        margin: 0;
        margin-bottom: 10px;
      }
      .actingTable {
        display: flex;
        position: relative;
        margin-top: 35px;
        h2 {
          margin: 0;
          font-size: 1.4em;
        }
        .mediaType {
          height: 16px;
          overflow: hidden;
          right: 100px;
          cursor: pointer;
          position: absolute;
          z-index: 10;
          &:hover {
            overflow: visible;
          }

          ul {
            list-style: none;
            padding-inline-start: 0;
            margin: 0;
          }
        }
        .department {
          height: 18px;
          overflow: hidden;
          position: absolute;
          right: 0;
          z-index: 10;
          cursor: pointer;
          &:hover {
            overflow: visible;
          }

          ul {
            list-style: none;
            padding-inline-start: 0;
            margin: 0;
          }
        }
        .works {
          position: absolute;
          top: 40px;
          ul {
            list-style: none;
            padding-inline-start: 0;
            li {
              margin: 10px 0;
              span {
                margin: 0 10px;
              }
              .character {
                font-weight: 300;
                display: block;
                margin-left: 130px;
              }
            }
          }
        }
      }
    }
  }
</style>
