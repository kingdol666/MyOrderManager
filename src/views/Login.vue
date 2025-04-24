<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <span>管理员登录</span>
        </div>
      </template>
      <div class="form-container">
        <div class="form-icon">
          <img src="/order.svg" alt="order icon" style="width: 30px; height: 30px;">
        </div>
        <el-form :model="loginForm" ref="loginFormRef" label-width="80px">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="Email or user name" :prefix-icon="User" @click="handleInputFocus('username')" @blur="handleInputBlur" :class="{ 'input-focused': focusedInput === 'username' }"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="Password" show-password :prefix-icon="Lock" @keyup.enter="handleLogin" @click="handleInputFocus('password')" @blur="handleInputBlur" :class="{ 'input-focused': focusedInput === 'password' }"></el-input>
        </el-form-item>
        <div class="form-options">
          <el-checkbox label="Remember me" name="remember"></el-checkbox>
          <el-link type="primary" :underline="false" class="forgot-password">Forgot Password</el-link>
        </div>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="loading" class="login-button">Login</el-button>
        </el-form-item>
      </el-form>
      </div>
      <div class="social-login">
        <div class="divider">OR</div>
        <p>Login / sign up with</p>
        <div class="social-icons">
          <!-- Add social icons here, e.g., using Element Plus icons or SVGs -->
          <el-icon><Eleme /></el-icon> <!-- Placeholder for Google -->
          <el-icon><Platform /></el-icon> <!-- Placeholder for Facebook -->
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { User, Lock, UserFilled } from '@element-plus/icons-vue'; // 引入图标

const router = useRouter();
const loginFormRef = ref(null);
const loading = ref(false);

const loginForm = reactive({
  username: '',
  password: '',
});

const focusedInput = ref('');

const handleInputFocus = (inputName) => {
  focusedInput.value = inputName;
};

const handleInputBlur = () => {
  setTimeout(() => {
    focusedInput.value = '';
  }, 300);
};

const handleLogin = () => {
  loading.value = true;
  // 模拟 API 调用延迟
  setTimeout(() => {
    if (loginForm.username === 'root' && loginForm.password === '123456') {
      ElMessage.success('登录成功！');
      // 存储登录状态
      localStorage.setItem('isLoggedIn', 'true');
      router.push('/main'); // 登录成功后跳转到主页面
    } else {
      ElMessage.error('用户名或密码错误！');
    }
    loading.value = false;
  }, 500);
};
</script>

<style scoped>
.logo-container {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  width: 120px;
  height: auto;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f5f5f5;
  position: relative;
  overflow: hidden;
  animation: gradientBG 15s ease infinite;
  background-size: 400% 400%;
}

/* 添加背景装饰元素 - 模仿图片中的黄色和圆形 */
.login-container::before {
  content: '';
  position: absolute;
  top: -80px;
  left: -80px;
  width: 300px;
  height: 300px;
  background: #f7dc6f;
  border-radius: 50%;
  opacity: 0.4;
  animation: float 6s ease-in-out infinite;
}

.login-container::after {
  content: '';
  position: absolute;
  bottom: -100px;
  right: -100px;
  width: 350px;
  height: 350px;
  background: #f7dc6f;
  border-radius: 50%;
  opacity: 0.4;
  animation: float 8s ease-in-out infinite alternate;
}

.login-card {
  width: 420px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background-color: #ffffff;
  border: none;
  padding: 40px;
  z-index: 1;
  transition: all 0.3s ease;
}

.card-header {
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  color: #333;
  margin-bottom: 32px;
  padding-top: 0;
  letter-spacing: 1px;
}

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: relative;
}

.form-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: absolute;
  left: 0px;
  top: 20px;
  z-index: 1;
  transition: all 0.3s ease;
  margin-bottom: 16px;
  margin-right: 16px;
  background-color: #fff;
}

.el-form {
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 0;
}

.el-form-item {
  margin-bottom: 24px;
  width: 100%;
  max-width: 320px;
}

/* 输入框样式 */
:deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: none;
  border: 1px solid #f0f0f0;
  background-color: #fafafa;
  height: 48px;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper.input-focused) {
  height: 64px;
  transform: scale(1.2) !important;
  box-shadow: 0 0 16px rgba(67, 206, 162, 0.5) !important;
  border-color: #43cea2 !important;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.5) !important;
  z-index: 9999 !important;
  margin: -2px 0;
} 

:deep(.el-input__wrapper.is-focus) {
  border-color: #43cea2;
  transform: scale(1.15) !important;
  box-shadow: 0 0 0 2px rgba(67, 206, 162, 0.2);
}

:deep(.el-input__wrapper:hover) {
  border-color: #abda40;
}

:deep(.el-input__inner) {
  color: #606266;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  font-size: 14px;
  gap: 30px;
}

.forgot-password {
  font-size: 14px;
}

.login-button {
  width: 100%;
  border-radius: 8px;
  font-size: 16px;
  padding: 12px 20px;
  border: none;
  background: #ff2442;
  font-weight: 500;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 36, 66, 0.2);
}

.login-button:hover {
  background: linear-gradient(to right, #ff687f, #ff71a6);
}

.social-login {
  margin-top: 32px;
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: #999;
  font-size: 12px;
  margin-bottom: 16px;
  font-weight: 400;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #eee;
}

.divider::before {
  margin-right: 16px;
}

.divider::after {
  margin-left: 16px;
}

.social-login p {
  font-size: 12px;
  color: #999;
  margin-bottom: 16px;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.social-icons .el-icon {
  font-size: 20px;
  cursor: pointer;
  color: #333;
  transition: all 0.2s ease;
  background: transparent;
  padding: 8px;
  border-radius: 50%;
  border: 1px solid #eee;
}

.social-icons .el-icon:hover {
  color: #ff2442;
  border-color: #ff2442;
  transform: none;
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}

</style>