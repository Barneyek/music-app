<template>
  <transition name="slideBottom" mode="out-in">
    <div
      v-if="Object.keys(current_song).length"
      class="fixed bottom-0 left-0 bg-white px-4 py-2 w-full"
    >
      <!-- Track Info -->
      <div v-if="current_song.modified_name" class="text-center">
        <span class="song-title font-bold">{{
          current_song.modified_name
        }}</span>
        <template v-if="current_song.display_name">
          by
          <span class="song-artist">{{ current_song.display_name }}</span>
        </template>
      </div>
      <div class="flex flex-nowrap gap-4 items-center">
        <!-- Play/Pause Button -->
        <button id="player-play-btn" type="button" @click.prevent="toggleAudio">
          <i
            class="fa text-gray-500 text-xl"
            :class="{ 'fa-play': !playing, 'fa-pause': playing }"
          ></i>
        </button>
        <!-- Current Position -->
        <div class="player-currenttime">{{ seek }}</div>
        <!-- Scrub Container  -->
        <div
          class="w-full h-2 rounded bg-gray-200 relative cursor-pointer"
          @click.prevent="updateSeek"
        >
          <!-- Player Ball -->
          <span
            class="absolute -top-2.5 -ml-2.5 text-gray-800 text-lg"
            :style="{ left: playerProgress }"
          >
            <i class="fas fa-circle"></i>
          </span>
          <!-- Player Progress Bar-->
          <span
            class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
            :style="{ width: playerProgress }"
          ></span>
        </div>
        <!-- Duration -->
        <div class="player-duration">{{ duration }}</div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapState } from "pinia";
import usePlayerStore from "@/stores/player";

export default {
  name: "Player",
  computed: {
    ...mapState(usePlayerStore, [
      "playing",
      "duration",
      "seek",
      "playerProgress",
      "current_song",
    ]),
  },
  methods: {
    ...mapActions(usePlayerStore, ["toggleAudio", "updateSeek"]),
  },
};
</script>

<style>
.slideBottom-enter-from {
  transform: translateY(70px);
}

.slideBottom-enter-active {
  transition: all 0.3s ease-in-out;
}

.slideBottom-leave-to {
  transition: all 0.3s ease-in-out;
  transform: translateY(0);
}
</style>
