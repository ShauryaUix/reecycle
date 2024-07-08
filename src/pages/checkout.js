/* eslint-disable import/no-anonymous-default-export */
// import React, { useEffect } from 'react';
import queryString from 'query-string';

import Page from '../hive-admin/src/components/Page';

class PageCheckout extends Page {
  render() {
    const { success } = queryString.parse(window.location.search.slice(1));
    window.parent.postMessage(
      JSON.stringify([
        'checkout',
        { success: `${success}` === 'true' },
      ]),
      '*',
    );
    return null;
  }
}

export default [(config = {}) => PageCheckout.create(config), {
  hidden: true,
  hideHeader: true,
  hideSidebar: true,
  path: '/checkout-card-verification',
  exact: true,
}];
