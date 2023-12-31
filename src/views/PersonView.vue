<script setup>
  import subNavigationBar from '@/components/subNavigationBar.vue'
  import carosuelComp from '@/components/RibbonComp/carosuelComp.vue'

  import { useDbStore } from '@/stores/dbStore'
  import { SortBy, GroupBy, ageCalculator } from '@/utils/functions.js'
  import { onBeforeMount, ref, toRefs, watch, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  const store = useDbStore()
  const { person, mobile } = toRefs(store)
  const route = useRoute()

  const selectedMediaType = ref('All')
  const mediaTypes = ['All', 'Movie', 'TV Shows']
  const selectedDepartment = ref('Acting')
  const departments = ref([])

  async function initialize() {
    if (!person.value) {
      await store.getPerson(route.params.id, store.language)
    }
    person.value.profiles = person.value.images.profiles
    SortBy(person.value.movie_credits.cast, 'release_date')
    SortBy(person.value.tv_credits.cast, 'release_date')

    person.value.movie_credits.crew = GroupBy(
      SortBy(person.value.movie_credits.crew, 'release_date'),
      'department'
    )
    person.value.tv_credits.crew = GroupBy(
      SortBy(person.value.tv_credits.crew, 'release_date'),
      'department'
    )
    person.value.combined_credits.crew = GroupBy(
      SortBy(person.value.combined_credits.crew, 'release_date'),
      'department'
    )
    person.value.age = ageCalculator(person.value.birthday)

    departmentsCalc('All')
  }
  function departmentsCalc(mediaType) {
    function departmentArray(creditsType) {
      if (creditsType.cast) {
        departments.value = ['Acting']
      }
      Object.keys(creditsType.crew).forEach((department) => {
        if (!departments.value.includes(department)) {
          departments.value.push(department)
        }
      })
    }
    switch (mediaType) {
      case 'TV Shows':
        departmentArray(person.value.tv_credits)
        break
      case 'Movie':
        departmentArray(person.value.movie_credits)
        break
      case 'All':
        departmentArray(person.value.combined_credits)
    }
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
      case 'All':
        if (selectedDepartment === 'Acting') {
          return person.value.combined_credits.cast
        } else return person.value.combined_credits.crew[selectedDepartment]
    }
  }
  onBeforeMount(() => {
    initialize()
  })
  onMounted(() => {
    watch(
      () => selectedMediaType.value,
      () => departmentsCalc(selectedMediaType.value)
    )
  })
</script>

<template>
  <subNavigationBar />
  <template v-if="mobile">
    <template v-if="person">
      <div class="personView">
        <div>
          <img :src="store.imageURL('w375_and_h375_face', person.profile_path)" alt="" />
        </div>
        <h1>{{ person.name }}</h1>
        <div class="links">
          <app-link
            v-if="person.external_ids.instagram_id"
            :to="'https://www.instagram.com/' + person.external_ids.instagram_id"
            ><icon-lib icon="fa-brands fa-instagram" size="2xl" />
          </app-link>
          <app-link
            v-if="person.external_ids.facebook_id"
            :to="'https://www.facebook.com/' + person.external_ids.facebook_id"
            ><icon-lib icon="fa-brands fa-facebook" size="2xl" />
          </app-link>
          <app-link
            v-if="person.external_ids.twitter_id"
            :to="'https://www.twitter.com/' + person.external_ids.twitter_id"
            ><icon-lib icon="fa-brands fa-twitter" size="2xl" />
          </app-link>
          <app-link
            v-if="person.external_ids.imdb_id"
            :to="'https://www.imdb.com/' + person.external_ids.imdb_id"
            ><icon-lib icon="fa-brands fa-imdb" size="2xl" />
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
          <h3>Biography</h3>
          <p>{{ person.biography }}</p>
          <h4>Known For</h4>
        </div>

        <carosuelComp
          :carosuel-array="SortBy(person.combined_credits.cast, 'release_date')"
          class="carosuel" />
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
              <template v-for="department in departments" :key="department">
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
    </template>
  </template>
  <template v-if="!mobile">
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
          <carosuelComp
            :carosuel-array="SortBy(person.combined_credits.cast, 'release_date')"
            class="carosuel" />
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
                <template v-for="department in departments" :key="department">
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
</template>
<style scoped lang="scss">
  @media all and (min-width: 751px) {
    .personView {
      display: flex;
      flex-direction: row;
      justify-content: center;
      padding-left: 60px;
      margin-top: 30px;
      .leftSide {
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
        width: 75vw;
        .carosuel {
          width: 75vw;
        }
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
      }
    }
  }
  @media all and (max-width: 750px) {
    .personView {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;

      img {
        width: 40vw;
        border-radius: 10px;
      }
      h1 {
        font-size: 2.2em;
      }
      .links {
        display: flex;
        column-gap: 1.3em;

        a {
          font-size: 1.3em;
        }
      }
      .personalInfo {
        display: flex;
        flex-direction: row;
        padding: 0 15px;
        flex-wrap: wrap;
        h2 {
          font-size: 1.8em;
          font-weight: 500;
          margin-bottom: 5px;
          width: 100%;
        }
        span {
          display: flex;
          flex-direction: column;
          font-size: 1.2em;
          font-weight: 400;
          width: 50%;
          strong {
            font-size: 1.3em;
            font-weight: 500;
          }
        }
        h3 {
          width: 100%;
          font-size: 1.5em;
          margin-bottom: 0;
        }
        p {
          overflow: scroll;
          word-break: break-all;
        }
        h4 {
          margin-bottom: 5px;
          font-size: 1.5em;
        }
      }

      .carosuel {
        width: 100%;
      }
    }
  }
  .actingTable {
    display: flex;
    position: relative;

    margin-top: 35px;
    width: 100%;
    h2 {
      padding-left: 15px;
      margin: 0;
      font-size: 1.4em;
    }
    .mediaType {
      height: 1.3em;
      overflow: hidden;
      right: 8em;
      font-size: 1.3em;
      cursor: pointer;
      position: absolute;
      z-index: 10;
      box-shadow:
        5px 5px 10px 0 #edededff,
        -5px -5px 10px 0 #edededff;

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
      height: 1.3em;
      overflow: hidden;
      position: absolute;
      font-size: 1.3em;
      right: 1em;

      z-index: 10;
      cursor: pointer;
      box-shadow:
        5px 5px 10px 0 #edededff,
        -5px -5px 10px 0 #edededff;
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
</style>
