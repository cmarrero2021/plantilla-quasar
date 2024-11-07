<template>
  <q-page padding>
    <h4>Gestión de Usuarios</h4>
    <q-table :rows="users" :columns="columns" row-key="id">
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            icon="edit"
            flat
            color="primary"
            @click="showEditDialog(props.row)"
          />
          <q-btn
            icon="delete"
            flat
            color="negative"
            @click="showDeleteDialog(props.row)"
          />
        </q-td>
      </template>
    </q-table>
    <q-btn color="positive" label="Agregar Usuario" @click="showAddDialog" />
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue"; // Importa ref

export default {
  setup() {
    const $q = useQuasar(); // Guarda la instancia de $q

    return { $q }; // Retorna $q para que esté disponible en el componente
  },
  data() {
    return {
      users: [
        { id: 1, name: "Juan Pérez", email: "juan@example.com" },
        { id: 2, name: "María García", email: "maria@example.com" },
      ],
      columns: [
        {
          name: "name",
          label: "Nombre",
          field: "name",
        },
        {
          name: "email",
          label: "Email",
          field: "email",
        },
        {
          name: "actions",
          label: "Acciones",
          field: "actions",
        },
      ],
    };
  },
  methods: {
    showAddDialog() {
      this.$q.dialog({
        title: "Agregar Usuario",
        message: "Se ha seleccionado agregar un nuevo usuario",
      });
    },
    showEditDialog(user) {
      this.$q.dialog({
        title: "Editar Usuario",
        message: `Se ha seleccionado editar al usuario ${user.name}`,
      });
    },
    showDeleteDialog(user) {
      this.$q
        .dialog({
          title: "Eliminar Usuario",
          message: `Se ha seleccionado eliminar al usuario ${user.name}`,
          persistent: true,
          ok: "Confirmar",
          cancel: "Cancelar",
        })
        .onOk(() => {
          // Lógica para eliminar el usuario
          console.log(`Eliminando usuario ${user.name}`);
        })
        .onCancel(() => {
          console.log("Eliminación cancelada");
        });
    },
  },
};
</script>
