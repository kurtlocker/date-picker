import dateMixin from './date';
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
            this.gflightsPickOrder(year, month, day);
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
        const mouseOverDate = new Date(year, month, day);
        if (this.isLaterDate(mouseOverDate, this.departureDate)) {
          this.tentativeReturnDate = mouseOverDate;
        }
      }
    }
  }
};
