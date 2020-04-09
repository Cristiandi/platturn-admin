<template>
  <div class="row">
    <div class="col-md-6 offset-md-3">
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-12 col-lg-8 col-md-6">
              <h3 class="mb-0 text-truncated">{{ currentUser.fullName }}</h3>
              <p class="lead">{{ currentUser.email }}</p>
              <p>
                Tú número de documento es {{ currentUser.document }}, además tú
                número de telefono es {{ currentUser.phone }} y vives en esta
                dirección: {{ currentUser.address }}
              </p>
              <p>
                <span
                  class="badge badge-info tags"
                  v-for="role in currentUser.roles"
                  :key="role.id"
                  >{{ role.name }}</span
                >
              </p>
            </div>
            <div class="col-12 col-lg-4 col-md-6 text-center">
              <img
                src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                alt=""
                class="mx-auto rounded-circle img-fluid"
              />
            </div>
            <div class="col-md-4">
              <small>¿Mal email?</small>
              <button
                class="btn btn-outline-danger btn-block"
                v-on:click="onChageEmail"
              >
                <span class="fa fa-plus-circle"></span> Cambiar email
              </button>
            </div>
            <div class="col-md-4">
              <small>¿Clave insegura?</small>
              <button
                class="btn btn-outline-primary btn-block"
                v-on:click="onChangePassword"
              >
                <span class="fa fa-user"></span> Cambiar clave
              </button>
            </div>
            <div class="col-md-4">
              <small>¿Datos erroneos?</small>
              <button
                type="button"
                class="btn btn-outline-success btn-block"
                v-on:click="onUpdateUserInfo"
              >
                <span class="fa fa-gear"></span> Actualizar perfil
              </button>
            </div>
            <!--/col-->
          </div>
          <!--/row-->
        </div>
        <!--/card-block-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Profile",
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
  },
  methods: {
    onChageEmail() {
      this.$router.push("/change-email");
    },
    onChangePassword() {
      this.$router.push("/change-password");
    },
    onUpdateUserInfo() {
      this.$router.push("/update-user-info");
    }
  }
};
</script>

<style scoped>
.card {
  margin-top: 10px;
}
</style>
