<template>
  <div class="date-picker">
    <div class="date-picker__calendars">
      <calendar :date="internalDate" />
      <calendar :date="nextMonth" />
    </div>
    <div class="date-picker__buttons">
      <button class="date-picker__previous-month" @click="updateMonth(-1)"></button>
      <button class="date-picker__next-month" @click="updateMonth(1)"></button>
    </div>
  </div>
</template>

<script>
import Calendar from "./Calendar.vue";

export default {
  name: "DatePicker",
  components: {
    Calendar
  },
  data() {
    return {
      /**
       * The date object used for this instance.
       */
      internalDate: this.date
    };
  },
  props: {
    /**
     * Intialize the date picker with a date.
     */
    date: {
      type: Date,
      required: false,
      default: () => new Date()
    }
  },
  computed: {
    /**
     * Returns a new date whose month is +1 of {@link this.internalDate}.
     * @returns {Date}
     */
    nextMonth() {
      return this.adjustedMonth(1);
    }
  },
  methods: {
    /**
     * Updates the {@link this.internalDate} to a new date whose month has
     * been adjusted by {@link n}.
     * @param {Number} n The number of months to shift
     * @returns {void}
     */
    updateMonth(n) {
      this.internalDate = this.adjustedMonth(n);
    },
    /**
     * @param {Number} n The number of months to shift
     * @returns {Date} The adjusted month date
     */
    adjustedMonth(n) {
      const clonedDate = new Date(+this.internalDate);
      clonedDate.setDate(1);
      return new Date(clonedDate.setMonth(this.internalDate.getMonth() + n));
    }
  }
};
</script>

<style scoped>
.date-picker {
  position: relative;
}
.date-picker__calendars {
  display: grid;
  grid-gap: 2em;
}
.date-picker__buttons {
  margin-top: 1em;
}
.date-picker__buttons button {
  border: none;
  margin: 0;
  padding: 0;
  overflow: visible;
  color: inherit;
  font: inherit;
  line-height: normal;
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;
  appearance: none;
  border-radius: 0;
  padding: .8em;
  cursor: pointer;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
button.date-picker__previous-month {
  /* Left chevron */
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAB00lEQVRoge3ayWsTYRiA8R8iwTZQ49JNbet2cjv5F/sXqCdFrd7c2roVo61K1IMbeNZTPUwGwXFM8ga/mQx54L0F8jyZ4c2EL0yZ0jhauIItrFXsEqaFq9jrzzusVmoUoIVrfkfk8xYrFXqNRFlEPj2crMhtaAZF5LOL4xU5DqSF6wZH5LOjhjEHcMPwEfl0ZR9ALZjBTaNH7OEb2umVi8zglljEd1xOr1xkVkMibotFfMWl9MpFZnFHPOJieuUibayLRXxRo4i74hEX0isXGSfiM86nVy7Sxj0THnEQ98UjzqVXLjJOxCc1inggFvERZ9MrF+ngoVjEBw2JOJNe+e9EV2wPp/633L4RXvsz+B4/+lMb5sQ31WscS69czpz4xnqF5fTK5YyzfmsZE91gXSylVy6ng0diMS+xmF65nA4ei8U8w9H0yuWME/MUR9Irl3MIG2IxT9QwZlNDYubxXCxmC4fTK5czjxcaErMgHrMpu01rwwK2xWI21CxmSfZNHolZr8D3nyzLnrFGDelWITuIRdljybAR73G6EtMhGPY260nwi3JcTuCNCY/IWZEdRf8ZsWuCjqdzVmV/EsgjdmRXayJZkwVsq+EJ7qjs78+UxvELSX0b6Obam+UAAAAASUVORK5CYII=");
  margin-right: .5em;
}
button.date-picker__next-month {
  /* Right chevron */
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAABuUlEQVRoge3YW08TURSG4UfvaBOLRioqMXiKpz9PvFbRG1E8JGAUxEQBo/APjImJXpQGZDLMdFX27Kl9k3XVTuZ7s5q1dxdTpmTLDB7iM+42nCVMB4/w+6C+406jiQJ08MShxLC+4XaDuUaig8eKEsPaw73G0tWkrBPH6ytuNZSxkq56EkdlbjaStIIl9SWGtYPrpx3s7Ijf/xl4xzUsYzHw7Kkx4+9xm11nRqFqYv03Mtsy+5nVHcOtkVkWk/mEq+kjl9MVl9mSocxTcZkryROfQBfPxGQ+ykzmHFbEZDZxOX3kcnp4YYJkXorJbGA+feRyJkpmFqtiMmu4mD5yORfwVkzmDc7Uecmo1/gIv/Aj+GxfmoyV9PBcrBv7eJA+cpGe+Jmyh/vpIxcZ5yzJZgMzKz52s9m8jCOxKyOJ6JmxK5O10Xm8EpPYMSESN9JHLjJncJWISGzLZKMyh3Utl+iLS3yRyQalj3diEltYSB+5yLgS2WxMotfxTZktFyL3pw2Z/Q9ncGa81uJOHKXu2M2yE8epkmmFxJA+3itKrB981iou4YNDiTWDbrWSeYOxvCKz9c2UKf+AP45PDnfqQ+j+AAAAAElFTkSuQmCC");
}
@media screen and (min-width: 787px) {
  .date-picker__calendars {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
