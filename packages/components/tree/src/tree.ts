import { ExtractPropTypes,InjectionKey,PropType, SetupContext } from 'vue';


export type Key = string | number


export interface TreeNode extends Required<TreeOption> {
   level : number,
   isLeaf : boolean,
   children : TreeNode[],
   rawNode : TreeOption  // 用户传的原始数据
}

export interface TreeOption {
   key?: Key,
   label ?: Key ,
   isLeaf ?: boolean,
   children ?: TreeOption[],
   [key:string] : unknown
}

export let treeProps = {
   data:{
    type: Array as PropType<TreeOption[]>,
    default : () => []
   },
   labelField : {
     type : String,
     default : 'label'
   },
   keyField : {
     type : String,
     default : 'key'
   },
   childrenField : {
     type : String,
     default : 'children'
   },
   defaultExpandedKeys : {
     type : Array as PropType<Key[]>
   },
   selectedKeys : {
      type : Array as PropType<Key[]>
   },
   selectable :{
     type : Boolean,
     default : true
   },
   mutiple : {
     type : Boolean,
     default : false
   },
   onLoad : { 
    // 用户可以通过onLoad传入一个异步加载的方式进来。 
    // 当点击的节点不是叶子节点并且没有children时会调用
      type : Function as PropType<(node: TreeOption) => Promise<TreeOption[]>>
   }
} as const

export const treeNodeProps = {
   node : {
     type : Object as PropType<TreeNode>,
     required: true
   },
   isExpanded : {
     type : Boolean,
     required : true
   },
   loadingKeys : {
     type : Object as PropType<Set<Key>>
   },
   selectedKeys : {
    type : Array as PropType<Key[]>,
    default : () => []
   }
}  as const

export const treeNodeEmits = {
   toggle : (node : TreeNode) => node,
   select : (node: TreeNode) => node
}

export const treeEmits = {
  'update:selectedKeys': (keys : Key[]) => keys 
}

export type TreeProps = ExtractPropTypes<typeof treeProps>
export type TreeNodeProps = ExtractPropTypes<typeof treeNodeProps>

export interface TreeContext {
   slots : SetupContext['slots']
}
// 此变量作为提供出去的属性
export const treeInjectKey : InjectionKey<TreeContext> = Symbol()

export const treeNodeContentProps = {
   node : {
     type : Object as PropType<TreeNode>,
     required : true
   }
}