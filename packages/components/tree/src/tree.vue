<template>
  <div>
   <virtualList :item="flattenTree" :size="30"  :remain="10">
    <template #default="{ node }">
      <wc-tree-node
      :node="node"
      :is-expanded="hasExpanded(node)"
      :loadingKeys ="loadingKeysRef"
      :selected-keys="selectedKeysRef"
      @toggle="treeNodeClick"
      @select="onSelectNode"
      :key="node.key"
      ></wc-tree-node>
    </template>
   </virtualList>
    
  </div>
</template>
<script lang="ts" setup>
import { treeProps, TreeNode, TreeOption, Key, treeEmits,treeInjectKey } from "./tree";
import { ref, watch, computed, provide, useSlots } from "vue";
import wcTreeNode from "./treeNode.vue";
import virtualList from '@wencha/components/virtual-list';

defineOptions({
  name: "wc-tree",
});
const props = defineProps(treeProps);

let treeOption = createOption(
  props.labelField, 
  props.keyField, 
  props.childrenField
)

// 通过props对用户的数据进行格式化，创造一个固定的格式
// label,key,children
const tree = ref<TreeNode[]>([]);
// 将props.data格式化后放到tree中
watch(
  () => props.data,
  (data) => {
    tree.value = createNode(data);
  },
  {
    immediate: true,
  }
);

// 将tree拍平
const expandedKeys = ref(new Set(props.defaultExpandedKeys));
let flattenTree = computed(() => {
  let stack: TreeNode[] = []; // 用于遍历树的栈
  let flattenNodes: TreeNode[] = []; // 最终拍平后的结果
  let node = tree.value || []; // 格式化后的节点(tree)

  console.log('node',node)

  // 第一步 把tree倒序添加进栈中
  // stack : [41,40]
  for (let i = node.length - 1; i >= 0; i--) {
    stack.push(node[i]);
  }
  // 第二步 ，遍历栈
  while (stack.length) {
    const node = stack.pop(); // 因为是倒序入栈，所以最后一项其实也就是原本的第一项 [40]
    if (!node) continue;
    // 加入拍平的结果中
    flattenNodes.push(node);
    if (expandedKeys.value.has(node.key)) {
      // 如果当前node在需要展开的keys中
      // 遍历孩子
      const children = node.children;
      if (children.length) {
        for (let i = children.length - 1; i >= 0; i--) {
          // 继续入栈
          stack.push(children[i]);
        }
      }
    }
  }
  console.log('树',flattenNodes)
  return flattenNodes;
});
// 40
// 4010
// 4020
// 402030
// 402031
// 4030
// 41

// [40,4010,4020,402030,402031]
// stack [41,]

function createNode(data: TreeOption[],parent:TreeNode | null=null) {
  function traversal(data: TreeOption[], parent: TreeNode | null = null) {
    return data.map((node) => {
      let children = treeOption.getChildren(node) || [];
      let treeNode: TreeNode = {
        key: treeOption.getKey(node),
        label: treeOption.getLabel(node),
        children: [], // 默认为空
        level: parent ? parent.level + 1 : 0,
        isLeaf: node.isLeaf ?? children.length === 0,
        rawNode: node,
      };
      if (children.length > 0) {
        // 有孩子再去递归孩子，将其格式化成treeNode类型
        treeNode.children = traversal(children, treeNode);
      }
      return treeNode;
    });
  }
  let result: TreeNode[] = traversal(data,parent);
  return result;
}
function createOption(label: string, key: string, children: string) {
  return {
    getLabel: (node: TreeOption) => node[label] as string,
    getKey: (node: TreeOption) => node[key] as string,
    getChildren: (node: TreeOption) => node[children] as TreeOption[],
  };
}
function treeNodeClick(node:TreeNode) {
  toggle(node);
}
function toggle(node:TreeNode) {
   // 如果当前节点正在加载中不能收起
  if (expandedKeys.value.has(node.key) && !loadingKeysRef.value.has(node.key)) {
    collpase(node);
  } else {
    expand(node);
  }
}
// 折叠
function collpase(node: TreeNode) {
  expandedKeys.value.delete(node.key);
}
// 展开
function expand(node: TreeNode) {
  expandedKeys.value.add(node.key);
  // 要在展开时判断是否需要执行异步函数
   triggerLoading(node)
}

const loadingKeysRef = ref(new Set<Key>())
function triggerLoading(node:TreeNode) {
   // 不是叶子节点并且没有孩子 触发异步加载
   if(!node.isLeaf && !node.children.length) {
       let expandLoading = loadingKeysRef.value
       if(!expandLoading.has(node.key)) {
           let onLoadFn = props.onLoad
           if(onLoadFn && typeof onLoadFn === 'function') {
              expandLoading.add(node.key)
              // onLoad这里要把原始数据传给用户
             onLoadFn(node.rawNode).then((children) => {
                // 先给原始数据的children赋值
                node.rawNode.children = children
                // 改变我们要使用的数据
                node.children = createNode(children,node)
                expandLoading.delete(node.key)
             })
           }
       }
   }
}

// 是否选择
function hasExpanded(node:TreeNode):boolean {
   return expandedKeys.value.has(node.key)
}

// 节点选中

const emit = defineEmits(treeEmits)

const selectedKeysRef = ref<Key[]>([])

watch(() => props.selectedKeys,(value) => {
  console.log('watch到了',value)
  if(value) {
    selectedKeysRef.value = value
  }
},{
  immediate : true
})

function onSelectNode(node:TreeNode) {
    if(!props.selectable) return;

    let keys = Array.from(selectedKeysRef.value)

    if(props.mutiple) {
        const index = keys.findIndex(key => node.key === key)
        if(index > -1) {
           keys.splice(index,1)
        }else {
          keys.push(node.key)
        }
    }else {
      // 单选
       if(keys.includes(node.key)) {
         keys = []
       }else {
        keys = [node.key]
       }
    }
    console.log('keys',keys)
    emit('update:selectedKeys',keys)
}

provide(treeInjectKey,{
   slots : useSlots()
})

</script>
<style lang="scss" scoped></style>
