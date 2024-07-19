export function getTimestampInSeconds(): number {
  return Math.round(Date.now() / 1000);
}
