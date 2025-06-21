export enum PointFeatureCategory {
  DiveSite = 1,
  DiveShop = 2,
};

export type ClusterProperty = {
  id:           string | number
  title:        string
  cluster:      boolean
  category:     PointFeatureCategory
  point_count?: number
};

export enum ScreenReturn {
  SiteSubmitter = 1,
  PartnerRequestPage = 2,
}