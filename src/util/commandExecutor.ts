import { exec } from "child_process";
import { Err, Ok, type Result } from "./result";

export default function execCommand(
  cmdStr: string,
): Promise<Result<string, string>> {
  return new Promise((resolve) => {
    exec(cmdStr, (error, stdout, stderr) => {
      if (error != null) return resolve(Err(error.message));
      else if (typeof stderr != "string") {
        return resolve(Err(stderr));
      }
      return resolve(Ok(stdout));
    });
  });
}
