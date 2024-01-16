<template>
  <v-card>
    <!-- {{ logs }} -->
    <v-layout>
      <v-navigation-drawer expand-on-hover rail permanent>
        <v-list>
          <v-list-item
            prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
            title="Sandra Adams"
            subtitle="sandra_a88@gmailcom"
          ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item
            prepend-icon="mdi-folder"
            title="My Files"
            value="myfiles"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-account-multiple"
            title="Shared with me"
            value="shared"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-star"
            title="Starred"
            value="starred"
          ></v-list-item>
          <router-link to="/about">About</router-link>
          <hr />
          <router-link to="/fileLoader">loader</router-link>
          <hr />
          <router-link to="/Test">Test</router-link>
        </v-list>
      </v-navigation-drawer>

      <v-main style="height: 100vh">
        <v-row>
          <v-col xxl="2" xl="2" lg="3" md="4" sm="5" class="col-top-search">
            <v-text-field
              hide-details
              clearable
              placeholder="Search"
              filled
              rounded
              dense
              single-line
              append-icon="mdi-magnify"
              class="shrink mx-4"
              v-model="searchPhraze"
              style="transform: scale(0.8)"
            >
            </v-text-field>
          </v-col>

          <v-col xxl="10" xl="10" lg="9" md="8" sm="7" class="col-top-search">
            <v-tabs
              next-icon="mdi-arrow-right-bold-box-outline"
              prev-icon="mdi-arrow-left-bold-box-outline"
              show-arrows
              v-model="tab"
            >
              <template
                v-for="(item, indexTabTitle) in cards"
                :key="indexTabTitle"
              >
                <Transition name="slide-fade">
                  <v-tab
                    :value="indexTabTitle"
                    v-show="search(item.title, searchPhraze)"
                  >
                    {{ item.title }}
                  </v-tab>
                </Transition>
              </template>
            </v-tabs>
          </v-col>
        </v-row>

        <v-window v-model="tab">
          <v-window-item
            v-for="(item, indexTab) in cards"
            :key="indexTab"
            :value="item"
          >
            <v-card flat>
              <v-container fluid>
                <v-row>
                  <div
                    v-for="(soundCards, index) in cards[indexTab].sounds"
                    :key="index"
                  >
                    <CardPlayer v-model="cards[indexTab].sounds[index]" />
                  </div>
                </v-row>
              </v-container>
            </v-card>
          </v-window-item> </v-window
      ></v-main>
    </v-layout>
  </v-card>
</template>

<script setup>
import { ref } from "vue";
import CardPlayer from "@/components/CardPlayer.vue";
// const { ipcRenderer } = window.require("electron");

// const logs = ref("empty");
// ipcRenderer.on("alert-logs", (event, configFile) => {
//   logs.value = configFile;
// });

const cards = ref([
  {
    title: "Pierwszy obiekt",
    sounds: [
      {
        title: "Pre-fab homes",
        src: "https://cdn.vuetifyjs.com/images/cards/house.jpg",
        soundSrc: "C:/Users/daki_ImBack/Documents/guiro-sweep-156002.mp3",
      },
      {
        title: "Favorite road trips",
        src: "https://cdn.vuetifyjs.com/images/cards/road.jpg",
        flex: 6,
        soundSrc: "C:/Users/daki_ImBack/Documents/guiro-sweep-156002.mp3",
      },
      {
        title: "Best airlines",
        src: "https://cdn.vuetifyjs.com/images/cards/plane.jpg",
        flex: 6,
        soundSrc: "C:/Users/daki_ImBack/Documents/guiro-sweep-156002.mp3",
      },
    ],
  },
  {
    title: "Ósmy obiekt",
    sounds: [
      {
        title: "City skyline",
        src: "https://cdn.vuetifyjs.com/images/cards/city2.jpg",
        flex: 12,
        soundSrc: "C:/Users/daki_ImBack/Documents/guiro-sweep-156002.mp3",
      },
      {
        title: "Countryside charm",
        src: "https://cdn.vuetifyjs.com/images/cards/countryside.jpg",
        flex: 6,
        soundSrc: "C:/Users/daki_ImBack/Documents/guiro-sweep-156002.mp3",
      },
      {
        title: "Seaside retreat",
        src: "https://cdn.vuetifyjs.com/images/cards/seaside.jpg",
        flex: 6,
        soundSrc: "C:/Users/daki_ImBack/Documents/guiro-sweep-156002.mp3",
      },
    ],
  },
  {
    title: "Ósmy obiekt",
    sounds: [
      {
        title: "City skyline",
        src: "https://cdn.vuetifyjs.com/images/cards/city2.jpg",
        flex: 12,
        soundSrc: "C:/Users/daki_ImBack/Documents/guiro-sweep-156002.mp3",
      },
      {
        title: "Countryside charm",
        src: "https://cdn.vuetifyjs.com/images/cards/countryside.jpg",
        flex: 6,
        soundSrc: "C:/Users/daki_ImBack/Documents/guiro-sweep-156002.mp3",
      },
      {
        title: "Seaside retreat",
        src: "https://cdn.vuetifyjs.com/images/cards/seaside.jpg",
        flex: 6,
        soundSrc: "C:/Users/daki_ImBack/Documents/guiro-sweep-156002.mp3",
      },
    ],
  },
  {
    title: "Ósmy obiekt",
    sounds: [
      {
        title: "City skyline",
        src: "https://cdn.vuetifyjs.com/images/cards/city2.jpg",
        flex: 12,
        soundSrc: "C:/Users/daki_ImBack/Documents/guiro-sweep-156002.mp3",
      },
      {
        title: "Countryside charm",
        src: "https://cdn.vuetifyjs.com/images/cards/countryside.jpg",
        flex: 6,
        soundSrc: "C:/Users/daki_ImBack/Documents/guiro-sweep-156002.mp3",
      },
      {
        title: "Seaside retreat",
        src: "https://cdn.vuetifyjs.com/images/cards/seaside.jpg",
        flex: 6,
        soundSrc: "C:/Users/daki_ImBack/Documents/guiro-sweep-156002.mp3",
      },
    ],
  },
  {
    title: "Ósmy obiekt",
    sounds: [
      {
        title: "City skyline",
        src: "https://cdn.vuetifyjs.com/images/cards/city2.jpg",
        flex: 12,
        soundSrc: "C:/Users/daki_ImBack/Documents/guiro-sweep-156002.mp3",
      },
      {
        title: "Countryside charm",
        src: "https://cdn.vuetifyjs.com/images/cards/countryside.jpg",
        flex: 6,
        soundSrc: "C:/Users/daki_ImBack/Documents/guiro-sweep-156002.mp3",
      },
      {
        title: "Seaside retreat",
        src: "https://cdn.vuetifyjs.com/images/cards/seaside.jpg",
        flex: 6,
        soundSrc: "C:/Users/daki_ImBack/Documents/guiro-sweep-156002.mp3",
      },
    ],
  },
  {
    title: "Ósmy obiekt",
    sounds: [
      {
        title: "City skyline",
        src: "https://cdn.vuetifyjs.com/images/cards/city2.jpg",
        flex: 12,
        soundSrc: "C:/Users/daki_ImBack/Documents/guiro-sweep-156002.mp3",
      },
      {
        title: "Countryside charm",
        src: "https://cdn.vuetifyjs.com/images/cards/countryside.jpg",
        flex: 6,
        soundSrc: "C:/Users/daki_ImBack/Documents/guiro-sweep-156002.mp3",
      },
      {
        title: "Seaside retreat",
        src: "https://cdn.vuetifyjs.com/images/cards/seaside.jpg",
        flex: 6,
        soundSrc: "C:/Users/daki_ImBack/Documents/guiro-sweep-156002.mp3",
      },
    ],
  },
]);

const searchPhraze = ref("");
const search = (title, phrase) => {
  return phrase !== null
    ? title.toLowerCase().includes(phrase.toLowerCase())
    : true;
};

const tab = ref(null);
</script>
<style lang="scss">
.col-top-search {
  padding: 10px 2px;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
