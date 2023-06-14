<template>
  <div class="nav-bar">
    <button class="nav-bar__button text--body--medium" type="button" @click.prevent="changeSlide()">Prev</button>
    <button class="nav-bar__button text--body--medium" type="button" @click.prevent="changeSlide(true)">Next</button>
  </div>
  <div class="top-bar">
    <p class="text--body">Style</p>
    <select class="top-bar__transitions" name="LeaveType" @change="transitionTypeEmit($event)">
      <option value="-1" selected>None</option>
      <option value="0">Fade</option>
      <option value="1">Circle center</option>
      <option value="2">Circle top right</option>
      <option value="3">Circle top left</option>
      <option value="4">Circle center left</option>
      <option value="5">Circle center right</option>
      <option value="6">Circle bottom left</option>
      <option value="7">Circle bottom right</option>
      <option value="8">Line left to right</option>
      <option value="9">Line right to left</option>
      <option value="10">Line top to bottom</option>
      <option value="11">Line bottom to top</option>
      <option value="12">Lines horizontal left to right</option>
      <option value="13">Lines horizontal right to left</option>
      <option value="14">Lines horizontal top to bottom</option>
      <option value="15">Lines horizontal bottom to top</option>
      <option value="16">Multiples Lines horizontal left to right</option>
      <option value="17">Multiples Lines horizontal right to left</option>
      <option value="18">Multiples Lines horizontal top to bottom</option>
      <option value="19">Multiples Lines horizontal bottom to top</option>
      <option value="20">Multiples Lines vertical center to out</option>
      <option value="21">Multiples Lines horizontal center to out</option>
      <option value="22">Cross center to out</option>
      <option value="23">Cross out to center</option>
      <option value="24">Textures R channel</option>
      <option value="25">Sand</option>
      <option value="26">Transition texture</option>
      <option value="27">Transition texture center to out</option>
      <option value="28">Pixels</option>
      <option value="29">Big Pixels</option>
    </select>
    <label class="top-bar__loop">
      <input type="checkbox" checked @change="loopEmit" name="loop">
      <span class="text--body">Loop</span>
    </label>
  </div>
</template>

<script setup lang="ts">

const emit = defineEmits<{

  (e: "change-slide", value: number): void
  (e: "transition-type", value: string): void
  (e: "loop", value: boolean): void

}>();

function transitionTypeEmit(e: Event) {

  //@ts-ignore
  emit("transition-type", e.target.value);

}

function loopEmit(e: Event) {

  //@ts-ignore
  emit("loop", e.target.checked);

}

function changeSlide( isNext?: boolean ): void {

  const random = Math.random() * 100 + 1;

  emit("change-slide", isNext ? random : - random);

}

</script>
