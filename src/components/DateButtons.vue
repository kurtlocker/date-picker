<template>
  <div class="date-buttons">
    <div class="date-buttons__button-group">
      <button class="date-buttons__departure">Departure date</button>
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
    <div class="date-buttons__button-group">
      <button class="date-buttons__return">Return Date</button>
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
  }
};
</script>

<style lang="scss" scoped>
@import "../style/components/date-buttons";
</style>
