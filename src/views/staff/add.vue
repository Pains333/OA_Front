<script setup name="staffadd">
import OAMain from "@/components/OAMain.vue";
import {reactive, ref} from "vue";
import {useAuthStore} from "@/stores/auth.js";
import {useRouter} from "vue-router";
import staffHttp from "@/api/staffHttp.js";
import {ElMessage} from "element-plus";

const authStore = useAuthStore();
const router = useRouter();
let staffFormRef = ref()
let staffForm = reactive({
  email: '',
  password: '',
  realname: '',
})
let staffRules = reactive({
  email: [{required: true, message: '请输入邮箱', trigger: 'blur'}],
  password: [{required: true, message: '请输入密码', trigger: 'blur'}],
  realname: [{required: true, message: '请输入真实姓名', trigger: 'blur'}],
})

const onSubmit = () => {
  staffFormRef.value.validate(async (valid, fields) => {
    if(valid){
      try{
        await staffHttp.addStaff(staffForm.realname, staffForm.email, staffForm.password)
        ElMessage.success('员工添加成功')
        router.push({name: 'stafflist'})
      }catch (detail){
        ElMessage.error(detail)
      }
    }
  })
}

</script>

<template>
  <OAMain title="新增员工">
    <el-card>
      <el-form :model="staffForm" :rules="staffRules" ref="staffFormRef" label-width="80px">
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="staffForm.realname" placeholder="请输入名字"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="staffForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="staffForm.password" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>

        <el-form-item label="部门">
          <el-input readonly disabled :value="authStore.user.department.name"></el-input>
        </el-form-item>

        <el-form-item label="领导">
          <el-input readonly disabled :placeholder="'[' + authStore.user.email + ']' + authStore.user.realname"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="onSubmit" type="primary">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </OAMain>
</template>

<style scoped>

</style>