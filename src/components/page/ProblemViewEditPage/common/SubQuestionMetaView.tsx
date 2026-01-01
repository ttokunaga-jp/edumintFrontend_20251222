import React from 'react';
import { Box } from '@mui/material';
import { KeywordEditor, Keyword } from './KeywordEditor';

type SubQuestionMetaViewProps = {
  keywords?: Keyword[];
};

export const SubQuestionMetaView: React.FC<SubQuestionMetaViewProps> = ({
  keywords = [],
}) => {
  return (
    <Box>
      <KeywordEditor keywords={keywords} canEdit={false} />
    </Box>
  );
};
