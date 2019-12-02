<template>
  <div class="gflights-date-buttons">
    <div :class="buttonGroupClasses(0)">
      <icon-base
        class="gflights-date-buttons__icon"
        iconColor="#1a73e8"
        width="24"
        height="24"
        viewBox="0 0 426.667 426.667"
        icon-name="calendar"
      >
        <icon-calendar />
      </icon-base>
      <button
        class="gflights-date-buttons__button gflights-date-buttons__button--departure"
        @click="$emit('next', 0)"
      >{{ departureDateText }}</button>
      <button
        v-if="departureDate"
        class="gflights-date-buttons__button gflights-date-buttons__button--left-arrow"
        @click="$emit('day-update', 0, -1)"
      >
        <icon-base height="10px" width="10px" icon-name="left-chevron">
          <icon-left-chevron />
        </icon-base>
      </button>
      <button
        v-if="departureDate"
        class="gflights-date-buttons__button gflights-date-buttons__button--right-arrow"
        @click="$emit('day-update', 0, 1)"
      >
        <icon-base height="10px" width="10px" icon-name="right-chevron">
          <icon-right-chevron />
        </icon-base>
      </button>
    </div>
    <div class="gflights-date-buttons__divider" />
    <div :class="buttonGroupClasses(1)">
      <button
        class="gflights-date-buttons__button gflights-date-buttons__button--return"
        @click="$emit('next', 1)"
      >{{ returnDateText }}</button>
      <button
        v-if="returnDate"
        :disabled="isSameDate(departureDate, returnDate)"
        class="gflights-date-buttons__button gflights-date-buttons__button--left-arrow"
        @click="$emit('day-update', 1, -1)"
      >
        <icon-base height="10px" width="10px" icon-name="left-chevron">
          <icon-left-chevron />
        </icon-base>
      </button>
      <button
        v-if="returnDate"
        class="gflights-date-buttons__button gflights-date-buttons__button--right-arrow"
        @click="$emit('day-update', 1, 1)"
      >
        <icon-base height="10px" width="10px" icon-name="right-chevron">
          <icon-right-chevron />
        </icon-base>
      </button>
    </div>
  </div>
</template>

<script>
import IconBase from "./IconBase.vue";
import IconLeftChevron from "./icons/IconLeftChevron.vue";
import IconRightChevron from "./icons/IconRightChevron.vue";
import IconCalendar from "./icons/IconCalendar.vue";
import dateMixin from "../mixins/date";

export default {
  name: "GoogleFlightsDateButtons",
  mixins: [dateMixin],
  components: {
    IconBase,
    IconLeftChevron,
    IconRightChevron,
    IconCalendar
  },
  props: {
    departureDate: {
      type: Date,
      required: false,
      default: null
    },
    returnDate: {
      type: Date,
      required: false,
      default: null
    },
    next: {
      type: Number,
      required: false,
      default: null
    }
  },
  computed: {
    departureDateText() {
      return this.departureDate
        ? `${this.departureDate.toLocaleString("default", {
            weekday: "short"
          })}, ${this.departureDate.toLocaleString("default", {
            month: "short"
          })} ${this.departureDate.getDate()}`
        : "Departure date";
    },
    returnDateText() {
      return this.returnDate
        ? `${this.returnDate.toLocaleString("default", {
            weekday: "short"
          })}, ${this.returnDate.toLocaleString("default", {
            month: "short"
          })} ${this.returnDate.getDate()}`
        : "Return date";
    }
  },
  methods: {
    buttonGroupClasses(next) {
      return {
        "gflights-date-buttons__button-group": true,
        "gflights-date-buttons__button-group--active": this.next === next
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../style/components/google-flights-date-buttons";
</style>
