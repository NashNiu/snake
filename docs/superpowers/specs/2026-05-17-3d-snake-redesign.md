# 3D Snake 重设计 Spec

**日期**: 2026-05-17
**状态**: 已审批

---

## 概述

将当前已简化为 2D 平面移动的贪吃蛇游戏，重新设计为真·3D 版本。恢复六自由度移动，扩大竞技场，全面升级视觉表现，保持霓虹赛博朋克风格，不引入新的游戏机制。

---

## 核心逻辑

### 竞技场尺寸
- `GRID_SIZE`: `10 → 20`
- 有效空间：`-20 ~ +20`，共 40×40×40 格

### 移动维度
- 恢复全部 6 个方向：X/Y/Z 三轴
- `useControls.ts` 加回 `Space → [0,1,0]`，`ShiftLeft / ShiftRight → [0,-1,0]`

### 碰撞 & 食物生成
- `isOutOfBounds`: 恢复 Y 轴边界检查（`pos[1] > gridSize || pos[1] < -gridSize`）
- `randomFood`: 恢复三轴随机（Y 轴不再固定为 0）

### 速度曲线
```
旧: tickInterval = max(80, 200 - score * 5)   // 第 24 分到极速
新: tickInterval = max(80, 200 - score * 3)   // 第 40 分到极速
```
原因：竞技场体积扩大 8 倍，放缓斜率避免玩家还没熟悉空间就进入极速阶段。

---

## Arena 视觉

- **线框**：12 条边，颜色 `#00fff7`，半透明（`opacity 0.55`）
- **填充面**：极低不透明度的半透明青色面，增强空间深度感
- **8 个顶角装饰**：每角一个小球 mesh + 一个 `<pointLight>`（颜色 `#00fff7`，intensity 极低，distance 8），强调立体边界
- **不绘制内部网格线**：40³ 网格线密度过高，视觉噪声太大

---

## 摄像机

- 类型：第三人称跟随（始终在蛇头运动方向正后方）
- 跟随距离：`-12` 格（原 -8，随 gridSize 等比扩展）
- 高度偏移：`+6` 格（原 +4）
- lerp 系数：`0.05`（原 0.06，更大空间里过渡更平滑）
- `lookAt` 目标：蛇头位置

---

## 蛇 & 食物视觉

### 蛇
- **蛇头**：`emissiveColor #ffffff`，`emissiveIntensity 1.5`，在蛇身中高亮辨识
- **蛇身渐变**：从蛇头到尾部，`emissiveIntensity` 从 `1.0` 线性降至 `0.05`
- 段几何体：`BoxGeometry 0.88`，不变

### 食物
- 形状：`OctahedronGeometry`（八面体），替换原球体，更有宝石感
- 颜色：品红 `#ff00ff`，不变
- 动画：绕 Y 轴自转替换原上下浮动
- 保留 `pointLight` 光晕

### Bloom 后处理
- `intensity` 小幅提升（具体值实现时微调），增强霓虹饱满感

---

## 控制 & UI

### 按键映射
| 键 | 方向 |
|---|---|
| W / ↑ | 前进 (−Z) |
| S / ↓ | 后退 (+Z) |
| A / ← | 左移 (−X) |
| D / → | 右移 (+X) |
| Space | 上升 (+Y) |
| Shift | 下降 (−Y) |
| R | 重新开始（dead 状态）|

### GameOverlay
- 开始画面：标题 `3D SNAKE`，副标题 `按方向键开始`，提示行 `Space 上升 · Shift 下降`
- 游戏结束画面：不变

### HUD
- 底部提示：`WASD / 方向键 移动 · Space 上升 · Shift 下降`

---

## 文件改动清单

| 文件 | 改动 |
|---|---|
| `src/store/gameStore.ts` | `GRID_SIZE 10 → 20` |
| `src/utils/gameLogic.ts` | 恢复 Y 轴 bounds 检查；`randomFood` 恢复三轴；速度公式 `*5 → *3` |
| `src/hooks/useControls.ts` | 加回 Space / ShiftLeft / ShiftRight |
| `src/components/Arena.tsx` | 3D 线框立方体 + 8 顶角发光装饰 |
| `src/components/FollowCamera.tsx` | 跟随距离 -12，高度 +6，lerp 0.05 |
| `src/components/Snake.tsx` | 蛇头白色高亮；蛇身渐变强化 |
| `src/components/Food.tsx` | 八面体 + 自转动画 |
| `src/components/ui/GameOverlay.tsx` | 恢复 3D SNAKE 标题及 Y 轴提示 |
| `src/components/ui/HUD.tsx` | 底部提示补充 Space / Shift |
| `README.md` | 同步更新控制说明和游戏规则 |

---

## 不在范围内

- 新道具 / buff 系统
- 多个食物同时存在
- 多人模式
- 音效
- 存档 / 排行榜
