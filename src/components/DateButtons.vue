<template>
  <div class="date-buttons">
    <div>
      Departure Date
    </div>
    <div>
      Return Date
    </div>
  </div>
</template>

<script>
export default {
  name: 'DateButtons',
}
</script>

<style lang="scss" scoped>
.date-buttons {
  display: flex;
  justify-content: space-around;
  & > div {
    flex-basis: 100%;
  }
}
</style>
