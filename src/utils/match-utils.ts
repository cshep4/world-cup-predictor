export default class MatchUtils {
  static convertUTCDateToLocalDate(date) {
    let newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

    const offset = date.getTimezoneOffset() / 60;
    const hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;
  }

  static compareDate(a, b) {
    if (a.dateTime < b.dateTime)
      return -1;
    if (a.dateTime > b.dateTime)
      return 1;
    return 0;
  }
}
