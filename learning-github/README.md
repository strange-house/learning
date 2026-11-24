# Learning

一个完全离线的「计划型」学习 App：把「今天要做什么」这件事，变得几乎不用动脑。

- **技术栈**：React Native + Expo（SDK 58）+ TypeScript，一套代码跑 Android / iOS
- **存储**：expo-sqlite 本地数据库，无后端、无账号、不联网
- **理念**：低决策成本 —— 习惯自动出现、待办池无压力、未来排期软性不催

## 一、功能（5 个 Tab）

- **今天**（首页）：习惯自动出现 + 今日计划（按优先级 SSS→SS→S→A 排序）+ 接下来几天（软性）。打勾完成留在原地。
- **计划**：待办池（无日期、无压力）+ 接下来几天。
- **日记**：一天一篇，自由文字。
- **备忘**：便签，可置顶 / 编辑 / 删除，显示创建时间。
- **我的**：习惯完成统计 + 深色模式 + JSON 导出导入。

> 完整需求见 [docs/需求文档.md](docs/需求文档.md)。

## 二、先回答：需要打成安装包吗？

| 目的 | 做法 | 是否需要 APK |
|---|---|---|
| 马上在手机上试试 | 手机装 **Expo Go**，扫二维码 | 不需要 |
| 长期用、发给别人、装到平板 | 打 **APK**（或上架 AAB） | 需要 |

**APK 必须在你自己的电脑或云端编译**。代码已按可直接打包的状态配好（app.json / eas.json / 图标 / 包名）。

## 三、运行与打包

### 1. 准备环境
安装 **Node.js 20 LTS 或 22 LTS（推荐 22）**。检查：`node -v`、`npm -v`。

### 2. 安装依赖
    cd learning
    npm install

> 钉在 Expo SDK 58。若提示依赖版本不匹配，执行 `npx expo install --fix`。

### 3. 手机预览（最快，不用打包）
    npx expo start

- 手机应用商店装 **Expo Go**
- 安卓手机用 Expo Go 扫码（同一 WiFi）
- 不通就 `npx expo start --tunnel`

### 4. 打包 APK
**方式 A：EAS 云构建（推荐）**
    npm install -g eas-cli
    eas login
    eas build -p android --profile preview

**方式 B：本地编译（JDK 17 + Android SDK）**
    npx expo prebuild --platform android --clean
    cd android
    .\gradlew assembleRelease

## 排错：启动报 `WebSocketServer is not a constructor`

这个错是因为依赖被 `pnpm` 装成了 isolated 结构，`@expo/cli` 找不到正确的 `ws` 版本。处理办法：

1. 删掉项目里的 `node_modules` 文件夹
2. 重新安装（**用 npm，不要用 pnpm**）：
       npm install
3. 再 `npx expo start`

本项目已用 npm 装好扁平依赖，正常直接启动即可。

## 四、一键脚本（Windows）
- `1-启动预览.bat`：自动装依赖 + 启动预览
- `2-打包APK.bat`：云构建 APK
- `4-清理缓存并启动.bat`：清缓存重启
- `5-查看连接地址.bat`：显示 Expo Go 连接地址

## 五、目录结构
    learning/
    ├─ app.json / eas.json / tsconfig.json / babel.config.js
    ├─ assets/            # 图标（白底 + 打开的书）
    ├─ scripts/           # make-assets.py（图标生成脚本）
    ├─ docs/需求文档.md   # 完整需求
    └─ src/
       ├─ app/            # expo-router 路由（5 Tab + 4 编辑器）
       ├─ components/     # UI 组件
       ├─ stores/         # zustand 状态
       ├─ data/           # SQLite、仓储
       ├─ domain/         # 纯领域模型
       ├─ services/       # 备份导入导出
       ├─ theme/  utils/