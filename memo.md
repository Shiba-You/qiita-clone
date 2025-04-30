## TODO
- terraform で作成した基盤にそのままコンテナを乗っけてアプリを起動したい
- EC2上で `. ./run_prod.sh` を実行するとpermission denyになる（原因不明・調査必要）

## やりたいこと
- アプリ
  - 記事執筆（markdownの表示をwasmで実装）
  - 執筆記事をbedrockで要約（クローズドな環境）
  - mcpも使いたい（ソースはどこでもいいかも、lambdaにサーバを立てる？）
- 基盤
  - ECS化
- 品質
  1. そのnginxに対して、Jmeterでテストを行う
  2. 帯域を調べられるのかという観点でも試したい
  3. 理想はtube ossをcloneしてやってみたい