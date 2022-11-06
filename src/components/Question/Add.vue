<template>
  <div>
    <v-dialog max-width="600" v-model="dialog" persistent>
      <v-card class="mx-auto">
        <v-card-title>
          Add question
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-container>
          <AddForm :exam-id="examId" @close="dialog = false" />
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  components: {
    AddForm: () => import('./AddForm.vue'),
  },
  props: {
    examId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
    };
  },
};
</script>

<style>
</style>
