<template>
  <div class="trip-date-picker">
    <header>Top</header>
    <main>
      <date-picker
        :date-classes="dateClasses"
        @date-selected="handleDateSelected"
        @mouse-enter-date="handleMouseEnterDate"
        @mouse-leave-date="tentativeReturnDate = null"
      />
    </main>
    <footer>Done</footer>
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
       *
       * @type {Number}
       */
      next: 0,
      /**
       * The date representing a departure
       *
       * @type {Date}
       */
      departureDate: null,
      /**
       * The date representing a return
       *
       * @type {Date}
       */
      returnDate: null,
      /**
       * The date recorded when a user hovers/mouse enters over an arbitrary
       * calendar date when we a departure date set but no return date.
       *
       * @type {Date}
       */
      tentativeReturnDate: null
    };
  },
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
     * Google Flights - observed behavior of date selection
     *  D = departure date
     *  R = return date
     *  Next = Which variable gets set next
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
     *
     * This function handles the various states dictating which date, departure
     * or return, the user should be selecting next based on their previous
     * selection.
     *
     * @param {String} eventName The event emitted from the DatePicker component
     * @param {Number} year The year emitted from the DatePicker component
     * @param {Number} month The month emitted from the DatePicker component
     * @param {Number} day The day emitted from the DatePicker component
     *
     * @return {void}
     */
    handleDateSelected(eventName, year, month, day) {
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
    },
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
        this.tentativeReturnDate = new Date(year, month, day);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$color_1: white;
$color_2: inherit;
$border-color: #dadce0;
$hover-background-color: $color_1;
$blue: #4285f4;
$darker-blue: #3367d6;
$lighter-blue: #daedfd;
$background_color_1: inherit;

@mixin circle-with-border {
  content: "";
  border: 2px solid $blue;
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

@mixin in-range-base {
  @include circle-with-border;
  background-color: $lighter-blue;
  border: 0;
  border-radius: 0;
}

.trip-date-picker {
  box-shadow: 0 1px 3px rgba(60, 64, 67, 0.3),
    0 4px 8px 3px rgba(60, 64, 67, 0.15);
  border-radius: 8px;
  max-width: 800px;
  margin: 0 auto;

  & > header {
    padding: 8px 8px 8px 24px;
    border-bottom: 1px solid $border-color;
  }

  & > main {
    position: relative;
    margin: 12px 45px 3em;
  }

  & > footer {
    padding: 8px;
    border-top: 1px solid $border-color;
  }

  /deep/ .date-picker {
    &__calendars {
      grid-gap: 4em;
    }
    &__previous-month,
    &__next-month {
      position: absolute;
      top: 50%;
    }

    &__previous-month {
      margin-left: -65px;
      left: 0;
    }

    &__next-month {
      margin-right: -65px;
      right: 0;
    }
  }

  /deep/ .calendar {
    main ul li button {
      padding: 15px 0;
    }

    &__day-button {
      outline: none;
    }

    &__cell {
      @media (hover: hover) {
        &--day:not(.calendar__cell--disabled):hover:after {
          @include circle-with-border;
          background-color: $hover-background-color;
        }
      }
      &--selected:after {
        @include circle-with-border;
        background-color: $hover-background-color;
      }

      &--day {
        position: relative;
        @media (hover: hover) {
          &:hover {
            color: $color_2;
          }
        }
      }

      &--selected {
        color: $color_1;
        &:after {
          background-color: $blue;
        }
        &.next {
          &:after {
            border-color: $darker-blue;
          }
        }
        @media (hover: hover) {
          &:hover {
            &:after {
              background-color: $hover-background-color;
            }
          }
        }
      }
    }

    // Styles for highlighting the cells between departure and return
    // dates.
    .in-range {
      &:before {
        @include in-range-base;
        width: inherit;
      }
      &.departure-date {
        &:before {
          left: 50%;
        }
      }
      &.return-date,
      &.tentative-return-date {
        &:before {
          right: 50%;
        }
      }
      &.calendar__cell--first-day:not(.departure-date) {
        &:before {
          background: linear-gradient(to right, $color_1, $lighter-blue);
        }
      }
      &.calendar__cell--last-day:not(.return-date):not(.tentative-return-date) {
        &:before {
          background: linear-gradient(to left, $color_1, $lighter-blue);
        }
      }
    }
  }
}
</style>
