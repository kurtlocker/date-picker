<template>
  <div id="app">
    <trip-date-picker /> 
  </div>
</template>

<script>
import TripDatePicker from './components/TripDatePicker.vue'

export default {
  name: 'app',
  components: {
    TripDatePicker,
  }
}
</script>

<style>
@import url("//fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap");
#app {
  font-family: "Roboto", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
