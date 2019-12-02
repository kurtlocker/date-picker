<template>
  <div class="gflights-dp">
    <header>
      <div class="gflights-dp__ancillary-buttons-container">
        <div class="gflights-dp__flight-type">Round Trip</div>
        <div class="gflights-dp__reset">
          <button :disabled="isResetDisabled" @click="reset">Reset</button>
        </div>
      </div>
      <div class="gflights-dp__date-buttons-container">
        <google-flights-date-buttons
          :departure-date="departureDate"
          :return-date="returnDate"
          :next="next"
          @next="handleNext"
          @day-update="handleDayUpdate"
        />
      </div>
    </header>
    <main>
      <date-picker
        :date-classes="dateClasses"
        @date-selected="roundTrip"
        @mouse-enter-date="handleMouseEnterDate"
        @mouse-leave-date="tentativeReturnDate = null"
      />
    </main>
    <footer>Done</footer>
  </div>
</template>

<script>
import DatePicker from "./DatePicker.vue";
import GoogleFlightsDateButtons from "./GoogleFlightsDateButtons.vue";
import engine from "../mixins/engine";

export default {
  name: "GoogleFlightsDatePicker",
  components: {
    DatePicker,
    GoogleFlightsDateButtons
  },
  mixins: [engine],
  computed: {
    isResetDisabled() {
      return !this.departureDate && !this.returnDate;
    }
  },
  methods: {
    /**
     * Resets the departure and return dates.
     *
     * @return  {void}
     */
    reset() {
      this.departureDate = null;
      this.returnDate = null;
      this.next = 0;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../style/components/google-flights-date-picker";
</style>
