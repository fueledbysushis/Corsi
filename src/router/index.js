import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import GamePage from '../views/GamePage.vue'
import TrainingPage from '../views/TrainingPage.vue'
import ChooseModePage from "@/views/ChooseModePage.vue";

const routes = [
    { path: '/', component: HomePage },
    { path: '/choose-mode', component: ChooseModePage },
    { path: '/game/:mode', component: GamePage },
    { path: '/training/:mode', component: TrainingPage }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
