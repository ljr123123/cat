import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Login",
    component: () => import("../views/LoginAndGacha.vue"),
  }
];

const options = {
  history: createWebHashHistory(),
  routes,
};

const router = createRouter(options);

export default router;
