<template>
  {{ path }}
  {{ conf }}
  <div>
    <button @click="test">test</button><br />
    <button @click="playSound">Play</button><br />
    <button @click="pauseSound">Pause</button><br />
    <button @click="stopSound">Stop</button><br />
    <button @click="handleFileChange">fileLoad</button>
  </div>
</template>

<script setup>
// import { ref } from "vue";
const { ipcRenderer } = window.require("electron");
import { Howl } from "howler";
import { ref } from "vue";

const sound = new Howl({
  src: ["C:/Users/daki_ImBack/Documents/guiro-sweep-156002.mp3"],
  format: ["mp3"],
  onloaderror: (soundId, error) => {
    console.error("Błąd ładowania dźwięku:", error);
  },
  onplayerror: (soundId, error) => {
    console.error("Błąd odtwarzania dźwięku:", error);
  },
  // inne opcje konfiguracyjne
});

const playSound = () => {
  sound.play();
};

const pauseSound = () => {
  sound.pause();
};

const stopSound = () => {
  sound.stop();
};

const handleFileChange = () => {
  ipcRenderer.send("open-file-dialog");
};

const test = () => {
  console.log("test works");
  ipcRenderer.send("get-app-path");
};

ipcRenderer.on("selected-file", (event, filePath) => {
  if (sound) {
    sound.unload();
    sound.src = [filePath];
    console.log(filePath);
  }
});

const path = ref("");
const conf = ref("asdasd");
ipcRenderer.on("app-path", (event, filePath, configFile) => {
  path.value = filePath;
  conf.value = configFile;

  console.log(configFile);
});
</script>
