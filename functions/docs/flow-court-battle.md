# AI court battle flow

```mermaid
graph TD
    A["rooms/{roomId}の変更検知"] --> B{原告と被告の主張終了直後？}
    B -- YES --> C{裁判フローの実行}
    C --> D[裁判官による訴えの確認]
    D --> E[裁判官: 原告側、いかがですか？]
    E --> F[原告の冒頭記述]
    F --> G[裁判官: 被告側、いかがですか？]
    G --> H[被告の冒頭記述]
    H --> I[裁判官が争点を整理]
    I --> J{主張に対して、原告への質問、立証を促す}
    J --> K[原告側の主張、立証]
    K --> L{主張に対して、被告側へ主張、立証を促す}
    L --> M[被告側の主張、立証]
    M --n回繰り返す--> J
    J --議論の終了--> N[最終弁論]
    N --> O[裁判官は最終判決を下す]
    O --> P[原告と被告にメール通知]
    P --> Q[Room status を completed にする]
```

## judgement content
```md
- 結果: 原告の勝訴/敗訴
- 主文
    - e.g. 「{被告}」は「{原告}」に対して、{裁判内容}について{判決内容}。
- 判決理由(3つ)
- 再審になった場合の原告へのアドバイスやtodo
- 再審になった場合の被告へのアドバイスやtodo
```