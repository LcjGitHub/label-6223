import { createRouter, createWebHistory } from 'vue-router';
import BuildingList from '../views/BuildingList.vue';
import BuildingDetail from '../views/BuildingDetail.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'list', component: BuildingList },
    { path: '/buildings/:id', name: 'detail', component: BuildingDetail, props: true },
  ],
});

export default router;
