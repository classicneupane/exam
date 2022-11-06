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
            <h1 style="color: #d87ca5" class="display-2">
              Create exam
            </h1>
            <div class="my-2 description">
              Create online test and quizzes in minutes, for
              any subject, any language and for all grade
              levels. Engage students on any device.
            </div>
            <div class="cta">
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
.section-1 {
  @media (max-width: 825px) {
    margin-top: 3rem !important;

    .cta {
      text-align: center;
    }
  }
}
.lottie-player {
  min-width: 200px;
  max-width: 600px;
  @media (max-width: 1189px) {
    max-width: 400px;
  }
}
.description {
  max-width: 500px;
  font-weight: 400;
  font-size: 1.3rem;
  color: grey;
}
</style>
