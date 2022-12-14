<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">{{ $t("upload.upload") }}</span>
      <i class="fas fa-upload float-right text-green-400 text-xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 mb-4 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{
          'hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid':
            is_dragover,
        }"
        @dragend.prevent.stop="is_dragover = false"
        @dragover.prevent.stop="is_dragover = true"
        @dragenter.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5>{{ $t("upload.drop") }}</h5>
      </div>
      <div class="flex justify-center items-center">
        <label
          for="files"
          class="min-w-[190px] text-center py-1.5 px-3 rounded text-white bg-green-600 cursor-pointer"
        >
          {{ $t("upload.button") }}
        </label>
        <input
          id="files"
          type="file"
          class="invisible opacity-0 h-0 w-0"
          multiple
          @change="upload($event)"
        />
      </div>
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div v-for="upload in uploads" :key="upload.name" class="mb-4">
        <!-- File Name -->
        <div class="font-bold text-sm mb-1" :class="upload.textClass">
          <i :class="upload.icon" /> {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar"
            :class="upload.variant"
            :style="{ width: upload.current_progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storage, auth, songsCollection } from "@/includes/firebase";

export default {
  name: "Upload",
  data() {
    return {
      is_dragover: false,
      uploads: [],
    };
  },
  props: ["addSong"],
  methods: {
    upload($event) {
      this.is_dragover = false;
      const files = $event.dataTransfer
        ? [...$event.dataTransfer.files]
        : [...$event.target.files];

      files.forEach((file) => {
        if (file.type !== "audio/mpeg") {
          return;
        }

        if (!navigator.onLine) {
          this.uploads.push({
            task: {},
            currentProgress: 100,
            name: file.name,
            variant: "bg-red-400",
            icon: "fas fa-times",
            textClass: "text-red-400",
          });
          return;
        }

        const storageRef = storage.ref(); // test.com
        const songsRef = storageRef.child(`songs/${file.name}`); // test.com/songs/example.mp3
        const task = songsRef.put(file);

        const uploadIndex =
          this.uploads.push({
            task,
            currentProgress: 0,
            name: file.name,
            variant: "bg-blue-400",
            icon: "fas fa-spinner fa-spin",
            textClass: "",
          }) - 1;

        task.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.uploads[uploadIndex].current_progress = progress;
          },
          (error) => {
            this.uploads[uploadIndex].variant = "bg-red-400";
            this.uploads[uploadIndex].icon = "fas fa-times";
            this.uploads[uploadIndex].textClass = "text-red-600";
            console.log(error);
          },
          async () => {
            const song = {
              uid: auth.currentUser.uid,
              display_name: auth.currentUser.displayName,
              original_name: task.snapshot.ref.name,
              modified_name: task.snapshot.ref.name,
              genre: "",
              comment_count: 0,
            };
            song.url = await task.snapshot.ref.getDownloadURL();

            const songRef = await songsCollection.add(song);
            const songSnapshot = await songRef.get();
            this.addSong(songSnapshot);

            this.uploads[uploadIndex].variant = "bg-green-400";
            this.uploads[uploadIndex].icon = "fas fa-check";
            this.uploads[uploadIndex].textClass = "text-green-600";
          }
        );
      });
    },
    cancelUploads() {
      this.uploads.forEach((upload) => {
        upload.task.cancel();
      });
    },
  },
  beforeUnmount() {
    this.uploads.forEach((upload) => {
      upload.task.cancel();
    });
  },
};
</script>
