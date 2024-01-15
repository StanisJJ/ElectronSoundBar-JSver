<template>
  <div>
    <input v-model="title" placeholder="Enter Title" />
    <button @click="saveToFile">Save to File</button><br />
    <button @click="getCurrentPath">Look Path</button>
    <p v-if="saveStatus">{{ saveStatus }}</p>
    <p v-if="appPath">{{ appPath }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
const { ipcRenderer } = window.require("electron");

const title = ref("");
const saveStatus = ref("");

const saveToFile = () => {
  const jsonData = { title: title.value };
  const jsonString = JSON.stringify(jsonData);

  ipcRenderer.send("save-json-file", jsonString);

  ipcRenderer.on("save-json-file-response", (event, response) => {
    if (response.success) {
      saveStatus.value = `JSON saved successfully at: ${response.filePath}`;
    } else {
      saveStatus.value = `Error saving JSON: ${response.error}`;
    }
  });
};

const appPath = ref("");
const getCurrentPath = () => {
  // let appPath;
  // Wysyła zapytanie do procesu głównego o aktualną ścieżkę
  ipcRenderer.send("get-app-path");

  // Odbiera odpowiedź z procesu głównego i aktualizuje dane Vue
  ipcRenderer.on("app-path", (event, appPath2) => {
    appPath.value = appPath2;
  });
};
</script>
