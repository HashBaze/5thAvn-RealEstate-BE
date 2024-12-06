import { Request, Response } from "express";
import { DocumentNode, gql } from "@apollo/client/core";
import createApolloClient from "./config/apolloClient";
import {
  GETALLLANDSALE,
  GETALLPROPERTIES,
  GETALLRESIDANTALRENT,
  GETALLACTIVEPROPERTYS,
  GETPROPERTYBYID,
  GETSUBURB,
  GETALLSOLDPROPRTYS,
} from "./graphql.querys";
import { FilteredProperty, PropertyNode } from "./graphql.interface";
import { PropertyFeatures, PropertyStatus, PropertyType } from "./graphql.enum";
import { logger } from "../../../utils/logger";

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
    logger.debug(
      "Properties fetched successfully , Length : ",
      sortedData.properties.edges.length
    );
  } catch (error) {
    logger.error("Error making GraphQL request:", (error as Error).message);
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
    logger.debug("Single Property fetched successfully ID: ", id);
  } catch (error) {
    logger.error("Error making GraphQL request:", (error as Error).message);
    res.status(500).json({ message: "Failed to fetch data from GraphQL API" });
  }
}

async function getByFilter(req: Request, res: Response): Promise<void> {
  let query: DocumentNode;

  let {
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

  houseCategory = houseCategory == "any" ? "HOUSE" : houseCategory;

  if (isSelected == PropertyType.SALE) {
    query = gql`
      ${GETALLACTIVEPROPERTYS}
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
          rentalPerWeek: node.listingDetails.rentalPerWeek,
          bedrooms: node.listingDetails.bedrooms,
          bathrooms: node.listingDetails.bathrooms,
          garageSpaces: node.listingDetails.garageSpaces,
          outdoorFeatures: node.listingDetails.outdoorFeatures,
          heatingCoolingFeatures: node.listingDetails.heatingCoolingFeatures,
        },
        images: node.images,
        propertyType: node.propertyType,
        thumbnailSquare: node.thumbnailSquare,
        isSelected: isSelected ?? false,
        headline: node.headline,
        landSize: node.landSize,
        status: node.status,
        altToPrice: node.altToPrice,
        createdAt: node.createdAt,
        daysOnMarket: node.daysOnMarket,
      }))
      .filter((property: FilteredProperty) => {
        if (
          property.status === "WITHDRAWN" ||
          (property.status === "OFF_MARKET" && isSelected == PropertyType.RENT)
        ) {
          return null;
        }
        if (
          (bedRoomMin && bedRoomMin !== "any") ||
          (bedRoomMax && bedRoomMax !== "any")
        ) {
          const bedrooms = property.listingDetails.bedrooms;

          // Handle filtering by min only
          if (
            bedRoomMin &&
            bedRoomMin !== "any" &&
            bedrooms < parseInt(bedRoomMin)
          ) {
            return null;
          }

          // Handle filtering by max only
          if (
            bedRoomMax &&
            bedRoomMax !== "any" &&
            bedrooms > parseInt(bedRoomMax)
          ) {
            return null;
          }
        }

        if (bathRooms && bathRooms !== "any") {
          if (property.listingDetails.bathrooms !== parseInt(bathRooms)) {
            return null;
          }
        }

        if (priceFrom && priceFrom !== " ") {
          if (property.price < parseInt(priceFrom)) {
            return null;
          }
        }

        if (priceTo && priceTo !== " ") {
          if (property.price > parseInt(priceTo)) {
            return null;
          }
        }

        if (suburb && suburb !== "any") {
          if (!property.formattedAddress.split(",")[1].includes(suburb)) {
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

        if (houseCategory && houseCategory.trim() !== "any") {
          if (property.propertyType !== houseCategory) {
            return null;
          }
        }

        return property;
      })
      .sort((a: { status: string }, b: { status: string }) =>
        a.status === "ACTIVE" && b.status !== "ACTIVE" ? -1 : 1
      );

    const formattedEdges = filteredResponse.map((property) => ({
      node: property,
    }));

    const json = {
      edges: formattedEdges,
    };

    res.json(json);
    logger.debug(
      "Properties fetched successfully , Length : ",
      json.edges.length
    );
  } catch (error) {
    logger.error("Error making GraphQL request:", (error as Error).message);
    res.status(500).json({ message: "Failed to fetch data from GraphQL API" });
  }
}

async function getByFilterByPagination(
  req: Request,
  res: Response
): Promise<void> {
  let query: DocumentNode;

  let {
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
    status,
  } = req.body;

  houseCategory =
    houseCategory == "any" && isSelected != PropertyType.LAND
      ? "HOUSE"
      : houseCategory;

  if (isSelected == PropertyType.SALE && status == PropertyStatus.ACTIVE) {
    query = gql`
      ${GETALLACTIVEPROPERTYS}
    `;
  } else if (isSelected == PropertyType.SALE && status == PropertyStatus.SOLD) {
    query = gql`
      ${GETALLSOLDPROPRTYS}
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
        status: node.status,
        listingDetails: {
          rentalPerWeek: node.listingDetails.rentalPerWeek,
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
        altToPrice: node.altToPrice,
        listedAt: node.listedAt,
        daysOnMarket: node.daysOnMarket,
      }))
      .filter((property: FilteredProperty) => {
        if (
          property.status === "WITHDRAWN" ||
          (property.status === "OFF_MARKET" && isSelected == PropertyType.RENT)
        ) {
          return null;
        }

        if (
          (bedRoomMin && bedRoomMin !== "any") ||
          (bedRoomMax &&
            bedRoomMax !== "any" &&
            isSelected != PropertyType.LAND)
        ) {
          const bedrooms = property.listingDetails.bedrooms;

          if (
            bedRoomMin &&
            bedRoomMin !== "any" &&
            bedrooms < parseInt(bedRoomMin)
          ) {
            return null;
          }

          if (
            bedRoomMax &&
            bedRoomMax !== "any" &&
            bedrooms > parseInt(bedRoomMax)
          ) {
            return null;
          }
        }

        if (
          bathRooms &&
          bathRooms !== "any" &&
          isSelected != PropertyType.LAND
        ) {
          if (property.listingDetails.bathrooms !== parseInt(bathRooms)) {
            return null;
          }
        }

        if (priceFrom && priceFrom !== " ") {
          if (property.price < parseInt(priceFrom)) {
            return null;
          }
        }

        if (priceTo && priceTo !== " ") {
          if (property.price > parseInt(priceTo)) {
            return null;
          }
        }

        if (suburb && suburb !== "any") {
          if (!property.formattedAddress.split(",")[1].includes(suburb)) {
            return null;
          }
        }

        if (airConditioning && isSelected != PropertyType.LAND) {
          if (
            !property.listingDetails.heatingCoolingFeatures.includes(
              PropertyFeatures.AIR_CONDITIONING
            )
          ) {
            return null;
          }
        }

        if (pool && isSelected != PropertyType.LAND) {
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

        if (secaurity && isSelected != PropertyType.LAND) {
          if (
            !property.listingDetails.outdoorFeatures.includes(
              PropertyFeatures.SECURE_PARKING
            )
          ) {
            return null;
          }
        }

        if (
          houseCategory &&
          houseCategory.trim() !== "" &&
          isSelected != PropertyType.LAND
        ) {
          if (property.propertyType !== houseCategory) {
            return null;
          }
        }

        return property;
      })
      .sort(
        (
          a: { status: string; daysOnMarket: any },
          b: { status: string; daysOnMarket: any }
        ) => (a.status === "ACTIVE" && b.status !== "ACTIVE" ? -1 : 1)
      );

    if (status == PropertyStatus.ACTIVE) {
      filteredResponse.sort(
        (a: { daysOnMarket: any }, b: { daysOnMarket: any }) =>
          a.daysOnMarket - b.daysOnMarket
      );
    }

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
    logger.debug(
      "Properties fetched successfully , Length : ",
      json.edges.length
    );
  } catch (error) {
    logger.error("Error making GraphQL request:", (error as Error).message);
    res.status(500).json({ message: "Failed to fetch data from GraphQL API" });
  }
}

const getSuburbByDistinct = async (req: Request, res: Response) => {
  const query: DocumentNode = gql`
    ${GETSUBURB}
  `;

  try {
    const client = await createApolloClient();

    const response = await client.query({
      query,
    });

    const suburbList = response.data.properties.edges.map(
      ({ node }: { node: PropertyNode }) => node.formattedAddress.split(",")[1]
    );
    const distinctSuburbList = [...new Set(suburbList)];

    res.json(distinctSuburbList);
    logger.debug(
      "Suburbs fetched successfully , Length : ",
      distinctSuburbList.length
    );
  } catch (error) {
    logger.error("Error making GraphQL request:", (error as Error).message);
    res.status(500).json({ message: "Failed to fetch data from GraphQL API" });
  }
};

export {
  handleGraphQLRequest,
  handleGetSingleProperty,
  getByFilter,
  getByFilterByPagination,
  getSuburbByDistinct,
};
