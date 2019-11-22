<template>
  <div class="date-picker">
    <div class="date-picker__calendars">
      <calendar
        v-for="n in months"
        @date-selected="handleEvent"
        @mouse-enter-date="handleEvent"
        @mouse-leave-date="handleEvent"
        :date-classes="dateClasses"
        :date="adjustedMonth(n - 1, internalDate)"
        :key="`calendar-month-${n - 1}`"
      />
    </div>
    <div class="date-picker__buttons">
      <button class="date-picker__previous-month" @click="updateMonth(-1)">
        <icon-base icon-name="left-chevron">
          <icon-left-chevron />
        </icon-base>
      </button>
      <button class="date-picker__next-month" @click="updateMonth(1)">
        <icon-base icon-name="right-chevron">
          <icon-right-chevron />
        </icon-base>
      </button>
    </div>
  </div>
</template>

<script>
import Calendar from "./Calendar.vue";
import dateMixin from "../mixins/date";
import IconBase from "./IconBase.vue";
import IconLeftChevron from "./icons/IconLeftChevron.vue";
import IconRightChevron from "./icons/IconRightChevron.vue";

export default {
  name: "DatePicker",
  components: {
    Calendar,
    IconBase,
    IconLeftChevron,
    IconRightChevron,
  },
  mixins: [dateMixin],
  data() {
    return {
      /**
       * The date object used for this instance.
       *
       * @type {Date}
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
      default: () => new Date()
    },
    /**
     * The number of months to show. Begins with {@link this.internalDate}.
     */
    months: {
      type: Number,
      required: false,
      default: 2
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
     * Returns a new date whose month is +1 of {@link this.internalDate}.
     *
     * @return {Date}
     */
    nextMonth() {
      return this.adjustedMonth(1, this.internalDate);
    }
  },
  methods: {
    /**
     * Updates the {@link this.internalDate} to a new date whose month has
     * been adjusted by {@link n}.
     *
     * @param {Number} n The number of months to shift
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
     * @param {String} eventName The event emitted from the Calendar component
     * @param {Number} year The year emitted from the Calendar component
     * @param {Number} month The month emitted from the Calendar component
     * @param {Number} day The day emitted from the Calendar component
     *
     * @return {void}
     */
    handleEvent(eventName, year, month, day) {
      this.$emit(eventName, eventName, year, month, day);
    }
  }
};
</script>

<style lang="scss" scoped>
$color_1: inherit;
$background_color_1: inherit;
$button-color: white;

.date-picker {
  &__calendars {
    display: grid;
    grid-gap: 2em;

    @media screen and (min-width: 787px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  &__buttons {
    button {
      border: none;
      padding: 0;
      overflow: visible;
      color: $color_1;
      font: inherit;
      line-height: normal;
      -webkit-font-smoothing: inherit;
      -moz-osx-font-smoothing: inherit;
      appearance: none;
      padding: 0.8em;
      cursor: pointer;
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
    }
  }

  &__previous-month,
  &__next-month {
    height: 40px;
    width: 40px;
    background-color: $button-color;
    border-radius: 100%;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.12), 0 4px 4px rgba(0, 0, 0, 0.24);
  }

  &__previous-month svg {
    margin-left: -1px;
  }

  &__next-month svg {
    margin-left: 1px;
  }
}
</style>
