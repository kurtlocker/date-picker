<template>
  <div id="app">
    <date-picker /> 
  </div>
</template>

<script>
import DatePicker from './components/DatePicker.vue'

export default {
  name: 'app',
  components: {
    DatePicker
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
