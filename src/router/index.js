import { createRouter, createWebHistory } from "vue-router";
import useUserStore from "@/stores/user";

const routes = [
  {
    name: "home",
    path: "/",
    component: () => import("@/views/Home.vue"),
  },
  {
    name: "about",
    path: "/about",
    component: () => import("@/views/About.vue"),
  },
  {
    name: "song",
    path: "/song/:id",
    component: () => import("@/views/Song.vue"),
  },
  {
    name: "manage",
    // alias: "/manage",
    path: "/manage-music",
    component: () => import("@/views/Manage.vue"),
    beforeEnter: (to, from, next) => {
      next();
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/manage",
    redirect: { name: "manage" },
  },
  {
    path: "/:catchAll(.*)*",
    redirect: { name: "home" },
  },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: "text-yellow-500",
});

router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) {
    next();
  } else {
    const store = useUserStore();

    if (store.userLoggedIn) {
      next();
    } else {
      next({ name: "home" });
    }
  }
});

export default router;
