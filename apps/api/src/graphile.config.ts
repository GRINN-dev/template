import "graphile-config";
import "postgraphile";

import { resolve } from "path";
import type { Pool } from "pg";
import { PgSimplifyInflectionPreset } from "@graphile/simplify-inflection";
import { SerializeOptions } from "cookie";
import { JwtPayload, verify } from "jsonwebtoken";
import { PostGraphileConnectionFilterPreset } from "postgraphile-plugin-connection-filter";
import { makePgService } from "postgraphile/adaptors/pg";
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";
import { makePgSmartTagsFromFilePlugin } from "postgraphile/utils";

import { LoginMutationPlugin } from "./plugins/login";
import { RegisterMutationPlugin } from "./plugins/register";
import { maskError } from "./utils/handle-errors";
import { setCookies } from "./utils/jwt";

declare global {
  namespace Grafast {
    interface Context {
      rootPgPool: Pool;
      userId?: string;
      ipAddr?: string;
      userAgent?: string;
      setCookies: (
        cookies: {
          name: string;
          value: string;
          options?: SerializeOptions;
        }[],
      ) => void;
    }
  }
}

const TagsFilePlugin = makePgSmartTagsFromFilePlugin(
  // We're using JSONC for VSCode compatibility; also using an explicit file
  // path keeps the tests happy.
  resolve(__dirname, "../postgraphile.tags.jsonc"),
);

const isDev = process.env.NODE_ENV === "development";

export function getPreset({
  rootPgPool,
}: {
  rootPgPool: Pool;
}): GraphileConfig.Preset {
  return {
    extends: [
      PostGraphileAmberPreset,
      PgSimplifyInflectionPreset,
      PostGraphileConnectionFilterPreset,
    ],
    pgServices: [
      makePgService({
        connectionString: process.env.AUTHENTICATOR_DATABASE_URL,
        superuserConnectionString: process.env.DATABASE_URL,
        schemas: ["publ"],
        pgSettings(inReq) {
          // we check if an authorization header is present and extract the userId
          const authorization =
            inReq.expressv4.req.headers?.authorization?.split(" ")[1];
          const token = authorization?.replace("Bearer ", "");
          let tokenPayload: JwtPayload | undefined = undefined;
          if (token) {
            try {
              tokenPayload = verify(
                token,
                process.env.ACCESS_TOKEN_SECRET!,
              ) as JwtPayload;
            } catch (e) {
              console.warn("Invalid access token", e);
            }
          }

          return {
            // Everyone uses the "visitor" role currently
            role: process.env.DATABASE_VISITOR!,
            "jwt.claims.sub": tokenPayload?.sub,
            "jwt.claims.sid": tokenPayload?.sid,
          };
        },
      }),
    ],
    schema: {
      exportSchemaSDLPath: "../../data/schema.graphql",
      pgMutationPayloadRelations: true,
      pgForbidSetofFunctionsToReturnNull: false,
    },

    grafast: {
      explain: isDev,
      async context(requestContext, _args) {
        const req = requestContext.expressv4?.req;
        const res = requestContext.node?.res;

        // we check if an authorization header is present and extract the userId
        const authorization = req?.headers?.authorization;
        const token = authorization?.replace("Bearer ", "");
        let tokenPayload: JwtPayload | undefined = undefined;
        if (token) {
          try {
            tokenPayload = verify(
              token,
              process.env.ACCESS_TOKEN_SECRET!,
            ) as JwtPayload;
          } catch (e) {
            console.warn("Invalid access token", e);
          }
        }
        return {
          rootPgPool,
          setCookies: (cookies) => {
            setCookies(cookies, res);
          },
          ipAddr: req?.ip,
          userAgent: req?.headers["user-agent"],
          userId: tokenPayload?.sub,
        };
      },
    },

    grafserv: {
      watch: true,
      maskError,
    },
    plugins: [
      IdToNodeIdPlugin,
      TagsFilePlugin,
      RegisterMutationPlugin,
      LoginMutationPlugin,
    ],
  };
}

export default getPreset;

const IdToNodeIdPlugin: GraphileConfig.Plugin = {
  name: "IdToNodeIdPlugin",
  version: "1.0.0",
  inflection: {
    replace: {
      nodeIdFieldName() {
        return "nodeId";
      },
      attribute(previous, options, details) {
        if (!previous) {
          throw new Error("There was no 'attribute' inflector to replace?!");
        }
        const name = previous(details);
        if (name === "rowId") {
          return "id";
        }
        return name;
      },
    },
  },
};
