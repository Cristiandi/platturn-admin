<template>
  <div class="row">
    <div class="col-md-12">
      <validation-observer ref="form" v-slot="{ handleSubmit }">
        <form name="form" @submit.prevent="handleSubmit(onSubmitCreate)">
          <div class="form-group">
            <label for="name">Nombre</label>
            <validation-provider rules="required" v-slot="{ errors }">
              <input
                v-model="functionality.name"
                type="text"
                class="form-control"
                name="name"
                id="name"
              />
              <span class="validation">{{ errors[0] }}</span>
            </validation-provider>
          </div>
          <div class="form-group">
            <label for="code">Código</label>
            <validation-provider rules="required" v-slot="{ errors }">
              <input
                v-model="functionality.code"
                type="text"
                class="form-control"
                name="code"
                id="code"
              />
              <span class="validation">{{ errors[0] }}</span>
            </validation-provider>
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
import Functionality from "../../models/functionality";
import functionalityService from "../../services/functionality.service";
import { getFromObjectPathParsed } from "../../utils/functions";

// Override the default message.
extend("required", {
  ...required,
  message: "Campo requerido"
});

export default {
  name: "CreateFunctionality",
  props: {
    bus: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      functionality: new Functionality({}),
      loading: false,
      message: ""
    };
  },
  methods: {
    async onSubmitCreate() {
      this.loading = true;

      console.log("onSubmit");

      try {
        await functionalityService.createFunctionality(this.functionality);
        console.log("PRE onSubmit end-creating");
        this.bus.$emit("end-creating");
        console.log("onSubmit end-creating");
        setTimeout(() => {
          this.bus.$emit("load-functionalities");
        }, 2000);

        this.successful = true;
        this.loading = false;
      } catch (error) {
        console.error("error", error);
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
