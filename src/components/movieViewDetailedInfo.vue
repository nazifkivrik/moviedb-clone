<script setup>
  import { useDbStore } from '../stores/dbStore'
  import { storeToRefs } from 'pinia'
  import { useRoute } from 'vue-router'
  import { onBeforeMount } from 'vue'
  import { languageFormatter, addDolarSign } from '@/utils/functions'
  const store = useDbStore()
  const { shared } = storeToRefs(store)
  const route = useRoute()
  let isMovie

  onBeforeMount(() => {
    if (route.params.type === 'movie') {
      isMovie = true
    } else {
      isMovie = false
    }
  })
</script>

<template>
  <template v-if="shared">
    <div class="greyColumn">
      <div class="links">
        <app-link :to="shared.homepage" v-if="shared.homepage"
          ><icon-lib icon="link" size="xl"
        /></app-link>
        <app-link
          :to="'https://www.facebook.com/' + shared.external_ids.facebook_id"
          v-if="shared.external_ids.facebook_id">
          <icon-lib icon="fa-brands fa-facebook" size="xl" />
        </app-link>
        <app-link
          :to="'https://www.instagram.com/' + shared.external_ids.instagram_id"
          v-if="shared.external_ids.instagram_id"
          ><icon-lib icon="fa-brands fa-instagram" size="xl"
        /></app-link>
        <app-link
          :to="'https://www.twitter.com/' + shared.external_ids.twitter_id"
          v-if="shared.external_ids.twitter_id">
          <icon-lib icon="fa-brands fa-twitter" size="xl"
        /></app-link>
        <app-link
          :to="'https://www.imdb.com/' + shared.external_ids.imdb_id"
          v-if="shared.external_ids.imdb_id"
          ><icon-lib icon="fa-brands fa-imdb" size="2xl"
        /></app-link>
      </div>
      <p>
        <strong>{{ $t('Status') }}</strong
        >{{ $t(shared.status) }}
      </p>
      <p v-if="!isMovie">
        <strong>{{ $t('Network') }}</strong
        ><img
          :src="store.imageURL('h30', shared.networks[0].logo_path)"
          alt=""
          v-if="shared.networks" />
      </p>
      <p v-if="!isMovie">
        <strong>{{ $t('Type') }}</strong
        >{{ shared.type }}
      </p>
      <p>
        <strong>{{ $t('Original Language') }}</strong
        >{{ languageFormatter(shared.original_language) }}
      </p>
      <p v-if="isMovie">
        <strong>{{ $t('Budget') }}</strong
        >{{ addDolarSign(shared.budget) }}
      </p>
      <p v-if="isMovie">
        <strong>{{ $t('Revenue') }}</strong
        >{{ addDolarSign(shared.revenue) }}
      </p>
      <p>
        <strong>{{ $t('Keywords') }}</strong>
      </p>
      <div class="keywords" v-if="isMovie">
        <div class="keyword" v-for="keyword in shared.keywords.keywords" :key="keyword.id">
          {{ keyword.name }}
        </div>
      </div>
      <div class="keywords" v-if="!isMovie">
        <div class="keyword" v-for="keyword in shared.keywords.results" :key="keyword.id">
          {{ keyword.name }}
        </div>
      </div>
    </div>
  </template>
</template>

<style scoped lang="scss">
  .greyColumn {
    width: 280px;
    display: flex;
    flex-direction: column;
    margin-left: 25px;
    p {
      display: block;
      strong {
        display: block;
      }
    }
    .links {
      width: 260px;
      justify-content: space-between;
      a {
        margin-right: 15px;
      }
    }
    .keywords {
      display: inline-flex;
      flex-wrap: wrap;
      .keyword {
        display: inline-block;
        width: max-content;
        margin: 3px;
        box-shadow: 2px 1px 3px black;
        padding: 2px 5px;
      }
    }
  }
</style>
