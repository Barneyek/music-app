<template>
  <div
    v-if="login_show_alert"
    class="text-white text-center font-bold p-4 rounded mb-4"
    :class="login_alert_variant"
  >
    {{ login_alert_msg }}
  </div>
  <vee-form
    :validation-schema="loginSchema"
    @submit="login"
  >
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t("mail") }}</label>
      <vee-field
        name="email"
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('mail_placeholder')"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t("password") }}</label>
      <vee-field
        name="password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('password_placeholder')"
      />
      <ErrorMessage class="text-red-600" name="password" />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="login_in_submission"
    >
      {{ $t("submit") }}
    </button>
  </vee-form>
</template>

<script>
import { mapActions } from "pinia";
import useUserStore from "@/stores/user";

export default {
  name: "LoginForm",
  data() {
    return {
      loginSchema: {
        email: "required|email",
        password: "required|min:3|max:20",
      },
      login_in_submission: false,
      login_show_alert: false,
      login_alert_variant: "bg-blue-500",
      login_alert_msg: "Proszę czekać! Twoje konto jest w trakcie rejestracji.",
    };
  },
  computed: {
    alertError() {
      return this.$t("login.error");
    },
    alertLogged() {
      return this.$t("login.logged");
    },
    alertWrongData() {
      return this.$t("login.wrong_data");
    },
  },
  methods: {
    ...mapActions(useUserStore, ["authenticate"]),
    async login(values) {
      this.login_show_alert = true;
      this.login_in_submission = true;
      this.login_alert_variant = "bg-blue-500";
      this.login_alert_msg = this.alertError;

      try {
        await this.authenticate(values);
      } catch (error) {
        this.login_in_submission = false;
        this.login_alert_variant = "bg-red-500";
        this.login_alert_msg = this.alertWrongData;
        return;
      }
      this.login_alert_variant = "bg-green-500";
      this.login_alert_msg = this.alertLogged;
      window.location.reload();
    },
  },
};
</script>
