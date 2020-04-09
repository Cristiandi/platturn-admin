<template>
  <transition name="fade">
    <div
      v-if="currentUser && renderSideBar"
      id="mySidebar"
      class="sidebar bg-dark"
      v-on:show-side-bar="showSideBar"
    >
      <a href="#" class="closebtn" v-on:click="closeSideBer">
        ×
      </a>
      <div v-for="functionality in functionalities" :key="functionality.id">
        <a
          data-toggle="collapse"
          :href="'#collapseFunctionality' + functionality.id"
          >{{ functionality.name }}</a
        >
        <div
          class="collapse"
          :id="'collapseFunctionality' + functionality.id"
          v-for="screen in functionality.screens"
          :key="screen.name"
        >
          <router-link
            :to="screen.path || '/'"
            v-on:click.native="closeSideBer"
            >{{ screen.name }}</router-link
          >
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import userService from "../../../services/user.service";

export default {
  name: "SideBar",
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
  data() {
    return {
      renderSideBar: false,
      functionalities: []
    };
  },
  watch: {
    currentUser: function (val) {
      console.log("val", val);
      if (val) this.loadMenu();
    }
  },
  methods: {
    showSideBar() {
      if (!this.currentUser) {
        const {
          currentRoute: { path }
        } = this.$router;

        if (path == "/") return;
        this.$router.push("/");
        return;
      }
      this.renderSideBar = true;
    },
    closeSideBer() {
      this.renderSideBar = false;
    },
    loadMenu() {
      userService.getUserScreens().then(
        data => {
          this.functionalities = data;
        },
        error => {
          console.error(error);
        }
      );
    }
  },
  mounted() {
    this.bus.$on("show-side-bar", this.showSideBar);
    if (this.currentUser) this.loadMenu();
  }
};
</script>
<style scoped>
.sidebar {
  height: 100%;
  width: 210px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  overflow-x: hidden;
  padding-top: 60px;
}

.sidebar a {
  padding: 8px 8px 8px 10px;
  text-decoration: none;
  font-size: 1rem;
  color: #818181;
  display: block;
  transition: 0.3s;
}

.sidebar div div a {
  padding: 8px 8px 8px 20px;
}

.sidebar a:hover {
  color: #f1f1f1;
}

.sidebar .closebtn {
  position: absolute;
  top: 0;
  right: 5px;
  font-size: 36px;
  margin-left: 50px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

/* On smaller screens, where height is less than 450px, change the style of the sidenav (less padding and a smaller font size) */
@media screen and (max-height: 450px) {
  .sidebar {
    padding-top: 15px;
  }
  .sidebar a {
    font-size: 1rem;
  }
}
</style>
