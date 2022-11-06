<template>
  <v-main>
    <v-container>
      <div>
        <ActiveSessions />
      </div>
      <v-divider class="my-3"></v-divider>
      <div>
        <ExamList />
      </div>
    </v-container>
  </v-main>
</template>

<script>
export default {
  metaInfo: {
    title: 'Dashboard',
  },
  components: {
    ExamList: () =>
      // eslint-disable-next-line implicit-arrow-linebreak
      import('../../components/Exam/List.vue'),
    ActiveSessions: () =>
      // eslint-disable-next-line implicit-arrow-linebreak
      import('../../components/ActiveSessions.vue'),
  },
};
</script>

<style>
</style>
