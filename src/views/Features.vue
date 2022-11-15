<template>
  <v-main>
    <v-container>
      <h1 class="features display-2 underline">Features</h1>
      <div class="mt-3">
        <div class="section-container">
          <div
            class="
              d-flex
              justify-space-between
              section
              align-center
            "
          >
            <div class="section-item">
              <h2 class="title-feature">
                Continue where you left
              </h2>
              <div class="feature-description">
                Closed browser by mistake?  Don't worry; you can always go back
                to the way things were.
              </div>
            </div>
            <div class="section-item">
              <lottie-player
                src="https://assets4.lottiefiles.com/packages/lf20_uavyvaxw.json"
                background="transparent"
                speed="1"
                class="lottie-player"
                loop
                autoplay
              ></lottie-player>
            </div>
          </div>
        </div>

        <div class="section-container">
          <div
            class="
              d-flex
              justify-space-between
              section
              align-center
            "
          >
            <div class="section-item">
              <h2 class="title-feature">See results</h2>
              <div class="feature-description">
                Review your test answers and scores to get
                insight.
              </div>
            </div>
            <div class="section-item">
              <v-img
                src="@/assets/review.png"
                max-width="600"
                style="border-radius: 10px"
              ></v-img>
            </div>
          </div>
        </div>

        <div class="section-container">
          <div
            class="
              d-flex
              justify-space-between
              section
              align-center
            "
          >
            <div class="section-item">
              <h2 class="title-feature">
                For creators
              </h2>
              <div class="feature-description">
                View the outcomes and efforts of all
                students, as well as a graphical depiction
                of statistics.
              </div>
            </div>
            <div class="section-item">
              <lottie-player
                src="https://assets5.lottiefiles.com/packages/lf20_3rqwsqnj.json"
                background="transparent"
                speed="1"
                class="lottie-player"
                loop
                autoplay
              ></lottie-player>
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </v-main>
</template>

<script>
import '@lottiefiles/lottie-player';

export default {};
</script>

<style>
.features {
  font-size: 3rem;
  font-weight: 500 !important;
  /* background: #9a4bcf;
  background: linear-gradient(
    to right,
    #9a4bcf 0%,
    #08cfc2 18%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; */
  background: #0f9600;
  background: linear-gradient(
    to right,
    #0f9600 0%,
    #c91e6e 18%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.title-feature {
  font-size: 2.5rem;
  font-weight: 500;

  background: #6e76e0;
  background: linear-gradient(
    to right,
    #6e76e0 13%,
    #1dadad 70%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-container {
  height: 100vh;
}
.section {
  height: 50vh;
}
.section-item {
  max-width: 50%;
}
.feature-description {
  font-size: 1.5rem;
  color: rgb(88, 82, 82);
}
.lottie-player {
  min-width: 200px;
  max-width: 600px;
  @media (max-width: 1189px) {
    max-width: 400px;
  }
}

@import url("https://fonts.googleapis.com/css2?family=Recursive:wght@400;700&display=swap");
* {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
  color: #bbccff;
  font-family: Recursive;
}

</style>
