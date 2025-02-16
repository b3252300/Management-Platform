<template>
  <div ref="wrap" class="wrap">
    <div
      ref="content"
      class="content"
      :class="animationClass"
      :style="contentStyle"
      @animationend="onAnimationEnd"
      @webkitAnimationEnd="onAnimationEnd"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      default: '',
    },
    delay: {
      type: Number,
      default: 0.5,
    },
    speed: {
      type: Number,
      default: 100,
    },
  },
  mounted() {
    this.calculateWidthAndDuration()
  },
  data() {
    return {
      wrapWidth: 0, //父盒子宽度
      firstRound: true, //判断是否
      duration: 0, //css3一次动画需要的时间
      offsetWidth: 0, //子盒子的宽度
      animationClass: '', //添加animate动画
    }
  },
  computed: {
    contentStyle() {
      return {
        //第一次从头开始,第二次动画的时候需要从最右边出来所以宽度需要多出父盒子的宽度
        paddingLeft: (this.firstRound ? 0 : this.wrapWidth) + 'px',
        //只有第一次的时候需要延迟
        animationDelay: (this.firstRound ? this.delay : 0) + 's',
        animationDuration: this.duration + 's',
      }
    },
  },
  methods: {
    // 开始计算宽度,并计算时间,添加动画
    calculateWidthAndDuration() {
      const { wrap, content } = this.$refs
      const wrapWidth = wrap.getBoundingClientRect().width
      const offsetWidth = content.getBoundingClientRect().width
      this.wrapWidth = wrapWidth
      this.offsetWidth = offsetWidth
      this.duration = offsetWidth / this.speed
      this.animationClass = 'animate'
    },
    //第一次动画执行完成后开始使用添加animate-infinite动画
    onAnimationEnd() {
      this.firstRound = false
      //这是时候样式多出了padding-left:this.wrapWidth;所以要想速度一样需要重新计算时间
      this.duration = (this.offsetWidth + this.wrapWidth) / this.speed
      this.animationClass = 'animate-infinite'
    },
  },
}
</script>
<style scoped>
.wrap {
  width: 100%;
  height: 48px;
  line-height: 48px;
  color: #16a342;
  font-size: 24px;
  overflow: hidden;
  position: relative;
  background: #fef9e8;
  position: relative;
  border-radius: 10px;
}

.wrap .content {
  position: absolute;
  white-space: nowrap;
}

.animate {
  animation: paomadeng linear;
}

.animate-infinite {
  animation: paomadeng-infinite linear infinite;
}

@keyframes paomadeng {
  to {
    transform: translate3d(-100%, 0, 0);
  }
}

@keyframes paomadeng-infinite {
  to {
    transform: translate3d(-100%, 0, 0);
  }
}
</style>
