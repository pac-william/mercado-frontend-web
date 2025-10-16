export interface Product {
  name: string;
  categoryId: string;
  categoryName: string;
}

export interface ProductDetail {
  id: string;
  name: string;
  price: number;
  unit: string;
  marketId: string;
  image: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  categoryDescription: string;
}

export interface SearchMeta {
  total: number;
  page: number;
  size: number;
}

export interface ProductSearchResult {
  searchTerm: string;
  categoryName: string;
  products: ProductDetail[];
  meta: SearchMeta;
}

export interface SearchStatistics {
  totalSearches: number;
  totalProductsFound: number;
  searchTerms: string[];
}

export interface SearchResults {
  productsBySearchTerm: ProductSearchResult[];
  statistics: SearchStatistics;
}

export interface SuggestionData {
  essential_products: Product[];
  common_products: Product[];
  utensils: Product[];
  searchResults: SearchResults;
}

export interface SuggestionCreateResponse {
  id: string;
}

export interface Suggestion {
  id: string;
  task: string;
  data: SuggestionData;
  createdAt: string;
  updatedAt: string;
}

