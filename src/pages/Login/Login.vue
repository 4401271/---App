<template>
  <section class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">美困外卖</h2>
        <div class="login_header_title">
          <a href="javascript:;" :class="{on: isShowSms}" @click="isShowSms = true">短信登录</a>
          <a href="javascript:;" :class="{on: !isShowSms}" @click="isShowSms = false">密码登录</a>
        </div>
      </div>
      <div class="login_content">
        <form>
          <div  :class="{on: isShowSms}">
            <section class="login_message">
              <input type="tel" maxlength="11" placeholder="手机号"
                     v-model="phone" name="phone" v-validate="'required|mobile'">
              <button :disabled="!isRightPhone || computeTime > 0" class="get_verification" :class="{right_phone_number: isRightPhone}" @click.prevent="sendCode" >
                {{computeTime>0 ? `短信已发送(${computeTime}s)` : '发送验证码'}}
              </button>
              <span style="color: red;" v-show="errors.has('phone')">{{ errors.first('phone') }}</span>
            </section>
            <section class="login_verification">
              <input type="text" placeholder="验证码"
                     v-model="code" name="code" v-validate="{required: true,regex: /^\d{6}$/}">
              <span style="color: red;" v-show="errors.has('code')">{{ errors.first('code') }}</span>
            </section>
            <section class="login_hint">
              温馨提示：未注册美困外卖帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <div  :class="{on: !isShowSms}">
            <section>
              <section class="login_message" >
                <input type="text" placeholder="手机/邮箱/用户名"
                       v-model="name" name="name" v-validate="'required'">
                <span style="color: red;" v-show="errors.has('name')">{{ errors.first('name') }}</span>
              </section>
              <section class="login_verification">
                <input :type="isShowPwd? 'text' : 'password'" placeholder="密码"
                       v-model="pwd" name="pwd" v-validate="'required'">
                <div class="switch_button" :class="isShowPwd? 'on' : 'off'" @click="isShowPwd = !isShowPwd">
                  <div class="switch_circle" :class="{right: isShowPwd}"></div>
                  <span class="switch_text">{{isShowPwd? 'abc': ''}}</span>
                </div>
                <span style="color: red;" v-show="errors.has('pwd')">{{ errors.first('pwd') }}</span>
              </section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="验证码"
                       v-model="captcha" name="captcha" v-validate="{required: true,regex: /^[0-9a-zA-Z]{4}$/}">
                <img ref="captcha" class="get_verification" :src="isShowSms ? '' : '/api/captcha'" alt="captcha" @click="updateCaptcha">
                <span style="color: red;" v-show="errors.has('captcha')">{{ errors.first('captcha') }}</span>
              </section>
            </section>
          </div>
          <button class="login_submit" @click.prevent="login">登录</button>
        </form>
        <a href="javascript:;" class="about_us">关于我们</a>
      </div>
      <a href="javascript:" class="go_back" @click="$router.back()">
        <i class="iconfont iconjiantou2" @click="$router.replace('/profile')"></i>
      </a>
    </div>
  </section>
</template>

<script>
import { Toast, MessageBox } from 'mint-ui'
export default {
  name: "Login",
  data(){
    return {
      phone: '', // 手机号
      code: '', // 短信验证码
      name: '', // 用户名
      pwd: '', // 密码
      captcha: '', // 图形验证码
      computeTime: 0, // 计时剩余时间
      isShowSms: true,  // false表示账号密码登录，true表示短信登录
      isShowPwd: false,   // 是否显密码
    }
  },
  computed: {
    // 判断手机号的格式是否正确
    isRightPhone() {
      return /^1\d{10}$/.test(this.phone)
    }
  },
  methods: {
    /* 发送短信验证码 */
    async sendCode () {
      // 设置computeTime为最大值
      this.computeTime = 10
      // 启动循环定时器, 每隔1s将computeTime减1
      const intervalId = setInterval(() => {
        console.log('-------')
        this.computeTime--
        // 当计时为0, 停止计时
        if (this.computeTime<=0) {
          clearInterval(intervalId)
        }
      }, 1000);

      // 发请求 ==> 发短信的接口
      const result = await this.$API1.reqSendCode(this.phone)
      if (result.code===0) {
        Toast('短信发送成功!')
      } else {
        // 停止计时
        this.computeTime = 0
        MessageBox('提示', result.msg);
      }
    },

    /*
    登陆
    */
    async login () {
      // 进行前台表单验证
      let names
      if (this.isShowSms) {  // 短信登录
        names = ['phone', 'code']
      } else {  // 账号密码登录
        names = ['name', 'pwd', 'captcha']
      }

      const success = await this.$validator.validateAll(names) // 对指定的所有表单项进行验证

      if (success) {
        const {phone, code, name, pwd, captcha} = this
        // 验证通过后发登陆的请求
        let result
        if (this.isShowSms) {
          result = await this.$API1.reqSmsLogin({phone, code})
          this.code = ''
        } else {
          result = await this.$API1.reqPwdLogin({name, pwd, captcha})
          this.updateCaptcha()
          this.captcha = ''
        }

        // 根据请求的结果进行处理
        if (result.code===0) { // 登陆请求成功
          const user = result.data
          // 保存user到state
          this.$store.dispatch('saveUser', user)
          // 跳转到个人中心
          this.$router.replace({path:'/profile'})
        } else { // 登陆请求失败
          MessageBox.alert(result.msg)
        }
      }
    },

    /*
    更新图形验证码
    */
    updateCaptcha () {
      // 如何让浏览器对图片重新请求: 图片地址携带一个时间戳参数
      this.$refs.captcha.src = 'http://localhost:4000/captcha?time='+ Math.floor(Date.now()/1000)
    },
  },
  //我们写一个组件守卫，它可以在一个组件中起到监测的效果，点击组件内的一个链接如果此时还没有登录，那么就强制要求登陆，已经登录就进入个人主页
  beforeRouteEnter(to, from, next){
    next((comp)=>{
      if (comp.$store.state.user.token){
        next('/profile');
      }else{
        next('/login');
      }
    })
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixins.styl'
  .loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #FFD000
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          >a
            color #999
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #FFD000
              font-weight 700
              border-bottom 2px solid #02a774
      .login_content
        >form
          >div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid #02a774
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                &.right_phone_number
                  color black
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s,border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #FFD000
                >.switch_circle
                  //transform translateX(27px)
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                  transition transform .3s
                  &.right
                    transform translateX(29px)
            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px
              >a
                color #02a774
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #FFD000
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 15px
          margin-top 20px
          text-align center
          color #999
      .go_back
        position absolute
        top 20px
        left 8px
        width 25px
        height 25px
        >.iconfont
          font-size 20px
          color #999
          margin-left 2px
</style>