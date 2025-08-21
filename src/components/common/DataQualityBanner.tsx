import React from 'react';

interface DataQualityBannerProps {
  message: string;
}

export const DataQualityBanner: React.FC<DataQualityBannerProps> = ({
  message,
}) => <div className="data-quality-banner">{message}</div>;

export default DataQualityBanner;
