---
productSlug: easy-chart-lit
lang: zh
chapterSlug: 00_00-Index
order: 0
title: "快速导览"
sourceFile: "00_00-Index.md"
---

# 快速导览

本手册面向通过 **`EasyChartLibraryWindow`** 在 Unity 编辑器里配置图表（`ChartProfile` 资产）的工作流。

- 菜单入口：`EasyChart/Library Editor`
- 手册查看器：`EasyChart/Manual`

---

## 目录

### A. 上手与工作流

- [快速导览](/zh/products/easy-chart-lit/manual/00_00-Index)
- [快速上手：2 分钟做出第一张图](/zh/products/easy-chart-lit/manual/00_01-QuickStart)
- [UIToolKit工作流（推荐）](/zh/products/easy-chart-lit/manual/00_02-WorkflowAndLibrary)
- [UGUI工作流](/zh/products/easy-chart-lit/manual/00_03-UGUIWorkflow)
- [运行时数据注入（UIToolKit）](/zh/products/easy-chart-lit/manual/00_04-RuntimeDataInjectionUIToolKit)
- [运行时数据注入（UGUI）](/zh/products/easy-chart-lit/manual/00_05-RuntimeDataInjectionUGUI)

### B. 编辑器与面板

- [编辑器工作流与面板说明](/zh/products/easy-chart-lit/manual/01_01-EditorWorkflow)
- [Library 面板（资源树）](/zh/products/easy-chart-lit/manual/01_02-LibraryPanel)
- [JSON Injection 面板](/zh/products/easy-chart-lit/manual/01_03-JsonInjectionPanel)
- [Preview 面板](/zh/products/easy-chart-lit/manual/02_04-PreviewPanel)
- [Inspector 面板](/zh/products/easy-chart-lit/manual/02_05-InspectorPanel)
- [Series 面板](/zh/products/easy-chart-lit/manual/02_06-SeriesPanel)

### C. Series详细配置（用户目的导向）

- [折线图（Line）](/zh/products/easy-chart-lit/manual/03_01-LineChart)
- [柱状图（Bar）](/zh/products/easy-chart-lit/manual/03_02-BarChart)
- [散点图（Scatter）](/zh/products/easy-chart-lit/manual/03_03-ScatterChart)
- [热力图（Heatmap）](/zh/products/easy-chart-lit/manual/03_04-HeatmapChart)
- [雷达图（Radar）](/zh/products/easy-chart-lit/manual/03_05-RadarChart)
- [饼图（Pie）](/zh/products/easy-chart-lit/manual/03_06-PieChart)
- [圆环图（RingChart）](/zh/products/easy-chart-lit/manual/03_07-RingChart)

### D. 配置项参考（按字段分类，查字典）

- [常用配方（Common Recipes）](/zh/products/easy-chart-lit/manual/04_08-CommonRecipes)
- [FAQ（常见问题与最快排错路线）](/zh/products/easy-chart-lit/manual/04_09-FAQ)

### E. 更新与规划

- [更新计划（Roadmap / Update Plan）](/zh/products/easy-chart-lit/manual/05_01-UpdatePlan)

---

## 约定与术语

- **ChartProfile**：图表配置资产（可复用，可在编辑器预览）。
- **Series / Serie**：数据序列（例如折线的一条线、柱状图的一组柱）。
- **SeriesData**：序列中的数据点集合。
- **Axis**：坐标轴配置（`AxisType=Category/Value`）。
- **Category**：类目轴（使用 `labels` 列表）。
- **Value**：数值轴（连续数值范围）。

---

## 推荐文件组织

建议在项目中为图表配置建立一个统一目录：

- `Assets/EasyChart/Library/Custom/`：你自己的 `ChartProfile` 资产
- `Assets/EasyChart/Docs/Manual/`：本手册章节（Markdown）

---

## 手册版本

- 本手册将随 EasyChart 的字段与编辑器功能迭代同步更新。
