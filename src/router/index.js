import { createRouter, createWebHistory } from "vue-router";

import Home from "@/components/Home.vue";
import Login from "@/components/Login.vue";
import Register from "@/components/Register.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/register",
      component: Register,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/register"];
  const authRequried = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("user");

  if (authRequried && !loggedIn) {
    return next("/login");
  } else if(!authRequried && loggedIn) {
    return next(from.path);
  }
  next();
});

export default router;
