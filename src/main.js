import Vue from "vue";
import App from "./views/App/App.vue";
import { router } from "./router";
import store from "./store";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faHome,
  faUser,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt,
  faEdit,
  faUserCircle,
  faChalkboardTeacher,
  faTrashAlt,
  faEye
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faHome,
  faUser,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt,
  faEdit,
  faUserCircle,
  faChalkboardTeacher,
  faTrashAlt,
  faEye
);

Vue.config.productionTip = false;

Vue.component("font-awesome-icon", FontAwesomeIcon);

new Vue({
  router,
  store,
  components: {},
  render: h => h(App)
}).$mount("#app");
