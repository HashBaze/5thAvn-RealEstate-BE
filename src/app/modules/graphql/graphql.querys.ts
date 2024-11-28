export const GETALLPROPERTIES: string = `
  query GetProperties(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $status: [PropertyStatusEnum!]
  ) {
    properties(
      first: $first
      after: $after
      last: $last
      before: $before
      status: $status 
    ) {
      totalCount
      edges {
        node {
          id
          createdAt
          formattedAddress
          landSize
          soldDate
          status
          price
          listingType
          headline
          propertyType
          thumbnailSquare
          listingDetails {
            ... on ResidentialSale {
              auctionLocation
              carportSpaces
              openCarSpaces
              bathrooms
              bedrooms
              garageSpaces
            }
          }
          images {
            createdAt
            url
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
    }
  }
`;

export const GETPROPERTYBYID: string = `
  query GetSingleProperty($id: ID!) {
    property(id: $id) {
      id
      createdAt
      brochureTitle
      formattedAddress
      landSize
      status
      daysOnMarket
      longitude
      latitude
      listingDetails {
        ... on ResidentialSale {
          auctionLocation
          carportSpaces
          bathrooms
          bedrooms
          garageSpaces
        }
      }
      images {
        url
      }
      videoUrl
      documents {
        url
      }
      address {
        bathrooms
        businessName
        corelogicUrl
        country
      }
      price
      country
      streetNo
      street
      vendors {
        contact {
          phoneNumbers{
            phoneNumber
            position
            numberType
          }
        }
      }
      description
    }
  }
`;

export const GETALLRESIDANTALSALE = `{
    properties(listingType: [RESIDENTIAL_SALE] ,status: [SOLD]) {
        totalCount
        edges {
        node {
          id
          createdAt
          formattedAddress
          landSize
          soldDate
          status
          price
          listingType
          headline
          propertyType
          thumbnailSquare
          listingDetails {
            ... on ResidentialSale {
              auctionLocation
              carportSpaces
              openCarSpaces
              bathrooms
              bedrooms
              garageSpaces
              outdoorFeatures
              heatingCoolingFeatures
            }
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
    }
}`;

export const GETALLRESIDANTALRENT = `{
    properties(listingType: [RESIDENTIAL_RENTAL]) {
        totalCount
        edges {
        node {
          id
          createdAt
          formattedAddress
          landSize
          soldDate
          status
          price
          listingType
          headline
          propertyType
          thumbnailSquare
          listingDetails {
            ... on ResidentialRental {
              auctionLocation
              carportSpaces
              openCarSpaces
              bathrooms
              bedrooms
              garageSpaces
              outdoorFeatures
              heatingCoolingFeatures
            }
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
    }
}`;

export const GETALLLANDSALE = `{
    properties(listingType: [LAND]) {
        totalCount
        edges {
        node {
          id
          createdAt
          formattedAddress
          landSize
          soldDate
          status
          price
          listingType
          headline
          propertyType
          thumbnailSquare
          listingDetails {
            ... on ResidentialRental {
              auctionLocation
              carportSpaces
              openCarSpaces
              bathrooms
              bedrooms
              garageSpaces
              outdoorFeatures
              heatingCoolingFeatures
            }
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
    }
}`;

export const GETSUBURB = `{
    properties{
        edges {
            node {
            formattedAddress
            }
        }
    }
}
`;