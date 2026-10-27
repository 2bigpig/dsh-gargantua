import React from 'react';
import { mountGargantua } from '../vendor/gargantua/src/core.js';
import { activateDarkTheme } from './theme.js';

export const inject = ['slots', 'theme', 'configForms'];
const mounted = new WeakMap();
const opacity = { dark: { hero: 0.85, chat: 0.12 }, light: { hero: 0.30, chat: 0.08 } };

function findHost(anchor) {
  // 使用会话的稳定标记定位，找不到时不猜测整个页面为背景。
  return anchor.closest('[data-conversation-scroll]')?.parentElement || null;
}

/** 挂载一个中栏背景；返回幂等清理函数。导出此函数以便测试真实 DOM 生命周期。 */
export function attachBackdrop(anchor, ctx) {
  const host = findHost(anchor);
  if (!host || mounted.has(host)) return () => {};
  const layer = document.createElement('div');
  layer.dataset.dshGargantua = '';
  layer.style.cssText = 'position:fixed;z-index:-1;overflow:hidden;pointer-events:none;transition:opacity .6s ease;';
  const oldIsolation = host.style.isolation;
  host.style.isolation = 'isolate';
  host.prepend(layer);
  let controller, gone = false, scheduled = 0;
  let lastRect = '';

  // 观察布局及状态变化，不在每帧读取宿主布局或消息内容。
  function sync() {
    scheduled = 0;
    if (gone) return;
    const rect = host.getBoundingClientRect();
    const key = [rect.left,rect.top,rect.width,rect.height].map(Math.round).join(',');
    if (key !== lastRect) {
      lastRect = key;
      Object.assign(layer.style,{left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px'});
      controller?.resize();
    }
    const theme = ctx.theme.getTheme().active.colorScheme;
    const phase = anchor.closest('[class*="_composerHero"]') ? 'hero' : 'chat';
    layer.dataset.phase = phase;
    layer.dataset.theme = theme;
    layer.style.opacity = String(opacity[theme][phase]);
  }
  const schedule = () => { if (!gone && !scheduled) scheduled = requestAnimationFrame(sync); };
  const sizeObserver = new ResizeObserver(schedule);
  sizeObserver.observe(host);
  const stateObserver = new MutationObserver(records => {
    // 渲染层自己的 DOM 更新不触发宿主状态刷新。
    if (records.some(record => !record.target.closest?.('[data-dsh-gargantua]'))) schedule();
  });
  stateObserver.observe(host,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  // 由官方主题服务通知变化，包含用户手动选择及跟随系统的结果。
  const offTheme = ctx.on('theme/change', schedule);
  window.addEventListener('resize',schedule);
  window.addEventListener('scroll',schedule,true);
  sync();
  const cleanup = () => {
    if (gone) return;
    gone = true;
    cancelAnimationFrame(scheduled);
    sizeObserver.disconnect();stateObserver.disconnect();offTheme();
    window.removeEventListener('resize',schedule);window.removeEventListener('scroll',schedule,true);
    controller?.destroy();layer.remove();
    if (host.style.isolation === 'isolate') host.style.isolation = oldIsolation;
    mounted.delete(host);
  };
  mounted.set(host,cleanup);
  // 不读取旧本地设置：始终固定 4K 自动播放。
  void mountGargantua(layer).then(instance => {
      if (gone) { instance.destroy(); return; }
      controller = instance;
      // 只暴露实例状态便于验证，不暴露 DSH 会话或消息。
      Object.defineProperty(layer,'gargantua',{value:instance});
      sync();
    }).catch(error => { if (!gone) { layer.dataset.error=String(error.message);cleanup(); } });
  return cleanup;
}

export function apply(ctx) {
  ctx.effect(() => activateDarkTheme(ctx), 'gargantua: initial dark appearance');
  function Backdrop() {
    const anchor = React.useRef(null);
    React.useEffect(() => anchor.current ? attachBackdrop(anchor.current, ctx) : undefined, []);
    return React.createElement('span',{ ref:anchor, 'data-dsh-gargantua-anchor':'', style:{display:'none'} });
  }
  ctx.slots.inject('conversation.input.dock', () => ctx.slots.register(
    {name:'conversation.input.dock',id:'gargantua',order:40},Backdrop));
}
