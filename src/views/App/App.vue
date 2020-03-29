<template>
  <div id="app">
    <NavBar
      v-if="currentUser"
      v-bind:currentUser="currentUser"
      v-bind:bus="bus"
    />

    <SideBar v-bind:currentUser="currentUser" v-bind:bus="bus" ref="sideBar" />

    <div class="container-fluid">
      <router-view />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import SideBar from "./SideBar/SideBar.vue";
import NavBar from "./NavBar/NavBar.vue";
import userService from "../../services/user.service";

export default {
  name: "App",
  data() {
    return {
      bus: new Vue()
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  methods: {},
  components: {
    SideBar,
    NavBar
  },
  mounted() {
    if (this.currentUser) {
      userService.validateToken().catch(error => {
        console.error(error);
        this.$store.dispatch("auth/logout");
        this.$router.push("/login");
      });
    }
  }
};
</script>
