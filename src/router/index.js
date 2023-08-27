import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ViewContainer from '../views/ViewContainer.vue'
import translationDetails from '@/components/DetailComponents/translationDetails.vue'
import CastDetails from '../components/DetailComponents/castDetails.vue'
import videoPlayer from '../components/videoPlayer.vue'
import alternativeTitles from '../components/DetailComponents/alternativeTitles.vue'
import releaseDates from '../components/DetailComponents/releaseDates.vue'
import backdrops from '../components/DetailComponents/mediaBackdrops.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/:type/:id',
      component: ViewContainer,
      props: true,
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
      path: '/:type/:id/images/backdrops',
      name: 'backdrops',
      component: backdrops
    }
  ]
})

export default router
