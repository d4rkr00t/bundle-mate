/* @flow */

/*::
 import type { Flags } from "../types/flags";
 */

module.exports = function run(
  command /*: string */,
  input /*: Array<string> */,
  flags /*: Flags */
) {
  console.log(command, input, flags);
};
