import dateMixin from "./date";
/**
 * The logic behind determining the next date selected and all of the stateful
 * modifications to each calendar cell.
 *
 * @return  {Object}
 */
export default {
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
       * The date recorded when a user hovers over/mouse enters an arbitrary
       * calendar date when we have a departure date set but no return date set.
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
     * date or in range of the departure date and the tentative return date.
     * Each date within the range gets an 'in-range' class on the calendar day.
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
      let {
        departureDate: d,
        returnDate: r,
        tentativeReturnDate: trd,
        next
      } = this;

      if (
        (d && r) ||
        (d && !r && trd && next !== 0 && this.isLaterDate(trd, d))
      ) {
        // If we have no return date or we have both dates but they're the same
        // with the intention of setting the retun date to a later date,
        // we're mousing over a tentative return date, so set the temp
        // return date to the date being moused over.
        const isSamePickingLater = this.isSamePickingLater();
        if (!r || isSamePickingLater) {
          r = trd;
        }

        let days = this.getDaysBetween(d, r) + 1;
        let daysLength = days;
        let inRangeDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

        // "do" ensures we include the departure date in range
        do {
          range.push({
            date: new Date(
              inRangeDate.getFullYear(),
              inRangeDate.getMonth(),
              inRangeDate.getDate()
            ),
            classes: [
              "in-range",
              // Used to style in the case of "isSamePickingLater"
              isSamePickingLater && days === daysLength ? "picking-later" : ""
            ]
          });
          inRangeDate.setDate(inRangeDate.getDate() + 1);
          --days;
        } while (days > 0);

        // If we have no return date, or we have both dates but they're the same
        // with next date to pick being the return date, and a "mouse over" date,
        // add a class to the date we're mousing over, in order to remove
        // "in range" style.
        if ((!this.returnDate && trd) || isSamePickingLater) {
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
     * If the departure date and return date are the same and our "next" date
     * to choose is a return date, we're picking later
     *
     * @return  {Boolean}
     */
    isSamePickingLater() {
      let {
        departureDate: d,
        returnDate: r,
        tentativeReturnDate: trd,
        next
      } = this;
      return d && r && trd && next === 1 && this.isSameDate(r, d);
    },
    /**
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
    roundTrip(eventName, year, month, day) {
      const { departureDate: d, returnDate: r } = this;
      const selectedDate = new Date(year, month, day);
      switch (this.next) {
        case 0:
          this.departureDate = selectedDate;
          if (r && this.isLaterDate(selectedDate, r)) {
            this.returnDate = null;
          }
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
            this.roundTrip(year, month, day);
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
     * When we have a departure date and no return date, or the departure date and
     * return date are the same, we want to set the tentative return date to the
     *  date we're mousing over (if its a later date).
     *
     * @param {String} eventName The event emitted from the DatePicker component
     * @param {Number} year The year emitted from the DatePicker component
     * @param {Number} month The month emitted from the DatePicker component
     * @param {Number} day The day emitted from the DatePicker component
     *
     * @return {void}
     */
    handleMouseEnterDate(eventName, year, month, day) {
      if (
        (this.departureDate && !this.returnDate) ||
        this.isSameDate(this.departureDate, this.returnDate)
      ) {
        const mouseOverDate = new Date(year, month, day);
        if (this.isLaterDate(mouseOverDate, this.departureDate)) {
          this.tentativeReturnDate = mouseOverDate;
        }
      }
    },
    /**
     * Method for handling arrow clicks for each date button
     *
     * @param   {Number}  dateType   Departure or return; 0 or 1 respectively
     * @param   {Number}  dayAdjust  Adust by how many days?
     *
     * @return  {void}
     */
    handleDayUpdate(dateType, dayAdjust) {
      if (dateType === 0) {
        const adjustedDate = this.adjustDay(dayAdjust, this.departureDate);
        if (!this.isEarlierDate(adjustedDate, new Date())) {
          // Make sure the new adjusted date is not earlier than today.
          this.departureDate = adjustedDate;
        }
        if (
          this.returnDate &&
          this.isLaterDate(this.departureDate, this.returnDate)
        ) {
          // If we're later than the return date, reset the return date.
          this.returnDate = null;
        }
        this.next = 0;
      } else {
        this.returnDate = this.adjustDay(dayAdjust, this.returnDate);
        this.next = 1;
      }
    },
    /**
     * Handler for setting the "next" date.
     *
     * @param   {Number}  next  Departure or return; 0 or 1 respectively
     *
     * @return  {void}
     */
    handleNext(next) {
      if (next === 1 && !this.departureDate) return;
      this.next = next;
    }
  }
};
