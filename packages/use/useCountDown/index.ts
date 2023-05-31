import { cancelRaf, raf } from "@wencha/utils/animate";
import { computed, onActivated, onBeforeUnmount, onDeactivated, ref } from "vue";

export type CurrentTime = {
  days: number;
  hours: number;
  total: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
};
export type UseCountDownOptions = {
  time: number;
  milliseconds?: boolean;
  onChange?: (current: CurrentTime) => void;
  onFinish?: () => void;
};

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function parseTime(time: number): CurrentTime {
  let days = Math.floor(time / DAY);
  let hours = Math.floor((time % DAY) / HOUR);
  let minutes = Math.floor((time % HOUR) / MINUTE);
  let seconds = Math.floor((time % MINUTE) / SECOND);
  let milliseconds = Math.floor(time % SECOND);
  return {
    total: time,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
  };
}
function isSameSecond(time1: number, time2: number): boolean {
  return Math.floor(time1 / SECOND) === Math.floor(time2 / SECOND);
}

export function useCountDown(options: UseCountDownOptions) {
  let rafId: number;
  let endTime: number;
  let counting: boolean;
  let deactivated: boolean;

  const remain = ref(options.time);
  const current = computed(() => parseTime(remain.value));

  const getCurrentReamin = () => Math.max(endTime - Date.now(),0)
  const setReamin = (time:number) => { 
      remain.value = time
      options.onChange?.(current.value)
      if(time === 0) {
        pause()
        options.onFinish?.()
      }
  }
  const start = () => {
    if(!counting) {
        endTime = Date.now() + remain.value
        counting = true
        tick()    
    }
  }
  const pause = () => {
    counting = false
    cancelRaf(rafId)
  }
  const reset = (totalTime: number = options.time) => {
      pause()
      remain.value = totalTime
  }
  const microTick = () => {
    rafId = raf(() => {
        if(counting) { 
            setReamin(getCurrentReamin())
            if(remain.value > 0) { 
                microTick()
            }
        }
    })
  }
  const macroTick = () => {
    rafId = raf(() => {
        if(counting) { 
            let remainRemain = getCurrentReamin()
            if(!isSameSecond(remainRemain,remain.value) || remainRemain === 0) { 
                setReamin(remainRemain)
            }
            if(remain.value > 0) {
                macroTick()
            }
        }
    })
  }
  const tick = () => {
     if(options.milliseconds) {
        microTick()
     }else {
        macroTick()
     }
  }

  onBeforeUnmount(pause)

  onActivated(() => {
     if(deactivated) {
       counting = true
       deactivated = false
       tick()
     }
  })

  onDeactivated(() => {
     if(counting) {
        pause()
        deactivated = true
     }
  })

  return {
    current,
    start,
    pause,
    reset
  };
}
