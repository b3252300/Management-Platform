<template>
    <svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect class="rect" x="22.5" y="0.437012" width="4" height="12" rx="2" fill="#D9D9D9" />
        <rect class="rect" x="22.5" y="36.437" width="4" height="12" rx="2" fill="#D9D9D9" />
        <rect class="rect" x="0.5" y="26.437" width="4" height="12" rx="2" transform="rotate(-90 0.5 26.437)" fill="#D9D9D9" />
        <rect class="rect" x="36.5" y="26.437" width="4" height="12" rx="2" transform="rotate(-90 36.5 26.437)" fill="#D9D9D9" />
        <rect class="rect" x="6.11523" y="8.88062" width="4" height="12" rx="2" transform="rotate(-45 6.11523 8.88062)"
            fill="#D9D9D9" />
        <rect class="rect" x="31.5713" y="34.3365" width="4" height="12" rx="2" transform="rotate(-45 31.5713 34.3365)"
            fill="#D9D9D9" />
        <rect class="rect" x="8.94336" y="42.8218" width="4" height="12" rx="2" transform="rotate(-135 8.94336 42.8218)"
            fill="#D9D9D9" />
        <rect class="rect" x="34.3994" y="17.3658" width="4" height="12" rx="2" transform="rotate(-135 34.3994 17.3658)"
            fill="#D9D9D9" />
    </svg>
    <article>




</article>
</template>
<style lang="scss" scoped>


.rect {

  background-color: #1d1d1d;
  fill: #2D2D2D;
  border-radius: 20px;
  opacity: 0;
  animation: animate-in;
  animation-duration:900ms;
  animation-timing-function: ease-in-out;
  animation-fill-mode: alternate;
  animation-iteration-count: infinite;
}

@for $j from 0 through 8 {
  .rect:nth-of-type(#{$j}) {
    // --degrees: #{$j} * 360deg / 16;
    // transform: rotate(calc(var(--degrees))) translateX(var(--offset));
    animation-delay: calc(#{$j} * 100ms);
  }
}
@keyframes animate-in {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}



</style>