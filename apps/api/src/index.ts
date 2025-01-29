import { createServer } from "http";

import { makeApp } from "./app";

async function main() {
  const { default: chalk } = await import("chalk");
  const { default: boxen } = await import("boxen");

  // Create our HTTP server
  const httpServer = createServer();

  // Make our application (loading all the middleware, etc)
  const app = await makeApp({ httpServer });

  // Add our application to our HTTP server

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  httpServer.addListener("request", app);

  // And finally, we open the listen port
  const PORT = parseInt(process.env.SERVER_PORT ?? "", 10) || 3000;
  httpServer.listen(PORT, () => {
    const address = httpServer.address();
    const actualPort: string =
      typeof address === "string"
        ? address
        : address?.port
          ? String(address.port)
          : String(PORT);

    const serverInfo = `

${chalk.green(`Server listening on port ${chalk.bold(actualPort)}`)}

  API: ${chalk.bold.underline(`http://localhost:${actualPort}`)}
  SITE: ${chalk.bold.underline(`http://localhost:${process.env.PORT}`)}
    `;

    const card = boxen(serverInfo, {
      padding: 1,
      margin: 1,
      dimBorder: true,
      borderStyle: "doubleSingle",
      borderColor: "green",
      backgroundColor: "black",
      fullscreen(width, height) {
        return [0.8 * width, 0.8 * height];
      },
    });

    console.log(card);
  });
}
main().catch((e) => {
  console.error("Fatal error occurred starting server!");
  console.error(e);
  process.exit(101);
});
