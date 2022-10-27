<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link
        :to="{ name: 'home' }"
        class="flex items-center text-white gap-x-2 font-bold uppercase text-2xl mr-4"
        exact-active-class="no-active"
        v-icon="'headphones-alt'"
      >
        <span class="order-1">{{ $t("header.logo") }}</span>
      </router-link>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <li>
            <router-link :to="{ name: 'about' }" class="px-2 text-white">
              {{ $t("header.about") }}
            </router-link>
          </li>
          <!-- Navigation Links -->
          <li v-if="!userStore.userLoggedIn">
            <a
              class="px-2 text-white"
              href="#"
              @click.prevent="toggleAuthModal"
            >
              {{ $t("header.login") }}
            </a>
          </li>
          <template v-else>
            <li>
              <router-link :to="{ name: 'manage' }" class="px-2 text-white">
                {{ $t("header.manage") }}
              </router-link>
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="signOut">
                {{ $t("header.logout") }}
              </a>
            </li>
          </template>
        </ul>

        <ul class="flex flex-row mt-1 ml-auto">
          <li>
            <a href="#" class="px-2 text-white" @click.prevent="changeLocale">
              {{ currentLocale }}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapStores } from "pinia";
import UseModalStore from "@/stores/modal";
import UseUserStore from "@/stores/user";

export default {
  name: "AppHeader",
  computed: {
    ...mapStores(UseModalStore, UseUserStore),
    currentLocale() {
      return this.$i18n.locale === "en" ? "Polish" : "English";
    },
  },
  methods: {
    toggleAuthModal() {
      this.modalStore.isOpen = !this.modalStore.isOpen;
    },
    signOut() {
      this.userStore.signOut();
      // console.log(this.$route);
      if (this.$route.meta.requiresAuth) {
        this.$router.push({name: "home"});
      }
    },
    changeLocale() {
      this.$i18n.locale = this.$i18n.locale === "en" ? "pl" : "en";
    },
  },
};
</script>
