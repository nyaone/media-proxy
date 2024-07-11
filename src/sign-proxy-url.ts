import { createHmac, timingSafeEqual } from 'node:crypto';

export function verifySignedProxyURL(signedURLString: string, signatureKey: string): boolean {
  const workingURL = new URL(signedURLString);

  // 提取签名参数
  const sig = workingURL.searchParams.get('sig');
  if (sig === null) {
    // 缺失签名
    return false;
  }

  // 去掉签名参数
  workingURL.searchParams.delete('sig');

  // 提取过期时间
  const exp = workingURL.searchParams.get('exp');
  if (exp === null) {
    // 缺失过期时间
    return false;
  }
  // 检查是否已过期
  const expEpochSec = parseInt(exp);
  if (expEpochSec > Date.now() / 1000) {
    // 无效的时间，或者已经超时
    return false;
  }

  // 检查是否有 static 参数：因为前端可能会追加这个参数，为避免参数影响，要把它删除掉。
  if (workingURL.searchParams.has('static')) {
    workingURL.searchParams.delete('static');
  }

  // 排序查询字符串
  workingURL.searchParams.sort();

  // 生成正确的签名用来对照
  const sigCorrect = createHmac('sha256', signatureKey).
  update(workingURL.toString()).digest('hex');

  // 检查签名是否匹配
  if (!timingSafeEqual(Buffer.from(sigCorrect), Buffer.from(sig))) {
    // 不匹配
    return false;
  }

  // 验证通过
  return true;
}
