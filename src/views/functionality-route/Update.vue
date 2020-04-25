<template>
  <div class="row">
    <div class="col-md-12">
      <validation-observer ref="form" v-slot="{ handleSubmit }">
        <form name="form" @submit.prevent="handleSubmit(onSubmitUpdate)">
          <div class="form-group">
            <label for="functionalityId">Funcionalidad</label>
            <validation-provider rules="required" v-slot="{ errors }">
              <v-select
                id="functionality"
                name="functionality"
                label="name"
                v-model="objectToUpdate.functionalityId"
                :options="functionalities"
                :reduce="(item) => item.id"
                value="id"
              ></v-select>
              <span class="validation">{{ errors[0] }}</span>
            </validation-provider>
          </div>
          <div class="form-group">
            <label for="routeId">Ruta</label>
            <validation-provider rules="required" v-slot="{ errors }">
              <v-select
                id="routeId"
                name="route"
                label="routeDescription"
                v-model="objectToUpdate.routeId"
                :options="routes"
                :reduce="(item) => item.id"
                value="id"
              ></v-select>
              <span class="validation">{{ errors[0] }}</span>
            </validation-provider>
          </div>
          <div class="form-group">
            <div v-if="message" class="alert alert-danger" role="alert">
              {{ message }}
            </div>
          </div>
          <div class="form-group">
            <button class="btn btn-primary btn-block" :disabled="loading">
              <span
                v-show="loading"
                class="spinner-border spinner-border-sm"
              ></span>
              <span>Actualizar</span>
            </button>
          </div>
        </form>
      </validation-observer>
    </div>
  </div>
</template>
<script>
import { ValidationProvider, ValidationObserver, extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";
import functionalityRouteService from "../../services/functionality-route.service";
import functionalityService from "../../services/functionality.service";
import routeService from "../../services/route.service";
import { getFromObjectPathParsed } from "../../utils/functions";

// Override the default message.
extend("required", {
  ...required,
  message: "Campo requerido"
});

export default {
  name: "UpdateFunctionalityRoute",
  props: {
    current: {
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
      objectToUpdate: { ...this.current },
      functionalities: [],
      routes: [],
      loading: false,
      message: ""
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  methods: {
    async onSubmitUpdate() {
      this.loading = true;

      try {
        await functionalityRouteService.updateOne(this.objectToUpdate);
        this.bus.$emit("end-updating");
        setTimeout(() => {
          this.bus.$emit("load-functionalities-routes");
        }, 2000);

        this.successful = true;
        this.loading = false;
      } catch (error) {
        this.successful = false;
        this.loading = false;
        this.message = getFromObjectPathParsed(error, "response.data.message");
      }
    },
    async loadFunctionalities() {
      try {
        const data = await functionalityService.getFunctionalities();
        this.functionalities = data;
        this.successful = true;
      } catch (error) {
        this.successful = false;
        this.message = getFromObjectPathParsed(error, "response.data.message");
      }
    },
    async loadRoutes() {
      try {
        const data = await routeService.getRoutes();
        this.routes = data.map((item) => ({
          ...item,
          routeDescription: `${item.httpMethod} ${item.path}`
        }));
        this.successful = true;
      } catch (error) {
        this.successful = false;
        this.message = getFromObjectPathParsed(error, "response.data.message");
      }
    }
  },
  components: {
    ValidationProvider,
    ValidationObserver
  },
  mounted() {
    if (!this.loggedIn) {
      this.$router.push("/login");
    }

    this.loadFunctionalities();
    this.loadRoutes();
    console.log("objectToUpdate", this.objectToUpdate);
  }
};
</script>

<style scoped>
span .validation {
  color: red;
}
</style>
