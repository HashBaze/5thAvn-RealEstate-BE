export interface PropertyNode {
    daysOnMarket: any;
    listedAt: any;
    createdAt: any;
    images: any;
    status: any;
    id: string;
    formattedAddress: string;
    price: number;
    headline: string;
    listingDetails: {
      rentalPerWeek: any;
      bedrooms: number;
      bathrooms: number;
      garageSpaces: number;
      outdoorFeatures: string[];
      heatingCoolingFeatures: string[];
    };
    propertyType: string;
    thumbnailSquare: string;
    landSize: string;
    altToPrice: string;
  }

  export interface FilteredProperty {
    daysOnMarket: any;
    id: string;
    formattedAddress: string;
    price: number;
    altToPrice: string;
    status: string;
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