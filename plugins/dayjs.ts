import dayjs from "dayjs";
import "dayjs/locale/id";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";

dayjs.locale("id");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekday);

const currentTimeZone = dayjs.tz.guess();

export { currentTimeZone, dayjs };
