<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Assignment Tracker</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
        </template>
        <EditTransactions @close="close" :assignment="editAssignment"></EditTransactions>
      </v-dialog>
      <v-dialog v-model="deleteDialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Confirm Delete</v-card-title>
          <v-card-text>Are you sure you want to delete this item?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click="closeDelete">Cancel</v-btn>
            <v-btn color="green darken-1" flat @click="confirmDelete">CONFIRM DELETE</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-data-table :headers="headers" :items="assignments" class="elevation-1">
      <template v-slot:items="props">
        <td>{{ props.item.subject | subjectFilter}}</td>
        <td class="text-xs-left">{{ props.item.assignment }}</td>
        <td class="text-xs-left">{{ props.item.status }}</td>
        <td class="text-xs-left">{{ props.item.time }}</td>
        <td class="text-xs-left">{{ props.item.start }}</td>
        <td class="text-xs-left">{{ props.item.due }}</td>
        <td class="justify-center layout px-0">
          <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
          <v-icon small @click="openDeleteDialog(props.item)">delete</v-icon>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import EditTransactions from "../components/EditTransactions";
import { database } from "../firebase/database";
export default {
  components: { EditTransactions },
  filters: {
    subjectFilter: function(value) {
      if (typeof value == "object") {
        return value.name;
      } else {
        return value;
      }
    }
  },
  data() {
    return {
      dialog: false,
      deleteDialog: false,
      deleteItem: null,
      itemToEdit: null,
      headers: [
        { text: "Subject", align: "left", sortable: false, value: "subject" },
        { text: "Assignment", value: "assignment" },
        { text: "Status", value: "Status" },
        { text: "Time", value: "time" },
        { text: "Start Date", value: "start" },
        { text: "Due Date", value: "due" }
      ],
      assignments: []
    };
  },
  methods: {
    fetchItems() {
      this.assignments = database.getAssignments();
    },
    close(fetchItems) {
      this.dialog = false;
      this.itemToEdit = null;
      if (fetchItems) {
        this.fetchItems();
      }
    },
    editItem(item) {
      this.itemToEdit = item;
      this.dialog = true;
    },
    openDeleteDialog(item) {
      this.deleteDialog = true;
      this.deleteItem = item;
    },
    closeDelete() {
      this.deleteItem = null;
      this.deleteDialog = false;
    },
    confirmDelete() {
      database.deleteAssignment(this.deleteItem);
      this.closeDelete();
      this.fetchItems();
    }
  },
  computed: {
    editAssignment() {
      if (this.itemToEdit) {
        return this.itemToEdit;
      } else {
        return {
          subject: {},
          assignment: "",
          status: "Not Started",
          time: "",
          start: new Date().toISOString().substr(0, 10),
          due: new Date().toISOString().substr(0, 10)
        };
      }
    }
  },
  mounted() {
    this.fetchItems();
  }
};
</script>