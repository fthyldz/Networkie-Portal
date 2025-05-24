export class DateUtils {
  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}