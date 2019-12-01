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
        <date-buttons
          :departure-date="departureDate"
          :return-date="returnDate"
          :next="next"
          @next="handleNext"
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
import DateButtons from "./DateButtons.vue";
import engine from "../mixins/engine";

export default {
  name: "GoogleFlightsDatePicker",
  components: {
    DatePicker,
    DateButtons
  },
  mixins: [engine],
  computed: {
    isResetDisabled() {
      return !this.departureDate && !this.returnDate;
    }
  },
  methods: {
    reset() {
      this.departureDate = null;
      this.returnDate = null;
      this.next = 0;
    },
    handleNext(next) {
      if (next === 1 && !this.departureDate) return;
      this.next = next;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../style/components/google-flights-date-picker";
</style>
