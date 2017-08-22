<template>
  <span :class="{link: this.status == 'available'}" @click="send()">{{text}}</span>
</template>
<script>
import { sendCode } from '../api/index.js';
import { phoneTest } from '../utils/validate.js';
export default {
  props: {
    phone: String,
    register: Boolean // 是否是用于注册的短信验证码
  },
  data: function() {
    return {
      status: 'available', // available, sending, cooling
      time: 60
    }
  },
  computed: {
    text() {
      if (this.status == 'available') return '获取验证码';
      if (this.status == 'sending') return '发送中...';
      if (this.status == 'cooling') return '已发送（' + this.time + 's)';
    }
  },
  methods: {
    send() {
      if (!phoneTest(this.phone)) {
        return this.$message.error("请输入正确的手机号");
      }
      if (this.status == 'available') {
        this.status = 'sending';
        sendCode(this.phone, this.register).then(() => {
          this.$message.success("发送成功");
          this.status = "cooling";
          this.countDown(() => {
            this.status = 'available';
            this.time = 60;
          });
        }).catch(() => this.status = "available");
      }
    },
    countDown(callback) {
      var timer = setInterval(() => {
        if (this.time > 0) {
          this.time--;
        } else {
          callback();
          clearInterval(timer);
        }
      }, 1000)
    }
  }
}

</script>
<style scoped>
.link {
  color: #20a0ff;
}

</style>
