---
# Template for F_* architecture index files
# Frontmatter keys (fill as appropriate):
# name, path, layer, type, description, primary_owner, tags, entry_points, status, file_count, size_hint, last_updated
---

## 概要
<!-- 1-2 行で何が含まれるかを記述 -->

## YAML frontmatter (required)
Place a YAML frontmatter at the top of the file with the following example content:

```yaml
---
name: "src/components (common)"
path: "src/components/common"
layer: "src/components"
type: "dir"
description: "Common components used across pages (Header, Button, etc.)"
primary_owner: "frontend-team"
tags: ["components","ui","common"]
entry_points:
  - "src/components/common/Header/Header.tsx"
status: "pure-new"
file_count: 20
size_hint: "medium"
last_updated: "2025-12-27"
---
```

## 構成（Entry points）
| Path | Type | Purpose | Note |
|---|---:|---|---|
| `src/components/common/Header/Header.tsx` | component | App header | used by `App.tsx` |

## 検索・操作コマンド
- ファイル一覧: `find src/components/common -type f` 
- テスト: `pnpm test -- src/components/common` (プロジェクトに合わせて調整)

## 更新履歴
- 2025-12-27: Template created
