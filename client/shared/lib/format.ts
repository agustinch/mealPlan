import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// by providing a default string of 'PP' or any of its variants for `formatStr`
// it will format dates in whichever way is appropriate to the locale
export default function (date: Date, formatStr = 'PP') {
  return format(date, formatStr, {
    locale: es, // or global.__localeId__
  });
}
