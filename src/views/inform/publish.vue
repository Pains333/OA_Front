<script setup name="informpublish">
import OAMain from "@/components/OAMain.vue";
import {ref, reactive, shallowRef, onMounted, onBeforeUnmount, computed, watch} from "vue";
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import staffHttp from "@/api/staffHttp.js";
import {ElMessage} from "element-plus";
import {useAuthStore} from "@/stores/auth.js";
import informHttp from "@/api/informHttp.js";
import {useRouter} from "vue-router";

const authStore = useAuthStore();
const router = useRouter()

let formLabelWidth = '100px'
let informFormRef = ref()
let departments = ref([])
let mode = 'default'

const informForm = reactive({
  title: '',
  content: '',
  department_ids: [],
})

const informRules = reactive({
  title: [{required: true, message: '请输入标题', trigger: 'blur'}],
  content: [{required: true, message: '请输入内容', trigger: 'blur'}],
  department_ids: [{required: true, message: '请选择部门', trigger: 'change'}],
})

const onSubmit = () => {
  informFormRef.value.validate(async (valid) => {
    if (valid){
      try{
        let data = await informHttp.publishInform(informForm)
        ElMessage.success("通知发布成功")
        router.push({name: 'informlist'})
      }catch (detail){
        ElMessage.error(detail)
      }
    }
  })
}

////////这个wangEditor相关的配置
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

const toolbarConfig = {}
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      server: import.meta.env.VITE_BASE_URL + '/image/upload',
      fieldName: 'image',
      maxFileSize: 0.5 * 1024 * 1024,
      maxNumberOfFiles: 10,
      allowedFileTypes: ['image/*'],
      headers: {
        Authorization: 'JWT ' + authStore.token
      },
      timeout: 6 * 1000,
      customInsert(res, insertFn) {
        if(res.errnp == 0){
          let data = res.data;
          let url = import.meta.env.VITE_BASE_URL + data.url
          let href = import.meta.env.VITE_BASE_URL + data.href
          let alt = data.alt
          insertFn(url, alt, href)
        }else{
          ElMessage.error(res.message)
        }
      },
      // 单个文件上传失败
      onFailed(file, res) {
        console.log(`${file.name} 上传失败`, res)
      },

      // 上床错误
      onError(file, err, res) {
        if(file.size > 0.5*1024*1024){
          ElMessage.error('图片文件最大不能超过0.5MB')
        }else{
          ElMessage.error('图片格式不正确')
        }
      }
    }
  }
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

onMounted(async () => {
  try{
    let data = await staffHttp.getAllDepartment()
    departments.value = data
  }catch (detail) {
    ElMessage.error(detail)
  }
})
</script>

<template>
  <OAMain title="发布通知">
    <el-card>
      <el-form :model="informForm" :rules="informRules" ref="informFormRef">
        <el-form-item label="标题" :label-width="formLabelWidth" prop="title">
          <el-input v-model="informForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择部门" :label-width="formLabelWidth" prop="department_ids">
          <el-select multiple v-model="informForm.department_ids">
            <el-option :value="0" label="所有部门"></el-option>
            <el-option v-for="department in departments" :label="department.name" :value="department.id" :key="department.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布内容" :label-width="formLabelWidth" prop="content">
          <div style="border: 1px solid #ccc">
            <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="editorRef"
                :defaultConfig="toolbarConfig"
                :mode="mode"
            />
            <Editor
                style="height: 500px; overflow-y: hidden;"
                v-model="informForm.content"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="handleCreated"
            />
          </div>
        </el-form-item>
        <el-form-item>
          <div style="text-align: right; flex: 1;">
            <el-button type="primary" @click="onSubmit">提交</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </OAMain>
</template>

<style scoped>

</style>