<template>
  <v-data-table :items="items"></v-data-table>
</template>

<script setup>
import { ref, onMounted } from "vue";
const { ipcRenderer } = window.require("electron");

// Użyj ref do stworzenia reaktywnej zmiennej items
const items = ref([
  {
    name: "African Elephant",
    type: "Loxodonta africana",
    path: "Herbivore",
  },
  // ... more items
]);

onMounted(() => {
  // Ta funkcja zostanie uruchomiona, gdy komponent zostanie zamontowany
  ipcRenderer.send("get-file-list");
  console.log("Komponent został zamontowany");
});

ipcRenderer.on("get-list", (event, receivedItems) => {
  // Zaktualizuj wartość zmiennej items przy użyciu ref.value
  items.value = receivedItems;
  console.log(receivedItems);
});
</script>
