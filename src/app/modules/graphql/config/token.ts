import axios from "axios";
import { logger } from "../../../../utils/logger";

let token: null = null;
let tokenExpiresAt: number | null = null;

async function fetchToken() {
  try {
    const response = await axios.post(
      (process.env.GRAPHQL_URL + "/token") as string,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CLIENR_SECRET}`,
        },
      }
    );

    token = response.data.data.token.token;
    tokenExpiresAt = response.data.data.token.expiresAt;
    logger.debug("Token fetched successfully");
    return token;
  } catch (error) {
    if (error instanceof Error) {
      logger.error("Error fetching token:", error);
    } else {
      logger.error("Error fetching token:", error);
    }
    logger.error("Failed to fetch token");
    throw new Error("Failed to fetch token");
  }
}

async function getToken() {
  if (!token || !tokenExpiresAt || Date.now() >= tokenExpiresAt * 1000) {
    await fetchToken();
  }
  return token;
}

export default getToken;
