FROM node:24.12.0-alpine

WORKDIR /app

# テスト実行を制御するビルド引数（デフォルト: 実行する）
ARG RUN_TESTS_ON_BUILD=true
ENV RUN_TESTS_ON_BUILD=${RUN_TESTS_ON_BUILD}

# 依存をインストール（npm ci はプラットフォーム別 optional deps 差分で失敗するため npm install を使用）
COPY package*.json ./
# Use legacy-peer-deps to avoid ERESOLVE failures in environments with strict peer deps
RUN npm install --legacy-peer-deps || npm install --force

# ソースを配置
COPY . .

# ビルド時に型チェックとユニット/コンポーネントテストを実行（オプション）
RUN if [ "$RUN_TESTS_ON_BUILD" = "true" ]; then npm run lint && npm test; else echo "Skipping tests during build"; fi

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
