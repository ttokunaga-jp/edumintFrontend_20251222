import {
  Container,
  Box,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '@/features/content/hooks/useContent';
import { AdvancedSearchPanel, SearchFilters } from '@/components/page/HomePage/AdvancedSearchPanel';
import { SortChipGroup } from '@/components/page/HomePage/SortChipGroup';
import { SearchResultsGrid } from '@/components/page/HomePage/SearchResultsGrid';

export function HomePage() {
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'recommended' | 'views'>('recommended');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // useSearch フックで検索を実行
  const { data, isLoading, error } = useSearch({
    keyword,
    page,
    sortBy,
    limit: 12,
    ...filters,
  });

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleCardClick = (problemId: string) => {
    navigate(`/problem/${problemId}`);
  };

  const handleSortChange = (newSort: 'newest' | 'popular' | 'recommended' | 'views') => {
    setSortBy(newSort);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          {/* 詳細検索パネル */}
          <Box sx={{ mb: 3 }}>
            <AdvancedSearchPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              isOpen={Object.keys(filters).length > 0}
            />
          </Box>

          {/* ソート選択 */}
          <SortChipGroup
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />

          {/* 検索結果 */}
          <SearchResultsGrid
            data={data}
            isLoading={isLoading}
            error={error}
            page={page}
            onCardClick={handleCardClick}
            onPageChange={handlePageChange}
          />
        </Box>
      </Container>
    </Box>
  );
}
export default HomePage;
