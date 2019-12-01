<template>
  <div class="date-buttons">
    <div :class="buttonGroupClasses(0)">
      <button class="date-buttons__departure" @click="$emit('next', 0)">{{ departureDateText }}</button>
      <button class="date-buttons__arrow">
        <icon-base height="10px" width="10px" icon-name="left-chevron">
          <icon-left-chevron />
        </icon-base>
      </button>
      <button class="date-buttons__arrow">
        <icon-base height="10px" width="10px" icon-name="right-chevron">
          <icon-right-chevron />
        </icon-base>
      </button>
    </div>
    <div :class="buttonGroupClasses(1)">
      <button class="date-buttons__return" @click="$emit('next', 1)">{{ returnDateText }}</button>
      <button class="date-buttons__arrow">
        <icon-base height="10px" width="10px" icon-name="left-chevron">
          <icon-left-chevron />
        </icon-base>
      </button>
      <button class="date-buttons__arrow">
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

export default {
  name: "DateButtons",
  components: {
    IconBase,
    IconLeftChevron,
    IconRightChevron
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
        "date-buttons__button-group": true,
        "date-buttons__button-group--active": this.next === next
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../style/components/date-buttons";
</style>
