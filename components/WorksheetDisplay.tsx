import React from 'react';
import { Level, WorksheetData, WorksheetDataL1, WorksheetDataL2, WorksheetDataL3, WorksheetDataL4 } from '../types';
import { WorksheetLevel1 } from './WorksheetLevel1';
import { WorksheetLevel2 } from './WorksheetLevel2';
import { WorksheetLevel3 } from './WorksheetLevel3';
import { WorksheetLevel4 } from './WorksheetLevel4';

interface WorksheetDisplayProps {
  level: Level;
  data: WorksheetData;
  image: string | null;
}

export const WorksheetDisplay: React.FC<WorksheetDisplayProps> = ({ level, data, image }) => {
  const renderWorksheet = () => {
    switch (level) {
      case Level.L1:
        return <WorksheetLevel1 data={data as WorksheetDataL1} image={image} />;
      case Level.L2:
        return <WorksheetLevel2 data={data as WorksheetDataL2} image={image} />;
      case Level.L3:
        return <WorksheetLevel3 data={data as WorksheetDataL3} image={image} />;
      case Level.L4:
        return <WorksheetLevel4 data={data as WorksheetDataL4} image={image} />;
      default:
        return <div className="text-center text-red-500">Invalid level selected.</div>;
    }
  };

  return <div>{renderWorksheet()}</div>;
};
