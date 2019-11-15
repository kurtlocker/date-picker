<template>
  <div class="trip-date-picker">
    <date-picker :dates-selected="computedDatesSelected" @date-selected="handleDateSelected" />
  </div>
</template>

<script>
import DatePicker from "./DatePicker.vue";
import dateMixin from "../mixins/date";

export default {
  name: "TripDatePicker",
  components: {
    DatePicker
  },
  mixins: [dateMixin],
  data() {
    return {
      /**
       * Which date gets set next? Where 0 = departureDate; 1 = returnDate
       * @type {Number}
       */
      next: 0,
      /**
       * @type {Date}
       */
      departureDate: null,
      /**
       * @type {Date}
       */
      returnDate: null
    };
  },
  computed: {
    /**
     * The array of selected dates and classes to apply to the selected
     * dates
     *
     * @return  {Object[]}  The array of selected dates.
     */
    computedDatesSelected() {
      return [
        {
          date: this.departureDate,
          class: "departure-date"
        },
        {
          date: this.returnDate,
          class: "return-date"
        }
      ];
    }
  },
  methods: {
    /**
     * Google Flights - observed behavior of date selection
     * (D = departure date, R = return date, Next = Which variable gets set next)
     *
     * Reset click:
     *  D = null
     *  R = null
     *  Next = D
     *
     * On click:
     *  if Next = D
     *    D = Selected Date
     *    Next = R
     *  else if Next = R
     *    if Selected Date < D
     *      D = Selected Date
     *      Next = R
     *    else if Selected Date >= D
     *      R = Selected Date
     *      Next = empty
     *  else (Next is empty)
     *    if Selected Date <= R
     *      D = Selected Date
     *      Next = R
     *    else if Selected Date > R
     *      D = Selected Date
     *      R = null
     *      Next = R
     */
    handleDateSelected(year, month, day) {
      const { departureDate: d, returnDate: r } = this;
      const selectedDate = new Date(year, month, day);
      switch (this.next) {
        case 0:
          this.departureDate = selectedDate;
          // Set return date next
          this.next = 1;
          break;
        case 1:
          if (this.isEarlierDate(selectedDate, d)) {
            this.departureDate = selectedDate;
            this.next = 1;
          } else if (
            this.isLaterDate(selectedDate, d) ||
            this.isSameDate(selectedDate, d)
          ) {
            this.returnDate = selectedDate;
            this.next = null;
          }
          break;
        default:
          // Initialization or reset
          if (!d && !r) {
            // Departure date is next
            this.next = 0;
            // Set the departure date
            this.handleDateSelected(year, month, day);
          } else if (
            this.isEarlierDate(selectedDate, r) ||
            this.isSameDate(selectedDate, r)
          ) {
            this.departureDate = selectedDate;
            // Set return date next
            this.next = 1;
          } else if (this.isLaterDate(selectedDate, r)) {
            this.departureDate = selectedDate;
            this.returnDate = null;
            this.next = 1;
          }
          break;
      }
    }
  }
};
</script>

<style scoped>
.trip-date-picker >>> .calendar {
  font-weight: 500;
}
.trip-date-picker >>> .calendar__day-button {
  outline: none;
}
.trip-date-picker >>> .calendar__cell--day {
  position: relative;
}
.trip-date-picker >>> .calendar__cell--day:hover {
  color: inherit;
}
.trip-date-picker >>> .calendar__cell--selected:after,
.trip-date-picker
  >>> .calendar__cell--day:not(.calendar__cell--disabled):hover:after {
  content: "";
  border: 2px solid #4285f4;
  border-radius: 100%;
  box-sizing: border-box;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  height: 44px;
  margin: auto;
  position: absolute;
  transform: scale(1);
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
  width: 44px;
  z-index: -1;
}
.trip-date-picker >>> .calendar__cell--selected {
  color: white;
}
.trip-date-picker >>> .calendar__cell--selected:after {
  background-color: #4285f4;
}
.trip-date-picker >>> .calendar__cell--selected:hover:after {
  background-color: inherit;
}
</style>
