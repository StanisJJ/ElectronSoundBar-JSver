<template>
  <div>
    <!-- <v-img
      :src="require('../assets/logo.png')"
      class="my-3"
      contain
      height="200"
    /> -->
    <!-- <AudioPlayer
      :option="{
        src: require('@/assets/sounds/guiro-sweep-156002.mp3'),
        title: 'your-audio-title',
        coverImage: require('../assets/logo.png'),
      }"
    /> -->
    <!-- {{ localCard.soundSrc }} -->
    <v-card class="single-card-box">
      <v-btn
        size="small"
        color="surface-variant"
        variant="text"
        :icon="editMode ? 'mdi-pencil' : 'mdi-check-bold'"
        class="to-right-corner-edit"
        @click="editMode = !editMode"
      ></v-btn>
      <div
        class="active-border"
        :class="{ 'active-border-glowing': isPlaying }"
      >
        <v-card class="single-card" :class="{ 'rounded-border': !editMode }">
          <transition name="slide-fade">
            <div
              @click="isPlaying ? pause() : play()"
              v-show="editMode"
              class="edit-mode"
            >
              <v-img
                :src="localCard.src"
                class="align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="150px"
                cover
              >
                <v-card-title
                  class="cart-title text-white"
                  v-text="localCard.title"
                ></v-card-title>
              </v-img>
            </div>
          </transition>

          <!-- <transition name="slide-fade" mode="out-in"> -->
          <div v-show="!editMode">
            <div>
              <audio
                ref="audioPlayer"
                :src="audioSource"
                @timeupdate="updateTime"
                @ended="audioEnded"
              ></audio>
              <div>
                <button @click="playPause">
                  {{ isPlaying ? "Pause" : "Play" }}
                </button>
                <button @click="stop">Stop</button>
              </div>
              <div>
                <label for="volume">Volume:</label>
                <input
                  id="volume"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  v-model="volume"
                  @input="updateVolume"
                />
              </div>
              <div>
                <label for="speed">Speed:</label>
                <input
                  id="speed"
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  v-model="playbackSpeed"
                  @input="updateSpeed"
                />
              </div>
            </div>
            <v-text-field clearable v-model="localCard.title"></v-text-field>
            <v-card-actions>
              <v-spacer></v-spacer>
            </v-card-actions>
          </div>
          <!-- </transition> -->
        </v-card>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from "vue";
const props = defineProps(["modelValue"]);
const localCard = ref(props.modelValue);
const editMode = ref(true);
//---------------------audio
const audioSource = ref(localCard.value.soundSrc);
const audioPlayer = ref(null);
const isPlaying = ref(false);
const volume = ref(1);
const playbackSpeed = ref(1);

const playPause = () => {
  isPlaying.value ? pause() : play();
};

const play = () => {
  audioPlayer.value.play();
  isPlaying.value = true;
};

const pause = () => {
  audioPlayer.value.pause();
  isPlaying.value = false;
};

const stop = () => {
  pause();
  audioPlayer.value.currentTime = 0;
};

const updateVolume = () => {
  audioPlayer.value.volume = volume.value;
};

const updateSpeed = () => {
  audioPlayer.value.playbackRate = playbackSpeed.value;
};

const updateTime = () => {
  // Tutaj możesz dodatkowo obsłużyć aktualizację czasu odtwarzania
};

const audioEnded = () => {
  isPlaying.value = false;
};

onMounted(() => {
  audioPlayer.value = new Audio();
});
</script>

<style lang="scss">
.v-input__details {
  display: none;
}

.single-card-box {
  width: 170px;
  height: 150px;
  box-shadow: none;
  margin: 2px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  // background-color: #00ff66;
}

.active-border {
  border-radius: 100%;
  width: calc((100% - 20px) * 0.9);
  height: 90%;
  margin: 5%;
  position: relative;
}

.single-card {
  width: 95%;
  height: 95%;
  margin: 2.5%;
  position: absolute;
  border-radius: 100%;
  box-shadow: 0px 0px 10px 0px rgb(0, 0, 0);
  transition: all 0.3s ease-in-out;
}

.rounded-border {
  border-radius: 10px;
}

.cart-title {
  font-size: 16px;
  transform: translateY(-30px);
}

.to-right-corner-edit {
  position: absolute;
  top: -1px;
  right: -3px;
  z-index: 900;
}
// animation border glowing

.active-border-glowing {
  border-radius: 100%;
  background: linear-gradient(
    45deg,
    #e8f74d,
    #ff6600d9,
    #00ff66,
    #ad27ad,
    #6512b9,
    #5aabde
  );
  background-size: 500%;
  animation: glower 20s linear infinite, pulse 0.5s linear infinite;
}

@keyframes glower {
  0% {
    background-position: 0 0;
  }

  50% {
    background-position: 400% 0;
  }

  100% {
    background-position: 0 0;
  }
}

$pulseColor: rgba(204, 169, 44, 0.4);
@keyframes pulse {
  0% {
    -moz-box-shadow: 0 0 0 0 $pulseColor;
    box-shadow: 0 0 0 0 $pulseColor;
  }
  70% {
    -moz-box-shadow: 0 0 10px 10px $pulseColor;
    box-shadow: 0 0 10px 10px $pulseColor;
  }
  100% {
    -moz-box-shadow: 0 0 0 0 $pulseColor;
    box-shadow: 0 0 0 0 $pulseColor;
  }
}

/* ------------------------------------ Vue animation slider */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-80px);
  opacity: 0;
}
</style>
