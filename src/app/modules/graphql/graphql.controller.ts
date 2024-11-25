import { Request, Response } from "express";
import { DocumentNode, gql } from "@apollo/client/core";
import createApolloClient from "./config/apolloClient";
import {
  GETALLLANDSALE,
  GETALLPROPERTIES,
  GETALLRESIDANTALRENT,
  GETALLRESIDANTALSALE,
  GETPROPERTYBYID,
} from "./graphql.querys";
import { FilteredProperty, PropertyNode } from "./graphql.interface";
import { PropertyFeatures, PropertyType } from "./graphql.enum";

async function handleGraphQLRequest(
  req: Request,
  res: Response
): Promise<void> {
  const getAll: DocumentNode = gql`
    ${GETALLPROPERTIES}
  `;
  const { first, after, last, before } = req.body;
  const variables = {
    first,
    after,
    last,
    before,
    status: ["SOLD"],
  };
  try {
    const client = await createApolloClient();

    const response = await client.query({
      query: getAll,
      variables,
    });

    const sortedData = sortPropertiesByCreatedAt(response.data);

    res.json(sortedData);
  } catch (error) {
    console.error("Error making GraphQL request:", (error as Error).message);
    res.status(500).json({ message: "Failed to fetch data from GraphQL API" });
  }
}

const sortPropertiesByCreatedAt = (data: any) => {
  const sortedEdges = [...data.properties.edges].sort((a, b) => {
    const dateA = new Date(a.node.createdAt);
    const dateB = new Date(b.node.createdAt);

    return dateB.getTime() - dateA.getTime();
  });
  return {
    ...data,
    properties: {
      ...data.properties,
      edges: sortedEdges,
    },
  };
};

async function handleGetSingleProperty(
  req: Request,
  res: Response
): Promise<void> {
  const getByID: DocumentNode = gql`
    ${GETPROPERTYBYID}
  `;
  const { id } = req.params;
  const variables = {
    id,
  };
  try {
    const client = await createApolloClient();

    const response = await client.query({
      query: getByID,
      variables,
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error making GraphQL request:", (error as Error).message);
    res.status(500).json({ message: "Failed to fetch data from GraphQL API" });
  }
}

async function getByFilter(req: Request, res: Response): Promise<void> {
  let query: DocumentNode;

  const {
    bedRoomMin,
    bedRoomMax,
    houseCategory,
    suburb,
    priceFrom,
    priceTo,
    airConditioning,
    pool,
    secaurity,
    isSelected,
    bathRooms,
  } = req.body;

  if (isSelected == PropertyType.SALE) {
    query = gql`
      ${GETALLRESIDANTALSALE}
    `;
  } else if (isSelected == PropertyType.RENT) {
    query = gql`
      ${GETALLRESIDANTALRENT}
    `;
  } else {
    query = gql`
      ${GETALLLANDSALE}
    `;
  }

  try {
    const client = await createApolloClient();

    const response = await client.query({
      query,
    });

    const filteredResponse: FilteredProperty[] = response.data.properties.edges
      .map(({ node }: { node: PropertyNode }) => ({
        id: node.id,
        formattedAddress: node.formattedAddress,
        price: node.price,
        listingDetails: {
          bedrooms: node.listingDetails.bedrooms,
          bathrooms: node.listingDetails.bathrooms,
          garageSpaces: node.listingDetails.garageSpaces,
          outdoorFeatures: node.listingDetails.outdoorFeatures,
          heatingCoolingFeatures: node.listingDetails.heatingCoolingFeatures,
        },
        propertyType: node.propertyType,
        thumbnailSquare: node.thumbnailSquare,
        isSelected: isSelected ?? false,
        headline: node.headline,
        landSize: node.landSize,
      }))
      .filter((property: FilteredProperty) => {
        if (
          bedRoomMin &&
          bedRoomMax &&
          bedRoomMin !== "any" &&
          bedRoomMax !== "any"
        ) {
          if (
            property.listingDetails.bedrooms < bedRoomMin ||
            property.listingDetails.bedrooms > bedRoomMax
          ) {
            return null;
          }
        }

        if (bathRooms && bathRooms !== "any") {
          if (property.listingDetails.bathrooms < parseInt(bathRooms)) {
            return null;
          }
        }

        if (priceFrom && priceTo && priceFrom !== " " && priceTo !== " ") {
          if (
            property.price < parseInt(priceFrom) ||
            property.price > parseInt(priceTo)
          ) {
            return null;
          }
        }

        if (suburb && suburb !== " ") {
          if (
            property.formattedAddress
              .toLowerCase()
              .includes(suburb.toLowerCase())
          ) {
            return property;
          }
        }

        if (airConditioning) {
          if (
            !property.listingDetails.heatingCoolingFeatures.includes(
              PropertyFeatures.AIR_CONDITIONING
            )
          ) {
            return null;
          }
        }

        if (pool) {
          if (
            !property.listingDetails.outdoorFeatures.includes(
              PropertyFeatures.SWIMMING_POOL_IN_GROUND
            ) ||
            !property.listingDetails.outdoorFeatures.includes(
              PropertyFeatures.SWIMMING_POOL_ABOVE_GROUND
            )
          ) {
            return null;
          }
        }

        if (secaurity) {
          if (
            !property.listingDetails.outdoorFeatures.includes(
              PropertyFeatures.SECURE_PARKING
            )
          ) {
            return null;
          }
        }

        if (houseCategory && houseCategory !== " ") {
          if (property.propertyType === houseCategory) {
            return property;
          }
        }
      });

    const formattedEdges = filteredResponse.map((property) => ({
      node: property,
    }));

    const json = {
      edges: formattedEdges,
    };

    res.json(json);
  } catch (error) {
    console.error("Error making GraphQL request:", (error as Error).message);
    res.status(500).json({ message: "Failed to fetch data from GraphQL API" });
  }
}

async function getByFilterByPagination(
  req: Request,
  res: Response
): Promise<void> {
  let query: DocumentNode;

  const {
    bedRoomMin,
    bedRoomMax,
    houseCategory,
    suburb,
    priceFrom,
    priceTo,
    airConditioning,
    pool,
    secaurity,
    isSelected,
    bathRooms,
    page = 1,
  } = req.body;

  if (isSelected == PropertyType.SALE) {
    query = gql`
      ${GETALLRESIDANTALSALE}
    `;
  } else if (isSelected == PropertyType.RENT) {
    query = gql`
      ${GETALLRESIDANTALRENT}
    `;
  } else {
    query = gql`
      ${GETALLLANDSALE}
    `;
  }

  try {
    const client = await createApolloClient();

    const response = await client.query({
      query,
    });

    const filteredResponse: FilteredProperty[] = response.data.properties.edges
      .map(({ node }: { node: PropertyNode }) => ({
        id: node.id,
        formattedAddress: node.formattedAddress,
        price: node.price,
        listingDetails: {
          bedrooms: node.listingDetails.bedrooms,
          bathrooms: node.listingDetails.bathrooms,
          garageSpaces: node.listingDetails.garageSpaces,
          outdoorFeatures: node.listingDetails.outdoorFeatures,
          heatingCoolingFeatures: node.listingDetails.heatingCoolingFeatures,
        },
        propertyType: node.propertyType,
        thumbnailSquare: node.thumbnailSquare,
        isSelected: isSelected ?? false,
        headline: node.headline,
        landSize: node.landSize,
      }))
      .filter((property: FilteredProperty) => {
        // Apply filters
        if (
          bedRoomMin &&
          bedRoomMax &&
          bedRoomMin !== "any" &&
          bedRoomMax !== "any"
        ) {
          if (
            property.listingDetails.bedrooms < bedRoomMin ||
            property.listingDetails.bedrooms > bedRoomMax
          ) {
            return null;
          }
        }

        if (bathRooms && bathRooms !== "any") {
          if (property.listingDetails.bathrooms < parseInt(bathRooms)) {
            return null;
          }
        }

        if (priceFrom && priceTo && priceFrom !== " " && priceTo !== " ") {
          if (
            property.price < parseInt(priceFrom) ||
            property.price > parseInt(priceTo)
          ) {
            return null;
          }
        }

        if (suburb && suburb !== " ") {
          if (
            !property.formattedAddress
              .toLowerCase()
              .includes(suburb.toLowerCase())
          ) {
            return null;
          }
        }

        if (airConditioning) {
          if (
            !property.listingDetails.heatingCoolingFeatures.includes(
              PropertyFeatures.AIR_CONDITIONING
            )
          ) {
            return null;
          }
        }

        if (pool) {
          if (
            !property.listingDetails.outdoorFeatures.includes(
              PropertyFeatures.SWIMMING_POOL_IN_GROUND
            ) &&
            !property.listingDetails.outdoorFeatures.includes(
              PropertyFeatures.SWIMMING_POOL_ABOVE_GROUND
            )
          ) {
            return null;
          }
        }

        if (secaurity) {
          if (
            !property.listingDetails.outdoorFeatures.includes(
              PropertyFeatures.SECURE_PARKING
            )
          ) {
            return null;
          }
        }

        if (houseCategory && houseCategory !== " ") {
          if (
            isSelected != PropertyType.LAND &&
            property.propertyType !== houseCategory
          ) {
            return null;
          }
        }

        return property;
      });

    const itemsPerPage = 10;
    const totalItems = filteredResponse.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedResponse = filteredResponse.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    const formattedEdges = paginatedResponse.map((property) => ({
      node: property,
    }));

    const json = {
      edges: formattedEdges,
      page,
      pageinfo: {
        totalPages,
        totalItems,
        hasNextPage: page < totalPages,
      },
      hasPreviousPage: page > 1,
    };

    res.json(json);
  } catch (error) {
    console.error("Error making GraphQL request:", (error as Error).message);
    res.status(500).json({ message: "Failed to fetch data from GraphQL API" });
  }
}

export {
  handleGraphQLRequest,
  handleGetSingleProperty,
  getByFilter,
  getByFilterByPagination,
};
