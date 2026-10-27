/** 每次插件初始化只切换一次；等待宿主设置就绪，随后允许用户自行改主题。 */
export function activateDarkTheme(ctx) {
  const settings = ctx.configForms.get('ui-theme');
  let attempted = false, stopped = false;
  let unsubscribe = () => {};
  const warn = reason => console.warn(
    '[dsh-gargantua] 自动切换深色主题失败 / Could not select dark appearance:',
    reason, '请在「设置 → 通用设置 → 深色」手动切换 / Settings → General → Dark.'
  );
  const stop = () => {
    stopped = true;
    clearTimeout(timer);
    unsubscribe();
  };
  // 官方 setTheme 返回 void；通过持久化快照核对结果，不重复写入或锁定主题。
  const timer = setTimeout(() => {
    warn(attempted ? 'Host did not confirm the saved dark preference.' : 'Theme settings did not become ready.');
    stop();
  }, 15000);
  const sync = () => {
    if (stopped) return;
    const snapshot = settings.getSnapshot();
    if (snapshot.status === 'unavailable') {
      warn('The Host does not serve ui-theme settings.');
      stop();
      return;
    }
    if (snapshot.status !== 'ready' || !snapshot.value) return;
    if (attempted) {
      if (snapshot.value.preference === 'dark') stop();
      return;
    }
    attempted = true;
    if (snapshot.value.preference === 'dark') {
      stop();
      return;
    }
    if (!snapshot.writable) {
      warn('Theme settings are read-only.');
      stop();
      return;
    }
    try {
      ctx.theme.setTheme('dark');
    } catch (error) {
      warn(error);
      stop();
    }
  };
  unsubscribe = settings.subscribe(sync);
  sync();
  return stop;
}
