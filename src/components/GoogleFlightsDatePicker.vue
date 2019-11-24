<template>
  <div class="gflights-dp">
    <header>
      <div class="gflights-dp__ancillary-buttons-container">
        <div class="gflights-dp__flight-type">Round Trip</div>
        <div class="gflights-dp__reset">Reset</div>
      </div>
      <div class="gflights-dp__date-buttons-container">
        <date-buttons />
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
import pickOrder from "../mixins/pick-order";
import dateMixin from "../mixins/date";

export default {
  name: "GoogleFlightsDatePicker",
  components: {
    DatePicker,
    DateButtons
  },
  mixins: [dateMixin, pickOrder],
  computed: {
    /**
     * The classes to append to the calendar day
     *
     * @return  {Object[]}  [
     *  {
     *    date: Date,
     *    classes: String[]
     *  }
     * ]
     */
    dateClasses() {
      return [
        {
          date: this.departureDate,
          classes: [
            "departure-date",
            "calendar__cell--selected",
            this.next === 0 ? "next" : ""
          ]
        },
        {
          date: this.returnDate,
          classes: [
            "return-date",
            "calendar__cell--selected",
            this.next === 1 ? "next" : ""
          ]
        }
      ].concat(this.datesInRange);
    },
    /**
     * Computes the dates that are in range of the departure date and return
     * date or in range of the departure date and a specified date. Each
     * date within the range gets an 'in-range' class on the calendar day.
     *
     * @return  {Object[]}  [
     *  {
     *    date: Date,
     *    classes: String[]
     *  }
     * ]
     */
    datesInRange() {
      const range = [];
      let { departureDate: d, returnDate: r, tentativeReturnDate: trd } = this;

      if ((d && r) || (d && !r && trd && this.isLaterDate(trd, d))) {
        // If we have no return date and we're in this block, we're mousing
        // over a tentative date, so set the temp return date to the date being
        // moused over.
        if (!r) r = trd;

        let days = this.getDaysBetween(d, r) + 1;
        let inRangeDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

        // "do" ensures we include the departure date in range
        do {
          range.push({
            date: new Date(
              inRangeDate.getFullYear(),
              inRangeDate.getMonth(),
              inRangeDate.getDate()
            ),
            classes: ["in-range"]
          });
          inRangeDate.setDate(inRangeDate.getDate() + 1);
          --days;
        } while (days > 0);

        // If we have no return date and a "mouse over" date, add a class to the
        //  date we're mousing over, in order to remove "in range" style.
        if (!this.returnDate && trd) {
          range.push({
            date: trd,
            classes: ["tentative-return-date"]
          });
        }
      }
      return range;
    }
  },
  methods: {
    /**
     * When we have a departure date and no return date, we want to set the
     * tentative return date to the date we're mousing over.
     *
     * @param {String} eventName The event emitted from the DatePicker component
     * @param {Number} year The year emitted from the DatePicker component
     * @param {Number} month The month emitted from the DatePicker component
     * @param {Number} day The day emitted from the DatePicker component
     *
     * @return {void}
     */
    handleMouseEnterDate(eventName, year, month, day) {
      if (this.departureDate && !this.returnDate) {
        const mouseOverDate = new Date(year, month, day);
        if (this.isLaterDate(mouseOverDate, this.departureDate)) {
          this.tentativeReturnDate = mouseOverDate;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../style/components/google-flights-date-picker";
</style>
