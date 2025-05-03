<template>
  <div>
    <div v-if="showCountdown" class="countdown-overlay">
      <div class="countdown-number">{{ countdown }}</div>
    </div>
    <h2>Jeu ({{ mode === 'reverse' ? 'Reverse' : 'Normal' }})</h2>
    <div class="round-info">Round : {{ round }}</div>
    <div
        class="board"
        :style="{ width: boardWidth + 'px', height: boardHeight + 'px' }"
    >
      <div
          v-for="square in squares"
          :key="square.index"
          :class="['square', { lit: isLit(square.index), clickable: clickable && !finished }]"
          @pointerdown="!finished && clickSquare(square.index)"
          :style="{
          position: 'absolute',
          top: square.top + 'px',
          left: square.left + 'px',
          width: squareSize + 'px',
          height: squareSize + 'px'
        }"
      ></div>
    </div>
    <div v-if="finished">
      <h2>Perdu !</h2>
      <button class="menu-btn" @pointerdown="goHome">Retour au menu</button>
    </div>
    <div v-else>
      <div v-if="!clickable" class="info">Regarde la séquence...</div>
      <div v-else class="info">Clique sur les carrés dans le bon ordre !</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const boardWidth = Math.min(window.innerWidth, 900)
const boardHeight = Math.min(window.innerHeight - 200, 700)
const squareSize = boardWidth < 600 ? 50 : 70
const SQUARE_COUNT = 16

const route = useRoute()
const router = useRouter()
const mode = route.params.mode

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
const sequence = ref([])
const userSequence = ref([])
const clickable = ref(false)
const finished = ref(false)
const litIndex = ref(-1)
const countdown = ref(0)
const showCountdown = ref(false)
const round = ref(1)
const errorCount = ref(0)

let sequenceTimeout = null
let countdownInterval = null

function randomSequence(len) {
  const indices = squares.value.map(sq => sq.index)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return indices.slice(0, len)
}

function showSequence() {
  if (finished.value) return
  clickable.value = false
  userSequence.value = []
  sequence.value = randomSequence(round.value)
  let idx = 0
  function next() {
    if (finished.value) return
    if (idx < sequence.value.length) {
      litIndex.value = sequence.value[idx]
      sequenceTimeout = setTimeout(() => {
        litIndex.value = -1
        idx++
        sequenceTimeout = setTimeout(next, 300)
      }, 500)
    } else {
      clickable.value = true
    }
  }
  next()
}

function startCountdownAndShowSequence(incrementRound = false) {
  if (finished.value) return
  userSequence.value = []
  if (incrementRound) {
    round.value++
  }
  countdown.value = 3
  showCountdown.value = true
  if (countdownInterval) clearInterval(countdownInterval)
  countdownInterval = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      clearInterval(countdownInterval)
      showCountdown.value = false
      showSequence()
    }
  }, 1000)
}

function isLit(i) {
  if (litIndex.value === i) return true
  if (userSequence.value.includes(i)) return true
  return false
}

function clickSquare(i) {
  if (!clickable.value || finished.value) return

  userSequence.value.push(i) // Toujours illuminer le carré cliqué

  // Calcul de l'index attendu dans la séquence
  const idx = userSequence.value.length - 1
  const expected = mode === 'reverse'
      ? sequence.value[sequence.value.length - 1 - idx]
      : sequence.value[idx]

  if (i !== expected) {
    errorCount.value++
    if (errorCount.value >= 2) {
      clickable.value = false
      finished.value = true
      if (sequenceTimeout) clearTimeout(sequenceTimeout)
      if (countdownInterval) clearInterval(countdownInterval)
      return
    }
  }

  // Si la séquence est terminée et que le jeu n'est pas fini, on passe au round suivant
  if (userSequence.value.length === sequence.value.length && !finished.value) {
    clickable.value = false
    nextTick(() => {
      setTimeout(() => {
        if (!finished.value) {
          setTimeout(() => startCountdownAndShowSequence(true), 1000)
        }
      }, 250)
    })
  }
}

function goHome() {
  router.push('/')
}

onMounted(() => startCountdownAndShowSequence(false))
</script>

<style scoped>
.board {
  position: relative;
  margin: 20px auto;
  border-radius: 12px;
  overflow: hidden;
  touch-action: manipulation;
  background: transparent;
}
.square {
  background: #222;
  border-radius: 6px;
  transition: background 0.2s;
  box-sizing: border-box;
  border: 2px solid #fff;
  touch-action: manipulation;
}
.square.lit {
  background: yellow;
}
.square.clickable {
  cursor: pointer;
  box-shadow: 0 0 6px #ff0;
}
.info {
  text-align: center;
  margin-top: 15px;
  font-size: 1.1em;
  color: #333;
}
.menu-btn {
  background: #d32f2f;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 24px;
  font-size: 1em;
  margin-top: 20px;
  cursor: pointer;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.menu-btn:hover {
  background: #b71c1c;
}
.round-info {
  text-align: center;
  margin-bottom: 10px;
  color: #555;
}
.countdown-overlay {
  position: fixed;
  z-index: 1000;
  inset: 0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
.countdown-number {
  font-size: 8rem;
  color: #222;
  font-weight: bold;
  user-select: none;
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
