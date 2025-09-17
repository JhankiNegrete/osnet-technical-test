export const REGEX_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_\W]).{6,}$/gm;

export const REGEX_NAME =
  /^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1 ]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$/gm;

export const REGEX_NAMES_GENERAL =
  /^[\w\d\s()\-_"#%&!¿?|°áéíóúÁÉÍÓÚüÜñÑ.,]+$/gm;

export const REGEX_NAME_SPECIALS =
  /^[\w\d\s()\-_"#%&!¿?|°áéíóúÁÉÍÓÚüÜñÑ.,/]+$/gm;

export const REGEX_MAIL = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/gm;

export const REGEX_USERNAME = /^[\w\d@.-]+$/gm;

export const REGEX_NUMBER = /^\d+(\.\d+)?$/gm;

export const REGEX_PERFORMANCE_EVALUATION = /^\d+(\.\d+)?\s*-\s*\d+$/gm;

export const REGEX_NINEBOX = /^[A-ZÁÉÍÓÚÑ\s]+ \([A-Z\s]+\)$/gm;

export const REGEX_CENTRO_COSTO = /^\d+[A-Z]{3}\s+[A-Z]{4}$/gm;
