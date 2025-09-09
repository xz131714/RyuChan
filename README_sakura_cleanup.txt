已将所有与 TypeScript 相关的 sakura 逻辑弃用，全部采用 BaseLayout.astro 内联 JS 方案。

- src/utils/sakura.ts 仅保留一行注释，提示已弃用。
- src/utils/sakura-manager.ts 仅保留一行注释，提示已弃用。
- public/sakura.js 可删除（如无其他用途）。
- public/sakura.png 保留。

如需恢复 TS 方案，请参考历史提交。
