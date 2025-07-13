
import React from 'react';
import { SortOrder, MultimodalFilter } from '../types';
import { SearchIcon } from './icons/SearchIcon';
import { GridIcon } from './icons/GridIcon';
import { ImageIcon } from './icons/ImageIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { VideoCameraIcon } from './icons/VideoCameraIcon';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  showSort: boolean;
  sortOrder?: SortOrder;
  onSortOrderChange?: (order: SortOrder) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showMultimodalFilter?: boolean;
  multimodalFilter?: MultimodalFilter;
  onMultimodalFilterChange?: (filter: MultimodalFilter) => void;
}

const FilterButton: React.FC<{
  filter: MultimodalFilter;
  label: string;
  icon: React.ReactNode;
  activeFilter: MultimodalFilter;
  onClick: (filter: MultimodalFilter) => void;
}> = ({ filter, label, icon, activeFilter, onClick }) => {
  const isActive = activeFilter === filter;
  return (
    <button
      onClick={() => onClick(filter)}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
        isActive ? 'bg-accent text-white shadow-sm' : 'bg-card text-secondary hover:bg-card-hover'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};


const CommunityHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showSort,
  sortOrder,
  onSortOrderChange,
  searchQuery,
  onSearchChange,
  showMultimodalFilter,
  multimodalFilter,
  onMultimodalFilterChange,
}) => {

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-primary">{title}</h1>
      <p className="mt-1 text-secondary">{subtitle}</p>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-secondary" />
            </div>
            <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-card placeholder-secondary focus:outline-none focus:placeholder-secondary/80 focus:ring-1 focus:ring-accent focus:border-accent sm:text-sm"
                disabled={!onSearchChange}
            />
        </div>

        {showSort && (
            <div className="flex items-center gap-2">
                <label htmlFor="sort-order" className="text-sm font-medium text-secondary">Sort by:</label>
                <select
                    id="sort-order"
                    value={sortOrder}
                    onChange={(e) => onSortOrderChange?.(e.target.value as SortOrder)}
                    className="bg-card border-border rounded-md text-sm font-medium text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                >
                    <option value="recommended">Recommended</option>
                    <option value="recent">Recent</option>
                </select>
            </div>
        )}
      </div>
      {showMultimodalFilter && onMultimodalFilterChange && (
        <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center gap-2">
            <FilterButton filter="all" label="All" icon={<GridIcon className="w-5 h-5" />} activeFilter={multimodalFilter!} onClick={onMultimodalFilterChange} />
            <FilterButton filter="image" label="Image" icon={<ImageIcon className="w-5 h-5" />} activeFilter={multimodalFilter!} onClick={onMultimodalFilterChange} />
            <FilterButton filter="audio" label="Voice" icon={<MicrophoneIcon className="w-5 h-5" />} activeFilter={multimodalFilter!} onClick={onMultimodalFilterChange} />
            <FilterButton filter="video" label="Video" icon={<VideoCameraIcon className="w-5 h-5" />} activeFilter={multimodalFilter!} onClick={onMultimodalFilterChange} />
        </div>
      )}
    </div>
  );
};

export default CommunityHeader;
