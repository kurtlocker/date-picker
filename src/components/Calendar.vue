<template>
  <div class="calendar">
    <header>
      {{ month }}&nbsp;
      <span v-if="needsYear">{{ internalDate.getFullYear() }}</span>
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
          class="calendar__cell calendar__cell--day"
        >
          <button
            :class="getClasses(date, day)"
            :disabled="isPast(day, date, today)"
            :data-day="day"
            :data-month="date.getMonth()"
            :data-year="date.getFullYear()"
            @click="handleButtonSelect(day)"
          >{{ day }}</button>
        </li>
      </ul>
    </main>
    <template v-if="hasMonthUpdateButtons">
      <slot name="previous" v-bind="{updateMonth}">
        <button @click="updateMonth(-1)">Previous</button>
      </slot>
      <slot name="next" v-bind="{updateMonth}">
        <button @click="updateMonth(1)">Next</button>
      </slot>
    </template>
  </div>
</template>

<script>
import dateMixin from "../mixins/date";

export default {
  name: "Calendar",
  mixins: [dateMixin],
  data() {
    return {
      /**
       * Used to determine if a particular date is in the past.
       */
      today: new Date(),
      /**
       * The date object used for this instance.
       */
      internalDate: this.date,
    };
  },
  watch: {
    /**
     * When the date prop changes, set the {@link internalDate} with the
     * new dateObj.
     * @param {Date} dateObj The dateObj
     */
    date(dateObj) {
      this.internalDate = dateObj;
    }
  },
  props: {
    /**
     * Intialize the calendar with a date.
     */
    date: {
      type: Date,
      required: false,
      default: () => new Date()
    },
    /**
     * Determines if a calendar has month update markup
     */
    hasMonthUpdateButtons: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    /**
     * Returns the abbreviations of the days of the week as an object.
     * @return {Object}
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
     * @return {Number}
     */
    days() {
      return this.getDaysInMonth(
        this.internalDate.getFullYear(),
        this.internalDate.getMonth()
      );
    },
    /**
     * The number of days to offset before day 1 of the month starts.
     * Corresponds with blank cells in the calendar month.
     * @return {Number}
     */
    daysOffset() {
      const { internalDate, weekDayMap, getMonthStartDay } = this;
      const monthStartDay = getMonthStartDay(
        internalDate.getFullYear(),
        internalDate.getMonth()
      );
      return weekDayMap[monthStartDay].num;
    },
    /**
     * The name of the month
     * @return {String}
     */
    month() {
      return this.internalDate.toLocaleString("default", { month: "long" });
    },
    /**
     * Determines if we should display the year.
     * @return {Boolean}
     */
    needsYear() {
      const { internalDate, today } = this;
      return (
        internalDate.getFullYear() > today.getFullYear() ||
        internalDate.getFullYear() < today.getFullYear()
      );
    }
  },
  methods: {
    /**
     * The computed classes for the button.
     * @return {Object}
     */
    getClasses() {
      return {
        "calendar__cell-day-button": true,
      };
    },
    /**
     * Updates the calendar month by +|- 1.
     * @param {Number} n The month number to shift by
     * @return {void}
     */
    updateMonth(n) {
      this.internalDate = this.adjustedMonth(n, this.internalDate);
    },
    /**
     * Emits the date-clicked event.
     * @param {Number} daySelected The day selected
     */
    handleButtonSelect(daySelected) {
      this.$emit(
        "date-clicked",
        this.internalDate.getFullYear(),
        this.internalDate.getMonth(),
        daySelected
      );
    },
  }
};
</script>

<style scoped>
.calendar {
  color: #3c4043;
  font-size: 16px;
}
.calendar__cell--label {
  color: rgba(0, 0, 0, 0.54);
  font-size: 13px;
  padding: 0.5em;
}
.calendar header {
  margin-bottom: 1em;
}
.calendar main ul {
  padding: 0;
  margin: 0;
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
}
.calendar main ul li button {
  border: none;
  margin: 0;
  padding: 0;
  overflow: visible;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: normal;
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;
  appearance: none;
  border-radius: 0;
  padding: 1em;
  width: 100%;
  /* outline: none; */
  cursor: pointer;
}
.calendar main ul li button[disabled] {
  color: rgba(0, 0, 0, 0.26);
  pointer-events: none;
}
.calendar main ul li button::-moz-focus-inner {
  border: 0;
  padding: 0;
}
</style>
