import isString from 'lodash/isString';
import queryString from 'query-string';

export default function clickAnchor(href, extras = {}) {
  const anchor = document.createElement('a');
  anchor.href = (
      isString(href)
    ? href
    : `${href.url}?${queryString.stringify(href.query || {})}`
  );
  Object.assign(anchor, extras);
  anchor.click();
}
