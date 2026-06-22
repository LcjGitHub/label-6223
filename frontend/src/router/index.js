import { createRouter, createWebHistory } from 'vue-router';
import BuildingList from '../views/BuildingList.vue';
import BuildingDetail from '../views/BuildingDetail.vue';
import Statistics from '../views/Statistics.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'list', component: BuildingList },
    { path: '/statistics', name: 'statistics', component: Statistics },
    { path: '/buildings/:id', name: 'detail', component: BuildingDetail, props: true },
  ],
});

export default router;
