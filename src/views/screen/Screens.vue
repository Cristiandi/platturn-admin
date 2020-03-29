<template>
  <div class="row initial-row">
    <div class="col-md-12">
      <div class="row">
        <div class="col-md-12">
          <button
            type="button"
            class="btn btn-success"
            @click="showCreatingModal = true"
          >
            Nueva
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3">
          <form name="form">
            <div class="form-group">
              <label for="query">Busqueda</label>
              <input
                v-model="searchQuery"
                id="query"
                name="query"
                class="form-control"
              />
            </div>
          </form>
        </div>
      </div>
      <div class="row" v-if="message">
        <div
          class="alert"
          :class="successful ? 'alert-success' : 'alert-danger'"
        >
          {{ message }}
        </div>
      </div>
      <Grid
        v-bind:rows="screens"
        v-bind:columns="columms"
        v-bind:filterKey="searchQuery"
        v-bind:bus="bus"
      />
    </div>
    <!-- use the modal component, pass in the prop -->
    <Modal v-if="showCreatingModal" @close="endCreating()">
      <h3 slot="header">Creación</h3>
      <Create v-bind:bus="bus" slot="body" />
    </Modal>

    <!-- use the modal component, pass in the prop -->
    <Modal v-if="showUpdatingModal" @close="endUpdating()">
      <h3 slot="header">Actualizar</h3>
      <Update v-bind:bus="bus" v-bind:screen="currentScreen" slot="body" />
    </Modal>

    <Modal v-if="showDeletingModel" @close="endDeleting()">
      <h3 slot="header">Eliminar</h3>
      <Delete v-bind:bus="bus" v-bind:screen="currentScreen" slot="body" />
    </Modal>
  </div>
</template>
<script>
import Vue from "vue";
import Grid from "../../components/Grid/Grid";
import Modal from "../../components/Modal/Modal";
import Create from "./Create";
import Update from "./Update";
import Delete from "./Delete";
import screenService from "../../services/screen.service";
import { getFromObjectPathParsed } from "../../utils/functions";

export default {
  name: "Screens",
  data() {
    return {
      screens: [],
      currentScreen: null,
      columms: ["id", "name", "path", "functionality", "actions"],
      successful: false,
      message: "",
      showCreatingModal: false,
      showUpdatingModal: false,
      showDeletingModel: false,
      searchQuery: "",
      bus: new Vue()
    };
  },
  components: {
    Grid,
    Modal,
    Create,
    Update,
    Delete
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  methods: {
    async loadScreens() {
      try {
        const data = await screenService.getScreens();
        this.screens = data.map(item => {
          return {
            ...item,
            actions: [
              {
                name: "edit",
                description: "editar",
                class: "btn btn-primary",
                eventName: "init-updating"
              },
              {
                name: "delete",
                description: "eliminar",
                class: "btn btn-danger",
                eventName: "init-deleting"
              }
            ]
          };
        });
        this.successful = true;
      } catch (error) {
        this.successful = false;
        this.message = getFromObjectPathParsed(error, "response.data.message");
      }
    },
    initCreating() {
      this.showCreatingModal = true;
    },
    endCreating() {
      this.showCreatingModal = false;
    },
    initUpdating(screen) {
      this.showUpdatingModal = true;
      this.currentScreen = screen;
    },
    endUpdating() {
      this.showUpdatingModal = false;
      this.currentScreen = null;
    },
    initDeleting(screen) {
      this.showDeletingModel = true;
      this.currentScreen = screen;
    },
    endDeleting() {
      this.showDeletingModel = false;
      this.currentScreen = null;
    }
  },
  mounted() {
    if (!this.loggedIn) {
      this.$router.push("/login");
    }

    this.loadScreens();
    this.bus.$on("load-screens", this.loadScreens);
    this.bus.$on("end-creating", this.endCreating);
    this.bus.$on("init-updating", this.initUpdating);
    this.bus.$on("end-updating", this.endUpdating);
    this.bus.$on("init-deleting", this.initDeleting);
    this.bus.$on("end-deleting", this.endDeleting);
  }
};
</script>
<style scoped>
.initial-row {
  margin-top: 1rem;
}
</style>
