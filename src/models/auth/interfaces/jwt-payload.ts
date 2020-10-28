export interface JwtPayload {
  nbf?: string; // 生效时间
  sub?: string; // 主题
  iat?: number; // 签发时间
  exp?: number; // 到期時間
  jti?: string; // 编号，唯一標識符; 可用於防止JWT被重放（允許令牌僅使用一次）
}
