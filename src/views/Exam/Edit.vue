<!-- eslint-disable max-len -->
<template>
  <v-main>
    <v-container>
      <v-snackbar v-model="snackbar">
        Exam link copied to clipboard
        <template v-slot:action="{ attrs }">
          <v-btn
            color="purple"
            class="text-capitalize"
            text
            v-bind="attrs"
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>

      <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
      <v-row>
        <v-col cols="12" sm="6">
          <v-card class="mx-auto" flat>
            <v-container>
              <v-form ref="form">
                <v-row align="center">
                  <v-col cols="12">
                    <v-text-field
                      v-model="formData.title"
                      label="Title"
                      placeholder="Please enter a title"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      rows="3"
                      auto-grow
                      v-model="formData.description"
                      label="Description"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-combobox
                      v-model="formData.tags"
                      :search-input.sync="search"
                      hide-selected
                      placeholder="eg: Physics, Chemistry, DSA"
                      label="Add some tags"
                      multiple
                      persistent-hint
                      small-chips
                    >
                      <template v-slot:no-data>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              No results matching "<strong
                                >{{ search }}</strong
                              >". Press <kbd>enter</kbd> to
                              create a new one
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-combobox>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <div class="d-flex justify-center flex-wrap">
            <!-- Setting -->
            <v-dialog
              v-model="dialogs.setting"
              max-width="400"
            >
              <template #activator="{ on }">
                <v-btn
                  color="success"
                  text
                  x-large
                  class="v-btn--active text-capitalize my-1"
                  v-on="on"
                >
                  Setting <v-icon>mdi-cog</v-icon>
                </v-btn>
              </template>
              <v-card class="mx-auto">
                <v-card-title>
                  Setting
                  <v-spacer></v-spacer>
                  <v-btn
                    @click="dialogs.setting = false"
                    icon
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <v-checkbox
                    v-model="formData.privacy"
                    true-value="public"
                    false-value="private"
                    label="Public"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="formData.allowRetake"
                    label="Allow retake"
                  ></v-checkbox>
                  <v-text-field
                    label="Time limit"
                    v-model.number="formData.duration"
                    suffix="Minutes"
                  ></v-text-field>
                </v-card-text>
              </v-card>
            </v-dialog>
            <v-dialog
              max-width="300"
              v-model="dialogs.delete"
            >
              <template #activator="{ on }">
                <v-btn
                  color="error"
                  v-on="on"
                  x-large
                  text
                  class="
                    v-btn--active
                    text-capitalize
                    ml-1
                    my-1
                  "
                >
                  Delete
                  <v-icon> Delete mdi-trash-can </v-icon>
                </v-btn>
              </template>
              <v-card class="ma-auto">
                <v-card-title> Delete exam?</v-card-title>
                <v-card-text>
                  <v-btn color="error" @click="deleteExam()"
                    >Yes</v-btn
                  >
                  <v-btn
                    color="grey"
                    text
                    @click="dialogs.delete = false"
                    >No</v-btn
                  >
                </v-card-text>
              </v-card>
            </v-dialog>
            <v-btn
              color="primary"
              x-large
              text
              class="
                text-capitalize
                ml-1
                my-1
                v-btn--active
              "
              :disabled="formData.privacy !== 'public'"
              @click="share()"
              >Share <v-icon>mdi-share</v-icon></v-btn
            >
            <v-btn
              x-large
              text
              color="primary"
              class="
                text-capitalize
                my-1
                v-btn--active
                ml-1
              "
              :to="`/exam/${this.$route.params.id}/results`"
              >Results <v-icon>mdi-chart-bar</v-icon></v-btn
            >
          </div>

          <v-alert
            type="warning"
            text
            class="my-2"
            v-if="formData.privacy !== 'public'"
          >
            This exam is not accessible to public. Click on
            setting to make it public.
          </v-alert>
        </v-col>
      </v-row>

      <QuestionList
        style="margin-top: 3rem"
        :exam-id="$route.params.id"
        @add="$refs.question.dialog = true"
      />
    </v-container>
  </v-main>
</template>

<script>
import { throttle } from 'throttle-debounce';
import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
import Exam from '../../services/exam';

Vue.use(VueClipboard);

const e = new Exam();

const updateData = throttle(1000, (data) => {
  if (!data || !e.id) {
    return;
  }
  e.update(data);
});

export default {
  components: {
    // QuestionAdd: () => import('../../components/Question/Add.vue'),
    QuestionList: () =>
      // eslint-disable-next-line implicit-arrow-linebreak
      import('../../components/Question/List.vue'),
  },
  data() {
    return {
      search: '',
      formData: {},
      dialogs: {
        delete: false,
        setting: false,
      },
      snackbar: false,
      breadcrumbs: [
        { text: 'Dashboard', to: '/dashboard' },
        { text: 'Edit exam', to: '/edit', disabled: true },
      ],
    };
  },
  watch: {
    formData: {
      handler(value) {
        const data = {
          ...value,
          userEmail: this.$store.state.user.email,
          userFullName: this.$store.state.user.name,
        };
        updateData(data);
      },
      deep: true,
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    share() {
      this.$copyText(
        `${window.location.origin}/exam/${this.$route.params.id}`,
      );
      this.snackbar = true;
      setTimeout(() => {
        this.snackbar = false;
      }, 5000);
    },
    updatePrivacy() {
      if (this.formData.privacy === 'public') {
        this.formData.privacy = 'private';
      } else {
        this.formData.privacy = 'public';
      }
    },
    deleteExam() {
      e.delete();
      this.$router.push('/dashboard');
    },
    getData() {
      e.setUser(this.$store.state.user.uid);
      e.setId(this.$route.params.id);
      e.get().then((data) => {
        if (data.user !== this.$store.state.user.uid) {
          this.$router.push('/dashboard');
        }
        this.formData = data;
      });
    },
  },
};
</script>

<style>
</style>
