import autoBind from 'auto-bind';
import { action, makeAutoObservable, observable } from 'mobx';

import { durationType, OrderType } from '~/types/api';
import { LessonSortDataType, SortByOrderType } from '~/types/sort';

export default class SortStore {
  @observable sortTypes: LessonSortDataType = {
    search: '',
    level: 'all',
    created: 'all',
    numberOfTerms: 'all',
    type: 'all',
    page: 1,
    order: 'date:desc',
  };
  @observable searchQuery: string;
  @observable sortDuration: durationType = 'any';
  @observable sortSearchOrder: OrderType = 'relevance';

  constructor() {
    autoBind(this);
    makeAutoObservable(this);
  }

  @action setSortTypes(sortTypes: LessonSortDataType) {
    this.sortTypes = { ...this.sortTypes, ...sortTypes };
  }

  @action setSortDuration(sortDuration: durationType) {
    this.sortDuration = sortDuration;
  }

  @action setSortOrder(sortOrder: OrderType) {
    this.sortSearchOrder = sortOrder;
  }

  @action setSearchQuery(query: string) {
    this.searchQuery = query;
  }

  @action resetSortTypes() {
    this.sortTypes = {
      search: '',
      level: 'all',
      created: 'all',
      numberOfTerms: 'all',
      type: 'all',
      page: 1,
      order: 'date:desc',
    };
  }

  @action setLessonsSorted(sortTypes: SortByOrderType, arrayToSort) {
    return arrayToSort.sort((a, b) => {
      switch (sortTypes) {
        case 'date:desc':
          return +new Date(b.updatedAt) - +new Date(a.updatedAt);
        case 'date:asc':
          return +new Date(a.updatedAt) - +new Date(b.updatedAt);
        case 'alfabet:asc':
          return (
            +(a.name.toLowerCase() > b.name.toLowerCase()) ||
            -(a.name.toLowerCase() < b.name.toLowerCase())
          );
        case 'alfabet:desc':
          return (
            +(b.name.toLowerCase() > a.name.toLowerCase()) ||
            -(b.name.toLowerCase() < a.name.toLowerCase())
          );
      }
    });
  }
}
