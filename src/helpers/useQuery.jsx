import { useEffect, useState, useCallback, useRef } from 'react';

function defaultExtractData(data) {
  return data ? data : null;
}

function defaultExtractError(error) {
  return error ? error : null;
}

export default function useQuery(client, {
  url,
  data,
  skip = false,
  method = 'GET',
  extractData = defaultExtractData,
  extractError = defaultExtractError,
}) {
  const cache = useRef({
    source: client.createSource(),
    request: null,
  });
  const [refreshCount, setRefreshCount] = useState(0);
  const updateRefreshCount = useCallback(
    () => setRefreshCount(refreshCount + 1),
    [refreshCount],
  );
  const [
    state,
    setState,
  ] = useState({
    loading: skip ? false : true,
    data: extractData(null),
    error: extractError(null),
  });
  useEffect(
    () => {
      if (cache.current.source) {
        cache.current.request = null;
        cache.current.source.cancel();
        cache.current.source = client.createSource();
      }
      if (!skip) {
        cache.current.request = client.request({
          url,
          method,
          data,
          cancelToken: cache.current.source.token,
        });
        cache.current.request.then((response) => {
          setState({
            ...state,
            loading: false,
            error: null,
            data: extractData(response),
          });
        });
        cache.current.request.catch((error) => {
          setState({
            ...state,
            loading: false,
            data: null,
            error: extractError(error),
          });
        });
      } else {
        setState({
          data: null,
          error: null,
          loading: false,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      client,
      refreshCount,
      url,
      method,
      data,
      skip,
    ],
  );
  return [state, updateRefreshCount];
}
