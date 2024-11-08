<template>
  <q-page padding>
    <!-- Breadcrumbs y encabezado anteriores -->
    <q-table :rows="users" :columns="columns" row-key="id" :loading="loading">
      <!-- Mantener el slot de acciones original -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            icon="edit"
            flat
            color="primary"
            @click="showEditDialog(props.row)"
          />
          <q-btn
            v-if="props.row.name !== 'Admin'"
            icon="delete"
            flat
            color="negative"
            @click="showDeleteDialog(props.row)"
          />
        </q-td>
      </template>
    </q-table>

    <!-- Botón de Agregar Usuario -->
    <q-btn color="positive" label="Agregar Usuario" @click="showAddDialog" />

    <!-- Diálogo de Edición de Usuario -->
    <!-- <q-dialog v-model="editDialog" persistent>
      <q-card style="min-width: 700px">
        <q-card-section>
          <div class="text-h6">Editar Usuario</div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-12">
              <q-input v-model="editingUser.id" label="ID" readonly disable />
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
              <div class="col-12 col-md-6 q-pr-sm q-mb-sm">
                <q-input
                  v-model="editingUser.email"
                  label="Correo Electrónico"
                  :rules="[(val) => !!val || 'El correo es requerido']"
                />
              </div>
            </div>
            <div class="col-12 row">
              <div class="col-6 q-pr-sm">
                <q-input
                  v-model="formattedEmailVerifiedAt"
                  label="Verificación de Correo"
                  readonly
                  disable
                />
              </div>
              <div class="col-6 q-pl-sm">
                <q-toggle
                  v-model="editingUser.requires_password_change"
                  label="Requiere Cambio de Contraseña"
                />
              </div>
            </div>
            <div class="col-12 row">
              <div class="col-6 q-pr-sm">
                <q-toggle v-model="editingUser.active" label="Usuario Activo" />
              </div>
              <div class="col-6 q-pl-sm">
                <q-input
                  v-model="formattedCreatedAt"
                  label="Fecha de Creación"
                  readonly
                  disable
                />
              </div>
            </div>
            <div class="col-12 row">
              <div class="col-6 q-pr-sm">
                <q-input
                  v-model="formattedUpdatedAt"
                  label="Última Actualización"
                  readonly
                  disable
                />
              </div>
              <div class="col-6"></div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancelar" color="negative" flat v-close-popup />
          <q-btn label="Aceptar" color="primary" @click="updateUser" />
        </q-card-actions>
      </q-card>
    </q-dialog> -->
    <q-dialog v-model="editDialog" persistent>

<q-card

  :style="{

    minWidth: $q.screen.width < 600 ? '95vw' : '700px',

    width: $q.screen.width < 600 ? '95vw' : 'auto'

  }"

>

  <q-card-section>

    <div class="text-h6">Editar Usuario</div>

  </q-card-section>


  <q-card-section>

    <!-- ID en una fila completa -->

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


    <!-- Resto de campos en dos columnas -->

    <div class="row q-col-gutter-md">

      <div class="col-12 row">

        <div class="col-12 col-md-6 q-pr-sm q-mb-sm">

          <q-input

            v-model="editingUser.name"

            label="Nombre"

            :rules="[val => !!val || 'El nombre es requerido']"

          />

        </div>

        <div class="col-12 col-md-6 q-pl-sm q-mb-sm">

          <q-input

            v-model="editingUser.email"

            label="Correo Electrónico"

            :rules="[val => !!val || 'El correo es requerido']"

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

          <q-toggle

            v-model="editingUser.requires_password_change"

            label="Requiere Cambio de Contraseña"

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

        <!-- Columna vacía para mantener el balance -->

        <div class="col-12 col-md-6"></div>

      </div>

    </div>

  </q-card-section>


  <q-card-actions align="left">

    <q-btn

      label="Cancelar"

      color="negative"

      flat

      v-close-popup

    />

    <q-btn

      label="Aceptar"

      color="primary"

      @click="updateUser"

    />

  </q-card-actions>

</q-card>

</q-dialog>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import { ref, onMounted } from "vue";

export default {
  setup() {
    const $q = useQuasar();
    const users = ref([]);
    const loading = ref(false);
    const editDialog = ref(false);
    const editingUser = ref({});

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
        await api.put(`users/${editingUser.value.id}`, editingUser.value, {
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

    // Método para mostrar diálogo de eliminación (mantener el existente)
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

    // Método para mostrar diálogo de agregar (mantener el existente)
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
          align: "center",
          field: "actions",
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

}

}

</style>
