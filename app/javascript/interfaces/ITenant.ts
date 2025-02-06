interface ITenant {
  id: number;
  siteName: string;
  oldSiteLogo: string;
  locale: string;
  customDomain?: string;
}

export default ITenant;