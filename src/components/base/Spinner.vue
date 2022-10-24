<template>
  <transition name="fade" mode="out-in">
    <div v-if="loading" class="flex flex-row">
      <div class="relative">
        <div class="w-12 h-12 rounded-full absolute border-2 border-solid border-gray-200"/>
        <div class="w-12 h-12 rounded-full animate-spin absolute border-2 border-solid border-[#374151] border-t-transparent shadow-md"/>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Spinner",
  props: ["loading"],
};
</script>
