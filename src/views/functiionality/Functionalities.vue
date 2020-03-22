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
        v-bind:rows="functionalities"
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
      <Update
        v-bind:bus="bus"
        v-bind:functionality="currentFunctionality"
        slot="body"
      />
    </Modal>

    <Modal v-if="showDeletingModel" @close="endDeleting()">
      <h3 slot="header">Eliminar</h3>
      <Delete
        v-bind:bus="bus"
        v-bind:functionality="currentFunctionality"
        slot="body"
      />
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
import functionalityService from "../../services/functionality.service";
import { getFromObjectPathParsed } from "../../utils/functions";

export default {
  data() {
    return {
      functionalities: [],
      currentFunctionality: null,
      columms: ["id", "name", "code", "actions"],
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
    async loadFunctionalities() {
      try {
        const data = await functionalityService.getFunctionalities();
        this.functionalities = data.map(item => {
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
    initUpdating(functionality) {
      this.showUpdatingModal = true;
      this.currentFunctionality = functionality;
    },
    endUpdating() {
      this.showUpdatingModal = false;
      this.currentFunctionality = null;
    },
    initDeleting(functionality) {
      this.showDeletingModel = true;
      this.currentFunctionality = functionality;
    },
    endDeleting() {
      this.showDeletingModel = false;
      this.currentFunctionality = null;
    }
  },
  mounted() {
    if (!this.loggedIn) {
      this.$router.push("/login");
    }

    this.loadFunctionalities();
    this.bus.$on("load-functionalities", this.loadFunctionalities);
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
