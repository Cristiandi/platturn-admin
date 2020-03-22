<template>
  <div class="row">
    <div class="col-md-12">
      <p>¿Desea eliminar?</p>
      <div v-if="message" class="alert alert-danger" role="alert">
        {{ message }}
      </div>
      <div class="">
        <button
          class="btn btn-danger btn-block"
          :disabled="loading"
          @click.prevent="onSubmitDelete"
        >
          <span
            v-show="loading"
            class="spinner-border spinner-border-sm"
          ></span>
          <span>Eliminar</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import Functionality from "../../models/functionality";
import functionalityService from "../../services/functionality.service";
import { getFromObjectPathParsed } from "../../utils/functions";

export default {
  name: "DeleteFunctionality",
  props: {
    functionality: {
      type: Object,
      default: () => new Functionality({})
    },
    bus: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      functionalityToDelete: { ...this.functionality },
      loading: false,
      message: ""
    };
  },
  methods: {
    async onSubmitDelete() {
      this.loading = true;

      console.log("onSubmit delete");

      try {
        await functionalityService.deleteFunctionality(
          this.functionalityToDelete
        );
        this.bus.$emit("end-deleting");
        setTimeout(() => {
          this.bus.$emit("load-functionalities");
        }, 2000);

        this.successful = true;
        this.loading = false;
      } catch (error) {
        this.successful = false;
        this.loading = false;
        this.message = getFromObjectPathParsed(error, "response.data.message");
      }
    }
  }
};
</script>
