# 给 AI 的安装说明 / Installation instructions for AI

用户给出的安装请求授权安装和启用本插件。只操作用户当前希望使用的 DSH profile，不修改其他插件或账号信息。先识别目标是 **Desktop** 还是 **Web**；不能确定时询问用户。

## 固定安装目标

- 名称：`dsh-gargantua`；版本：`0.2.0`。
- 已验证宿主：DeepSeek Harness Desktop `0.2.1-rc.3`。
- 预构建安装包：https://github.com/2bigpig/dsh-gargantua/releases/download/v0.2.0/dsh-gargantua-0.2.0.tgz
- SHA-256：https://github.com/2bigpig/dsh-gargantua/releases/download/v0.2.0/SHA256SUMS.txt
- 无需克隆源码、Node.js 开发环境、npm 发布、模型密钥或自行构建。

## A. 在 DSH 自身的 AI 中安装（优先）

Desktop rc.3 使用 **Creator 模式**提供的 `plugin_manager`。工具不可用时请用户切换到 Creator；不要尝试通过 CLI 修改 Desktop profile。

1. 调用 `plugin_manager`，参数 `{"action":"list_bundles","limit":100}`，必要时翻页，获得当前 profile 中的准确名称和启用状态。
2. 相同版本且已启用时，不重复安装；确认实际加载无错误。相同版本禁用时调用 `{"action":"set_bundle","target":"dsh-gargantua","enabled":true}`。
3. 未安装时调用：

```json
{
  "action": "install_bundle",
  "target": "https://github.com/2bigpig/dsh-gargantua/releases/download/v0.2.0/dsh-gargantua-0.2.0.tgz",
  "enabled": true
}
```

4. 已安装其他版本时，先记录启用状态；通过官方 `remove_bundle` 删除准确的包名，成功后安装上述版本。删除失败不要强行覆盖配置。
5. 按返回的 `application`、错误及 `nextStep` 行动，再调用 `list_bundles` / `list_plugins` 核对。若要求刷新或重启，先告知用户，再按宿主支持的流程完成；不得把 `restart-required` 宣称为已生效。

工具权限审批遵循 DSH。缺少授权时说明阻碍；不绕过审批，不更改用户的权限模式。预构建包本身没有安装脚本；若出现额外依赖构建授权，必须按宿主要求让用户决定。

## B. 外部 AI 为 Desktop 安装

适用于具备桌面操作能力的 Codex、Claude Code 或其他助手：

1. 下载固定目标的 tgz 和校验文件，核对 SHA-256；失败时停止，不使用未知镜像。
2. 打开用户希望使用的 DSH Desktop 实例，进入「插件」。
3. 已安装则先检查版本、启用状态和错误；按 A 部分处理重复安装或升级。
4. 「添加插件」→在包名或地址中填下载文件的绝对路径→「安装」→「立即启用」。
5. 选择工作区并打开新会话，确认中栏黑洞；进入聊天确认背景变淡，输入与选择仍可用。

只有终端能力而没有 DSH 内置工具或桌面操作能力时，**不能承诺自动安装 Desktop**。可以准备下载包，再明确请用户在 Creator 模式粘贴 README 中的一句话，或完成手动添加；不要直接编辑 Desktop profile、强杀日常应用或宣称安装完成。

## C. 外部 AI 为 Web 安装

确认已安装 DSH CLI，识别实际使用的 Web profile；不要因为名称未知就默认修改 Desktop。默认 Web profile 的命令为：

```sh
dsh plugin --profile web add "https://github.com/2bigpig/dsh-gargantua/releases/download/v0.2.0/dsh-gargantua-0.2.0.tgz"
```

命名 profile 应替换为用户实际使用的名称。已安装同版本先检查启用状态；升级前通过官方插件管理工具或 CLI 移除旧包，再安装。根据宿主结果刷新或重启，并在真实会话验证。

## 完成标准与卸载

包版本为 0.2.0、bundle 已启用且无加载错误；有界面能力时核对新会话黑洞可见、聊天变淡、背景不妨碍输入。只能验证安装清单而不能观察画面时，明确说明视觉未验证。下载成功或包管理器退出码为零不等于插件实际加载成功。

Desktop 可在插件详情页禁用或卸载，也可用 `plugin_manager` 的 `set_bundle` 或 `remove_bundle`。Web 使用 `dsh plugin --profile <实际名称> remove dsh-gargantua`。网络、权限、兼容性或显卡失败应报告实际状态，不自动降低画质、不授予版本豁免。

## English agent instructions

Identify the intended Desktop or Web profile first. The fixed artifact is the v0.2.0 tgz linked above; no source build or credentials are needed. Prefer DSH's official `plugin_manager` in **Creator mode on Desktop rc.3**: list bundles first, avoid reinstalling an active identical version, enable a disabled identical version, otherwise install using the exact JSON above. For upgrades, remove the old bundle through official tools before installing. Respect approvals and follow `application` / `nextStep`; a restart requirement is not completed activation.

External agents with desktop control may download and checksum the tgz, then use Plugins → Add plugin → absolute package path → Install → Enable now. Terminal-only external agents must not directly edit Desktop profiles or claim unattended Desktop installation. They may install into a confirmed Web profile through the documented CLI.

Verify version, activation and absence of loading errors. When UI access exists, check the new-conversation background and dimming during chat without blocking typing. Report unverified visual state honestly. Uninstall through the same official manager or Web CLI. Never request account secrets or bypass permissions.
