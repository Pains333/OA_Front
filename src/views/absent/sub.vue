<script setup name="subabsent">
import OAMain from "@/components/OAMain.vue";
import timeFormatter from "@/utils/timeFormatter.js";
import {ref, reactive, onMounted} from "vue";
import {ElMessage} from "element-plus";
import absentHttp from "@/api/absentHttp.js";
import OAPagination from "@/components/OAPagination.vue";
import OADialog from "@/components/OADialog.vue";


let absents = ref([])
let pagination = reactive({
  total: 0,
  page: 1,
})
let dialogFormVisible = ref(false)
let absentForm = reactive({
  status: 2,
  response_content: '',
})
let absentFormRef = ref()
let absentFormRule = reactive({
  status: [{required: true, message: '请选择处理结果', trigger: 'change'}],
  response_content: [{required: true, message: '请输入理由', trigger: 'blur'}]
})
let handleIndex = 0

const onShowOpinions = (index) => {
  absentForm.status = 2
  absentForm.response_content = ''
  handleIndex = index
  dialogFormVisible.value = true
}

const onSubmitAbsent = () => {
  absentFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      try{
        const absent = absents.value[handleIndex]
        const data = await absentHttp.handleSubAbsent(absent.id, absentForm.status, absentForm.response_content)
        dialogFormVisible.value = false
        absents.value.splice(handleIndex, 1, data)
        ElMessage.success('处理成功')
      }catch (detail){
        ElMessage.error(detail)
      }
    }
  })
}

onMounted(async () => {
  try{
    let data = await absentHttp.getSubAbsents()
    pagination.total = data.count
    absents.value = data.results
  }catch (detail){
    ElMessage.error(detail)
  }
})
</script>

<template>
  <OAMain title="下属考勤">
    <el-card>
      <el-table :data="absents" style="width: 100%">
        <el-table-column prop="title" label="标题"/>
        <el-table-column label="发起人">
          <template #default="scope">
            {{ '[' + scope.row.requester.department.name + ']' + scope.row.requester.realname }}
          </template>
        </el-table-column>
        <el-table-column prop="absent_type.name" label="请假类型"/>
        <el-table-column prop="request_content" label="原因"/>
        <el-table-column label="发起时间">
          <template #default="scope">
            {{timeFormatter.stringFromDateTime(scope.row.create_time)}}
          </template>
        </el-table-column>
        <el-table-column prop="start_date" label="开始时间"/>
        <el-table-column prop="end_date" label="结束时间"/>
        <el-table-column prop="responder.realname" label="审核领导" />
        <el-table-column prop="response_content" label="审核意见"/>
        <el-table-column label="审核状态">
          <template #default="scope">
            <el-tag type="info" v-if="scope.row.status==1">审核中</el-tag>
            <el-tag type="success" v-else-if="scope.row.status==2">已通过</el-tag>
            <el-tag type="danger" v-else>已拒绝</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="处理">
          <template #default="scope">
            <el-button @click='onShowOpinions(scope.$index)' type="primary" v-if="scope.row.status==1" icon="EditPen">处理</el-button>
            <el-button v-else disabled type="default">已处理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <OAPagination v-model="pagination.page" :total="pagination.total"></OAPagination>
      </template>
    </el-card>
  </OAMain>

  <OADialog v-model="dialogFormVisible" title="处理请假" @submit="onSubmitAbsent">
    <el-form :model="absentForm" :rules="absentFormRule" ref="absentFormRef" label-width="100px">
      <el-form-item label="结果" prop="status">
        <el-radio-group v-model="absentForm.status" class="ml-4">
          <el-radio :value="2">通过</el-radio>
          <el-radio :value="3">拒绝</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="理由" prop="response_content">
        <el-input type="textarea" v-model="absentForm.response_content" autocomplete="off" />
      </el-form-item>
    </el-form>
  </OADialog>
</template>

<style scoped>

</style>



