import { createNameSpace } from "@wencha/utils/create";
import { computed, defineComponent, nextTick, onMounted, reactive, ref, watch } from "vue";

const bem = createNameSpace('virtual-list')

export default defineComponent({
   name : 'wcVirtualList',
   props : {
      // 每一项的高度
      size : {
        type : Number,
        required : true
      },
      // 展示几项
      remain : {
        type : Number,
        required : true
      },
      // 数据
      item : {
        type : Array,
        default : []
      }
   },
   setup(props,{ slots }) {
      const wrapperRef = ref<HTMLElement>()
      const barRef = ref<HTMLElement>()
      // 每次可见区展示的数据的起始和结束索引
      const state = reactive({
         start : 0,
         end : props.remain
      })
      // 一般要在可视区前面多渲染一屏，后面也多渲染一屏，保证用户在快速滚动时不会白屏
      const prevAddNum = computed(() => Math.min(props.remain,state.start)) // 可视区前面补充多少个
      const nextAddNum = computed(() => Math.min(props.item.length - state.end,props.remain)) // 可视区后面补充多少个
      // 每次展示的数据
      const visibleData = computed(() => {
          return props.item.slice(state.start - prevAddNum.value,state.end + nextAddNum.value)
      })
      
      // 数据变了要重新计算高度
      watch(() => props.item,() => {
        initWrapper()
      })
      onMounted(() => {
         nextTick(() => {
            wrapperRef.value!.style.height = props.size * props.remain + 'px'
            barRef.value!.style.height = props.item.length * props.size + 'px'
         })
      })
      function initWrapper() {
        wrapperRef.value!.style.height = props.size * props.remain + 'px'
        barRef.value!.style.height = props.item.length * props.size + 'px'
      }
      const offset = ref(0)
      function scrollHandler() {
        let scrollTop = wrapperRef.value!.scrollTop
        state.start = Math.floor(scrollTop/props.size) // 划过去了多少个
        state.end = state.start + props.remain
        // 数据变了的同时让list视图往下移动。（list是定位在左上角的）
        offset.value = props.size * (state.start - prevAddNum.value)  // 偏移量 (注意这里要把前面补充的数据的位置去掉。)
      }
      return () => {
         return (
            <div class={bem()} ref={wrapperRef} onScroll={ scrollHandler }>
              <div class={bem('scroll-bar')} ref={barRef}></div>
              <div class={bem('list')} style={ {transform : `translate3d(0, ${offset.value}px, 0)`}}>
                {
                  visibleData.value.map(node => slots.default!({ node }))
                }
              </div>
            </div>

         ) 
      }
   }
})