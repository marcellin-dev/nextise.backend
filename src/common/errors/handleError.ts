/* eslint-disable prettier/prettier */

import { errorMessages } from "./errorList";


export function ResolveError(code: string) {
  return {
    code,
    message: errorMessages[code],
  };
}
