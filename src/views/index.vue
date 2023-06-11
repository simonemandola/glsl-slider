<template>
  <UiComponent @change-slide="changeTo = $event" @transition-type="transitionType = $event" @loop="loop = $event"/>
  <SliderComponent :change-to="changeTo" :transition-type="transitionType" :loop="loop"/>
</template>
<script setup lang="ts">
import SliderComponent from "../components/SliderComponent.vue";
import UiComponent from "../components/uiComponent.vue";
import {ref} from "vue";

const changeTo = ref(0);
const transitionType = ref("-1");
const loop = ref(true);

</script>