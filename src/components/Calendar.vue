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
        <li
          v-for="(day, i) in daysOffset"
          class="calendar__cell calendar__cell--blank"
          :key="`day-offset-${i}`"
        ></li>
        <!-- Day numbers -->
        <li v-for="day in days" :key="`month-day-${day}`" :class="getClasses(day)">
          <button
            class="calendar__day-button"
            :disabled="isPast(day, internalDate, today)"
            @click="handleEvent('date-selected', day)"
            @mouseenter="handleEvent('mouse-enter-date', day)"
            @mouseleave="handleEvent('mouse-leave-date', day)"
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
      internalDate: this.date
    };
  },
  watch: {
    /**
     * When the date prop changes, set the {@link internalDate} with the
     * new dateObj.
     *
     * @param {Date} dateObj The dateObj
     *
     * @return {void}
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
    },
    /**
     * The classes to append to the calendar day
     *
     * object model: {
     *  date: Date,
     *  classes: String[]
     * }
     */
    dateClasses: {
      type: Array,
      required: true
    }
  },
  computed: {
    /**
     * Returns the abbreviations of the days of the week as an object.
     *
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
     *
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
     *
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
     *
     * @return {String}
     */
    month() {
      return this.internalDate.toLocaleString("default", { month: "long" });
    },
    /**
     * Determines if we should display the year.
     *
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
     * The computed classes for the calendar cell..
     *
     * @param {Number} day The day of the month
     *
     * @return {Object}
     */
    getClasses(day) {
      const { internalDate: date } = this;
      return this.dateClasses.reduce(
        (classes, obj) => {
          const calendarDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            day
          );
          if (this.isSameDate(obj.date, calendarDate)) {
            return {
              ...classes,
              ...obj.classes.reduce((acc, clazz) => {
                if (clazz) {
                  // check for empty value
                  acc[clazz] = true;
                }
                return acc;
              }, {})
            };
          }
          return classes;
        },
        // Default classes controlled by the calendar component
        {
          calendar__cell: true,
          "calendar__cell--day": true,
          "calendar__cell--disabled": this.isPast(day, date, this.today),
          "calendar__cell--first-day": day === 1,
          "calendar__cell--last-day":
            day === this.getDaysInMonth(date.getFullYear(), date.getMonth())
        }
      );
    },
    /**
     * Updates the calendar month by +|- 1.
     *
     * @param {Number} n The month number to shift by
     *
     * @return {void}
     */
    updateMonth(n) {
      this.internalDate = this.adjustedMonth(n, this.internalDate);
    },
    /**
     * Emits {@link eventName} with the values of the event name, year, month,
     * and day that the user selected.
     *
     * @param {String} eventName The event to emit
     * @param {Number} daySelected The day selected
     *
     * @return {void}
     */
    handleEvent(eventName, daySelected) {
      this.$emit(
        eventName,
        eventName,
        this.internalDate.getFullYear(),
        this.internalDate.getMonth(),
        daySelected
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../style/components/calendar";
</style>
