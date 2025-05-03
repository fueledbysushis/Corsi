<template>
  <div>
    <h2>Choisis le mode</h2>
    <button class="mode-btn" @click="go('normal')">Normal</button>
    <button class="mode-btn" @click="go('reverse')">Reverse</button>
    <button class="back-btn" @click="goHome">Retour</button>
  </div>
</template>
<script setup>
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const type = route.query.type // 'game' ou 'training'

function go(mode) {
  if (type === 'game') {
    router.push(`/game/${mode}`)
  } else if (type === 'training') {
    router.push(`/training/${mode}`)
  }
}
function goHome() {
  router.push('/')
}
</script>
<style scoped>
.mode-btn {
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 14px 32px;
  font-size: 1.2em;
  margin: 12px auto;
  display: block;
  cursor: pointer;
}
.mode-btn:hover {
  background: #1565c0;
}
.back-btn {
  background: #aaa;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 18px;
  font-size: 1em;
  margin: 24px auto 0 auto;
  display: block;
  cursor: pointer;
}
</style>
