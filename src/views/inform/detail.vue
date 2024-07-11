<script setup name="informdetail">
import informHttp from "@/api/informHttp.js";
import OAMain from "@/components/OAMain.vue";
import {onMounted, ref, reactive} from "vue";
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";
import timeFormatter from "@/utils/timeFormatter.js";

const route = useRoute();
let inform = reactive({
  title: '',
  content: '',
  create_time: '',
  author: {
    realname: '',
    department: {
      name: '',
    }
  }
})
onMounted(async () => {
  const pk = route.params.pk
  try{
    let data = await informHttp.getInformDetail(pk)
    Object.assign(inform, data)
  }catch (detail){
    ElMessage.error(detail)
  }
  await informHttp.readInform(pk)
})
</script>

<template>
  <OAMain title="通知详情">
    <el-card>
      <template #header>
        <div style="text-align: center">
          <h2 style="padding-bottom: 20px">{{inform.title}}</h2>
          <div>
            <span>作者：{{inform.author.realname}}</span>
            <span style="margin-left: 20px">发布时间：{{timeFormatter.stringFromDate(inform.create_time)}}</span>
          </div>
        </div>
      </template>
      <template #default>
        <div v-html="inform.content" class="content"></div>
      </template>
      <template #footer>阅读量：{{inform.read_count}}</template>
    </el-card>
  </OAMain>
</template>

<style scoped>
.content :deep(img){
  max-width: 100%;
}
</style>