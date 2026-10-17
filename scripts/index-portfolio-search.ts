import {
  getPortfolioSearchDocuments,
  PORTFOLIO_INDEX_PATH,
} from "../lib/portfolio-guide/search";
import { manageIndex } from "../lib/search/index-file";
manageIndex(PORTFOLIO_INDEX_PATH, getPortfolioSearchDocuments()).catch(
  (error) => {
    console.error(error.message);
    process.exitCode = 1;
  },
);
