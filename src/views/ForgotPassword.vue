<template>
  <div class="row">
    <div class="col-md-4 offset-md-4">
      <div class="card card-container">
        <validation-observer v-slot="{ handleSubmit }">
          <form name="form" @submit.prevent="handleSubmit(onSubmit)">
            <div class="form-group">
              <label for="email">Email</label>
              <validation-provider rules="required|email" v-slot="{ errors }">
                <input
                  v-model="user.email"
                  type="text"
                  class="form-control"
                  name="email"
                  id="email"
                  placeholder="escribe tu email"
                />
                <span class="validation">{{ errors[0] }}</span>
              </validation-provider>
            </div>
            <div class="form-group">
              <button
                class="btn btn-primary btn-block"
                :disabled="loading || submitted"
              >
                <span
                  v-show="loading"
                  class="spinner-border spinner-border-sm"
                ></span>
                <span>Enviar email</span>
              </button>
            </div>
          </form>
        </validation-observer>
        <div
          v-if="message"
          class="alert"
          :class="successful ? 'alert-success' : 'alert-danger'"
        >
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import User from "../models/user";
import { ValidationProvider, ValidationObserver, extend } from "vee-validate";
import { required, email } from "vee-validate/dist/rules";
import { getFromObjectPathParsed } from "../utils/functions";

// No message specified.
extend("email", {
  ...email,
  message: "El email no es valido."
});

// Override the default message.
extend("required", {
  ...required,
  message: "Campo requerido"
});

export default {
  name: "ForgotPassword",
  data() {
    return {
      user: new User({}),
      loading: false,
      submitted: false,
      successful: false,
      message: ""
    };
  },
  components: {
    ValidationProvider,
    ValidationObserver
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  created() {
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
  },
  methods: {
    onSubmit() {
      this.loading = true;
      this.submitted = true;
      if (this.user.email) {
        this.$store.dispatch("auth/sendForgotPasswordEmail", this.user).then(
          (data) => {
            this.loading = false;
            this.successful = true;
            this.message = data.message;
          },
          (error) => {
            this.loading = false;
            this.message = getFromObjectPathParsed(
              error,
              "response.data.message"
            );

            this.message =
              this.message ||
              (error.response && error.response.data) ||
              error.message ||
              error.toString();
          }
        );
      } else {
        this.loading = false;
        this.successful = false;
        this.message = "email must be valid.";
      }
    }
  }
};
</script>

<style scoped>
label {
  display: block;
  margin-top: 10px;
}

span .validation {
  color: red;
}

.card-container.card {
  padding: 20px 20px;
}

.card {
  background-color: #f7f7f7;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}
</style>
