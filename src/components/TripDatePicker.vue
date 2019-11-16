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

<style lang="scss" scoped>
$color_1: white;
$color_2: inherit;
$blue: #4285f4;
$background_color_1: inherit;

@mixin circle-with-border {
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
  width: 44px;
  z-index: -1;
}

.trip-date-picker {
  /deep/ .calendar {
    font-weight: 500;

    &__day-button {
      outline: none;
    }

    &__cell {
      &--day {
        position: relative;
        &:not(.calendar__cell--disabled) {
          &:hover {
            &:after {
              @include circle-with-border;
            }
          }
        }
        @media (hover: hover) {
          &:hover {
            color: $color_2;
          }
        }
      }

      &--selected {
        &:after {
          @include circle-with-border;
          background-color: $blue;
        }
        color: $color_1;

        @media (hover: hover) {
          &:hover {
            &:after {
              background-color: $background_color_1;
            }
          }
        }
      }
    }
  }
}
</style>
