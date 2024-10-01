import type { Pool } from "pg";
import { PgSimplifyInflectionPreset } from "@graphile/simplify-inflection";
import { makePgService } from "postgraphile/adaptors/pg";
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";

import type {} from "postgraphile/grafserv/express/v4";

import { resolve } from "path";
import type { CookieSerializeOptions } from "cookie";
import type { JwtPayload } from "jsonwebtoken";
import { serialize } from "cookie";
import { verify } from "jsonwebtoken";
import { PostGraphileConnectionFilterPreset } from "postgraphile-plugin-connection-filter";
import { makePgSmartTagsFromFilePlugin } from "postgraphile/utils";

import LoginPlugin from "./plugins/login-plugin";
import LogoutPlugin from "./plugins/logout-plugin";
import RegisterPlugin from "./plugins/register-plugin";
import ResetPasswordPlugin from "./plugins/reset-password-plugin";
import { GenerateVideoPresignedUrl } from "./plugins/s3-presigned-post";
import { VideoPresignedUrl } from "./plugins/signed-video-url";

declare global {
  namespace Grafast {
    interface Context {
      rootPgPool: Pool;
      setCookie: (
        cookies: {
          name: string;
          value: string;
          options?: CookieSerializeOptions;
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

type UUID = string;

function uuidOrNull(input: string | number | null | undefined): UUID | null {
  if (!input) return null;
  const str = String(input);
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      str,
    )
  ) {
    return str;
  } else {
    return null;
  }
}

const isDev = process.env.NODE_ENV === "development";
//const isTest = process.env.NODE_ENV === "test";

interface IPostGraphileOptionsOptions {
  authPgPool: Pool;
  rootPgPool?: Pool;
}

export function getPreset({
  rootPgPool,
}: IPostGraphileOptionsOptions): GraphileConfig.Preset {
  return {
    extends: [
      PostGraphileAmberPreset,
      PgSimplifyInflectionPreset,
      PostGraphileConnectionFilterPreset,
    ],
    pgServices: [
      makePgService({
        connectionString: process.env.AUTH_DATABASE_URL,
        superuserConnectionString: process.env.DATABASE_URL,
        schemas: ["publ"],
        pgSettings(inReq) {
          const access_token =
            inReq.expressv4.req.headers?.authorization?.split(" ")[1];
          let tokenPayload: JwtPayload | null = null;
          if (access_token) {
            try {
              tokenPayload = verify(
                access_token,
                process.env.ACCESS_TOKEN_SECRET!,
              ) as JwtPayload;
            } catch (e) {
              console.warn("Invalid access token", e);
            }
          }
          const userId = uuidOrNull(tokenPayload?.sub);
          return {
            // Everyone uses the "visitor" role currently
            role: process.env.DATABASE_VISITOR!,
            "jwt.claims.sub": userId!,
          };
        },
      }),
    ],
    schema: {
      exportSchemaSDLPath: "../../data/schema.graphql",
      pgMutationPayloadRelations: true,
    },

    grafast: {
      explain: isDev,

      // eslint-disable-next-line no-unused-vars
      async context(requestContext, _args) {
        const res = requestContext.node?.res;

        return {
          rootPgPool,
          setCookie(cookies: { name: string; value: string; options?: any }[]) {
            if (res) {
              res.setHeader(
                "Set-Cookie",
                cookies.map((cookie) =>
                  serialize(cookie.name, cookie.value, cookie.options),
                ),
              );
            }
          },
        };
      },
    },

    grafserv: { watch: true },
    plugins: [
      IdToNodeIdPlugin,
      GenerateVideoPresignedUrl,
      VideoPresignedUrl,
      TagsFilePlugin,
      LoginPlugin,
      LogoutPlugin,
      ResetPasswordPlugin,
      RegisterPlugin,
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
