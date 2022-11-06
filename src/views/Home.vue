<template>
  <v-main>
    <v-container>
      <div class="section-1">
        <div
          class="
            d-flex
            flex-wrap
            justify-space-around
            align-center
          "
        >
          <div>
            <h1  style="color: #D87CA5" class="display-2">
              Create exam
            </h1>
            <div style="max-width: 400px; font-weight: 400;" class="my-2">
              Create online test and quizzes in minutes, for
              any subject, any language and for all grade
              levels. Engage students on any device.
            </div>
            <v-btn
              rounded
              x-large
              dark
              color="indigo"
              class="mt-4"
              to="/login?message=Please login to continue"
              >Get started</v-btn
            >
          </div>
          <div>
            <lottie-player
              src="https://assets3.lottiefiles.com/packages/lf20_6ft9bypa.json"
              background="transparent"
              speed="1"
              class="lottie-player"
              loop
              autoplay
            ></lottie-player>
          </div>
        </div>
      </div>
    </v-container>
  </v-main>
</template>

<script>
import '@lottiefiles/lottie-player';

export default {
  name: 'Home',
  metaInfo: {
    title: 'uqExam | Create online exam',
    description:
      'You can create your own online exam with EQExam. You can choose the questions and answers, the topics, the time limit and more. The program is easy to use and fast to complete.',
  },
};
</script>

<style scoped lang="scss">
.lottie-player {
  min-width: 200px;
  max-width: 600px;
  @media (max-width: 1189px) {
    max-width: 400px;
  }
}
</style>
