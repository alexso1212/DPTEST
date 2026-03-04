export interface TierData {
  level: number;
  name: string;
  english: string;
  badge: string;
  criteria: string;
}

export const TIER_DATA: TierData[] = [
  { level: 1, name: "学徒", english: "APPRENTICE", badge: "I", criteria: "完成交易人格测评" },
  { level: 2, name: "交易者", english: "TRADER", badge: "II", criteria: "转发1封PropFirm考核邮件 或 经纪商出金邮件" },
  { level: 3, name: "精英", english: "ELITE", badge: "III", criteria: "累计出金邮件达 $10,000+" },
  { level: 4, name: "职业操盘手", english: "PROFESSIONAL", badge: "IV", criteria: "累计出金 $100,000+ 或 官方合作认证" },
];
