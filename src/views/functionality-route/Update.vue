<template>
  <div class="row">
    <div class="col-md-12">
      <validation-observer ref="form" v-slot="{ handleSubmit }">
        <form name="form" @submit.prevent="handleSubmit(onSubmitUpdate)">
          <div class="form-group">
            <label for="httpMethod">HTTP Method</label>
            <validation-provider rules="required" v-slot="{ errors }">
              <input
                v-model="routeToUpdate.httpMethod"
                type="text"
                class="form-control"
                name="httpMethod"
                id="httpMethod"
              />
              <span class="validation">{{ errors[0] }}</span>
            </validation-provider>
          </div>
          <div class="form-group">
            <label for="code">Path</label>
            <validation-provider rules="required" v-slot="{ errors }">
              <input
                v-model="routeToUpdate.path"
                type="text"
                class="form-control"
                name="path"
                id="path"
              />
              <span class="validation">{{ errors[0] }}</span>
            </validation-provider>
          </div>
          <div class="form-group form-check">
            <input
              v-model="routeToUpdate.isPublic"
              type="checkbox"
              class="form-check-input"
              id="isPublic"
              name="isPublic"
            />
            <label class="form-check-label" for="isPublic">Is public?</label>
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
import Route from "../../models/route";
import routeService from "../../services/route.service";
import { getFromObjectPathParsed } from "../../utils/functions";

// Override the default message.
extend("required", {
  ...required,
  message: "Campo requerido"
});

export default {
  name: "UpdateRoute",
  props: {
    route: {
      type: Object,
      default: () => new Route({})
    },
    bus: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      routeToUpdate: { ...this.route },
      loading: false,
      message: ""
    };
  },
  methods: {
    async onSubmitUpdate() {
      this.loading = true;

      // console.log("onSubmit update");

      try {
        await routeService.updateRoute(this.routeToUpdate);
        this.bus.$emit("end-updating");
        setTimeout(() => {
          this.bus.$emit("load-routes");
        }, 2000);

        this.successful = true;
        this.loading = false;
      } catch (error) {
        this.successful = false;
        this.loading = false;
        this.message = getFromObjectPathParsed(error, "response.data.message");
      }
    }
  },
  components: {
    ValidationProvider,
    ValidationObserver
  }
};
</script>

<style scoped>
span .validation {
  color: red;
}
</style>
