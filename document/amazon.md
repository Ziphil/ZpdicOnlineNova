## 環境構築

### AWS に登録
まず、[AWS](https://aws.amazon.com/) のアカウントを作成してログインします。
マネジメントコンソールページから様々なサービスの設定ができます。

### EC2 インスタンスの作成
ページ上部の「サービス」から「EC2」を選び、左のメニューから「インスタンス」を選択してインスタンス一覧を表示させます。
「インスタンスの作成」をクリックして、以下の手順で操作を進めます。
なお、各ページでは (最後のステップを除いて)「確認と作成」ではなく「次のステップ」をクリックしてください。

- Amazon マシンイメージ:「Amazon Linux 2 AMI (HVM)」の 64 ビットを選択
- インスタンスタイプ:「t2.micro」を選択
- インスタンスの詳細設定: 何も変更せずに次へ
- ストレージの追加: 何も変更せずに次へ
- タグの追加: 何も変更せずに次へ
- セキュリティグループの設定:「追加」を 2 回行い追加されたルールのタイプをそれぞれ「HTTP」と「HTTPS」に変更

これを終えるとこれまでの設定項目の確認画面になるので、内容を確認して「起動」をクリックします。
最後にプライベートキーの設定画面が出るので、「新しいキーペアの作成」を選んで名前を入力し、「キーペアのダウンロード」をクリックします。
.pem ファイルがダウンロードされるので、厳重に保管します。

### PuTTY のインストール
EC2 インスタンスに SSH で接続するため、[PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/) をインストールします。
インストール後の設定は[このページ](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/putty.html)を参考にしてください (投げやり)。
最終的に、PuTTY のコンソールで EC2 インスタンスに接続できていれば問題ありません。

### EC2 インスタンスの環境設定
PuTTY のコンソールから EC2 インスタンスの環境構築を行います。
まず、yum 経由で C++ コンパイラと Git をダウンロードします。
```
sudo yum update
sudo yum -y install gcc-c++
sudo yum -y install git
```
次に、Git 経由で nvm をダウンロードします。
```
git clone https://github.com/creationix/nvm.git ~/.nvm
source ~/.nvm/nvm.sh
```
nvm のパスを設定するため、vim などのテキストエディタで `.bash_profile` を開き、末尾に以下を追加します。
```
if [[-s ~/.nvm/nvm.sh]]; then
  source ~/.nvm/nvm.sh;
fi
```
nvm を用いて最新版の Node.js をインストールします。
```
nvm install --lts
nvm use --lts
```
最後に、アプリをデーモン化して実行するために、npm のライブラリをインストールしておきます。
```
npm install -g forever
```

### nginx の設定
なんもわからん。

### アプリケーションの起動
Git 経由でこのリポジトリをダウンロードし、Node リポジトリとして初期化します。
依存ライブラリのダウンロードが終わると、自動的にアプリケーションがビルドされます。
```
git clone https://github.com/Ziphil/ZpdicOnlineNova.git
cd ZpdicOnlineNova
npm install
```
デーモンとして起動します。
```
forever start -c "npm start" ./
```

### Route 53 によるドメイン設定
まだやってません。

## 参考文献
以下のページを参考にしました。

- [EC2 で Node アプリを公開する方法](https://qiita.com/yujiro0102/items/0bc30ab0a73de62c4e2d)
- [Windows から Linux インスタンスに接続する方法](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/putty.html)