# Gargantua Black Hole for DSH · 卡冈图雅黑洞插件

给 **DeepSeek Harness** 会话中栏加上《星际穿越》**Interstellar** 风格的实时 4K 黑洞。新会话醒目、聊天变淡；不覆盖侧栏，不拦截输入、滚动和选择。**0.2.1 · 已验证 Desktop 0.2.1-rc.3**。

[下载插件](https://github.com/2bigpig/dsh-gargantua/releases/download/v0.2.1/dsh-gargantua-0.2.1.tgz) · [纯动画实时预览](https://2bigpig.github.io/gargantua/) · [动画源码](https://github.com/2bigpig/gargantua) · [English](README.en.md)

![真实 DSH Desktop：新会话与聊天背景演示](docs/demo.gif)

动图来自隔离的真实 rc.3 Desktop 中栏，使用虚构演示会话。预览经过压缩，实际绘制始终为 **3840×2160**。

## 一句话让 AI 安装

复制这句话交给 AI：

> 请读取 https://raw.githubusercontent.com/2bigpig/dsh-gargantua/main/INSTALL_FOR_AI.md，按说明帮我安装并启用 Gargantua 黑洞插件，完成后验证是否生效。

DSH Desktop 0.2.1-rc.3 请先切换到 **Creator 模式**，让 AI 使用官方 `plugin_manager`。外部 AI 安装 Desktop 插件需要桌面操作能力；纯终端助手可安装 Web profile，但无法承诺自动操作 Desktop。DSH 要求的权限确认仍需按提示完成。完整说明见 [INSTALL_FOR_AI.md](INSTALL_FOR_AI.md)。

## 手动安装与卸载

从 [v0.2.1 Release](https://github.com/2bigpig/dsh-gargantua/releases/tag/v0.2.1) 下载 `dsh-gargantua-0.2.1.tgz`，无需 Node.js 或自行构建。Release 附 `SHA256SUMS.txt`。

**Desktop：** 打开侧栏「插件」→「添加插件」，在包名或地址中粘贴下载包的绝对路径或上方下载链接，安装后点击「立即启用」。选择工作区，打开新会话查看。插件详情页可禁用或卸载。旧版需先卸载再安装新版；Desktop profile 由应用管理，不能用 CLI 修改。

**Web：** 已安装 DSH CLI 时，对实际使用的 Web profile 执行：

```sh
dsh plugin --profile web add "https://github.com/2bigpig/dsh-gargantua/releases/download/v0.2.1/dsh-gargantua-0.2.1.tgz"
dsh plugin --profile web remove dsh-gargantua
```

若 profile 名不同，替换为当前使用的名称。根据宿主返回结果刷新或重启；不要把安装包下载成功当成插件已启用。

## 自动切换深色

每次启用插件或启动 DSH，插件等待宿主主题设置加载后，使用官方主题接口将**整个 DSH 切为深色并保存**。每次初始化只执行一次；发送消息、切换会话不会重复切换。随后可在「设置 → 通用设置」手动改回浅色或跟随系统，停用和卸载不会恢复旧主题。下次启用或启动会再次选择深色。

这是为避免浅色聊天背景中黑洞几乎不可见。若设置只读、加载或保存失败，插件控制台会记录诊断，不反复强制切换；请在「设置 → 通用设置 → 深色」手动选择。

已有用户需升级到 v0.2.1，仓库更新不会自动替换本机插件。

## 固定行为与兼容性

- 纯黑洞背景，无插件叠加文字、设置入口、面板或暂停操作；保留 DSH 自身界面。
- 实际绘制固定 **3840×2160**，按中栏比例校正，持续自动播放，调度上限 60fps；实际帧率取决于显卡。
- 深色新会话/聊天强度 **85% / 12%**，浅色 **30% / 8%**。
- 不读取旧暂停或画质设置，不因低动态或隐藏主动暂停。系统冻结、后台调度和显卡故障仍可能限制绘制；显卡不可用显示无文字静帧。
- 已在 **DSH Desktop 0.2.1-rc.3** 验证安装、卸载、双主题、历史切换、缩放、输入选择。其他宿主版本需重新确认兼容性。
- 不调用模型、不发送消息、无 CDN 请求；卸载和会话组件销毁释放显卡资源。

安装后无背景时，先检查是否启用、是否选中工作区并打开会话，再检查硬件加速、浏览器显卡支持和插件错误。动画只挂在带 `data-conversation-scroll` 标记的会话中栏；不支持的宿主布局不会误挂到整个页面。

## 从源码构建

需要 Node.js 22+：

```sh
git clone https://github.com/2bigpig/dsh-gargantua.git
cd dsh-gargantua
npm ci
npm run build
npm pack
```

生成 `lib/client.js` 和 `dsh-gargantua-0.2.1.tgz`。普通构建只使用仓库内 `vendor/gargantua` 固定快照，不要求相邻动画目录。维护时显式同步：

```sh
npm run sync:engine -- "<gargantua 源码目录>"
npm run build
```

同步记录版本和 SHA-256。React 由 DSH 提供，渲染依赖和回退图内嵌；接入使用 DSH 模块加载器、Cordis bundle 与 `conversation.input.dock`。

## 来源与许可

MIT © 2026 **2bigpig**。核心来自 [gargantua](https://github.com/2bigpig/gargantua)，基于 [dgreenheck/webgpu-black-hole](https://github.com/dgreenheck/webgpu-black-hole)（MIT），使用 Three.js。参考 [dsh-ascii-ocean](https://github.com/GqqQq-Q/dsh-ascii-ocean) 的宿主接入结构，未复制海洋代码。见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) 和 [LICENSE](LICENSE)。

受《星际穿越》启发的艺术近似，不含电影视频、剧照或个人网站信息。
