<template>
  <div class="background-container">
    <a-statistic-countdown class="day-level" title="倒计时" :value="deadline" format="D 天 H 时 m 分 s 秒" />
    <div class="login content" v-if="mode == 'login'">
      <img class="logo" src="../assets/logo.png" alt="">
      <div class="logo-name">Mr.Ma</div>
      <a-form :model="loginFormState" name="normal_login" class="login-form" @finish="onFinish"
        @finishFailed="onFinishFailed">
        <a-form-item label="账号" name="username" :rules="[{ required: true, message: '请输入账号!' }]">
          <a-auto-complete v-model:value="loginFormState.username" placeholder="请输入账号" :options="options"
            @search="handleSearch">
            <template #option="{ value: val }">
              {{ val.split('@')[0] }} @
              <span style="font-weight: bold">{{ val.split('@')[1] }}</span>
            </template>
          </a-auto-complete>
        </a-form-item>

        <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码!' }]">
          <a-input-password v-model:value="loginFormState.password">
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <div class="forget">
            <a-form-item name="remember" no-style>
              <a-checkbox v-model:checked="loginFormState.remember">记住密码</a-checkbox>
            </a-form-item>
            <a class="login-form-forgot" href="">忘记密码</a>
          </div>
        </a-form-item>

        <a-form-item>
          <div class="form-end">
            <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button">
              <RadiusBottomrightOutlined />
              登录
            </a-button>
            <a class="to-register" href="/register">注册!</a>
          </div>
        </a-form-item>
      </a-form>
    </div>
    <div class="register content" v-if="mode == 'register'">
      <div class="register-header">
        <LeftCircleFilled class="black-icon" @click="blackLogin" />
        <img class="logo" src="../assets/logo.png" alt="">
        <div class="logo-name">Mr.Ma</div>
      </div>
      <a-form :model="registerFormState" :label-col="labelCol" :wrapper-col="wrapperCol" layout="horizontal"
        style="max-width: 600px" @finish="register" @finishFailed="registerFailed">
        <a-form-item label="性别">
          <a-radio-group v-model:value="registerFormState.sex">
            <a-radio value="man">男生</a-radio>
            <a-radio value="woman">女生</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :rules="[{ required: true, message: '请输入账号!' }]" label="账号">
          <a-input v-model:value="registerFormState.username" />
        </a-form-item>
        <a-form-item label="密码" :rules="[{ required: true, message: '请输入密码!' }]">
          <a-input-password v-model:value="registerFormState.password">
          </a-input-password>
        </a-form-item>
        <a-form-item label="确认密码" :rules="[{ required: true, message: '请确认密码!' }]">
          <a-input-password v-model:value="password">
          </a-input-password>
        </a-form-item>
        <a-form-item label="昵称">
          <a-input v-model:value="registerFormState.nickname" />
        </a-form-item>
        <a-form-item label="手机">
          <a-input v-model:value="registerFormState.phone" />
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input v-model:value="registerFormState.email" />
        </a-form-item>
        <a-form-item label="出生日期">
          <a-date-picker v-model:value="registerFormState.birthday" />
        </a-form-item>
        <a-form-item label="地址">
          <a-textarea :rows="4" v-model:value="registerFormState.address" />
        </a-form-item>
        <a-button :disabled="false" type="primary" html-type="submit" class="register-form-button">
          注册
        </a-button>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { login, userRegister } from '../service/login.js';
import type { Login, Users } from '@/untils/type';
import { LeftCircleFilled } from '@ant-design/icons-vue';
import { RadiusBottomrightOutlined } from '@ant-design/icons-vue';
import { openNotification } from '../untils/antvNotification';
import { useUserInfoStore } from '../stores/userInfo';

defineProps({
  mode: String
})

interface LoginFormState {
  username: string;
  password: string;
  remember: boolean;
}

const router = useRouter();
const labelCol = { style: { width: '88px' } };
/** 输入框长度 */
const wrapperCol = { span: 15 };

/** 登录表单 */
const loginFormState = reactive<LoginFormState>({
  username: '',
  password: '',
  remember: true,
});

/** 注册表单 */
const registerFormState = reactive<Users>({
  username: '',
  password: '',
  sex: 'man',
  email: '',
  phone: null,
  address: '',
  birthday: null,
  nickname: '',
});

/** 倒计时 */
const deadline = new Date(new Date().getFullYear() + 1, 0, 1, 0, 0, 0, 0).getTime();
/** 确认密码 */
let password = ref<string>('');
/** 辅助提示 */
const options = ref<{ value: string }[]>([]);
const handleSearch = (val: string) => {
  let res: { value: string }[];
  if (!val || val.indexOf('@') >= 0) {
    res = [];
  } else {
    res = ['gmail.com', '163.com', 'qq.com'].map(domain => ({ value: `${val}@${domain}` }));
  }
  options.value = res;
};
const store = useUserInfoStore();

/** 登录 */
const onFinish = (values: LoginFormState) => {
  const params: Login = {
    username: values.username,
    password: values.password,
  };

  login(params)
    .then((response) => {
      const { token, message, data } = response as unknown as { token: string, message: string, data: Users };
      if (token) {
        delete data.password;
        store.$patch({userInfoData: data});
        localStorage.setItem('token', token);
        router.push({ path: '/home', replace: true });
        openNotification('bottomRight', '登录成功', '欢迎', false);
      } else {
        openNotification('bottomRight', '登录失败', message);
      }
    })
    .catch((error: string) => {
      let err = error.toString();
      openNotification('bottomRight', '登录失败', err);
    })
};

/** 登录失败 */
const onFinishFailed = (errorInfo: string) => {
  let error = errorInfo.toString();
  openNotification('bottomRight', '登录失败', error);
};

/** 登录按钮 */
const disabled = computed(() => {
  return !(loginFormState.username && loginFormState.password);
});

/** 返回登录页 */
const blackLogin = () => {
  router.push('/login');
}

/** 注册 */
const register = () => {
  userRegister({ ...registerFormState }).then((response) => {
    const { token, message } = response as unknown as {token: string, message: string};
    if (token) {
      router.push({ path: '/home', replace: true });
      openNotification('bottomRight', '注册成功', '欢迎', false);
    } else {
      openNotification('bottomRight', '注册失败', message);
    }
  })
    .catch((error: string) => {
      let err = error.toString();
      openNotification('bottomRight', '注册失败', err);
    });
}

/** 注册失败 */
const registerFailed = (errorInfo: unknown) => {
  console.log('Failed:', errorInfo);
};



</script>

<style lang="less" scoped>
.background-container {
  /* 设置背景图片 */
  background-image: url('../assets/Background.jpg');
  /* 替换为你的图片路径 */

  /* 使背景图片充满整个屏幕 */
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  /* 设置容器铺满整个屏幕 */
  width: 100vw;
  height: 100vh;

  /* 使内容居中 */
  display: flex;
  justify-content: center;
  align-items: center;

  margin: 0;
  padding: 0;
  overflow: hidden;

  .day-level {
    position: fixed;
    cursor: pointer;
    top: 8px;
    left: 8px;
  }
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 333px;
  margin: auto;
  padding: 30px 20px 10px 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  position: absolute;
  top: 50%;
  left: calc(100% - 345px);
  /* 居中并距离右边屏幕300px */
  transform: translate(-50%, -50%);
}

/* 可以在这里添加样式来美化登录组件 */
.login {

  .logo {
    width: 88px;
  }

  .logo-name {
    margin-bottom: 28px;
    font-size: x-large;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  }

  .login-form-button {
    width: 100%;
  }

  .forget {
    display: flex;
    justify-content: space-between;
  }

  .form-end {
    text-align: end;

    .to-register {
      text-align: end;
    }
  }
}




.register {
  .register-header {
    position: relative;

    .black-icon {
      position: absolute;
      font-size: 24px;
      left: -119px;
      top: -8px;
      cursor: pointer;
    }
  }

  .logo {
    width: 88px;
  }

  .logo-name {
    margin-bottom: 28px;
    font-size: 38px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  }

  .register-form-button {
    width: 100%;
    margin-bottom: 18px;
  }
}
</style>
