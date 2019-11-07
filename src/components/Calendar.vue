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
            :disabled="isPast(day)"
            :data-day="day"
            :data-month="date.getMonth()"
            :data-year="date.getFullYear()"
            @click="handleButtonSelect(date, day)"
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
export default {
  name: "Calendar",
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
      selectedEarlierDate: null,
      selectedLaterDate: null
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
        this.internalDate.getFullYear(),
        this.internalDate.getMonth()
      );
    },
    /**
     * The number of days to offset before day 1 of the month starts.
     * Corresponds with blank cells in the calendar month.
     * @returns {Number}
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
     * @returns {String}
     */
    month() {
      return this.internalDate.toLocaleString("default", { month: "long" });
    },
    /**
     * Determines if we should display the year.
     * @returns {Boolean}
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
     * @param {Date} internalDateObj The internal date object associated
     * @param {Number} daySelected The day selected
     * @returns {Object}
     */
    getClasses(internalDateObj, daySelected) {
      return {
        "calendar__cell-day-button": true,
        "calendar__cell-day-button--selected": this.isSelectedDate(
          internalDateObj,
          daySelected
        )
      };
    },
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
      const { today, internalDate } = this;
      const calendarYear = internalDate.getFullYear();
      const calendarMonth = internalDate.getMonth();
      const todayYear = today.getFullYear();
      const todayMonth = today.getMonth();
      const todayDay = today.getDate();
      return (
        calendarYear < todayYear ||
        (calendarYear === todayYear && calendarMonth < todayMonth) ||
        (calendarYear === todayYear &&
          calendarMonth === todayMonth &&
          calendarDay < todayDay)
      );
    },
    /**
     * Updates the calendar month by +|- 1.
     * @param {Number} n The month number to shift by
     * @returns {void}
     */
    updateMonth(n) {
      this.internalDate = this.adjustedMonth(n);
    },
    /**
     * Returns a new date from adjusting {@link this.internalDate} by
     * {@link n} months.
     * @param {Number} n The number of months to shift
     * @returns {Date} The adjusted month date
     */
    adjustedMonth(n) {
      const clonedDate = new Date(+this.internalDate);
      clonedDate.setDate(1);
      return new Date(clonedDate.setMonth(this.internalDate.getMonth() + n));
    },
    /**
     * Emits the selected-date event.
     * @param {Date} internalDateObj The internal date object associated
     * @param {Number} daySelected The day selected
     */
    handleButtonSelect(internalDateObj, daySelected) {
      const selectedYear = internalDateObj.getFullYear();
      const selectedMonth = internalDateObj.getMonth();
      const selectedDate = new Date(selectedYear, selectedMonth, daySelected);
      if (
        !this.selectedEarlierDate ||
        this.isEarlierDate(selectedDate, this.selectedEarlierDate)
      ) {
        this.selectedEarlierDate = selectedDate;
      } else if (
        !this.selectedLaterDate ||
        this.isLaterDate(selectedDate, this.selectedLaterDate)
      ) {
        this.selectedLaterDate = selectedDate;
      }
      this.$emit("selected-date", selectedYear, selectedMonth, daySelected);
    },
    /**
     * Determines if {@link date} is earlier than {@link compareDate}.
     * @param {Date} date The date to compare against {@link compareDate}
     * @param {Date} compareDate The date to compare against {@link date}
     * @returns {Boolean}
     */
    isEarlierDate(date, compareDate) {
      return (
        date.getFullYear() < compareDate.getFullYear() ||
        date.getMonth() < compareDate.getMonth() ||
        (date.getMonth() === compareDate.getMonth() &&
          date.getDate() < compareDate.getDate())
      );
    },
    /**
     * Determines if {@link date} is later than {@link compareDate}.
     * @param {Date} date The date to compare against {@link compareDate}
     * @param {Date} compareDate The date to compare against {@link date}
     * @returns {Boolean}
     */
    isLaterDate(date, compareDate) {
      return (
        date.getFullYear() > compareDate.getFullYear() ||
        date.getMonth() > compareDate.getMonth() ||
        (date.getMonth() === compareDate.getMonth() &&
          date.getDate() > compareDate.getDate())
      );
    },
    /**
     * Determines if {@link date} is the same date as {@link compareDate}.
     * @param {Date} date The date to compare against {@link compareDate}
     * @param {Date} compareDate The date to compare against {@link date}
     * @returns {Boolean}
     */
    isSameDate(date, compareDate) {
      return (
        date.getFullYear() === compareDate.getFullYear() &&
        date.getMonth() === compareDate.getMonth() &&
        date.getDate() === compareDate.getDate()
      );
    },
    /**
     * If the selectedDate matches the {@link selectedEarlierDate} or
     * the {@link selectedLaterDate}, we set an appropriate class for this
     * date.
     * @param {Date} internalDateObj The internal date object associated
     * @param {Number} daySelected The day selected
     */
    isSelectedDate(internalDateObj, daySelected) {
      const selectedDate = new Date(
        internalDateObj.getFullYear(),
        internalDateObj.getMonth(),
        daySelected
      );
      return (
        (this.selectedEarlierDate &&
          this.isSameDate(selectedDate, this.selectedEarlierDate)) ||
        (this.selectedLaterDate &&
          this.isSameDate(selectedDate, this.selectedLaterDate))
      );
    }
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
