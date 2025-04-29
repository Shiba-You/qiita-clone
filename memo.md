## TODO
1. Dockerに立てたnginx経由でコンテンツ配信ができるか確認
2. そのnginxに対して、Jmeterでテストを行う
   1. 帯域を調べられるのかという観点でも試したい
   2. 理想はtube ossをcloneしてやってみたい


## やりたいこと
- アプリ
  - 記事執筆（markdownの表示をwasmで実装）
  - 執筆記事をbedrockで要約（クローズドな環境）
  - mcpも使いたい（ソースはどこでもいいかも、lambdaにサーバを立てる？）
- 基盤
  - 今回使っている基盤をCLI（teraform）
  - ECS化