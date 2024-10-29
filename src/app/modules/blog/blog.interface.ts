export interface IBlog {
  title: string;
  author: string;
  date: Date;
  coverImage: string;
  youtubeLink: string;
  tags: string[]; 
  description1: string;
  description2: string;
  image1: string;
  image2: string;
  additionalImages?: string[]; 
  isShow: boolean;
}
