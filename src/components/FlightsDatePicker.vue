<template>
  <div class="flights-date-picker">
    <date-picker />
  </div>
</template>

<script>
import DatePicker from "./DatePicker.vue";

export default {
  name: 'FlightsDatePicker',
  components: {
    DatePicker,
  }
}
</script>
