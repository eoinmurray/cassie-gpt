import chalk from 'chalk'

export const logging = {
  // 0: only info logs
  // 1: debug logs
  // 2: extensive debug logs
  green: chalk.green,
  red: chalk.red,

  level: parseInt(process.env.DEBUG || "0"),

  logEvent: function stamp({ event = 'STAMP', data, omit = [] }: { data: any, event: string, omit?: string[] }, level: number = 1) {
    // hide some keys unless debug 2
    if (level > logging.level) return
    function recursivelyHideKeys(obj: any, omit: string[]) {
      if (typeof obj !== 'object') {
        return obj;
      }
      const copy: any = Array.isArray(obj) ? [] : {};
      for (let key in obj) {
        if (omit.includes(key)) {
          copy[key] = "hidden because not on debug 2";
        } else {
          copy[key] = recursivelyHideKeys(obj[key], omit);
        }
      }
      
      return copy;
    }
    
    let copy: any = recursivelyHideKeys(data, omit);

    const recursivePrint = (copy: any, indent: string = '') => {
      for (const key of Object.keys(copy)) {
        if (Array.isArray(copy[key])) {
          logging.log(`||   ${key}: [`)
          for (const item of copy[key]) {
            logging.log(`||     "${item}",`)
          }
          logging.log(`||   ]`)
        } else if (typeof copy[key] === 'object') {
          logging.log(`||   ${key}: {`)
          if (copy[key]) {
            recursivePrint(copy[key], indent + '  ')
          } else {
            logging.log(`||   ${key}: null`)
          }
          logging.log(`||   }`)
        } else {
          logging.log(`||   ${key}: ${copy[key]}`)
        }
      }  
    }

    const fullLabel1 = `========== ${event} `.padEnd(50, '=')
    const fullLabel2 = `========== END_${event} `.padEnd(50, '=')
    logging.log(`\n${fullLabel1}`)
    logging.log(`|| {`)

    recursivePrint(copy)

    // for (const key of Object.keys(copy)) {
    //   logging.log(`||   ${key}: ${copy[key]}`)
    // }
    logging.log(`|| }`)
    logging.log(`${fullLabel2}\n`)
  },

  stdout: function stdout(arg: string) {
    return process.stdout.write(arg);
  },

  trace(...args: any) {
    console.trace(args || 'trace')
  },

  log: function log(args: any, level: number = 0) {
    if (level > logging.level) return

    if (typeof args[0] === 'object') return console.log(args[0])
    console.log(args)
  },

  error: function (error: any) {
    console.error(error)
  }
}