<template>
  <div class="date-picker">
    <div class="date-picker__calendars">
      <calendar :date="internalDate" />
      <calendar :date="nextMonth" />
    </div>
    <div class="date-picker__buttons">
      <button class="date-picker__previous-month" @click="updateMonth(-1)"></button>
      <button class="date-picker__next-month" @click="updateMonth(1)"></button>
    </div>
  </div>
</template>

<script>
import Calendar from "./Calendar.vue";

export default {
  name: "DatePicker",
  components: {
    Calendar
  },
  data() {
    return {
      /**
       * The date object used for this instance.
       */
      internalDate: this.date
    };
  },
  props: {
    /**
     * Intialize the date picker with a date.
     */
    date: {
      type: Date,
      required: false,
      default: () => new Date()
    }
  },
  computed: {
    /**
     * Returns a new date whose month is +1 of {@link this.internalDate}.
     * @returns {Date}
     */
    nextMonth() {
      return this.adjustedMonth(1);
    }
  },
  methods: {
    /**
     * Updates the {@link this.internalDate} to a new date whose month has
     * been adjusted by {@link n}.
     * @param {Number} n The number of months to shift
     * @returns {void}
     */
    updateMonth(n) {
      this.internalDate = this.adjustedMonth(n);
    },
    /**
     * @param {Number} n The number of months to shift
     * @returns {Date} The adjusted month date
     */
    adjustedMonth(n) {
      const clonedDate = new Date(+this.internalDate);
      clonedDate.setDate(1);
      return new Date(clonedDate.setMonth(this.internalDate.getMonth() + n));
    }
  }
};
</script>

<style scoped>
.date-picker {
  position: relative;
}
.date-picker__calendars {
  display: grid;
  grid-gap: 2em;
}
.date-picker__buttons {
  margin-top: 1em;
}
.date-picker__buttons button {
  border: none;
  margin: 0;
  padding: 0;
  overflow: visible;
  color: inherit;
  font: inherit;
  line-height: normal;
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;
  appearance: none;
  border-radius: 0;
  padding: 1em;
  cursor: pointer;
}
button.date-picker__previous-month {
  /* Left chevron */
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBkPSJNMTQuMTkgMTYuMDA1bDcuODY5IDcuODY4LTIuMTI5IDIuMTI5LTkuOTk2LTkuOTk3TDE5LjkzNyA2LjAwMmwyLjEyNyAyLjEyOXoiLz48L3N2Zz4=");
  background-repeat: no-repeat;
  background-position: center;
  margin-right: .5em;
}
button.date-picker__next-month {
  /* Right chevron */
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBkPSJNMTguNjI5IDE1Ljk5N2wtNy4wODMtNy4wODFMMTMuNDYyIDdsOC45OTcgOC45OTdMMTMuNDU3IDI1bC0xLjkxNi0xLjkxNnoiLz48L3N2Zz4=");
  background-repeat: no-repeat;
  background-position: center;
}
@media screen and (min-width: 787px) {
  .date-picker__calendars {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
