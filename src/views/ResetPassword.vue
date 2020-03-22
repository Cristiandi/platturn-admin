<template>
  <div class="row">
    <div class="col-md-4 offset-md-4">
      <div class="card card-container">
        <validation-observer v-slot="{ handleSubmit }">
          <form name="form" @submit.prevent="handleSubmit(onSubmit)">
            <div class="form-group">
              <label for="password">Clave</label>
              <validation-provider rules="required" v-slot="{ errors }">
                <input
                  v-model="user.password"
                  minlength="5"
                  maxlength="100"
                  type="password"
                  class="form-control"
                  name="password"
                  id="password"
                />
                <span class="validation">{{ errors[0] }}</span>
              </validation-provider>
            </div>
            <div class="form-group">
              <label for="repeatedPassword">Confirmar clave</label>
              <validation-provider rules="required" v-slot="{ errors }">
                <input
                  v-model="user.repeatedPassword"
                  minlength="5"
                  maxlength="100"
                  type="password"
                  class="form-control"
                  name="repeatedPassword"
                  id="repeatedPassword"
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
                <span>Cambiar</span>
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
  name: "ResetPassword",
  data() {
    return {
      user: new User({}),
      loading: false,
      successful: false,
      submitted: false,
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
    },
    code() {
      return this.$route.query.code;
    }
  },
  created() {
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
    if (!this.code) {
      this.$router.push("/");
    }
  },
  methods: {
    onSubmit() {
      this.loading = true;

      const {
        user: { password, repeatedPassword }
      } = this;

      if (password !== repeatedPassword) {
        this.loading = false;
        this.successful = false;
        this.message = "las claves no coinciden.";
        return;
      }

      if (this.user.password && this.user.repeatedPassword) {
        this.user.resetPasswordCode = this.code;

        this.$store.dispatch("auth/resetPassword", this.user).then(
          data => {
            this.loading = false;
            this.successful = true;
            this.message = data.message;
            this.submitted = true;
          },
          error => {
            this.loading = false;
            this.successful = false;
            this.submitted = true;

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
