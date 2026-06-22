import { createRouter, createWebHistory } from 'vue-router';
import BuildingList from '../views/BuildingList.vue';
import BuildingDetail from '../views/BuildingDetail.vue';
import Statistics from '../views/Statistics.vue';
import ButtonTypeList from '../views/ButtonTypeList.vue';
import Timeline from '../views/Timeline.vue';
import CityIndex from '../views/CityIndex.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'list', component: BuildingList },
    { path: '/cities', name: 'cities', component: CityIndex },
    { path: '/timeline', name: 'timeline', component: Timeline },
    { path: '/statistics', name: 'statistics', component: Statistics },
    { path: '/buildings/:id', name: 'detail', component: BuildingDetail, props: true },
    { path: '/button-types', name: 'buttonTypes', component: ButtonTypeList },
  ],
});

export default router;
