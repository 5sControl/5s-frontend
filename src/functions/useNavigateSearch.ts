import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

export const useNavigateSearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const existParams: { [key: string]: Array<string> } = {};

  for (const entry of searchParams.entries()) {
    if (existParams[entry[0]]) {
      existParams[entry[0]] = [...existParams[entry[0]], entry[1]];
    } else {
      existParams[entry[0]] = [entry[1]];
    }
  }

  return (
    pathname: string,
    params: { [key: string]: string },
    removeParams?: Array<string>
  ) => {
    if (removeParams) {
      for (const key of removeParams) {
        delete existParams[key];
      }
    }
    return navigate({
      pathname,
      search: `?${createSearchParams({ ...existParams, ...params })}`,
    });
  };
};
