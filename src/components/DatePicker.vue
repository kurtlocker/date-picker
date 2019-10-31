<template>
  <div class="date-picker">
    <calendar :date="date" />
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
     * Returns a new date whose month is +1 of {@link this.date}.
     * @returns {Date}
     */
    nextMonth() {
      return new Date(
        this.date.getUTCFullYear(),
        this.date.getUTCMonth() + 1,
        1
      );
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
        this.date.getUTCFullYear(),
        this.date.getUTCMonth() + n,
        1
      );
      this.date = newDate;
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
