<template>
  <div id="app">
    <google-flights-date-picker /> 
  </div>
</template>

<script>
import GoogleFlightsDatePicker from './components/GoogleFlightsDatePicker.vue'

export default {
  name: 'app',
  components: {
    GoogleFlightsDatePicker,
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
