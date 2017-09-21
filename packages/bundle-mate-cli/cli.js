#!/usr/bin/env node

/* @flow */

/*::
 import type { Flags } from "./types/flags";
 */

const meow = require("meow");
const chalk = require("chalk");
const run = require("./lib/index");

const cli = meow(
  {
    help: [
      chalk.green("Usage"),
      "  $ bm report --adapter webpack",
      "",
      chalk.green("Commands"),
      `  ${chalk.yellow("report")}            Runs an analyzer to build a report for a bundle`,
      `  ${chalk.yellow("-n, --ngrok")}       Exposes server to the real world by ngrok.`,
      `  ${chalk.yellow("-o, --open")}        Opens web server URL in the default browser.`,
      "",
      chalk.green("Options"),
      `  ${chalk.yellow("-a, --adapter")}     Adapter BundleMate will use to create a report`,
      `  ${chalk.yellow("-v, --version")}     Shows version.`,
      `  ${chalk.yellow("--help")}            Shows help.`
    ]
  },
  {
    alias: {
      a: "adapter",
      v: "version"
    }
  }
);

const ALLOW_COMMANDS = ["report"];
const COMMAND_VALIDATION_RULES = {
  report: {
    input: false, // optional
    flags: {
      adapter: true // required
    }
  }
};
const [command, ...input] = cli.input || [];
const flags = cli.flags || {};

const validateCommand = (command /*: string */, input /* Array<string> */, flags /*: Flags */) => {
  const validationRules = COMMAND_VALIDATION_RULES[command];
  if (validationRules.input && (!input || !input.length)) {
    return `Command "${command}" expect additional input, use bm --help for more info`;
  }
  if (validationRules.flags) {
    const errors = Object.keys(validationRules.flags).reduce((acc, rule) => {
      if (validationRules.flags[rule] && !flags[rule]) {
        acc.push(`Command "${command}" expects "--${rule}" flag, use bm --help for more info`);
      }
      return acc;
    }, []);
    return errors.join("\n");
  }
};

if (!command) {
  console.log(cli.help);
} else if (!ALLOW_COMMANDS.includes(command)) {
  console.log(`Command "${command}" is not supported`);
  process.exit(1);
} else {
  const commandValidationErrors = validateCommand(command, input, flags);

  if (commandValidationErrors) {
    console.log(commandValidationErrors);
    process.exit(1);
  }

  run(command, input, flags);
}
