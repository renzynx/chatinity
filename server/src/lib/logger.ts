import { blue, green, red, yellow, bold, dim } from "colorette";

export class Logger {
  constructor(private readonly context: string) {}

  public getTime() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const pad = (n: number) => (n < 10 ? `0${n}` : n);
    return `${pad(day)}/${pad(month)}/${year} ${pad(hour)}:${pad(minute)}:${pad(
      second
    )}`;
  }

  info(...args: any[]) {
    console.info(
      `${green(this.getTime())} [${blue(this.context)}] ${bold(
        ...(args as [string])
      )}`
    );
  }

  warn(...args: any[]) {
    console.warn(
      `${green(this.getTime())} [${yellow(this.context)}] ${bold(
        ...(args as [string])
      )}`
    );
  }

  error(...args: any[]) {
    console.error(
      `${green(this.getTime())} [${red(this.context)}] ${bold(
        ...(args as [string])
      )}`
    );
  }

  debug(...args: any[]) {
    if (process.env.NODE_ENV !== "development") return;
    console.debug(
      `${green(this.getTime())} [${dim(this.context)}] ${bold(
        ...(args as [string])
      )}`
    );
  }
}
