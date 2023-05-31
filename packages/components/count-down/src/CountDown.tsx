import { useCountDown } from "@wencha/use/useCountDown";
import { createNameSpace } from "@wencha/utils/create";
import { computed, defineComponent, watch } from "vue";
import { parseFormat } from "./utils";

const bem = createNameSpace('count-down')

export default defineComponent({
    props: {
        time : {
            type : [Number,String],
            default:0
        },
        format: {
            type : String,
            default : 'DD 天 HH时mm分ss秒SSS毫秒'
        },
        milliseconds: {
            type : Boolean,
            default:false
        },
        autoStart: {
            type : Boolean,
            default : true
        }
    },
    name:'wcCountDown',
    setup(props,{ slots,expose,emit }) {

        let {
            current,
            start,
            pause,
            reset
        } = useCountDown({
            time : +props.time,
            milliseconds : props.milliseconds,
            onChange:(current) => emit('change',current),
            onFinish:() => emit('finish')
        })
        
        const resetTime = () => {
            reset(+props.time)
            if(props.autoStart) {
                start()
            }
        }

        watch(() => props.time,resetTime,{ immediate:true })

        expose({
            start,
            pause,
            reset : resetTime
        })
        const timeText = computed(() => parseFormat(props.format, current.value));
        return () => slots.default ? slots.default(current.value) : <div>{ timeText.value }</div>
    }
})