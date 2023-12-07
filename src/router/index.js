import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import searchResults from '../views/SearchResults.vue'
import ViewContainer from '../views/ViewContainer.vue'
import translationDetails from '@/views/detailViews/translationDetails.vue'
import CastDetails from '@/views/detailViews//castDetails.vue'
import videoPlayer from '../components/videoPlayer.vue'
import alternativeTitles from '@/views/detailViews//alternativeTitles.vue'
import releaseDates from '@/views/detailViews//releaseDates.vue'
import images from '@/views/detailViews//mediaImages.vue'
import videos from '@/views/detailViews//mediaVideos.vue'
import episodeGroups from '@/views/detailViews//episodeGroups.vue'
import tvSeasons from '@/views/detailViews//tvSeasons.vue'
import group from '@/views/detailViews//episodeGroupDetail.vue'
import discoverMovie from '@/views/DiscoverMovie.vue'
import discoverTV from '@/views/DiscoverTVShows.vue'
import tvEpisodes from '@/views/detailViews/tvEpisodes.vue'
import authPage from '@/views/AuthPage.vue'
import { useAuthStore } from '@/stores/authStore.js'

import userSettings from '@/views/user/UserSettings.vue'
import createList from '@/views/user/createList.vue'
import editList from '@/views/user/editList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'TMDB-C' }
    },
    {
      path: '/login',
      name: 'authPage',
      component: authPage,
      meta: { title: 'Login', auth: false }
    },
    {
      path: '/search',
      name: 'searchResults',
      component: searchResults,
      meta: { title: 'Search Results' }
    },
    {
      path: '/movie',
      component: discoverMovie,
      meta: { title: 'Discover' }
    },
    {
      path: '/tv',
      component: discoverTV,
      meta: { title: 'Discover' }
    },
    {
      path: '/:type/:id',
      name: 'media',
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
      path: '/:type/:id/season/:seasonNumber',
      name: 'season',
      component: tvEpisodes
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
    },
    {
      path: '/settings',
      name: 'settings',
      component: userSettings,
      meta: { title: 'Settings', auth: true }
    },
    {
      path: '/list/new',
      component: createList,
      meta: { title: 'New List', auth: true }
    },
    {
      path: '/list/edit',
      component: editList,
      meta: { title: 'Edit List', auth: true }
    }
  ]
})
router.beforeEach((to, from) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
})
router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()
  if (to.meta.auth && !authStore.user) {
    return { name: 'authPage' }
  }
  if (authStore.user && to.path === '/login') {
    return { name: 'home' }
  }
})
export default router
