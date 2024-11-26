import chalk from "chalk";

export default class Logger {
	/**
	 * info
	 */
	public static info(...args: any[]) {
		let finalString = "";

		for (let i = 0; i < args.length; i++) {
			if (i >= 1) {
				finalString += " ";
			}

			const arg = args[i];
			finalString += arg
		}

		console.log(chalk.blue(`[LDK/INFO]`), chalk.white(finalString));
	}

	/**
	 * warn
	 */
	public static warn(...args: any[]) {
		let finalString = "";

		for (let i = 0; i < args.length; i++) {
			if (i >= 1) {
				finalString += " ";
			}

			const arg = args[i];
			finalString += arg
		}

		console.log(chalk.yellow(`[LDK/WARN]`), chalk.white(finalString));
	}

	/**
	 * err
	 */
	public static err(...args: any[]) {
		let finalString = "";

		for (let i = 0; i < args.length; i++) {
			if (i >= 1) {
				finalString += " ";
			}

			const arg = args[i];
			finalString += arg
		}

		console.log(chalk.red(`[LDK/ERROR]`), chalk.white(finalString));
	}
}