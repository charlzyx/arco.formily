# arco.formily **UNOFFICAL** `@formily/arco`

鉴于[官方](https://github.com/formilyjs/arco) ~你没看错, 就是空的嗯~未知原因, 没有开源版本, 就凭兴趣简单写了写练手;

欢迎随意 fork & PR, keep RELAX

![welcome](come.png)

Work in Progress... 随缘更新

## Install

```sh
yarn add arco.formily
bun i arco.formily
pnpm install arco.formily
```

## [./examples](./examples/)

## 尚未适配

TODO:

- 这俩不想适配纯属不好用, 回头用 Arco 的 hooks 重写一下

  - [] form-dialog
  - [] form-drawer

- 这俩纯属懒惰

  - [] upload
  - [] select-table

- 未完全适配
  - [] form-item 缺少部分布局属性支持
    - feedbackLayout
    - 忘了..

## diff `@fomrily/antd`

这个项目不是简单的 fork 一下 @formily/antd 然后进行 UI 替换, 逻辑部分也有一些优化调整

- UI 使用 `@arco-design/web-react` (废话嘛这不是)
- 预览使用 RsPress (YYDS), 打包使用 rollup@4 (区别不大)
- FormItem 适配重构, 主要处理样式 (arco x formily)
- ArrayTable 优化重构
- DatePicker/\*, Preview.DatePicker 根据 dayjs 适配重构 (arco-style)
- ArrayTabs, FormTab 适配 `activeKey` -> `activeTab` (arco-style)

## 当前项目已知构建问题

- 样式打包总是丢失 `import './style.less'` 这种文件, 直接丢弃了, 不会在产物中出现,
  所以在 `scripts` 写了个蠢蠢的脚本去替换
- github-actions npm 发布显示失败 404, 然而, 这个包已经成功发布了, 暂时不知道什么问题

## 技术栈

- [RsPress](https://rspress.dev/zh/) for 开发预览
- [Rollup](https://rollupjs.org/) for build
- [formily](https://github.com/alibaba/formily)
- [@arco-design/web-react](https://arco.design/)
