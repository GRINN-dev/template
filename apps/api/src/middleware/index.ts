import { installAuthorizationHeader } from "./install-authorization-header";
import { installCors } from "./install-cors";
import installDatabasePools from "./install-database-pools";
import installErrorHandler from "./install-error-handlers";
import installLogging from "./install-logging";
import installPostGraphile from "./install-postgraphile";
import { installRefreshTokenRotation } from "./install-refresh-token-rotation";
import installSharedStatic from "./install-shared-static";
import installUploads from "./install-upload";

export {
  installErrorHandler,
  installLogging,
  installSharedStatic,
  installCors,
  installAuthorizationHeader,
  installDatabasePools,
  installPostGraphile,
  installRefreshTokenRotation,
  installUploads,
};
