<template>
  <el-container class="app-layout">
    <el-header class="app-header">
      <div class="header-top">
        <router-link to="/" class="logo-link" active-class="" exact-active-class="">
          <span class="logo-icon">⬆</span>
          <h1>老式电梯按钮样式图鉴</h1>
        </router-link>
        <nav class="nav-links">
          <router-link to="/" class="nav-link" exact-active-class="nav-link-exact-active">建筑列表</router-link>
          <router-link to="/button-types" class="nav-link" exact-active-class="nav-link-exact-active">按钮类型</router-link>
          <router-link to="/statistics" class="nav-link" exact-active-class="nav-link-exact-active">统计概览</router-link>
        </nav>
      </div>
      <p class="subtitle">收录各年代建筑中仍存或已退役的电梯按钮样式</p>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background: #f5f0e8;
  color: #3d3229;
}

.app-layout {
  min-height: 100vh;
}

.app-header {
  background: linear-gradient(135deg, #5c4a3a 0%, #8b6914 100%);
  color: #f5f0e8;
  padding: 24px 32px;
  height: auto !important;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.nav-links {
  display: flex;
  gap: 8px;
}

.nav-link {
  padding: 8px 16px;
  font-size: 0.9rem;
  color: #f5f0e8;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s ease;
  opacity: 0.85;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.15);
  opacity: 1;
}

.nav-link-exact-active {
  background: rgba(255, 255, 255, 0.25);
  opacity: 1;
  font-weight: 600;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
}

.logo-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  font-size: 18px;
}

.app-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.subtitle {
  font-size: 0.875rem;
  opacity: 0.85;
  margin-left: 52px;
}

.el-main {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 16px 48px;
  width: 100%;
}
</style>
