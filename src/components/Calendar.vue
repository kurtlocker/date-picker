<template>
  <div class="calendar" :data-month="date.getUTCMonth()" :data-year="date.getUTCFullYear()">
    <header>
      {{ month }}&nbsp;
      <span v-if="needsYear">{{ date.getUTCFullYear() }}</span>
    </header>
    <main>
      <ul>
        <!-- Week Day Label -->
        <li
          class="calendar__cell calendar__cell--label"
          v-for="(label, i) in Object.values(weekDayMap)"
          :key="`day-abbr-${i}`"
        >{{ label.narrow }}</li>
        <!-- Days offset (blank grid cells) -->
        <li v-for="(day, i) in daysOffset" :key="`day-offset-${i}`"></li>
        <!-- Day numbers -->
        <li
          v-for="day in days"
          :key="`month-day-${day}`"
          :class="{ 
            'calendar__cell': true,
            'calendar__cell--day': true,
            'calendar__cell--past': isPast(day) 
          }"
          :data-day="day"
        >{{ day }}</li>
      </ul>
    </main>
    <button @click="updateMonth(-1)">Previous</button>
    <button @click="updateMonth(1)">Next</button>
  </div>
</template>

<script>
export default {
  name: "Calendar",
  data() {
    return {
      /**
       * Used to determine if a particular date is in the past.
       */
      today: new Date(),
      /**
       * The date object used by the component
       */
      date: this.initialDate
    };
  },
  props: {
    /**
     * Intialize the calendar with a date.
     */
    initialDate: {
      type: Date,
      required: false,
      default: () => new Date()
    }
  },
  computed: {
    /**
     * Returns the abbreviations of the days of the week as an array.
     * @returns {Object}
     */
    weekDayMap() {
      const baseDate = new Date(Date.UTC(2017, 0, 2)); // Random Sunday
      const weekDayMap = {};
      for (let i = 0; i < 7; i++) {
        weekDayMap[this.getWeekDay(baseDate, "long")] = {
          narrow: this.getWeekDay(baseDate, "narrow"),
          long: this.getWeekDay(baseDate, "long"),
          num: i
        };
        baseDate.setDate(baseDate.getDate() + 1);
      }
      return weekDayMap;
    },
    /**
     * Returns the number of days in the month.
     * @returns {Number}
     */
    days() {
      return this.getDaysInMonth(
        this.date.getUTCFullYear(),
        this.date.getUTCMonth()
      );
    },
    /**
     * The number of days to offset before day 1 of the month starts.
     * Corresponds with blank cells in the calendar month.
     * @returns {Number} 
     */
    daysOffset() {
      const { date, weekDayMap, getMonthStartDay } = this;
      const monthStartDay = getMonthStartDay(
        date.getUTCFullYear(),
        date.getUTCMonth()
      );
      return weekDayMap[monthStartDay].num;
    },
    /**
     * The name of the month
     * @returns {String}
     */
    month() {
      return this.date.toLocaleString("default", { month: "long" });
    },
    /**
     * Determines if we should display the year.
     * @returns {Boolean}
     */
    needsYear() {
      const { date, today } = this;
      return (
        date.getUTCFullYear() > today.getUTCFullYear() ||
        date.getUTCFullYear() < today.getUTCFullYear()
      );
    }
  },
  methods: {
    /**
     * Get the number of days of the given {@link month} of {@link year}.
     * @param {Number} year
     * @param {Number} month
     * @returns {Number} Number of days in month
     */
    getDaysInMonth(year, month) {
      return new Date(year, month + 1, 0).getDate();
    },
    /**
     * Returns the localized week day name.
     * @param {Date} date The date object
     * @param {String} form The form we want the weekday name in
     *  narrow = 'M'
     *  long = 'Monday'
     * @returns {String} The localized week day name
     */
    getWeekDay(date, form) {
      return date.toLocaleDateString(undefined, { weekday: form });
    },
    /**
     * Returns the localized weekday name for the given year and month.
     * @param {Number} year
     * @param {Number} month
     * @return {String}
     */
    getMonthStartDay(year, month) {
      const date = new Date(year, month, 1);
      return this.getWeekDay(date, "long");
    },
    /**
     * Determines if a given calendarDay is in the past by comparing it to
     * today's date.
     * @param {Number} calendarDay 
     * @return {Boolean}
     */
    isPast(calendarDay) {
      const { today, date } = this;
      const calendarYear = date.getUTCFullYear();
      const calendarMonth = date.getUTCMonth();
      const todayYear = today.getUTCFullYear();
      const todayMonth = today.getUTCMonth();
      const todayDay = today.getDate();
      return (
        calendarYear < todayYear ||
        (calendarYear === todayYear && calendarMonth < todayMonth) ||
        (calendarMonth === todayMonth && calendarDay < todayDay)
      );
    },
    /**
     * Updates the calendar month by +|- 1 
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

<style lang="scss" scoped>
.calendar {
  color: #3c4043;
  font-size: 16px;
  main {
    ul {
      padding: 0;
      margin: 0;
      list-style: none;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
      li {
        padding: 1em;
      }
    }
  }
  &__cell {
    &--label {
      color: rgba(0, 0, 0, 0.54);
      font-size: 13px;
    }
    &--past {
      color: rgba(0, 0, 0, 0.26);
    }
  }
}
</style>
