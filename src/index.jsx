/* eslint-disable no-undef */
import './helpers/fixInfiniteScroller';

import React from 'react';
import ReactDOM from 'react-dom';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import Admin from './hive-admin/src/components/Admin'; 

import { Link} from 'react-router-dom';

import './helpers/library';

import './hive-admin/src/components/FieldGoogleAddress';
import './hive-admin/src/components/FieldGooglePolygon';

import './components/antd.less';
import './components/admin.less';

import './components/FieldTitle';
import './components/FieldCheckoutCard';
import './components/FieldColorPicker';
import './components/FieldTagsCount';
import './components/FilterActionLink';

import UserPages from './pages/Users'; 
import PageCheckout from "./pages/checkout"

import { renderLogo, renderSidebarLogo } from './components/Logo/Logo';

import Types from './helpers/types'; 

import Signup from './pages/Signup';
import Theme from './theme';

const {
  REACT_APP_NODE_ENV='',
  REACT_APP_API_PATH,
  REACT_APP_PUBLIC_URL = '',
} = process.env;

const { SERVER_URL } = Types;

const base = window.ADMIN_BASE = `${REACT_APP_PUBLIC_URL}/`;
const restBase = REACT_APP_NODE_ENV !== 'production'
? `${REACT_APP_API_PATH}`
: `${SERVER_URL}${REACT_APP_API_PATH}`;
// const restBase = `https://platform.reecycle.app${REACT_APP_API_PATH}`;
// const restBase = `http://192.168.0.101:8000${REACT_APP_API_PATH}`;
// const restBase = `https://thrs-ree-api.tunnelto.dev${REACT_APP_API_PATH}`;

const admin = Admin.create({
  base,
  restBase,
  restBaseRoot: `${SERVER_URL}${REACT_APP_API_PATH}`,
  titlePrefix: 'Ree | ',
  sidebarProps: { renderLogo: renderSidebarLogo },
  passwordSetSuccessRedirectPath: '/login',
  accountActivationSuccessRedirectPath: '/login',
  viewerUrl: '/users/me',
  checkoutCardInputRef: React.createRef(),
  validateViewer: async (viewer, props) => {
    if (['ADMIN', 'CUSTOMER', 'DRIVER', 'SORTER'].indexOf(viewer.role) === -1) {
      throw new Error('Invalid credentials');
    }
    const { client } = props;
    const { data: { data: categoriesArray } } = await props.client.request({
      url: '/categories',
    });
    const { data: tiersMap } = await props.client.request({
      url: '/users/tiers',
    });
    const categoriesMap = categoriesArray.reduce(
      (agr, category) => {
        agr[category._id] = category;
        agr[category._id].label = category.name;
        return agr;
      },
      {},
    );
    viewer._ = {
      categories: Types.CATEGORIES_LIST.map(category => ({
        ...category,
        ...(categoriesMap[category.id] || {}),
      })),
      tiersMap,
    };
    if (Capacitor.getPlatform() !== 'web') {
      PushNotifications.removeAllListeners();
      PushNotifications.addListener('registration', async (token) => {
        try {
          await client.request('users/actions/push-register', {
            method: 'POST',
            data: {
              platform: Capacitor.getPlatform().toUpperCase(),
              token: token.value,
            },
          });
          // eslint-disable-next-line no-console
          console.log('push token registration success');
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(`push token registration setting error: ${
            JSON.stringify(error)
          }`);
        }
      });
      PushNotifications.addListener('registrationError', (error) => {
        // eslint-disable-next-line no-console
        console.log(`push token registration error: ${
          JSON.stringify(error)
        }`);
      });
      PushNotifications.requestPermissions().then((permissions) => {
        if (permissions.receive === 'granted') {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
        } else {
          // No permission for push granted
        }
      });
    }
    return viewer;
  },
  structure: [
    ['PageLogin', {
      renderBeforeForm: renderLogo,
      redirect: [['redirect.authorized', '/']],
      renderAfterForm: props => (
        <>
          <p className="after-form" style={{ marginBottom: '0.3em' }}>
            Lost your password? Click
            {' '}
            <Link to={props.passwordResetPath}>
              here
            </Link>
            {' '}
            to set a new one.
          </p>
          <p className="after-form">
            If you dont yet have an account, click
            {' '}
            <Link to="/signup">
              here
            </Link>
            {' '}
            to sign up instead.
          </p>
        </>
      ),
    }],
    [Signup, {
      renderBeforeForm: renderLogo,
    }],
    PageCheckout,
    ['PagePasswordReset', {
      renderBeforeForm: renderLogo,
      redirect: [['redirect.authorized']],
    }],
    ['PagePasswordSet', { renderBeforeForm: renderLogo }],
    ['PageAccountActivation', {
      renderBeforeForm: renderLogo,
      accountActivationSuccessRedirectPath: '/',
    }],
    UserPages, 
    ['Page404', {
      redirect: [
        ['redirect.unauthorized'],
        ['redirect.always', '/'],
      ],
    }],
  ],
});

ReactDOM.render(
  (
    <Theme>
      {/* <Inter weights={[500, 600, 700, 900]} /> */}
      {admin}
    </Theme>
  ),
  document.getElementById('root'),
);
