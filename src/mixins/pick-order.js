export default {
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
    }
  }
};
