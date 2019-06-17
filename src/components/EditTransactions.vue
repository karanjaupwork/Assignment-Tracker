<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{ newItem ? 'Add New': 'Edit' }} Assignment</span>
    </v-card-title>

    <v-card-text>
      <v-container grid-list-md>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-layout wrap>
            <v-flex xs12 sm6 md6>
              <label class="typo__label">Subject</label>
              <multiselect
                v-model="assignment.subject"
                tag-placeholder="Add this as new subject"
                placeholder="Search or add a subject"
                label="name"
                track-by="id"
                :multiple="false"
                :options="subjectOptions"
                :taggable="true"
                @tag="addSubject"
              ></multiselect>
            </v-flex>

            <v-flex xs12 sm6 md6>
              <v-text-field
                :rules="timeRules"
                required
                v-model="assignment.time"
                label="Estimated Time"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md6>
              <label class="typo__label">Status</label>
              <multiselect
                v-model="assignment.status"
                :searchable="false"
                :options="statusOptions"
                :close-on-select="true"
                :show-labels="false"
                placeholder="Select current status"
                outline
              ></multiselect>
            </v-flex>
            <v-flex xs12 sm6 md6>
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="assignment.start"
                    label="Start Time"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="assignment.start" no-title @input="menu = false"></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12 sm6 md6>
              <v-menu
                v-model="menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="assignment.due"
                    label="Time Due"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="assignment.due" no-title @input="menu2 = false"></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12>
              <v-textarea v-model="assignment.assignment" label="Description" rows="1"></v-textarea>
            </v-flex>
          </v-layout>
        </v-form>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
      <v-btn color="blue darken-1" flat :disabled="!valid" @click="save">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { database } from "../firebase/database";
export default {
  props: {
    assignment: {
      type: Object,
      default: () => ({
        subject: {},
        assignment: "",
        status: "",
        time: "",
        start: new Date().toISOString().substr(0, 10),
        due: new Date().toISOString().substr(0, 10)
      })
    }
  },
  data() {
    return {
      subjectOptions: [],
      statusOptions: ["Done", "In Progress", "Skipped", "Not Started"],
      snackbar: false,
      valid: true,
      menu: false,
      menu2: false,
      subjectRules: [v => !!v || "Subject is required"],
      timeRules: [v => !!v || "Estimated time is required"]
    };
  },
  methods: {
    addSubject(newSubject) {
      const subj = database.addSubject({ name: newSubject });
      this.subjectOptions.push(subj);
      this.assignment.subject = subj;
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.snackbar = true;
      }
    },
    close(fetchItems) {
      this.selectValue = [];
      this.$emit("close", fetchItems);
    },
    save() {
      let assignment = this.assignment;
      assignment.due = this.formatDate(this.assignment.due);
      assignment.start = this.formatDate(this.assignment.start);
      if (this.newItem) {
        database.addAssignment(this.assignment);
      } else {
        database.editAssignment(this.assignment);
      }
      this.close(true);
    },
    formatDate(value) {
      if (typeof value === "string") {
        return Date.parse(value);
      } else {
        return value;
      }
    }
  },
  computed: {
    newItem: function() {
      return !this.assignment.id;
    }
  },
  mounted() {
    this.subjectOptions = database.getSubjects();
    // this.setSelectValue();
  }
};
</script>

<style>
</style>
