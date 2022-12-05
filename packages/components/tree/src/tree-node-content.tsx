import { defineComponent, inject } from "vue";
import { treeInjectKey, treeNodeContentProps } from './tree'



export default defineComponent({

    name :'zTreeNodeContent',
    props : treeNodeContentProps,
    setup(props) {
       return () => {
        const treeContent = inject(treeInjectKey)
          const node = props.node
          if(treeContent?.slots.default) {
             return treeContent.slots.default({ node : node })
          }
          return node?.label
       }
    }
})