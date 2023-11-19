<template>
  {{ currentTrack }}
  <div id="app">
    <audio ref="audio" :src="currentTrack" @timeupdate="updateTime"></audio>
    <p>{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</p>
    <button @click="prevTrack">Previous</button>
    <button @click="playPause">{{ isPlaying ? "Pause" : "Play" }}</button>
    <button @click="stop">Stop</button>
    <button @click="nextTrack">Next</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
const tracks = [
  "sounds/guiro-sweep-156002.mp3",
  // Add more tracks if needed
];

let currentTrackIndex = ref(0);
let isPlaying = ref(false);
let currentTime = ref(0);
let duration = ref(0);

const currentTrack = computed(() => tracks[currentTrackIndex.value]);

const playPause = () => {
  isPlaying.value ? pause() : play();
};

const play = () => {
  audio.value.play();
  isPlaying.value = true;
};

const pause = () => {
  audio.value.pause();
  isPlaying.value = false;
};

const stop = () => {
  pause();
  currentTime.value = 0;
  audio.value.currentTime = 0;
};

const prevTrack = () => {
  stop();
  currentTrackIndex.value =
    (currentTrackIndex.value - 1 + tracks.length) % tracks.length;
  play();
};

const nextTrack = () => {
  stop();
  currentTrackIndex.value = (currentTrackIndex.value + 1) % tracks.length;
  play();
};

// const seek = () => {
//   audio.value.currentTime = currentTime.value;
// };

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};

const updateTime = () => {
  currentTime.value = audio.value.currentTime;
  duration.value = audio.value.duration;
};

const audio = ref(null);

onMounted(() => {
  audio.value.addEventListener("timeupdate", updateTime);
});
</script>

<style>
#app {
  text-align: center;
  margin-top: 60px;
}

button {
  margin: 5px;
}
</style>
