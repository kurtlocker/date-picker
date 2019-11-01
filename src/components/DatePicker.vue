<template>
  <div class="date-picker">
    <calendar :date="internalDate" />
    <calendar :date="nextMonth" />
    <button @click="updateMonth(-1)">Previous</button>
    <button @click="updateMonth(1)">Next</button>
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
      default: () => new Date(2019, 9, 31)
    }
  },
  computed: {
    /**
     * Returns a new date whose month is +1 of {@link this.internalDate}.
     * @returns {Date}
     */
    nextMonth() {
      const clonedDate = new Date(+this.internalDate);
      clonedDate.setDate(1);
      return new Date(clonedDate.setMonth(this.internalDate.getMonth() + 1))
      // return new Date(
      //   new Date(+this.internalDate).setMonth(this.internalDate.getMonth() + 1)
      // );
    }
  },
  methods: {
    /**
     * Updates the calendar month by +|- 1.
     * @param {Number} n The month number to shift by
     * @returns {void}
     */
    updateMonth(n) {
      const newDate = new Date(
        this.internalDate.setMonth(this.internalDate.getMonth() + n)
      );
      this.internalDate = newDate;
    }
  }
};
</script>

<style scoped>
.date-picker {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 2em;
}
@media screen and (min-width: 787px) {
  .date-picker {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
