<template>
  <div class="row">
    <div class="col-md-12">
      <div class="card card-container">
        <img
          id="profile-img"
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          class="profile-img-card"
        />

        <validation-observer v-slot="{ handleSubmit }">
          <form name="form" @submit.prevent="handleSubmit(onSubmit)">
            <div>
              <div class="form-group">
                <label for="fullName">Nombre completo</label>
                <validation-provider rules="required" v-slot="{ errors }">
                  <input
                    v-model="user.fullName"
                    minlength="10"
                    maxlength="100"
                    type="text"
                    class="form-control"
                    name="fullName"
                    id="fullName"
                  />
                  <span class="validation">{{ errors[0] }}</span>
                </validation-provider>
              </div>
              <div class="form-group">
                <label for="document">Documento</label>
                <validation-provider rules="required" v-slot="{ errors }">
                  <input
                    v-model="user.document"
                    type="text"
                    class="form-control"
                    name="document"
                    id="document"
                  />
                  <span class="validation">{{ errors[0] }}</span>
                </validation-provider>
              </div>
              <div class="form-group">
                <label for="address">Dirección</label>
                <validation-provider rules="required" v-slot="{ errors }">
                  <input
                    v-model="user.address"
                    type="text"
                    class="form-control"
                    name="address"
                    id="address"
                  />
                  <span class="validation">{{ errors[0] }}</span>
                </validation-provider>
              </div>
              <div class="form-group">
                <label for="phone">Telefono</label>
                <validation-provider rules="required" v-slot="{ errors }">
                  <input
                    v-model="user.phone"
                    type="number"
                    class="form-control"
                    name="phone"
                    id="phone"
                  />
                  <span class="validation">{{ errors[0] }}</span>
                </validation-provider>
              </div>
              <div class="form-group">
                <button class="btn btn-primary btn-block">Actualizar</button>
              </div>
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
  name: "UpdateUserInfo",
  data() {
    return {
      user: new User({}),
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
  mounted() {
    if (!this.loggedIn) {
      this.$router.push("/login");
    }

    this.user.fullName = this.currentUser.fullName;
    this.user.document = this.currentUser.document;
    this.user.address = this.currentUser.address;
    this.user.phone = this.currentUser.phone;
  },
  methods: {
    onSubmit() {
      this.submitted = true;

      userService.updateUserData(this.user).then(
        data => {
          this.message = data.message;
          this.successful = true;

          this.$store.dispatch("auth/refreshUser", data);
        },
        error => {
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
  max-width: 350px !important;
  padding: 40px 40px;
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

.profile-img-card {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}
</style>
