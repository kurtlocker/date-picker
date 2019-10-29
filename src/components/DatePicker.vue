<template>
  <div class="date-picker">
    <calendar class="date-picker__calendar" />
    <calendar class="date-picker__calendar" />
  </div>
</template>

<script>
import Calendar from "./Calendar.vue";

export default {
  name: "DatePicker",
  components: {
    Calendar
  }
};
</script>

<style scoped>
.date-picker {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 2em;
}
@media screen and (min-width: 787px) {
  .date-picker {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
