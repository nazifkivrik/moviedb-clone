import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import searchResults from '../views/SearchResults.vue'
import ViewContainer from '../views/ViewContainer.vue'
import translationDetails from '@/components/DetailComponents/movieAndTV/translationDetails.vue'
import CastDetails from '../components/DetailComponents/movieAndTV/castDetails.vue'
import videoPlayer from '../components/videoPlayer.vue'
import alternativeTitles from '../components/DetailComponents/movieAndTV/alternativeTitles.vue'
import releaseDates from '../components/DetailComponents/movieAndTV/releaseDates.vue'
import images from '../components/DetailComponents/movieAndTV/mediaImages.vue'
import videos from '../components/DetailComponents/movieAndTV/mediaVideos.vue'
import episodeGroups from '@/components/DetailComponents/movieAndTV/episodeGroups.vue'
import tvSeasons from '@/components/DetailComponents/movieAndTV/tvSeasons.vue'
import group from '@/components/DetailComponents/movieAndTV/episodeGroupDetail.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/search',
      name: 'searchResults',
      component: searchResults
    },
    {
      path: '/:type/:id',
      component: ViewContainer,
      children: [{ path: 'player', component: videoPlayer }]
    },
    {
      path: '/:type/:id/titles',
      name: 'titles',
      component: alternativeTitles
    },
    {
      path: '/:type/:id/cast',
      name: 'cast',
      component: CastDetails
    },
    {
      path: '/:type/:id/release_dates',
      name: 'release_dates',
      component: releaseDates
    },
    {
      path: '/:type/:id/translations',
      name: 'translations',
      component: translationDetails
    },
    {
      path: '/:type/:id/episode_groups',
      name: 'episodeGroups',
      component: episodeGroups
    },
    {
      path: '/:type/:id/episode_groups/:groupId',
      name: 'group',
      component: group,
      props: true
    },
    {
      path: '/:type/:id/seasons',
      name: 'seasons',
      component: tvSeasons
    },
    {
      path: '/:type/:id/images/:images',
      name: 'images',
      component: images
    },
    {
      path: '/:type/:id/videos',
      name: 'videos',
      component: videos,
      children: [{ path: 'player', component: videoPlayer }]
    }
  ]
})

export default router
