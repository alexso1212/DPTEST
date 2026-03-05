export interface TierData {
  level: number;
  name: string;
  english: string;
  badge: string;
  criteria: string;
}

export const TIER_DATA: TierData[] = [
  { level: 1, name: "学徒", english: "APPRENTICE", badge: "I", criteria: "完成交易人格测评" },
  { level: 2, name: "交易者", english: "TRADER", badge: "II", criteria: "累计登录 7 天" },
  { level: 3, name: "精英", english: "ELITE", badge: "III", criteria: "累计登录 21 天" },
  { level: 4, name: "职业操盘手", english: "PROFESSIONAL", badge: "IV", criteria: "累计登录 60 天 或 会员积分" },
];
