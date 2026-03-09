---
productSlug: easy-chart-lit
lang: en
chapterSlug: 00_00-Index
order: 0
title: "Quick Overview"
sourceFile: "00_00-Index.md"
---

# Quick Overview

This manual is intended for a workflow where you configure charts (the `ChartProfile` asset) in the Unity Editor via **`EasyChartLibraryWindow`**.

- Menu entry: `EasyChart/Library Editor`
- Manual viewer: `EasyChart/Manual`

---

## Table of Contents

### A. Getting Started & Workflows

- [Quick overview](/en/products/easy-chart-lit/manual/00_00-Index)
- [Quick start: create your first chart in 2 minutes](/en/products/easy-chart-lit/manual/00_01-QuickStart)
- [UIToolKit workflow (recommended)](/en/products/easy-chart-lit/manual/00_02-WorkflowAndLibrary)
- [UGUI workflow](/en/products/easy-chart-lit/manual/00_03-UGUIWorkflow)
- [Runtime data injection (UIToolKit)](/en/products/easy-chart-lit/manual/00_04-RuntimeDataInjectionUIToolKit)
- [Runtime data injection (UGUI)](/en/products/easy-chart-lit/manual/00_05-RuntimeDataInjectionUGUI)

### B. Editor & Panels

- [Editor workflow and panels](/en/products/easy-chart-lit/manual/01_01-EditorWorkflow)
- [Library panel (asset tree)](/en/products/easy-chart-lit/manual/01_02-LibraryPanel)
- [JSON Injection panel](/en/products/easy-chart-lit/manual/01_03-JsonInjectionPanel)
- [Preview panel](/en/products/easy-chart-lit/manual/02_04-PreviewPanel)
- [Inspector panel](/en/products/easy-chart-lit/manual/02_05-InspectorPanel)
- [Series panel](/en/products/easy-chart-lit/manual/02_06-SeriesPanel)

### C. Series Configuration (Goal-Oriented)

- [Line chart](/en/products/easy-chart-lit/manual/03_01-LineChart)
- [Bar chart](/en/products/easy-chart-lit/manual/03_02-BarChart)
- [Scatter chart](/en/products/easy-chart-lit/manual/03_03-ScatterChart)
- [Heatmap chart](/en/products/easy-chart-lit/manual/03_04-HeatmapChart)
- [Radar chart](/en/products/easy-chart-lit/manual/03_05-RadarChart)
- [Pie chart](/en/products/easy-chart-lit/manual/03_06-PieChart)
- [Ring chart](/en/products/easy-chart-lit/manual/03_07-RingChart)

### D. Reference (Lookup by Field)

- [Common recipes](/en/products/easy-chart-lit/manual/04_08-CommonRecipes)
- [FAQ (fastest troubleshooting path)](/en/products/easy-chart-lit/manual/04_09-FAQ)

### E. Updates & Roadmap

- [Roadmap / update plan](/en/products/easy-chart-lit/manual/05_01-UpdatePlan)

---

## Conventions & Terminology

- **ChartProfile**: A chart configuration asset (reusable; previewable in the editor).
- **Series / Serie**: A data series (e.g. one line in a line chart, or one group of bars in a bar chart).
- **SeriesData**: The set of data points in a series.
- **Axis**: Axis configuration (`AxisType=Category/Value`).
- **Category**: Category axis (uses the `labels` list).
- **Value**: Value axis (continuous numeric range).

---

## Recommended Project Structure

Recommended to create a dedicated folder in your project for chart assets:

- `Assets/EasyChart/Library/Custom/`: your own `ChartProfile` assets
- `Assets/EasyChart/Docs/Manual/`: this manual (Markdown chapters)

---

## Manual Version

- This manual will be kept in sync with EasyChart field and editor feature updates.
