<script setup name="login">
import login_img from '@/assets/image/login.png'
import {reactive} from "vue";
import {useAuthStore} from "@/stores/auth.js";
import {useRouter} from "vue-router";
import authHttp from "@/api/authHttp.js";
import {ElMessage} from "element-plus";

const authStore = useAuthStore()
const router = useRouter()

let form = reactive({
  email: "",
  password: "",
})

const onSubmit = async () => {
  let emailRex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9])+/
  let pwdRex = /^[a-zA-Z0-9_-]{6,20}/

  if(!emailRex.test(form.email)){
      ElMessage.info("邮箱格式不满足")
    return;
  }
  if(!pwdRex.test(form.password)){
    ElMessage.info("密码格式不满足")
    return;
  }
  try{
    let data = await authHttp.login(form.email, form.password)
    let token = data.token
    let user = data.user
    authStore.setUserToken(user, token)
    router.push({name: 'frame'})
  }catch (detail){
    ElMessage.error(detail)
  }
}
</script>

<template>
  <div class="dowebok">
    <div class="container-login100">
      <div class="wrap-login100">
        <div class="login100-pic js-tilt" data-tilt>
          <img :src="login_img" alt="IMG" />
        </div>

        <div class="login100-form validate-form">
          <span class="login100-form-title"> 员工登陆 </span>

          <div class="wrap-input100 validate-input">
            <input class="input100" type="text" name="email" placeholder="邮箱" v-model="form.email"/>
            <span class="focus-input100"></span>
            <span class="symbol-input100">
                            <i class="iconfont icon-fa-envelope" aria-hidden="true"></i>
                        </span>
          </div>

          <div class="wrap-input100 validate-input">
            <input class="input100" type="password" name="password" placeholder="密码" v-model="form.password"/>
            <span class="focus-input100"></span>
            <span class="symbol-input100">
                            <i class="iconfont icon-fa-lock" aria-hidden="true"></i>
                        </span>
          </div>

          <div class="container-login100-form-btn">
            <button class="login100-form-btn" @click="onSubmit">
              登陆
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="@/assets/css/login.css"></style>
<style scoped src="@/assets/iconfont/iconfont.css"></style>