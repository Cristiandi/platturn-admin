import Vue from "vue";
import Router from "vue-router";

import Login from "./views/Login.vue";
import ForgotPassword from "./views/ForgotPassword.vue";
import ResetPassword from "./views/ResetPassword.vue";

import Functionalities from "./views/functiionality/Functionalities.vue";

Vue.use(Router);

export const router = new Router({
  mode: "history",
  routes: [
    // general routes
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/forgot-password",
      name: "forgotPassword",
      component: ForgotPassword
    },
    {
      path: "/reset-password",
      name: "resetPassword",
      component: ResetPassword
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("./views/Home.vue")
    },
    {
      path: "/profile",
      name: "profile",
      // lazy-loaded
      component: () => import("./views/Profile.vue")
    },
    {
      path: "/change-email",
      name: "changeEmail",
      // lazy-loaded
      component: () => import("./views/user/ChangeEmail.vue")
    },
    {
      path: "/change-password",
      name: "changePassword",
      // lazy-loaded
      component: () => import("./views/user/ChangePassword.vue")
    },
    {
      path: "/update-user-info",
      name: "updateUserInfo",
      component: () => import("./views/user/UpdateUserInfo.vue")
    },
    {
      path: "/functionalities",
      name: "functionalities",
      component: Functionalities
    }
  ]
});

router.beforeEach((to, from, next) => {
  // console.log("---------");
  // console.log("to", to);
  // console.log("---------");

  const publicPages = ["/login", "/forgot-password", "/reset-password"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("user");

  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next("/login");
  } else {
    next();
  }
});
