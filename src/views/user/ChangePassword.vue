<template>
  <div class="row">
    <div class="col-md-4 offset-md-4">
      <div class="card card-container">
        <validation-observer v-slot="{ handleSubmit }">
          <form name="form" @submit.prevent="handleSubmit(onSubmit)">
            <div class="form-group">
              <label for="currentPassword">Clave actual</label>
              <validation-provider rules="required" v-slot="{ errors }">
                <input
                  v-model="user.currentPassword"
                  type="password"
                  class="form-control"
                  name="currentPassword"
                  id="currentPassword"
                />
                <span class="validation">{{ errors[0] }}</span>
              </validation-provider>
            </div>
            <div class="form-group">
              <label for="password">Nueva Clave</label>
              <validation-provider rules="required" v-slot="{ errors }">
                <input
                  v-model="user.password"
                  type="password"
                  class="form-control"
                  name="password"
                  id="password"
                  minlength="5"
                  maxlength="10"
                />
                <span class="validation">{{ errors[0] }}</span>
              </validation-provider>
            </div>
            <div class="form-group">
              <label for="repeatedEmail">Confirmar clave</label>
              <validation-provider rules="required" v-slot="{ errors }">
                <input
                  v-model="user.repeatedPassword"
                  type="password"
                  class="form-control"
                  name="repeatedPassword"
                  id="repeatedPassword"
                  minlength="5"
                  maxlength="10"
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
                <span>Cambiar clave</span>
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
import User from "../../models/user";
import userService from "../../services/user.service";
import { ValidationProvider, ValidationObserver, extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";
import { getFromObjectPathParsed } from "../../utils/functions";

// Override the default message.
extend("required", {
  ...required,
  message: "Campo requerido"
});

export default {
  name: "ChangeEmail",
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
    },
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  created() {
    if (!this.loggedIn) {
      this.$router.push("/login");
    }
  },
  methods: {
    onSubmit() {
      if (this.user.password !== this.user.repeatedPassword) {
        this.successful = false;
        this.message = "las claves no coincided.";
        return;
      }
      if (this.user.password === this.user.currentPassword) {
        this.successful = false;
        this.message = "la clave no puede ser igual a clave actual.";
        return;
      }

      this.loading = true;
      this.submitted = true;

      userService.changePassword(this.user).then(
        data => {
          this.user.email = this.currentUser.email;

          this.$store.dispatch("auth/logout");

          this.$store.dispatch("auth/login", this.user).then(
            () => {
              this.loading = false;
              this.successful = true;
              this.message = data.message;
            },
            error => {
              this.loading = false;
              this.successful = false;
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

          this.loading = false;
          this.successful = true;
          this.message = data.message;
        },
        error => {
          this.loading = false;
          this.successful = false;
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
