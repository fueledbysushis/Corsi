<template>
  <div>
    <h1>Corsi</h1>
    <p style="margin-top:30px;">Principe : reproduis la séquence de carrés qui s’allument.</p>
    <div
        class="board"
        :style="{ width: boardWidth + 'px', height: boardHeight + 'px' }"
    >
      <div
          v-for="square in squares"
          :key="square.index"
          class="square"
          :style="{
          position: 'absolute',
          top: square.top + 'px',
          left: square.left + 'px',
          width: squareSize + 'px',
          height: squareSize + 'px'
        }"
      ></div>
    </div>
    <button @click="choose('game')" class="red-btn">Démarrer</button>
    <button @click="choose('training')" class="red-btn">Entrainement</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const boardWidth = Math.min(window.innerWidth, 900)
const boardHeight = Math.min(window.innerHeight - 200, 700)
const squareSize = boardWidth < 600 ? 50 : 70
const SQUARE_COUNT = 16

function randomPositions(count) {
  const positions = []
  let attempts = 0
  while (positions.length < count && attempts < 1000) {
    attempts++
    const top = Math.random() * (boardHeight - squareSize)
    const left = Math.random() * (boardWidth - squareSize)
    const overlap = positions.some(
        pos =>
            Math.abs(pos.left - left) < squareSize + 8 &&
            Math.abs(pos.top - top) < squareSize + 8
    )
    if (!overlap) {
      positions.push({ index: positions.length, top, left })
    }
  }
  return positions
}

const squares = ref(randomPositions(SQUARE_COUNT))
const router = useRouter()
const choose = type => router.push(`/choose-mode?type=${type}`)
</script>

<style scoped>
.board {
  position: relative;
  margin: 20px auto 0 auto;
  border-radius: 12px;
  overflow: hidden;
  background: transparent;
  min-height: 220px;
}
.square {
  background: #222;
  border-radius: 6px;
  box-sizing: border-box;
  border: 2px solid #fff;
  pointer-events: none;
}
.red-btn {
  background: #d32f2f;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 12px 28px;
  font-size: 1.1em;
  margin: 18px auto 0 auto;
  display: block;
  cursor: pointer;
}
.red-btn:hover {
  background: #b71c1c;
}
@media (max-width: 600px) {
  .board {
    width: 98vw !important;
    height: 60vw !important;
    min-width: 300px;
    min-height: 250px;
  }
}
</style>
