export function generateVerifyCode(phone: string | undefined, traderTypeName: string): string {
  if (phone && phone.length >= 4) {
    const tail = phone.slice(-4);
    return `【${tail}·${traderTypeName}】`;
  }
  return `【${traderTypeName}】`;
}
