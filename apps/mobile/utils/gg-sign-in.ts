// import statusCodes along with GoogleSignin
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";

// Somewhere in your code
export const signIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    console.log("response", response);
    if (isSuccessResponse(response)) {
      return { userInfo: response.data };
    } else {
      // sign in was cancelled by user
    }
  } catch (error) {
    console.log("error", error);
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.IN_PROGRESS:
          // operation (eg. sign in) already in progress
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          // Android only, play services not available or outdated
          break;
        default:
          return { error };
        // some other error happened
      }
    } else {
      // an error that's not related to google sign in occurred
    }
  }
};
