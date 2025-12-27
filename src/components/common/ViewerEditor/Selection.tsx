import React, { useCallback, useEffect, useState } from 'react';
import type { ProblemTypeEditProps } from '@/types/problemTypes';
import ProblemTextEditor from './ProblemTextEditor';
import { Plus, Trash2 } from 'lucide-react';

type Option = { id: string; content: string; isCorrect: boolean };

export { default } from './Type2_Selection';
