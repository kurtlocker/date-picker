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
@import url("//fonts.googleapis.com/css?lang=en&family=Roboto:500");
#app {
  font: 400 16px/24px Roboto, HelveticaNeue, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
