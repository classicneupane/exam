<template>
  <v-main>
    <v-container>
      <ExamList />
    </v-container>
  </v-main>
</template>

<script>
export default {
  metaInfo: {
    title: 'Dashboard',
  },
  components: {
    ExamList: () => import('../../components/Exam/List.vue'),
  },
};
</script>

<style>
</style>
