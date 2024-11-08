<template>
  <q-page padding>
    <q-breadcrumbs>
      <q-breadcrumbs-el label="Inicio" to="/" />
      <q-breadcrumbs-el label="Administración" />
      <q-breadcrumbs-el label="Usuarios" />
    </q-breadcrumbs>
    <div class="row q-mb-md items-center">
      <q-icon name="people" size="md" class="q-mr-md" />
      <h4 class="q-ma-none">Gestión de Usuarios</h4>
    </div>
    <div class="row justify-end q-mb-md">
      <q-btn
        color="positive"
        icon="add"
        icon-right="person"
        @click="showAddDialog"
      >
        <q-tooltip anchor="bottom middle" self="top right" class="bg-green">
          Agregar usuario
        </q-tooltip>
      </q-btn>
    </div>
    <q-table
      :rows="users"
      :columns="columns"
      row-key="id"
      :loading="loading"
      dense
      class="fijar-acciones"
    >
      <template v-slot:body-cell-actions="props">
        <q-td
          :props="props"
          class="q-pa-xs"
          style="width: 110px; max-width: 110px"
        >
          <div class="row no-wrap">
            <q-btn
              icon="edit"
              flat
              color="primary"
              @click="showEditDialog(props.row)"
              class="q-mr-xs"
            >
              <q-tooltip
                class="bg-primary"
                anchor="bottom middle"
                self="top middle"
                :offset="[10, 10]"
              >
                Editar Usuario
              </q-tooltip>
            </q-btn>
            <q-btn
              v-if="props.row.name !== 'Admin'"
              icon="delete"
              flat
              color="negative"
              @click="showDeleteDialog(props.row)"
            >
              <q-tooltip
                class="bg-red"
                anchor="bottom middle"
                self="top middle"
                :offset="[10, 10]"
              >
                Eliminar Usuario
              </q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="editDialog" persistent>
      <q-card
        :style="{
          minWidth: $q.screen.width < 600 ? '95vw' : '700px',
          width: $q.screen.width < 600 ? '95vw' : 'auto',
        }"
      >
        <q-card-section>
          <div class="text-h6">Editar Usuario</div>
          <q-input v-model="editingUser.name" readonly disable />
        </q-card-section>
        <q-card-section>
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
          >
            <q-tab name="general" icon="person" label="General" />
            <q-tab name="security" icon="security" label="Seguridad" />
          </q-tabs>
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="general">
              <!--  -->
              <div class="row">
                <div class="col-12">
                  <q-input
                    v-model="editingUser.id"
                    label="ID"
                    readonly
                    disable
                  />
                </div>
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-12 row">
                  <div class="col-12 col-md-6 q-pr-sm q-mb-sm">
                    <q-input
                      v-model="editingUser.name"
                      label="Nombre"
                      :rules="[(val) => !!val || 'El nombre es requerido']"
                    />
                  </div>

                  <div class="col-12 col-md-6 q-pl-sm q-mb-sm">
                    <q-input
                      v-model="editingUser.email"
                      label="Correo Electrónico"
                      :rules="[
                        (val) => !!val || 'El correo es requerido',
                        (val) =>
                          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ||
                          'Formato de correo inválido',
                      ]"
                    />
                  </div>
                </div>
                <div class="col-12 row">
                  <div class="col-12 col-md-6 q-pr-sm q-mb-sm">
                    <q-toggle
                      v-model="editingUser.active"
                      label="Usuario Activo"
                    />
                  </div>
                  <div class="col-12 col-md-6 q-pl-sm q-mb-sm">
                    <q-toggle
                      v-model="editingUser.requires_password_change"
                      label="Requiere Cambio de Contraseña"
                    />
                  </div>
                </div>
                <div class="col-12 row">
                  <div class="col-12 col-md-6 q-pr-sm q-mb-sm">
                    <q-input
                      v-model="formattedEmailVerifiedAt"
                      label="Verificación de Correo"
                      readonly
                      disable
                    />
                  </div>
                  <div class="col-12 col-md-6 q-pl-sm q-mb-sm">
                    <q-input
                      v-model="formattedCreatedAt"
                      label="Fecha de Creación"
                      readonly
                      disable
                    />
                  </div>
                </div>
                <div class="col-12 row">
                  <div class="col-12 col-md-6 q-pr-sm q-mb-sm">
                    <q-input
                      v-model="formattedUpdatedAt"
                      label="Última Actualización"
                      readonly
                      disable
                    />
                  </div>
                  <div class="col-12 col-md-6"></div>
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel name="security">
              <div class="text-center q-pa-md">
                <q-icon name="security" size="50px" color="grey-5" />
                <p class="text-subtitle1 q-mt-md">
                  Configuraciones de Seguridad
                </p>
                <p class="text-caption text-grey">Próximamente</p>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancelar" color="negative" flat v-close-popup />
          <q-btn label="Aceptar" color="primary" @click="updateUser" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import { ref, onMounted, computed } from "vue";

export default {
  setup() {
    const $q = useQuasar();
    const users = ref([]);
    const loading = ref(false);
    const editDialog = ref(false);
    const editingUser = ref({});
    const tab = ref("general");

    // Función para formatear fechas
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date
        .toLocaleString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
        .replace(",", " ");
    };

    const fetchUsers = async () => {
      loading.value = true;
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          $q.notify({
            type: "negative",
            message: "No se encontró el token de autenticación",
          });
          return;
        }
        const response = await api.get(`users`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        users.value = response.data.usuarios;
      } catch (error) {
        console.error("Error fetching users:", error);
        $q.notify({
          type: "negative",
          message: "Error al obtener usuarios",
          caption: error.response?.data?.message || "Error desconocido",
        });
      } finally {
        loading.value = false;
      }
    };

    const showEditDialog = async (user) => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          $q.notify({
            type: "negative",
            message: "No se encontró el token de autenticación",
          });
          return;
        }

        const response = await api.get(`users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        editingUser.value = response.data.usuario;
        editDialog.value = true;
      } catch (error) {
        console.error("Error fetching user details:", error);
        $q.notify({
          type: "negative",
          message: "Error al obtener detalles del usuario",
          caption: error.response?.data?.message || "Error desconocido",
        });
      }
    };

    const updateUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        await api.post(`users/${editingUser.value.id}`, editingUser.value, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        $q.notify({
          type: "positive",
          message: "Usuario actualizado exitosamente",
        });

        editDialog.value = false;
        fetchUsers();
      } catch (error) {
        console.error("Error updating user:", error);
        $q.notify({
          type: "negative",
          message: "Error al actualizar usuario",
          caption: error.response?.data?.message || "Error desconocido",
        });
      }
    };

    const showDeleteDialog = (user) => {
      $q.dialog({
        title: "Eliminar Usuario",
        message: `Se ha seleccionado eliminar al usuario ${user.name}`,
        persistent: true,
        ok: "Confirmar",
        cancel: "Cancelar",
      })
        .onOk(() => {
          console.log(`Eliminando usuario ${user.name}`);
        })
        .onCancel(() => {
          console.log("Eliminación cancelada");
        });
    };

    const showAddDialog = () => {
      $q.dialog({
        title: "Agregar Usuario",
        message: "Se ha seleccionado agregar un nuevo usuario",
      });
    };

    onMounted(fetchUsers);

    return {
      $q,
      users,
      loading,
      editDialog,
      editingUser,
      showEditDialog,
      updateUser,
      showDeleteDialog,
      showAddDialog,
      formatDate,
      formattedEmailVerifiedAt: computed(() =>
        formatDate(editingUser.value.email_verified_at)
      ),
      formattedCreatedAt: computed(() =>
        formatDate(editingUser.value.created_at)
      ),
      formattedUpdatedAt: computed(() =>
        formatDate(editingUser.value.updated_at)
      ),
      tab,
    };
  },
  data() {
    return {
      columns: [
        {
          name: "name",
          label: "Usuario",
          field: "name",
          sortable: true,
          align: "left",
        },
        {
          name: "email",
          label: "Correo",
          field: "email",
          sortable: true,
          align: "left",
        },
        {
          name: "active",
          label: "Estado",
          field: "active",
          format: (val) => (val ? "Activo" : "Inactivo"),
          sortable: true,
          align: "center",
        },
        {
          name: "actions",
          label: "Acciones",
          align: "left",
          field: "actions",
          sortable: false,
          style: "width: 110px; max-width: 110px;",
        },
      ],
    };
  },
};
</script>

<style>
/* Aquí puedes agregar estilos específicos para tu componente */

@media (max-width: 599px) {
  .q-dialog__inner--minimized {
    padding: 0 !important;
    color: rgb(234, 236, 236);
  }
}
</style>
<style lang="sass">
.fijar-acciones
  thead tr:last-child th:last-child
    background-color: rgb(234, 236, 236)
  td:last-child
    background-color: rgb(234, 236, 236)
  th:last-child,
  td:last-child
    position: sticky
    right: 0
    z-index: 1
</style>
