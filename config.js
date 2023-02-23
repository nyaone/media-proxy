import repo from './package.json' assert { type: 'json' };
import config from './config.json' assert { type: 'json' };

export default {
    // UA
    userAgent: `MisskeyMediaProxy/${repo.version}~nya`,

    // プライベートネットワークでも許可するIP CIDR（default.ymlと同じ）
    allowedPrivateNetworks: [],

    // ダウンロードするファイルの最大サイズ (bytes)
    maxSize: 262144000,

    // CORS
    // WARN:
    //    'Access-Control-Allow-Origin'を'*'に設定した場合、要求のOriginヘッダーを応答します。
    //    （Misskeyのアバタークロップに必要なため）
    //    Varyヘッダーが付加されるため、同じURLでもOriginごとに画像が生成されてしまうはずです。
    ['Access-Control-Allow-Origin']: '*',
    ['Access-Control-Allow-Headers']: '*',

    // CSP
    ['Content-Security-Policy']: `default-src 'none'; img-src 'self'; media-src 'self'; style-src 'unsafe-inline'`,

    // フォワードプロキシ
    // proxy: 'http://127.0.0.1:3128'
    ...config,
}
