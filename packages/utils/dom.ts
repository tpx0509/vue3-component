import { Ref, unref } from "vue";

export function isHidden(
  elementRef: HTMLElement | Ref<HTMLElement | undefined>
) {
  const el = unref(elementRef)
  if(!el) {
     return false
  }
  
  const style = window.getComputedStyle(el)
  const hidden = style.display === 'none'

  // offsetParent returns null in the following situations:
  // 1. The element or its parent element has the display property set to none.
  // 2. The element has the position property set to fixed
  // 父元素是否隐藏
  // offsetParent返回null的两种情况。 1=> 此元素或此元素的父元素display为none 2=> 此元素position为fixed
  const parentHidden = el.offsetParent === null && style.position !== 'fixed'

  return hidden || parentHidden
}
