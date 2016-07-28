declare function require(name:string);
const moment = require('moment');
const locale = require('moment/locale/pt-br');

moment.locale('pt-br');

export default moment;
