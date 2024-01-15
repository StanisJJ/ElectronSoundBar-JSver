<template>
  <div id="app">
    <button @click="GetFiles">Get</button>
    <ul>
      <li v-for="(file, index) in files" :key="index">
        {{ file }}
        <v-img :width="300" aspect-ratio="16/9" cover :src="file"></v-img>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
const { ipcRenderer } = window.require("electron");

const files = ref([]);

onMounted(() => {
  ipcRenderer.on("files", (event, receivedFiles) => {
    files.value = receivedFiles;
  });
});

const GetFiles = () => {
  ipcRenderer.send("get-file");
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 5px;
  padding: 10px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
}
</style>
