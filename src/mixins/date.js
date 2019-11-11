/**
 * Mixin for handling logic involving Dates.
 */
export default {
  methods: {
    /**
     * Determines if {@link date} is earlier than {@link compareDate}.
     * @param {Date} date The date to compare against {@link compareDate}
     * @param {Date} compareDate The date to compare against {@link date}
     * @return {Boolean}
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
     * @return {Boolean}
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
     * @return {Boolean}
     */
    isSameDate(date, compareDate) {
      return (
        date.getFullYear() === compareDate.getFullYear() &&
        date.getMonth() === compareDate.getMonth() &&
        date.getDate() === compareDate.getDate()
      );
    },
    /**
     * Returns a new date from adjusting {@link date} by
     * {@link n} months.
     * @param {Number} n The number of months to shift
     * @param {Date} date The date to adjust.
     * @return {Date} The adjusted month date
     */
    adjustedMonth(n, date) {
      const clonedDate = new Date(+date);
      clonedDate.setDate(1);
      return new Date(clonedDate.setMonth(this.internalDate.getMonth() + n));
    },
    /**
     * Determines if a given calendarDay is in the past relative to
     * {@link compareDate}.
     * @param {Number} calendarDay
     * @param {Date} calendarDate
     * @param {Date} compareDate
     * @return {Boolean}
     */
    isPast(calendarDay, calendarDate, compareDate) {
      const calendarYear = calendarDate.getFullYear();
      const calendarMonth = calendarDate.getMonth();
      const compareDateYear = compareDate.getFullYear();
      const compareDateMonth = compareDate.getMonth();
      const compareDateDay = compareDate.getDate();
      return (
        calendarYear < compareDateYear ||
        (calendarYear === compareDateYear &&
          calendarMonth < compareDateMonth) ||
        (calendarYear === compareDateYear &&
          calendarMonth === compareDateMonth &&
          calendarDay < compareDateDay)
      );
    },
    /**
     * Get the number of days of the given {@link month} of {@link year}.
     * @param {Number} year
     * @param {Number} month
     * @return {Number} Number of days in month
     */
    getDaysInMonth(year, month) {
      return new Date(year, month + 1, 0).getDate();
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
     * Returns the localized week day name.
     * @param {Date} date The date object
     * @param {String} form The form we want the weekday name in
     *  narrow = 'M'
     *  long = 'Monday'
     * @return {String} The localized week day name
     */
    getWeekDay(date, form) {
      return date.toLocaleDateString(undefined, { weekday: form });
    },
  }
};
