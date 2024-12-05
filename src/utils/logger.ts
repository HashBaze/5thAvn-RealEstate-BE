import log4js from "log4js";

log4js.configure({
  appenders: {
    stdout: { type: "stdout" }, 
    dateFile: {
      type: "dateFile",               
      filename: "logs/RealEstate_BE.log",
      pattern: "yyyy-MM-dd",         
      compress: true,                
      keepFileExt: true,            
      daysToKeep: 30           
    }
  },
  categories: {
    default: { appenders: ["stdout", "dateFile"], level: "debug" }
  }
});


export const logger = log4js.getLogger();