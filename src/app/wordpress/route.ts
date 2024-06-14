import { bootWordPress } from "../../wordpress-playground/dist/packages/playground/wordpress";
import { loadNodeRuntime } from "../../wordpress-playground/dist/packages/php-wasm/node";

import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { basename } from "path";

type ResponseData = {
  message: string;
};

export const readAsFile = function (path: string, fileName?: string): File {
  return new File([fs.readFileSync(path)], fileName ?? basename(path));
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const wordPressZip = await readAsFile("./src/app/wordpress/wordpress.zip");
  const sqliteIntegrationPluginZip = await readAsFile(
    "./src/app/wordpress/sqlite-database-integration.zip"
  );

  const wp = await bootWordPress({
    siteUrl: "http://localhost:3000/wordpress",
    wordPressZip,
    sqliteIntegrationPluginZip,
    createPhpRuntime: async () => {
      const runtime = await loadNodeRuntime("8.0");
      return runtime;
    },
  });

  const request = {
    url: req.url,
    headers: req.headers,
    method: "GET",
    body: req.body,
  };
  const response = await wp.request(request);

  res.status(200).json({ message: "Hello from Next.js!" });
};

export const GET = handler;
export const POST = handler;
