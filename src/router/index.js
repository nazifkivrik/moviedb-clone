import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MovieView from '../views/MovieView.vue'
import TVShowView from '../views/TVShowView.vue'
import PersonView from '../views/PersonView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    { path: '/movie/:id', name: 'MovieView', component: MovieView },
    { path: '/tv/:id', name: 'TVShowView', component: TVShowView },
    { path: '/person/:id', name: 'PersonView', component: PersonView }
  ]
})

export default router
