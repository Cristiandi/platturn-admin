<template>
  <div class="row" id="main">
    <div
      class="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-8 offset-sm-2 centered"
    >
      <div class="card card-container">
        <validation-observer v-slot="{ handleSubmit }">
          <form name="form" @submit.prevent="handleSubmit(onSubmit)">
            <div class="form-group">
              <label for="email">Email</label>
              <validation-provider rules="required|email" v-slot="{ errors }">
                <input
                  v-model="user.email"
                  type="email"
                  class="form-control"
                  name="email"
                  id="email"
                />
                <span class="validation">{{ errors[0] }}</span>
              </validation-provider>
            </div>
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
              <router-link to="/forgot-password">
                ¿Olvidaste tu clave?
              </router-link>
            </div>
            <div class="form-group">
              <button class="btn btn-primary btn-block" :disabled="loading">
                <span
                  v-show="loading"
                  class="spinner-border spinner-border-sm"
                ></span>
                <span>Ingresar</span>
              </button>
            </div>
            <div class="form-group">
              <div v-if="message" class="alert alert-danger" role="alert">
                {{ message }}
              </div>
            </div>
          </form>
        </validation-observer>
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
  name: "Login",
  data() {
    return {
      user: new User({}),
      loading: false,
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
      if (this.user.email && this.user.password) {
        this.$store.dispatch("auth/login", this.user).then(
          () => {
            this.$router.push("/dashboard");
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
      }
    }
  }
};
</script>

<style scoped>
#main {
  background-image: url("../assets/login-bg.jpg");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 100% 100%;
}

span .validation {
  color: red;
}

.card-container.card {
  padding: 2rem 2rem;
}

.card {
  background-color: #f7f7f7;
  padding: 20px 25px 30px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}

.centered {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  min-height: 100vh;
}
</style>
