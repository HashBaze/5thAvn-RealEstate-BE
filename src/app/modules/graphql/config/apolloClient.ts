import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client/core";
import fetch from "isomorphic-fetch";
import getToken from "./token";

async function createApolloClient() {
  const token = await getToken();

  return new ApolloClient({
    link: new HttpLink({
      uri: (process.env.GRAPHQL_URL + "/graphql") as string,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      fetch,
    }),
    cache: new InMemoryCache(),
  });
}

export default createApolloClient;
