<template>
  <!-- Navigation -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark static-top">
    <div class="container">
      <a href="#" @click.prevent="showSideBar">
        <img
          src="../../../assets/logo.png"
          height="43px"
          width="75px"
          alt="Platturn"
        />
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarResponsive"
        aria-controls="navbarResponsive"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div
        v-if="currentUser"
        class="collapse navbar-collapse"
        id="navbarResponsive"
      >
        <ul class="navbar-nav ml-auto">
          <li class="nav-item active">
            <router-link to="/dashboard" class="nav-link">
              <font-awesome-icon icon="chalkboard-teacher" size="lg" />
              <span class="sr-only">(current)</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/profile" class="nav-link">
              <font-awesome-icon icon="user-circle" size="lg" />
            </router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link" href @click.prevent="logOut">
              <font-awesome-icon icon="sign-out-alt" size="lg" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
export default {
  name: "NavBar",
  props: {
    currentUser: {
      type: Object,
      default: null
    },
    bus: {
      type: Object,
      default: null
    }
  },
  computed: {
    showAdminBoard() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes("ROLE_ADMIN");
      }

      return false;
    },
    showModeratorBoard() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes("ROLE_MODERATOR");
      }

      return false;
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/login");
    },
    showSideBar() {
      this.bus.$emit("show-side-bar");
    }
  }
};
</script>
<style scoped>
.navbar-dark {
  color: #ffffff !important;
}
.navbar-dark .navbar-nav .nav-link:focus,
.navbar-dark .navbar-nav .nav-link:hover {
  color: #ffffff !important;
}
</style>
