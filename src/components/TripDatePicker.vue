<template>
  <div class="trip-date-picker">
    <date-picker />
  </div>
</template>

<script>
import DatePicker from "./DatePicker.vue";

/**
 * Google Flights - observed behavior of date selection
 * (D = departure date, R = return date, Next = Which variable gets set next)
 * 
 * Reset click:
 *  D = null
 *  R = null
 *  Next = D
 * 
 * On click:
 *  if Next = D
 *    D = Selected Date
 *    Next = R
 *  else if Next = R
 *    if Selected Date < D
 *      D = Selected Date
 *      Next = R
 *    else if Selected Date >= D
 *      R = Selected Date
 *      Next = empty
 *  else (Next is empty)
 *    if Selected Date <= R
 *      D = Selected Date
 *      Next = R
 *    else if Selected Date > R
 *      D = Selected Date
 *      R = null
 *      Next = R
 */
export default {
  name: "TripDatePicker",
  components: {
    DatePicker
  }
};
</script>

<style scoped>
.trip-date-picker >>> .calendar {
  font-weight: 500;
}
.trip-date-picker >>> .calendar__cell-day-button {
  position: relative;
  outline: none;
}
.trip-date-picker >>> .calendar__cell-day-button:hover {
  color: inherit;
}
.trip-date-picker >>> .calendar__cell-day-button--selected:after,
.trip-date-picker >>> .calendar__cell-day-button:hover:after {
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
.trip-date-picker >>> .calendar__cell-day-button--selected {
  color: white;
}
.trip-date-picker >>> .calendar__cell-day-button--selected:after {
  background-color: #4285f4;
}
.trip-date-picker >>> .calendar__cell-day-button--selected:hover:after {
  background-color: inherit;
}
</style>
