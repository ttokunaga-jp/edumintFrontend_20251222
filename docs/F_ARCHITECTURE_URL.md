# 開発ドキュメント：ハイブリッドURL設計（ID + Mutable Slug）実装仕様

## 1. アーキテクチャ概要とURL戦略

### URL構造
```text
https://example.com/posts/{content_id}/{slug}
```
*   **content_id**: 11文字のランダム文字列（不変・ユニーク・主キー）。
*   **slug**: コンテンツタイトルに基づいた文字列（可変・SEO用・ルーティングには**使用しない**）。

### 挙動の定義（Stack Overflow方式）
1.  **正常系:** `/posts/dQw4w9WgXcQ/how-to-code-golang` にアクセス → **200 OK**
2.  **スラグ未指定:** `/posts/dQw4w9WgXcQ` にアクセス → 正しいURLへ **301 Redirect**
3.  **古いスラグ:** `/posts/dQw4w9WgXcQ/old-title` にアクセス → 正しいURLへ **301 Redirect**
4.  **ID不正:** `/posts/wrongid/whatever` → **404 Not Found**

---

## 2. Database (SQL) 設計

IDを生成するアプリケーション側でユニーク性を担保しますが、DBレベルでも衝突を防ぎます。

```sql
CREATE TABLE posts (
    -- YouTube方式: 11文字のURLセーフな文字列
    id VARCHAR(11) PRIMARY KEY,
    
    -- SEO用スラグ: 日本語も考慮して長めに確保
    slug VARCHAR(255) NOT NULL,
    
    title TEXT NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックス設計
-- idは主キーなので自動でインデックスがかかる
-- slugでの検索は行わないため、slugへのインデックスは必須ではない
```

---

## 3. Backend Microservice (Golang) 実装

Go言語による「Content Service」の実装です。ここでは**NanoID**または**Crypto/Rand**を用いてIDを生成します。

### 3.1. ID生成ロジック (utils/id_generator.go)
YouTubeと同じ「URLセーフなBase64文字セット」を使用する11文字生成器です。

```go
package utils

import (
	"crypto/rand"
	"math/big"
)

// YouTubeで使用される記号を含む文字セット
const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_"

// GenerateID returns a secure random string of length n
func GenerateID(n int) (string, error) {
	b := make([]byte, n)
	for i := range b {
		num, err := rand.Int(rand.Reader, big.NewInt(int64(len(charset))))
		if err != nil {
			return "", err
		}
		b[i] = charset[num.Int64()]
	}
	return string(b), nil
}
```

### 3.2. 投稿作成 (Create Post)
IDを生成し、DBに保存します。衝突時のリトライ処理を含めます。

```go
func (s *Service) CreatePost(ctx context.Context, title string, content string) (*Post, error) {
    // 日本語タイトルをスラグ化 (例: "Go言語入門" -> "go-gengo-nyumon" またはそのままURLエンコード)
    // ライブラリ例: github.com/gosimple/slug
    slug := slugify.Make(title) 

    var post Post
    var err error
    
    // ID衝突対策（極めて稀だが念のためリトライループ）
    for i := 0; i < 5; i++ {
        id, _ := utils.GenerateID(11) // 11文字
        post = Post{
            ID:      id,
            Title:   title,
            Slug:    slug,
            Content: content,
        }
        
        err = s.repo.Create(ctx, &post)
        if err == nil {
            break // 成功
        }
        // Duplicate entryエラーならループ継続
    }
    
    if err != nil {
        return nil, err
    }
    return &post, nil
}
```

### 3.3. 投稿取得API (Get Post)
**ここが重要です。** APIは単にデータを返すだけでなく、**「現在の正しいスラグ」**をレスポンスに含める必要があります。

*   **Endpoint:** `GET /api/v1/posts/{id}`
    *   注意: パスに `slug` は含めず、`id` だけで特定します。

**Response JSON:**
```json
{
  "id": "dQw4w9WgXcQ",
  "title": "Go言語の実装方法",
  "slug": "how-to-implement-go", // 現在の最新スラグ
  "content": "...",
  "canonical_url": "/posts/dQw4w9WgXcQ/how-to-implement-go" // フロントでの判断用
}
```

---

## 4. edumintGateway (Node.js) 実装

Gatewayはリクエストを受け取り、適切なバックエンドへルーティングします。URLの検証ロジックをここに持たせるか、フロントエンドに任せるかで設計が分かれますが、**SEOを最大化するため（Google botへの正しい指示）には、SSR（Server Side Rendering）層またはBFF層での処理が理想**です。

ここでは、APIへのプロキシ設定を行います。

```javascript
// routes/posts.js (Express/Fastify example)

// URLパターン: /posts/:id (スラグなし) または /posts/:id/:slug (スラグあり)
// どちらも同じバックエンドAPI (GET /posts/:id) を呼び出す
app.get('/posts/:id/:slug?', async (req, res) => {
    const { id } = req.params;
    
    // Content Serviceへリクエスト
    const response = await contentService.getPost(id);
    
    if (!response) {
        return res.status(404).send('Not Found');
    }

    // SSR（サーバーサイドレンダリング）を行っている場合のリダイレクト処理
    // クライアントサイドレンダリング(CSR)のみの場合は、このロジックはReact側で行う
    const correctSlug = response.slug;
    const currentSlug = req.params.slug;

    // スラグが異なる、またはスラグがない場合
    if (currentSlug !== correctSlug) {
        // 301 Redirect (Permanent)
        // これによりSEO評価が正しいURLに集約される
        return res.redirect(301, `/posts/${id}/${correctSlug}`);
    }

    // 正しい場合はレンダリングまたはJSONを返す
    return res.render('post', { data: response });
});
```

---

## 5. Frontend (TypeScript + React) 実装

SPA（Single Page Application）として動作する場合、ブラウザ側でURLの整合性をチェックし、必要に応じてURLを書き換える（History API）処理が必要です。

### カスタムフック: `useCanonicalUrl`

```typescript
import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

interface PostData {
  id: string;
  slug: string;
  // ...
}

export const useCanonicalUrl = (data: PostData | null, isLoading: boolean) => {
  const { id, slug: currentSlug } = useParams<{ id: string; slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading || !data) return;

    // APIから返ってきた「真のSlug」
    const correctSlug = data.slug;

    // URL上のSlugと、真のSlugが食い違っている場合
    if (currentSlug !== correctSlug) {
      const correctPath = `/posts/${data.id}/${correctSlug}`;
      
      // replace: true にすることで、履歴に残さずURLだけ修正する
      // これにより「戻る」ボタンの挙動が壊れない
      navigate(correctPath, { replace: true });
      
      // 注意: SPAの場合、これでアドレスバーは変わるが、
      // Google Botに対して「301」を伝えるにはSSRまたはmetaタグが必要
    }
  }, [data, isLoading, currentSlug, navigate]);
};
```

### コンポーネント実装例

```tsx
import { useQuery } from '@tanstack/react-query';
import { useCanonicalUrl } from './useCanonicalUrl';

export const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  
  // 1. IDを使ってデータを取得（SlugはAPIパラメータに不要）
  const { data, isLoading, error } = useQuery(['post', id], () => fetchPost(id));

  // 2. URL補正ロジックを実行
  useCanonicalUrl(data, isLoading);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;

  return (
    <article>
      {/* SEO用: Canonicalタグを動的に挿入 (React Helmet等を使用) */}
      <Helmet>
        <link rel="canonical" href={`https://example.com/posts/${data.id}/${data.slug}`} />
        <title>{data.title}</title>
      </Helmet>

      <h1>{data.title}</h1>
      <div>{data.content}</div>
    </article>
  );
};
```

---

## 6. まとめ：データフローの全体像

ユーザーが「古いURL (`/posts/dQw4.../old-title`)」にアクセスした場合のフローです。

1.  **Frontend/Gateway**:
    *   URLからID `dQw4...` を抽出する。
    *   バックエンドAPI `GET /posts/dQw4...` を叩く。
2.  **Backend (Go)**:
    *   DBからIDで検索する（高速）。
    *   最新データ `{ id: "dQw4...", slug: "new-title" }` を返す。
3.  **Frontend/Gateway (判定)**:
    *   アクセスしたURLの `old-title` と、APIから来た `new-title` を比較。
    *   **不一致を検知。**
4.  **Action**:
    *   **SSR/Gatewayの場合:** レスポンスヘッダに `Location: /posts/dQw4.../new-title` と `Status: 301` をセットして即座に返す。
    *   **SPAの場合:** 画面を描画しつつ、`history.replaceState` でアドレスバーを `new-title` に書き換える。同時に `<link rel="canonical">` に新しいURLをセットする。

### この設計のメリット
*   **堅牢性:** YouTube方式のIDにより、スクレイピングや推測攻撃を防止。
*   **SEO:** キーワードを含んだURL構造を実現し、変更時も301リダイレクトで評価を引き継ぐ。
*   **整合性:** タイトル（スラグ）を何度変更しても、IDが変わらないためリンク切れが起きない。



検索機能（ファセット検索）のURL設計をまとめました。
将来の拡張（いいね済み、履歴など）を見越した、**RESTfulかつ拡張性の高い設計**です。

---

# 検索・フィルタリング URL設計仕様書

基本方針：
1.  **単一エンドポイント:** 全ての検索・絞り込みは `/exams` ページで行う。
2.  **クエリパラメータ:** 絞り込み条件はすべて `?key=value` 形式で管理する。
3.  **状態の共有:** URLをコピーすれば、誰でも「同じ検索結果」が見られるようにする（ログインが必要なフィルタを除く）。

## 1. URL構造の定義

**ベースURL:**
```text
https://example.com/exams
```

**完全なURL例:**
```text
https://example.com/exams?q=積分&subject_id=5&year=2024&filter=my_posts&sort=newest&page=2
```

### パラメータ一覧

| パラメータキー | 必須 | 値の例 | 説明 |
| :--- | :---: | :--- | :--- |
| **`q`** | 任意 | `積分`, `微分` | **キーワード検索** (Query)。タイトルや問題文を対象。 |
| **`filter`** | 任意 | `all` (default)<br>`my_posts`<br>`liked`<br>`history` | **表示スコープ**。<br>`my_posts`: 自分の投稿（非公開含む）<br>`liked`: いいね済み（将来）<br>`history`: 閲覧履歴（将来） |
| **`subject_id`** | 任意 | `1`, `5` | 科目IDでの絞り込み。 |
| **`university_id`** | 任意 | `10` | 大学IDでの絞り込み。 |
| **`year`** | 任意 | `2024` | 出題年度。 |
| **`major`** | 任意 | `0` (理系), `1` (文系) | 文理区分。 |
| **`sort`** | 任意 | `newest` (default)<br>`popular`<br>`oldest` | 並び順。<br>`popular` は閲覧数やいいね数順。 |
| **`page`** | 任意 | `1`, `2`... | ページネーション番号。 |

---

## 2. 具体的なユースケースとURL

### ① 通常の検索（誰でも利用可能）
「2024年の数学」を探す場合。
```text
/exams?year=2024&subject_id=5
```

### ② 自分の投稿を確認（今回の要件）
ログインユーザーが、自分の投稿した問題（公開・非公開問わず）を一覧表示する場合。
```text
/exams?filter=my_posts
```
*   **複合検索も可能:** 「自分が投稿した」×「数学」の問題を探す
    *   `/exams?filter=my_posts&subject_id=5`

### ③ 自分専用リスト（将来の拡張）
自分が「いいね」した問題の中から、「東京大学」の問題だけを探す場合。
```text
/exams?filter=liked&university_id=1
```

---

## 3. 実装ロジック要件

### フロントエンド (React)
URLとUIコンポーネントを同期させます。

*   **状態管理:** `useState` ではなく、React Router の `useSearchParams` を「真実のソース（Source of Truth）」として扱います。
*   **挙動:** 「自分の投稿」チェックボックスをONにしたら、stateを変えるのではなく、`setSearchParams({ filter: 'my_posts' })` を実行してURLを書き換えます。

### バックエンド (Golang)
`filter` パラメータの値によって、`WHERE` 句の条件と権限チェックを分岐させます。

| `filter`の値 | 権限チェック | 取得条件 (SQLイメージ) | 備考 |
| :--- | :--- | :--- | :--- |
| (なし) or `all` | 不要 | `WHERE is_public = true AND status = 'active'` | 通常の公開一覧 |
| **`my_posts`** | **必須** | `WHERE user_id = {me} AND status != 'deleted'` | **非公開(下書き)も表示する** |
| `liked` | **必須** | `INNER JOIN exam_likes ... WHERE likes.user_id = {me}` | 公開されているもの限定 |
| `history` | **必須** | `INNER JOIN histories ... WHERE histories.user_id = {me}` | 公開されているもの限定 |

---

## 4. SEOへの配慮（補足）

検索結果ページは、パラメータの組み合わせで無限にURLが生成されてしまうため、Google等の検索エンジンに対しては以下の制御を行うのがベストプラクティスです。

1.  **Canonicalタグ:**
    パラメータ付きのURLであっても、コンテンツが重複する場合は正規URLを示す。
    *   基本的には `/exams` をcanonicalとするか、パラメータを整理して指定する。

2.  **Noindexの活用:**
    「個人のフィルタ結果」は検索エンジンにインデックスさせるべきではありません。
    *   **`filter=my_posts` や `filter=liked` が付いている場合:**
        `<meta name="robots" content="noindex">` を出力する。
    *   これは、個人情報保護およびクロールバジェットの節約のために重要です。