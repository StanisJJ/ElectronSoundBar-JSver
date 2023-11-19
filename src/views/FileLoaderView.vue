<!-- <template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-text-field
          v-model="inputText"
          label="Wpisz tekst"
          outlined
        ></v-text-field>
        <v-btn @click="saveToFile">Zapisz do pliku</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      inputText: "",
    };
  },
  methods: {
    saveToFile() {
      // Wysyłanie danych do procesu głównego za pomocą IPC w Electronie
      const { ipcRenderer } = window.require("electron");
      const result = ipcRenderer.send("save-to-file", this.inputText);
      console.log(result);
    },
  },
};
</script>

<style scoped>
/* Dodaj stylizację według potrzeb */
</style> -->

<template>
  <div>
    <input v-model="title" placeholder="Enter Title" />
    <button @click="saveToFile">Save to File</button>
    <p v-if="saveStatus">{{ saveStatus }}</p>
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
</script>
