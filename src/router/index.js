import { createRouter, createWebHistory } from 'vue-router'
import videoPlayer from '../components/videoPlayer.vue'
import { useAuthStore } from '@/stores/authStore.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: 'TMDB-C' }
    },
    {
      path: '/login',
      name: 'authPage',
      component: () => import('@/views/AuthPage.vue'),

      meta: { title: 'Login', auth: false }
    },
    {
      path: '/search',
      name: 'searchResults',
      component: () => import('@/views/SearchResults.vue'),

      meta: { title: 'Search Results' }
    },
    {
      path: '/movie',
      component: () => import('@/views/DiscoverMovie.vue'),

      meta: { title: 'Discover' }
    },
    {
      path: '/tv',
      component: () => import('@/views/DiscoverTVShows.vue'),
      meta: { title: 'Discover' }
    },
    {
      path: '/:type/:id',
      name: 'media',
      component: () => import('@/views/ViewContainer.vue'),

      children: [{ path: 'player', component: videoPlayer }]
    },
    {
      path: '/:type/:id/titles',
      name: 'titles',
      component: () => import('@/views/detailViews//alternativeTitles.vue')
    },
    {
      path: '/:type/:id/cast',
      name: 'cast',
      component: () => import('@/views/detailViews//castDetails.vue')
    },
    {
      path: '/:type/:id/release_dates',
      name: 'release_dates',
      component: () => import('@/views/detailViews//releaseDates.vue')
    },
    {
      path: '/:type/:id/translations',
      name: 'translations',
      component: () => import('@/views/detailViews/translationDetails.vue')
    },
    {
      path: '/:type/:id/episode_groups',
      name: 'episodeGroups',
      component: () => import('@/views/detailViews//episodeGroups.vue')
    },
    {
      path: '/:type/:id/episode_groups/:groupId',
      name: 'group',
      component: () => import('@/views/detailViews//episodeGroupDetail.vue'),

      props: true
    },
    {
      path: '/:type/:id/seasons',
      name: 'seasons',
      component: () => import('@/views/detailViews//tvSeasons.vue')
    },
    {
      path: '/:type/:id/season/:seasonNumber',
      name: 'season',
      component: () => import('@/views/detailViews/tvEpisodes.vue')
    },
    {
      path: '/:type/:id/images/:images',
      name: 'images',
      component: () => import('@/views/detailViews//mediaImages.vue')
    },
    {
      path: '/:type/:id/videos',
      name: 'videos',
      component: () => import('@/views/detailViews//mediaVideos.vue'),
      children: [{ path: 'player', component: videoPlayer }]
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/user/UserSettings.vue'),
      meta: { title: 'Settings', auth: true }
    },
    {
      path: '/list/new',
      component: () => import('@/views/user/createList.vue'),
      meta: { title: 'New List', auth: true }
    },
    {
      path: '/list/edit',
      component: () => import('@/views/user/editList.vue'),
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
