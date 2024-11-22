import express from "express";
import {
  getByFilter,
  getByFilterByPagination,
  handleGetSingleProperty,
  handleGraphQLRequest,
} from "./graphql.controller";
const graphqlRouter = express.Router();

graphqlRouter.post("/get-listings", handleGraphQLRequest);
graphqlRouter.get("/get-property/:id", handleGetSingleProperty);
graphqlRouter.post("/get-by-filter", getByFilter);
graphqlRouter.post("/get-by-filter-pagination", getByFilterByPagination);
export default graphqlRouter;
