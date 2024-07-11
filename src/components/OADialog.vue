<script setup>
let dialogVisible = defineModel({required: true})

let props = defineProps({
  title: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '500',
  }
})

const emits = defineEmits(['cancel', 'submit'])

const onCancel = () => {
  dialogVisible.value = false
  emits('cancel')
}

const onSubmit = () => {
  emits('submit')
}
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="props.title" :width="props.width">
    <slot></slot>
    <div slot="footer" class="dialog-footer" style="text-align: right">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<style scoped>

</style>