<template>
  <div class="flights-date-picker">
    <date-picker />
  </div>
</template>

<script>
import DatePicker from "./DatePicker.vue";

export default {
  name: "FlightsDatePicker",
  components: {
    DatePicker
  }
};
</script>

<style scoped>
.flights-date-picker >>> .calendar__cell-day-button {
  position: relative;
  outline: none;
}
.flights-date-picker >>> .calendar__cell-day-button:hover {
  color: inherit;
}
.flights-date-picker >>> .calendar__cell-day-button--selected:after,
.flights-date-picker >>> .calendar__cell-day-button:hover:after {
  content: "";
  border: 2px solid #4285f4;
  border-radius: 100%;
  box-sizing: border-box;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  height: 44px;
  margin: auto;
  position: absolute;
  transform: scale(1);
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
  width: 44px;
  z-index: -1;
}
.flights-date-picker >>> .calendar__cell-day-button--selected {
  color: white;
}
.flights-date-picker >>> .calendar__cell-day-button--selected:after {
  background-color: #4285f4;
}
.flights-date-picker >>> .calendar__cell-day-button--selected:hover:after {
  background-color: inherit;
}
</style>
