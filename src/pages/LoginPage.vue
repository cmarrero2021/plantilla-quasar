<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 400px">
      <q-card-section>
        <div class="text-h6">Login</div>
      </q-card-section>
      <q-card-section>
        <q-input v-model="email" label="Email" type="email" />
        <q-input v-model="password" label="Password" type="password" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Login" color="primary" @click="login" />
      </q-card-actions>
      <q-card-section v-if="errorMessage" class="text-negative">
        {{ errorMessage }}
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script>
export default {
  // computed: {
  //   isAuthenticated() {
  //     return !!localStorage.getItem("accessToken");
  //   },
  // },
  mounted() {
    localStorage.clear();
  },
  data() {
    return {
      email: "",
      password: "",
      errorMessage: null,
      isAuthenticated: false,
    };
  },
  inject: ['updateIsAuthenticated'],
  methods: {
    async login() {
      try {
        const response = await fetch(`${process.env.API_BASE_URL}auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        if (response.status === 401 || response.status === 403) {
          const errorData = await response.json();
          this.errorMessage = errorData.message;
        } else if (response.status === 200) {
          const data = await response.json();
          localStorage.setItem("userName", data.user.name);
          localStorage.setItem("userEmail", data.user.email);
          localStorage.setItem("userId", data.user.id);
          localStorage.setItem("accessToken", data.access_token);
          this.updateIsAuthenticated(true);
          this.$router.push("/");
        } else {
          this.errorMessage = "Error desconocido";
        }
      } catch (error) {
        this.errorMessage = "Ocurrió un error al intentar iniciar sesión";
      }
    },
  },
};
</script>

<style scoped>
.text-negative {
  color: red;
}
</style>
