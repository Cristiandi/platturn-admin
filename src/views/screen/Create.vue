<template>
  <div class="row">
    <div class="col-md-12">
      <validation-observer ref="form" v-slot="{ handleSubmit }">
        <form name="form" @submit.prevent="handleSubmit(onSubmitCreate)">
          <div class="form-group">
            <label for="functionalityId">Funcionalidad</label>
            <validation-provider rules="required" v-slot="{ errors }">
              <v-select
                id="functionality"
                name="functionality"
                label="name"
                v-model="screen.functionalityId"
                :options="functionalities"
                :reduce="(item) => item.id"
                value="id"
              ></v-select>
              <span class="validation">{{ errors[0] }}</span>
            </validation-provider>
          </div>
          <div class="form-group">
            <label for="name">Nombre</label>
            <validation-provider rules="required" v-slot="{ errors }">
              <input
                v-model="screen.name"
                type="text"
                class="form-control"
                name="name"
                id="name"
              />
              <span class="validation">{{ errors[0] }}</span>
            </validation-provider>
          </div>
          <div class="form-group">
            <label for="path">Path</label>
            <validation-provider rules="required" v-slot="{ errors }">
              <input
                v-model="screen.path"
                type="text"
                class="form-control"
                name="path"
                id="path"
              />
              <span class="validation">{{ errors[0] }}</span>
            </validation-provider>
          </div>
          <div class="form-group">
            <label for="relativePath">Path relativo</label>
            <input
              v-model="screen.relativePath"
              type="text"
              class="form-control"
              name="relativePath"
              id="relativePath"
            />
          </div>
          <div class="form-group">
            <div v-if="message" class="alert alert-danger" role="alert">
              {{ message }}
            </div>
          </div>
          <div class="form-group">
            <button class="btn btn-success btn-block" :disabled="loading">
              <span
                v-show="loading"
                class="spinner-border spinner-border-sm"
              ></span>
              <span>Crear</span>
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
import Screen from "../../models/screen";
import screenService from "../../services/screen.service";
import functionalityService from "../../services/functionality.service";
import { getFromObjectPathParsed } from "../../utils/functions";

// Override the default message.
extend("required", {
  ...required,
  message: "Campo requerido"
});

export default {
  name: "CreateScreen",
  props: {
    bus: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      screen: new Screen({}),
      functionalities: [],
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
    async onSubmitCreate() {
      this.loading = true;

      console.log("onSubmit");

      try {
        await screenService.createScreen(this.screen);
        console.log("PRE onSubmit end-creating");
        this.bus.$emit("end-creating");
        console.log("onSubmit end-creating");
        setTimeout(() => {
          this.bus.$emit("load-screens");
        }, 2000);

        this.successful = true;
        this.loading = false;
      } catch (error) {
        console.error("error", error);
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
  }
};
</script>

<style scoped>
span .validation {
  color: red;
}
</style>
