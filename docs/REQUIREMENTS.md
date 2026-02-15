# デジタルサイネージシステム 要件定義書

## 1. プロジェクト概要

### 1.1 目的
現場事務所内に設置されたモニターで、行動予定・協力業者・月間予定・施工サイクル等の情報をデジタル表示するサイネージシステムを構築する。

### 1.2 システム特性
- **完全オンプレミス環境**（インターネット接続なし）
- 単一Windows PC上で動作
- 外部通信を行わない閉じた構成

### 1.3 制約事項
- 天気予報等の外部API連携は不可
- 縦置きモニターと横置きモニターの表を同一サイクルに混在させることは不可

---

## 2. システム構成

### 2.1 技術スタック

| 項目 | 技術 | 備考 |
|------|------|------|
| フレームワーク | **Electron** | デスクトップアプリとして動作 |
| フロントエンド | React または Vue.js | コンポーネント指向 |
| データベース | **SQLite** | ファイルベース、軽量 |
| 設定管理 | YAML または JSON | 画面定義の外部化 |

### 2.2 動作環境

| 項目 | 要件 |
|------|------|
| OS | Windows 10/11 |
| メモリ | 4GB以上推奨 |
| ストレージ | 1GB以上の空き容量 |
| ディスプレイ | 縦置き: 1080×1920 / 横置き: 1920×1080 |

---

## 3. 画面仕様

### 3.1 画面一覧

| No | 画面名 | 向き | サイズ | 用途 |
|----|--------|------|--------|------|
| 1 | 行動予定表 | 縦置き | 75インチ (1080×1920) | 社員の行動状況表示 |
| 2 | 施工サイクル表 | 縦置き | - | 当日の作業工程・ステータス表示 |
| 3 | 協力業者作業一覧 | 横置き | - | 当日入場の協力業者表示 |
| 4 | 月間行事予定表 | 横置き | 75インチ (1920×1080) | 月間カレンダー形式の予定表示 |
| 5 | ポスター表示 | 両対応 | - | 社内ポスター・掲示物のスライドショー |
| 6 | 管理画面 | - | - | データ登録・設定変更用 |

---

### 3.2 行動予定表

#### 表示項目
| 項目 | 型 | 必須 | 説明 |
|------|------|------|------|
| 氏名 | 文字列 | ○ | 社員名 |
| 行先 | 文字列 | ○ | 外出先・「在席」等 |
| 使用車両 | 文字列 | - | 社用車のナンバー等 |
| 帰社予定 | 時刻 | - | HH:MM形式 |

#### 動的スケーリング仕様
- **基本行数**: 10行
- **最大行数**: 制限なし（自動スケーリング）
- **スケーリングルール**:
  - 10行以下: 基本フォントサイズ（26px）
  - 11〜15行: フォントサイズ22px、行高さ縮小
  - 16〜20行: フォントサイズ18px
  - 21行以上: フォントサイズ16px、スクロール表示検討

---

### 3.3 施工サイクル表

#### 表示項目
| 項目 | 型 | 必須 | 説明 |
|------|------|------|------|
| タイトル | 文字列 | ○ | 作業名（例: 朝礼・KY活動） |
| 作業内容 | 文字列 | - | 詳細説明 |
| ステータス | 選択 | ○ | 完了 / 作業中 / 未着手 / 要確認 |

#### ステータス表示
| ステータス | 記号 | 色 |
|------------|------|------|
| 完了 | ✓ | 緑 (#38a169) |
| 作業中 | ◐ | 黄 (#d69e2e) |
| 未着手 | ○ | グレー (#a0aec0) |
| 要確認 | ! | 赤 (#e53e3e) |

---

### 3.4 協力業者作業一覧

#### 表示項目
| 項目 | 型 | 必須 | 説明 |
|------|------|------|------|
| 業者名 | 文字列 | ○ | 会社名 |
| 作業内容 | 文字列 | - | 担当工事種別 |
| 人数 | 数値 | - | 入場人数 |

#### 表示形式
- カード形式（グリッドレイアウト）
- 4列×N行で自動配置
- 業者数に応じてカードサイズを自動調整

---

### 3.5 月間行事予定表

#### 表示項目
| 項目 | 型 | 必須 | 説明 |
|------|------|------|------|
| 日付 | 日付 | ○ | 自動生成（年月指定時） |
| 曜日 | 文字列 | ○ | 自動生成 |
| 記事 | 文字列 | - | 自由入力の予定内容 |

#### イベントタグ
| タグ | 用途 | 背景色 |
|------|------|--------|
| 重要 | 重要イベント | #fed7d7 |
| 定例 | 定例会議等 | #c6f6d5 |
| 作業 | 作業予定 | #bee3f8 |
| 休日 | 休日・祝日 | #feebc8 |

---

### 3.6 ポスター表示

#### 対応フォーマット
- JPEG (.jpg, .jpeg)
- PNG (.png)
- PDF (.pdf) ※1ファイル=1ページ前提

#### 表示仕様
- **登録方法**: ディレクトリ指定（指定フォルダ内の対応ファイルを全て読み込み）
- **表示方式**: アスペクト比維持でフィット表示（中央配置）
- **切り替え**: スライドショー形式（秒数は設定可能）
- **登録枚数**: 無制限

#### ポスター表示パターン（要選択）

**パターンA: フルスクリーン切替方式（推奨）**
```
表 → 表 → ポスター → 表 → ポスター → ループ
```
- メリット: ポスター・表ともに大きく見やすい
- デメリット: 同時表示不可

**パターンB: 分割表示方式**
```
┌──────────────────┐
│    表（70%）      │
├──────────────────┤
│ ポスター（30%）   │
└──────────────────┘
```
- メリット: 同時表示可能
- デメリット: 表示領域が狭くなる

---

### 3.7 管理画面

#### 機能一覧

| 機能 | 説明 |
|------|------|
| 行動予定表管理 | 社員の追加・編集・削除、行動状況の更新 |
| 施工サイクル管理 | 作業項目の追加・編集・削除・並び替え、ステータス更新 |
| 協力業者管理 | 業者の追加・編集・削除・並び替え |
| 月間予定管理 | 年月選択、日付ごとの予定入力・編集・削除 |
| ポスター管理 | ディレクトリ指定、プレビュー、表示順設定 |
| 表示設定 | 切り替えサイクル秒数、各画面の表示/非表示、タッチモード切替 |
| 画面定義管理 | 新規画面の追加（将来拡張用） |

#### アクセス制限
- サイネージ端末（Windows PC）からのみアクセス可能
- 外部ネットワークからのアクセス不可

---

## 4. 汎用性設計（重要）

### 4.1 設計方針

**将来的な画面追加・カラム変更をコード修正なしで対応可能にする**

### 4.2 画面定義ファイル（screen-definitions.yaml）

```yaml
screens:
  - id: "action-schedule"
    name: "行動予定表"
    orientation: "vertical"      # vertical | horizontal
    type: "table"                # table | card | calendar | poster
    autoScale: true              # 項目数に応じた自動スケーリング
    baseRows: 10                 # 基本行数
    touchEnabled: true           # タッチ操作対応
    columns:
      - key: "name"
        label: "氏名"
        type: "text"
        width: "20%"
        required: true
      - key: "destination"
        label: "行先"
        type: "text"
        width: "35%"
        required: true
      - key: "vehicle"
        label: "使用車両"
        type: "text"
        width: "22%"
        required: false
      - key: "returnTime"
        label: "帰社予定"
        type: "time"
        width: "23%"
        required: false

  - id: "construction-cycle"
    name: "施工サイクル表"
    orientation: "vertical"
    type: "table"
    columns:
      - key: "title"
        label: "タイトル"
        type: "text"
        width: "75%"
        required: true
      - key: "status"
        label: "ステータス"
        type: "status"
        width: "25%"
        required: true
        options:
          - value: "complete"
            label: "完了"
            icon: "✓"
            color: "#38a169"
          - value: "progress"
            label: "作業中"
            icon: "◐"
            color: "#d69e2e"
          - value: "pending"
            label: "未着手"
            icon: "○"
            color: "#a0aec0"
          - value: "warning"
            label: "要確認"
            icon: "!"
            color: "#e53e3e"

  # 新規画面追加時はここに定義を追加するだけ
```

### 4.3 新規画面追加の手順

1. `screen-definitions.yaml` に画面定義を追加
2. SQLiteに対応するデータテーブルを作成（マイグレーション）
3. 管理画面から表示サイクルに追加

**コード修正は不要**

---

## 5. データベース設計

### 5.1 テーブル一覧

| テーブル名 | 用途 |
|------------|------|
| employees | 社員マスタ（行動予定表用） |
| action_schedules | 行動予定データ |
| construction_cycles | 施工サイクルデータ |
| contractors | 協力業者データ |
| monthly_events | 月間予定データ |
| posters | ポスター情報 |
| display_settings | 表示設定 |
| screen_definitions | 画面定義（YAML同期用） |

### 5.2 共通カラム

全テーブルに以下のカラムを含める:
```sql
id          INTEGER PRIMARY KEY AUTOINCREMENT,
created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
sort_order  INTEGER DEFAULT 0,
is_visible  BOOLEAN DEFAULT 1
```

### 5.3 主要テーブル定義

```sql
-- 社員マスタ
CREATE TABLE employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  department TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT 1
);

-- 行動予定
CREATE TABLE action_schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL,
  date DATE NOT NULL,
  destination TEXT,
  vehicle TEXT,
  return_time TIME,
  status TEXT DEFAULT 'out', -- in | out
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- 施工サイクル
CREATE TABLE construction_cycles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  status TEXT DEFAULT 'pending', -- complete | progress | pending | warning
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  sort_order INTEGER DEFAULT 0
);

-- 協力業者
CREATE TABLE contractors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date DATE NOT NULL,
  company_name TEXT NOT NULL,
  work_type TEXT,
  worker_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  sort_order INTEGER DEFAULT 0
);

-- 月間予定
CREATE TABLE monthly_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date DATE NOT NULL,
  event_type TEXT, -- important | regular | work | holiday
  content TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 表示設定
CREATE TABLE display_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 初期設定データ
INSERT INTO display_settings (key, value) VALUES
  ('cycle_interval_sec', '10'),
  ('poster_interval_sec', '5'),
  ('touch_mode', 'false'),
  ('poster_display_pattern', 'A'),
  ('poster_directory', ''),
  ('active_screens_vertical', '["action-schedule","construction-cycle"]'),
  ('active_screens_horizontal', '["contractors","monthly-events"]');
```

---

## 6. UI/UX仕様

### 6.1 共通デザインルール

| 項目 | 値 |
|------|------|
| 基本フォント | Noto Sans JP, メイリオ |
| 背景色 | #f7fafc |
| ヘッダー背景 | #2d3748 |
| プライマリカラー | #1a365d |
| アクセントカラー | #3182ce |
| 偶数行背景 | #edf2f7 |
| 奇数行背景 | #ffffff |

### 6.2 タッチモード

タッチモードON時の変更点:
- ボタン最小サイズ: 60px × 120px
- テーブルセルパディング: 28px（通常18px）
- フォントサイズ: 30px（通常26px）
- タップ可能領域の拡大

### 6.3 レスポンシブ対応（スケーリング）

- モニターサイズに応じた自動スケーリング
- 表示項目数に応じたフォントサイズ自動調整
- 長文テキストの省略表示（...）

---

## 7. 表示サイクル仕様

### 7.1 サイクル設定

```yaml
displayCycle:
  vertical:
    interval: 10        # 秒
    screens:
      - "action-schedule"
      - "construction-cycle"
      - "poster"         # ポスターも同一サイクルに組み込み可能
  horizontal:
    interval: 10
    screens:
      - "contractors"
      - "monthly-events"
      - "poster"
  poster:
    interval: 5          # ポスター間の切り替え間隔
```

### 7.2 制約
- 縦置き画面と横置き画面は別サイクルとして管理
- 同一サイクル内で縦横混在は不可

---

## 8. ディレクトリ構成（参考）

```
digital-signage/
├── package.json
├── electron/
│   ├── main.js              # Electronメインプロセス
│   └── preload.js
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── screens/         # サイネージ画面コンポーネント
│   │   │   ├── TableScreen.tsx      # 汎用テーブル画面
│   │   │   ├── CardScreen.tsx       # 汎用カード画面
│   │   │   ├── CalendarScreen.tsx   # カレンダー画面
│   │   │   └── PosterScreen.tsx     # ポスター画面
│   │   ├── admin/           # 管理画面コンポーネント
│   │   └── common/          # 共通コンポーネント
│   ├── hooks/
│   ├── services/
│   │   ├── database.ts      # SQLite操作
│   │   └── screenLoader.ts  # 画面定義読み込み
│   └── styles/
├── config/
│   └── screen-definitions.yaml
├── database/
│   └── signage.db           # SQLiteファイル
├── posters/                  # ポスター画像格納
└── docs/
    └── REQUIREMENTS.md
```

---

## 9. 非機能要件

### 9.1 パフォーマンス
- 画面切り替え: 500ms以内
- 起動時間: 10秒以内
- メモリ使用量: 500MB以下

### 9.2 信頼性
- 24時間365日連続稼働を想定
- エラー発生時は自動復帰（クラッシュ時は自動再起動）
- データベースの定期バックアップ機能

### 9.3 セキュリティ
- インターネット非接続による物理的セキュリティ確保
- ローカルネットワークからのアクセスも原則不可
- ファイルシステムへのアクセスは最小限に制限

### 9.4 保守性
- 画面定義の外部ファイル化による拡張性確保
- ログ出力機能（エラー・操作履歴）
- 設定のエクスポート/インポート機能

---

## 10. 開発スケジュール（参考）

| フェーズ | 期間 | 内容 |
|----------|------|------|
| Phase 1 | 2週間 | 基盤構築（Electron + DB + 設定読み込み） |
| Phase 2 | 2週間 | サイネージ画面5種類の実装 |
| Phase 3 | 2週間 | 管理画面の実装 |
| Phase 4 | 1週間 | 結合テスト・調整 |
| Phase 5 | 1週間 | 納品・導入サポート |

**合計: 約8週間**

---

## 11. 納品物

1. 実行可能ファイル（Windows用 .exe）
2. ソースコード一式
3. 操作マニュアル
4. 設定変更ガイド（画面追加手順含む）

---

## 改訂履歴

| 版 | 日付 | 内容 |
|-----|------|------|
| 1.0 | 2026/02/15 | 初版作成 |
