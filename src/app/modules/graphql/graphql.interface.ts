export interface PropertyNode {
    id: string;
    formattedAddress: string;
    price: number;
    headline: string;
    listingDetails: {
      bedrooms: number;
      bathrooms: number;
      garageSpaces: number;
      outdoorFeatures: string[];
      heatingCoolingFeatures: string[];
    };
    propertyType: string;
    thumbnailSquare: string;
    landSize: string;
  }

  export interface FilteredProperty {
    id: string;
    formattedAddress: string;
    price: number;
    listingDetails: {
      bedrooms: number;
      bathrooms: number;
      garageSpaces: number;
      outdoorFeatures: string[];
      heatingCoolingFeatures: string[];
    };
    propertyType: string;
    thumbnailSquare: string;
    isSelected: boolean;
    headline: string;
    landSize: string;
  }