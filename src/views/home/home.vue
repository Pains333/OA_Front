<script setup name="home">
import timeFormatter from "@/utils/timeFormatter.js";
import OAMain from "@/components/OAMain.vue";
import {ref, reactive, onMounted} from "vue";
import {ElMessage} from "element-plus";
import homeHttp from "@/api/homeHttp.js";
import * as echarts from 'echarts';

let absents = ref([])
let informs = ref([])

onMounted(async () => {
  try{
    absents.value = await homeHttp.getLatestAbsent()
    informs.value = await homeHttp.getLatestInform()

    let rows = await homeHttp.getDepartmentStaffCount()
    let xdata = []
    let ydata = []
    for(let row of rows){
      xdata.push(row.name)
      ydata.push(row.staff_count)
    }

    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('department-staff-count'));
    // 绘制图表
    myChart.setOption({
      tooltip: {},
      xAxis: {
        data: xdata
      },
      yAxis: {},
      series: [
          {
            name: '员工数量',
            type: 'bar',
            data: ydata,
        }
      ]
    });
  }catch (detail){
    ElMessage.error(detail)
  }
})
</script>

<template>
  <OAMain title="首页">
    <el-card>
      <template #header>
        <h2>员工数量</h2>
      </template>
      <div id="department-staff-count" style="width: 100%;height: 300px"></div>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <h2>最新通知</h2>
          </template>
          <el-table :data="informs">
            <el-table-column label="标题">
              <template #default="scope">
                <router-link :to="{name: 'informdetail', params: {pk: scope.row.id}}">{{scope.row.title}}</router-link>
              </template>
            </el-table-column>
            <el-table-column label="发布者" prop="author.realname"></el-table-column>
            <el-table-column label="发布时间">
              <template #default="scope">
                {{timeFormatter.stringFromDate(scope.row.create_time)}}
              </template>
            </el-table-column>
            <el-table-column label="是否已读">
              <template #default="scope">
                <el-tag v-if="scope.row.reads.length>0">已读</el-tag>
                <el-tag v-else type="danger">未读</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <h2>最新请假</h2>
          </template>
          <el-table :data="absents">
            <el-table-column label="部门" prop="requester.department.name"></el-table-column>
            <el-table-column label="发起人" prop="requester.realname"></el-table-column>
            <el-table-column label="起始日期" prop="start_date"></el-table-column>
            <el-table-column label="结束日期" prop="end_date"></el-table-column>
            <el-table-column label="发起时间">
              <template #default="scope">
                {{timeFormatter.stringFromDateTime(scope.row.create_time)}}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </OAMain>
</template>

<style scoped>

</style>