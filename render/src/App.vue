<template>
  <div id="app">
    <div class="tab-container">
      <ul class="tabs clearfix">
        <li class="tab" :class="{'active': tab.isActive}" v-for="tab in tabDatas" :key="tab.applicationKey" @click="changeTab(tab)">
          <a href=# >{{ tab.applicationName }}</a>
          <div v-if="tab.showClose" class="close" @click.stop="closeTab(tab)"></div>
        </li>
      </ul>
      <div class="btns">
        <img src="./images/minimize.png" alt="" @click="minimize">
        <img src="./images/maximize.png" alt="" @click="maximize">
        <img src="./images/close_tab.png" alt="" @click="close">
      </div>
    </div>
    <div class="application-container" v-show="activeKey === 'Home'">
      <ul class="application-datas">
        <li class="application-data" v-for="app in applicationDatas" :key="app.applicationKey" @click="openApplication(app)">
          {{ app.applicationName }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { sendChangeBrowserView, getIpcMainMessage, minimize, maximize, close } from './ipcRenderer'

export type AppApplicationDatas = {
  applicationKey: string,
  applicationName: string,
  applicationIcon: string,
  applicationUrl: string,
  isActive: boolean,
  isVisable: boolean,
  showClose: boolean
}
@Component
export default class App extends Vue {
  public $electron: any
  public applicationDatas: AppApplicationDatas[] = [
    {
      applicationKey: 'Home',
      applicationName: '首页',
      applicationIcon: '',
      applicationUrl: 'http://localhost:8888/#',
      isActive: true,
      isVisable: true,
      showClose: false
    },
    {
      applicationKey: 'Baidu',
      applicationName: 'Baidu',
      applicationIcon: '',
      applicationUrl: 'https://www.baidu.com',
      isActive: false,
      isVisable: false,
      showClose: true
    },
    {
      applicationKey: 'Google',
      applicationName: 'Google',
      applicationIcon: '',
      applicationUrl: 'https://www.google.com',
      isActive: false,
      isVisable: false,
      showClose: true
    }
  ]

  public tabDatas = this.applicationDatas.filter((app) => app.isVisable)
  public activeKey = 'Home'

  /**
   * 新打开一个标签页，并且选中当前标签页
   * @author blacklisten
   * @date 2020-04-16
   * @param {any} application:AppApplicationDatas
   * @returns {any}
   */
  private openApplication(application: AppApplicationDatas) {
    this.changeActive(application)
    if (application.applicationKey === 'Home') {
      this.$electron.sendChangeBrowserView('home-browser-view', {
        applicationKey: application.applicationKey,
        applicationUrl: application.applicationUrl
      })
    } else {
      this.$electron.sendChangeBrowserView('create-browser-view', {
        applicationKey: application.applicationKey,
        applicationUrl: application.applicationUrl
      })
    }
  }
  /**
   * 切换标签页时触发
   * @author blacklisten
   * @date 2020-04-16
   * @param {any} application:AppApplicationDatas
   * @returns {any}
   */
  private changeTab(application: AppApplicationDatas): void {
    this.changeActive(application)
    if (application.applicationKey === 'Home') {
      this.$electron.sendChangeBrowserView('home-browser-view', {
        applicationKey: application.applicationKey,
        applicationUrl: application.applicationUrl
      })
    } else {
      this.$electron.sendChangeBrowserView('changetab-browser-view', {
        applicationKey: application.applicationKey,
        applicationUrl: application.applicationUrl
      })
    }
  }

  /**
   * 关闭标签页
   * @author blacklisten
   * @date 2020-04-16
   * @param {any} application:AppApplicationDatas
   * @returns {any}
   */
  private closeTab(application: AppApplicationDatas): void {
    this.applicationDatas.forEach((app) => {
      if (app.applicationKey === 'Home') {
        app.isActive = true
        app.isVisable = true
        this.$forceUpdate()
        this.activeKey = app.applicationKey
      }
      if (app.applicationKey === application.applicationKey) {
        app.isVisable = false
        app.isActive = false
      }
    })
    this.tabDatas = this.applicationDatas.filter((app) => app.isVisable)
    this.$electron.sendChangeBrowserView('close-browser-view', {
      applicationKey: application.applicationKey,
      applicationUrl: application.applicationUrl
    })
  }

  /**
   * 改变当前的选中项，重新获取tabDatas
   * @author blacklisten
   * @date 2020-04-16
   * @param {any} application:AppApplicationDatas
   * @returns {any}
   */
  private changeActive(application: AppApplicationDatas): void {
    // 当前要切换的tab与当前选中的tab相同时，不进行任何操作
    if (application.applicationKey === this.activeKey) {
      return
    }
    this.applicationDatas.forEach((item) => {
      if (item.applicationKey === application.applicationKey) {
        item.isActive = true
        item.isVisable = true
        this.activeKey = application.applicationKey
      } else {
        item.isActive = false
      }
    })
    this.tabDatas = []
    this.tabDatas = this.applicationDatas.filter((app) => app.isVisable)
  }

  private minimize() {
    minimize()
  }
  private maximize() {
    maximize()
  }
  private close() {
    close()
  }
  private callbackMessage(event: any, {message, data}: any) {
    console.log(message, data)
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  border: none;
  outline: none;
}
#app {
  min-height: 100vh;
}
.tab-container {
  background: transparent;
  margin: 0;
  padding: 0;
  max-height: 35px;
  border-bottom: 1px solid #dcd7d782;
  display: flex;
  align-content: center;
  -webkit-user-select: none;
  -webkit-app-region: drag;
  .tabs {
    flex: 1;
    margin: 0;
    list-style-type: none;
    line-height: 35px;
    max-height: 35px;
    overflow: hidden;
    display: flex;
    padding-right: 20px;
    .tab {
      -webkit-app-region: no-drag;
      margin: 5px -10px 0;
      border-top-right-radius: 25px 170px;
      border-top-left-radius: 20px 90px;
      padding: 0 30px 0 25px;
      height: 170px;
      background: #d8d6d6;
      position: relative;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
      min-width: 150px;
      text-align: center;
      a {
        display: inline-block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        text-decoration: none;
        color: #3c3a3a;
        font-size: 14px;
        line-height: 30px;
        height: 30px;
      }
      .close {
        background: url(~@/images/close_tab.png);
        width: 16px;
        height: 15px;
        position: absolute;
        top: 8px;
        right: 20px;
        cursor: pointer;
        z-index: 99;
      }
      &::before, &::after {
        content: "";
        background: transparent;
        height: 20px;
        width: 20px;
        border-radius: 100%;
        border-width: 10px;
        top: 0px;
        border-style: solid;
        position: absolute;
      }
      &::before {
        border-color: transparent #d8d6d6 transparent transparent;
        transform: rotate(48deg);
        left: -23px;
      }
      &::after {
        border-color: transparent transparent transparent #d8d6d6;
        transform: rotate(-48deg);
        right: -17px;
      }
    }
    .active {
      z-index: 2;
      background: #ffffff;
      &::before {
        border-color: transparent #ffffff transparent transparent;
      }
      &::after {
        border-color: transparent transparent transparent #ffffff;
      }
    }
  }
  .btns {
    -webkit-app-region: no-drag;
    line-height: 35px;
    img {
      width: 16px;
      height: 16px;
      margin-right: 10px;
      cursor: pointer;
    }
  }
}
.application-container {
  .application-datas {
    display: flex;
    list-style: none;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    .application-data {
      width: 100px;
      height: 40px;
      line-height: 40px;
      background-color: #03A9F4;
      text-align: center;
      margin: 15px;
      cursor: pointer;
      color: #fff;
      font-size: 14px;
    }
  }
}
</style>
