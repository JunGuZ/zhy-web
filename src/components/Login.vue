<template>
  <el-container style="height: 100vh; justify-content: center; align-items: center;">
    <el-card>
      <h2>登录</h2>
      <el-form :model="account" ref="form" label-position="top">
        <el-form-item label="clientId">
          <el-input v-model="account.clientId" placeholder="请输入clientId号"></el-input>
        </el-form-item>
        <el-form-item label="clientSecret">
          <el-input type="password" v-model="account.clientSecret" placeholder="请输入clientSecret"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-container>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      account: {
        clientId: '',
        clientSecret: '',
      },
    };
  },
  methods: {
    ...mapActions(['login']),
    async handleLogin() {
      try {
        const response = await this.login(this.account);

        if (response) { // 根据后端返回的状态判断
          this.$router.push('/home'); // 登录成功后跳转
        } else {
          console.error('登录失败:', response.message || '未知错误');
        }
      } catch (error) {
        console.error('请求失败:', error);
      }
    },
  },
};
</script>

<style scoped>
.el-container {
  background-color: #f5f5f5;
}
</style>
