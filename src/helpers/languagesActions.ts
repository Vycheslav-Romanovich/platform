import ISO6391 from 'iso-639-1';

import api from '../api_client/api';
import { Lang } from '../types/settings';

export const getAllLanguages = async () => {
  const resp = await api.getLanguages();
  const langList = resp.data.supportedLanguages;
  const sortLangList: Lang[] = ISO6391.getLanguages(langList)
    .filter((l) => l.name)
    .sort((a, b) => a.name.localeCompare(b.name));
  return sortLangList;
};
