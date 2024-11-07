<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-if="isAuthenticated"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> Quasar App con API en Laravel 11 </q-toolbar-title>
        <q-btn v-if="isAuthenticated" flat label="Logout" @click="logout" />
      </q-toolbar>
    </q-header>
    <q-drawer
      v-if="isAuthenticated"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label header class="text-grey-8"> Menú Principal </q-item-label>
        <q-item to="/" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>

          <q-item-section>Inicio</q-item-section>
        </q-item>

        <q-expansion-item
          icon="admin_panel_settings"
          label="Administración"
          caption="Gestión del sistema"
        >
          <q-list>
            <q-item to="/users" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="people" />
              </q-item-section>

              <q-item-section>Usuarios</q-item-section>
            </q-item>

            <!-- Puedes agregar más opciones aquí en el futuro -->
          </q-list>
        </q-expansion-item>
        <q-item-label header> Essential Links </q-item-label>
        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script setup>
import { ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
defineOptions({
  name: "MainLayout",
});
const linksList = [
  {
    title: "Docs",
    caption: "quasar.dev",
    icon: "school",
    link: "https://quasar.dev",
  },
  {
    title: "Github",
    caption: "github.com/quasarframework",
    icon: "code",
    link: "https://github.com/quasarframework",
  },
  {
    title: "Discord Chat Channel",
    caption: "chat.quasar.dev",
    icon: "chat",
    link: "https://chat.quasar.dev",
  },
  {
    title: "Forum",
    caption: "forum.quasar.dev",
    icon: "record_voice_over",
    link: "https://forum.quasar.dev",
  },
  {
    title: "Twitter",
    caption: "@quasarframework",
    icon: "rss_feed",
    link: "https://twitter.quasar.dev",
  },
  {
    title: "Facebook",
    caption: "@QuasarFramework",
    icon: "public",
    link: "https://facebook.quasar.dev",
  },
  {
    title: "Quasar Awesome",
    caption: "Community Quasar projects",
    icon: "favorite",
    link: "https://awesome.quasar.dev",
  },
];
const leftDrawerOpen = ref(false);
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
<script>
export default {
  data() {
    return {
      isAuthenticated: !!localStorage.getItem("accessToken"),
    };
  },
  provide() {
    return {
      updateIsAuthenticated: (value) => {
        this.isAuthenticated = value;
      },
    };
  },
  methods: {
    checkAuthentication() {
      this.isAuthenticated = !!localStorage.getItem("accessToken");
    },
    async logout() {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          alert("Token no encontrado. Por favor, inicia sesión de nuevo.");
          this.isAuthenticated = false;
          this.$router.push("/login");
          return;
        }
        const response = await fetch(`${process.env.API_BASE_URL}auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          console.log("Logout exitoso");
          localStorage.removeItem("accessToken");
          this.isAuthenticated = false;
          this.$router.push("/login");
          this.$forceUpdate();
        } else {
          const errorText = await response.text();
          alert("Error al intentar cerrar sesión: " + errorText);
        }
      } catch (error) {
        console.error("Error al intentar cerrar sesión:", error);
        alert("Ocurrió un error inesperado.");
      }
    },
  },
};
</script>

<style scoped>
/* Puedes agregar estilos si es necesario */
</style>
