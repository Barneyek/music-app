<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div
      v-if="show_alert"
      class="text-white text-center font-bold p-4 mb-4"
      :class="alert_variant"
    >
      {{ alert_message }}
    </div>
    <div v-show="showForm">
      <vee-form
        :validation-schema="schema"
        :initial-values="songData"
        @submit="edit"
      >
        <div class="mb-3">
          <label class="inline-block mb-2">{{
            $t("song.composition_title")
          }}</label>
          <vee-field
            name="modified_name"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            :placeholder="$t('song.composition_title_placeholder')"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">{{
            $t("song.composition_genre")
          }}</label>
          <vee-field
            name="genre"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            :placeholder="$t('song.composition_genre_placeholder')"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>
        <div class="flex justify-end gap-x-2">
          <button
            type="button"
            class="py-1.5 px-3 rounded text-white bg-gray-600"
            :disabled="in_submission"
            @click.prevent="showForm = false"
          >
            {{ $t("back") }}
          </button>
          <button
            type="submit"
            class="py-1.5 px-3 rounded text-white bg-green-600"
            :disabled="in_submission"
          >
            {{ $t("submit") }}
          </button>
        </div>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { songsCollection, storage } from "@/includes/firebase";

export default {
  name: "CompositionItem",
  props: {
    song: {
      type: Object,
      required: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    removeSong: {
      type: Function,
      required: true,
    },
    updateUnsavedFlag: {
      type: Function,
    },
  },
  data() {
    return {
      showForm: false,
      schema: {
        modified_name: "required|min:3|max:100",
        genre: "alpha_spaces",
      },
      songData: {
        modified_name: this.song.modified_name,
        genre: this.song.genre,
      },
      in_submission: false,
      show_alert: false,
      alert_variant: "bg-blue-500",
      alert_message: "Trwa aktualizowanie informacji.",
    };
  },
  computed: {
    alertUpdating() {
      return this.$t("song.update_msg");
    },
    alertUpdated() {
      return this.$t("song.updated");
    },
    alertError() {
      return this.$t("error");
    },
  },
  methods: {
    async edit(values) {
      this.in_submission = true;
      this.show_alert = true;
      this.alert_variant = "bg-blue-500";
      this.alert_message = this.alertUpdating;
      try {
        await songsCollection.doc(this.song.docID).update(values);
      } catch (e) {
        this.in_submission = false;
        this.alert_variant = "bg-red-500";
        this.alert_message = this.alertError;
        return;
      }
      this.in_submission = false;
      this.updateSong(this.index, values);
      this.updateUnsavedFlag(false);

      this.alert_variant = "bg-blue-500";
      this.alert_message = this.alertUpdated;
      this.show_alert = false;
      this.showForm = false;
    },
    async deleteSong() {
      const storageRef = storage.ref();
      const songRef = storageRef.child(`songs/${this.song.original_name}`);

      await songRef.delete();

      await songsCollection.doc(this.song.docID).delete();

      this.removeSong(this.index);
    },
  },
};
</script>
