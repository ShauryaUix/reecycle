/* eslint-disable no-undef */
import getKey from 'lodash/get';

import React,{ useState, useMemo, useRef } from 'react';
import styled from 'styled-components';

import Query from '../../hive-admin/src/components/Query';

import AntdButton from 'antd/lib/button';
import useQuery from '../../helpers/useQuery';
import Types from '../../helpers/types';

import { QRCodePreviewWithQuery } from '../QRCode/QRCode';
import ScannerCard from './ScannerCard';
import ScannerMap from './ScannerMap';
import ScannerPicker from './ScannerPicker';
import ScannerPrompt from './ScannerPrompt';

QRCodePreviewWithQuery.defaultProps = Object.assign(QRCodePreviewWithQuery.defaultProps || {}, { Query });

export {
  default as ScannerContext,
  Provider as ScannerProvider,
  Consumer as ScannerConsumer,
} from './ScannerContext';

export * from '../QRCode/QRCode';

const ScannerButton = styled(AntdButton)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  font-size: 26px;
  width: 60px;
  height: 60px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.3);
  border-width: 2px;
  i {
    line-height: 0.95 !important;
  }
  z-index: 9999;
`;

const CodeScanner = ({ client, viewer, isVisible, setIsVisible }) => {
  const [userId, setUserId] = useState(viewer._id);
  const [{ data: user }] = useQuery(client, {
    url: `/users/${userId}?query=${btoa(JSON.stringify({
      populate: { area: true },
    }))}`,
    skip: !userId,
    extractData: data => (data ? data.data : null),
  });

  const [{ data: cages }] = useQuery(client, {
    url: `/cages?${stringifyQuery({
      query: JSON.stringify({
        populate: { organization: true },
      }),
    })}&isVisible=${isVisible}`,
    extractData: data => (data ? data.data.data : []),
  });

  const sortableCategories = useMemo(
    () => (
      viewer ? viewer._.categories.filter(({ sortable }) => sortable !== false) : []
    ),
    [viewer],
  );

  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [activeCageId, setActiveCageId] = useState(null);
  const [code, setCode] = useState(null);

  const codeCacheRef = useRef({
    code: null,
    count: 0,
  });

  const cage = useMemo(() => cages.find(({ _id }) => _id === activeCageId), [cages, activeCageId]);

  const [action, setAction] = useState(null);

  const [{ data: dataPrompt, error: errorPrompt }] = useQuery(client, {
    url: `/recycletags/scan/${code}?${stringifyQuery({
      query: JSON.stringify({
        user: userId,
        cage: cage ? cage._id : undefined,
        action: action ? action.id : null,
      }),
    })}`,
    method: 'POST',
    extractData: data => (data ? data.data.prompt : null),
    extractError: error =>
      !error || !error.response || !error.response.data
        ? null
        : {
            title: 'Oh, snap!',
            subtitle: getKey(error.response, 'data.message', 'Something went wrong, please try again!'),
            description: getKey(error.response, 'data.meta.description'),
            actions: [
              {
                id: 'CLOSE',
                title: 'OK',
              },
            ],
          },
    data: action,
    skip: !code && !action,
  });

  const [isRegularFlow, setIsRegularFlow] = useState(false);
  const prompt = dataPrompt || errorPrompt;

  const onScan = useMemo(
    () =>
      prompt || isMapVisible || code
        ? null
        : (newValue) => {
            const newCode = newValue.split('/').slice(-1)[0];
            const { current: cache } = codeCacheRef;
            if (cache.code === code) {
              cache.count++;
            }
            if (cache.code !== code || cache.count > 5) {
              setCode(newCode);
              cache.code = code;
              cache.count = 0;
            }
          },
    [prompt, isMapVisible, code],
  );

  const onClose = () => {
    setCode(null);
    setIsVisible(false);
    setIsMapVisible(false);
    setActiveCageId(null);
    setIsRegularFlow(false);
  };

  const setCage = (cageId) => {
    if (cageId) {
      setIsRegularFlow(true);
    }
    setActiveCageId(cageId);
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <ScannerCard
        isVisible={!prompt && !isMapVisible && isVisible}
        isRegularFlow={isRegularFlow}
        onBackdropClick={onClose}
        onPullDown={onClose}
        onScan={onScan}
        onClose={onClose}
        setIsMapVisible={setIsMapVisible}
        setIsRegularFlow={setIsRegularFlow}
        onCageClick={setCage}
        cage={cage}
        cages={cages}
        user={user}
      />
      <ScannerMap
        isVisible={!prompt && isMapVisible}
        client={client}
        cage={cage}
        cages={cages}
        onClose={() => {
          setIsMapVisible(false);
          setActiveCageId(null);
        }}
        onCageClick={setCage}
        setIsMapVisible={setIsMapVisible}
      />
      <ScannerPrompt
        prompt={prompt}
        onClose={() => {
          setCode(null);
          setAction(null);
        }}
        onCageClick={setCage}
        setAction={(newAction) => setAction(newAction)}
        categories={sortableCategories}
      />
      <ScannerPicker
        isVisible={isPickerVisible}
        userId={userId}
        setUserId={setUserId}
        client={client}
        onOk={() => {
          setIsVisible(true);
          setIsPickerVisible(false);
        }}
        onCancel={() => {
          setIsPickerVisible(false);
        }}
      />
      {!viewer || viewer.role === Types.USER_ROLE_CONST.CUSTOMER ? null : (
        <ScannerButton
          icon="scan"
          shape="circle"
          type="primary"
          onClick={() => {
            if (viewer.role === Types.USER_ROLE_CONST.ADMIN) {
              setIsPickerVisible(true);
              setIsVisible(false);
            } else {
              setIsPickerVisible(false);
              setIsVisible(true);
            }
            setCode(null);
          }}
        />
      )}
    </>
  );
};

export default CodeScanner;
