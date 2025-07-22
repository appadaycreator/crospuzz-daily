# CrosPuzz - 毎日のクロスワードパズル

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/appadaycreator/crospuzz-daily)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-Ready-orange.svg)](https://web.dev/progressive-web-apps/)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-brightgreen.svg)](https://www.w3.org/WAI/WCAG21/AA/)

## 📖 概要

CrosPuzzは、毎日更新される脳トレクロスワードパズルのWebアプリケーションです。日本語・英語対応で、初級から上級まで難易度選択が可能です。

## ✨ 主な機能

### 🎮 ゲーム機能
- **日次パズル**: 毎日新しいクロスワードパズル
- **難易度選択**: 初級・中級・上級
- **リアルタイム進捗**: 入力済みマスの表示
- **タイマー機能**: 経過時間の記録
- **ヒントシステム**: 3回まで使用可能
- **リセット**: 入力内容のみをクリア
- **初期化**: ゲーム状態・設定・ローカルストレージを完全初期化

### 🎨 UI/UX機能
- **レスポンシブデザイン**: デスクトップ・タブレット・スマートフォン対応
- **ダークモード**: 目に優しいダークテーマ
- **多言語対応**: 日本語・英語切り替え
- **フォントサイズ調整**: 5段階のサイズ変更
- **アクセシビリティ**: WCAG 2.1 AA準拠

### 📱 PWA機能
- **オフライン対応**: Service Workerによるキャッシュ
- **ホーム画面追加**: ネイティブアプリのような体験
- **プッシュ通知**: 新しいパズルのお知らせ
- **バックグラウンド同期**: オフライン時のデータ同期

### 💾 データ管理
- **ローカルストレージ**: ゲーム状態の自動保存
- **設定保存**: 言語・テーマ・フォントサイズ
- **進捗管理**: 入力済みデータの復元

## 🚀 技術スタック

### フロントエンド
- **HTML5**: セマンティックマークアップ
- **CSS3**: Tailwind CSS + カスタムスタイル
- **JavaScript (ES6+)**: モダンなJavaScript機能
- **PWA**: Service Worker, Manifest, オフライン対応

### ライブラリ・フレームワーク
- **Tailwind CSS**: ユーティリティファーストCSS
- **Font Awesome**: アイコンライブラリ
- **Google Fonts**: Noto Sans JP, Inter

### 開発ツール
- **ESLint**: コード品質管理
- **Prettier**: コードフォーマット
- **Jest**: テストフレームワーク

## 📁 プロジェクト構造

```
crospuzz-daily/
├── index.html              # メインHTMLファイル
├── assets/
│   ├── css/
│   │   └── styles.css      # カスタムスタイル
│   ├── js/
│   │   └── app.js          # メインJavaScript
│   └── images/             # 画像ファイル
├── static/
│   └── puzzles/
│       └── daily-puzzle.json # パズルデータ
├── tests/
│   └── test-app.js         # テストファイル
├── docs/                   # ドキュメント
├── sw.js                   # Service Worker
├── README.md               # このファイル
├── SPEC.md                 # 仕様書
└── LICENSE                 # ライセンス
```

## 🛠️ セットアップ

### 前提条件
- Node.js 16.0以上
- npm または yarn

### インストール

1. リポジトリをクローン
```bash
git clone https://github.com/appadaycreator/crospuzz-daily.git
cd crospuzz-daily
```

2. 依存関係をインストール（必要な場合）
```bash
npm install
```

3. ローカルサーバーを起動
```bash
# Python 3の場合
python3 -m http.server 8004

# Node.jsの場合
npx serve -p 8004
```

4. ブラウザでアクセス
```
http://localhost:8004
```

## 🧪 テスト

### テストの実行
```bash
# ブラウザでテストを実行
open tests/test-app.html
```

### テストカバレッジ
- ゲーム初期化
- パズルデータ構造
- 翻訳機能
- 設定管理
- 進捗計算
- タイマー機能
- ヒントシステム
- 言語切り替え
- ダークモード切り替え
- フォントサイズ機能
- モバイルメニュー
- ゲーム状態管理

## 📱 PWA機能

### インストール方法
1. ブラウザでアプリにアクセス
2. アドレスバーのインストールアイコンをクリック
3. 「インストール」を選択

### オフライン機能
- Service Workerによるキャッシュ
- オフライン時のゲーム継続
- オンライン復帰時の同期

## ♿ アクセシビリティ

### 対応機能
- **キーボードナビゲーション**: 全機能をキーボードで操作可能
- **スクリーンリーダー対応**: ARIA属性の適切な使用
- **高コントラストモード**: システム設定に応じた表示
- **フォントサイズ調整**: 5段階のサイズ変更
- **色覚異常対応**: 色だけでなく形でも情報を伝達

### WCAG 2.1 AA準拠
- 適切なコントラスト比
- フォーカス表示の改善
- 代替テキストの提供
- キーボード操作の完全対応

## 🌐 多言語対応

### 対応言語
- **日本語**: メイン言語
- **英語**: 国際化対応

### 翻訳キー
- ナビゲーション
- ゲーム要素
- メッセージ
- 設定項目

## 📊 パフォーマンス

### 最適化
- **画像最適化**: WebP形式の使用
- **CSS/JS圧縮**: ファイルサイズの最小化
- **キャッシュ戦略**: 効率的なキャッシュ設定
- **遅延読み込み**: 必要に応じたリソース読み込み

### 測定指標
- **First Contentful Paint (FCP)**: < 1.5秒
- **Largest Contentful Paint (LCP)**: < 2.5秒
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

## 🔧 開発

### 開発環境のセットアップ
```bash
# 開発用サーバー起動
npm run dev

# テスト実行
npm test

# ビルド
npm run build
```

### コード規約
- **ESLint**: JavaScriptコード品質
- **Prettier**: コードフォーマット
- **Conventional Commits**: コミットメッセージ規約

### ブランチ戦略
- `main`: 本番環境
- `develop`: 開発環境
- `feature/*`: 機能開発
- `hotfix/*`: 緊急修正

## 📈 分析・監視

### Google Analytics
- ページビュー追跡
- イベント追跡
- ユーザー行動分析

### エラー監視
- コンソールエラーの記録
- パフォーマンス監視
- ユーザー体験の追跡

## 🤝 コントリビューション

### 貢献方法
1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

### 開発ガイドライン
- コードレビューの必須化
- テストの追加
- ドキュメントの更新
- アクセシビリティの考慮

## 📄 ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。

## 🙏 謝辞

- **Tailwind CSS**: 美しいUIフレームワーク
- **Font Awesome**: 豊富なアイコンライブラリ
- **Google Fonts**: 高品質なフォント
- **PWA**: モダンなWebアプリケーション技術

## 📞 サポート

### お問い合わせ
- **GitHub Issues**: バグ報告・機能要望
- **Email**: support@crospuzz.com
- **Twitter**: [@CrosPuzz](https://twitter.com/CrosPuzz)

### よくある質問
- [FAQ](docs/FAQ.md)
- [トラブルシューティング](docs/TROUBLESHOOTING.md)
- [更新履歴](docs/CHANGELOG.md)

---

**CrosPuzz** - 毎日の脳トレクロスワードパズル 🧩

*Made with ❤️ by AppAdayCreator*