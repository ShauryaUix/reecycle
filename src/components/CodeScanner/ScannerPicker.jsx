import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Modal as AntdModal, Row as AntdRow } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import Admin from '../../hive-admin/src/components/Admin';
import Types from '../../helpers/types';

const CloseIcon = styled(PlusOutlined)`
  margin-top: env(safe-area-inset-top);
  transform: rotate(45deg);
  font-size: 140%;
`;

const ScannerPickerModal = styled(AntdModal)``;

const ScannerPickerModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  .ant-row {
    width: 100%;
    .ant-select {
      width: 100%;
    }
  }
`;

const ScannerPicker = ({
  userId,
  setUserId,
  isVisible,
  onOk,
  onCancel,
  client,
}) => {
  const userField = useMemo(
    () =>
      Admin.compileFromLibrary([
        'FieldConnectionSelect',
        {
          name: 'user',
          label: null,
          placeholder: 'Search platform users',
          allowClear: true,
          searchPaths: ['name'],
          url: '/users',
          getExtraQueryConditions: () => [
            {
              role: { NE: Types.USER_ROLE_CONST.ADMIN },
              active: true,
            },
          ],
          getChoiceLabel: (item) =>
            `${item.name} / ${Types.USER_ROLE_LABELS_MAP[item.role]}`,
        },
      ]),
    []
  );

  return (
    <ScannerPickerModal
      title="User Scanning"
      visible={isVisible}
      onOk={onOk}
      okText="Open Scanner"
      okButtonProps={{ disabled: !userId }}
      onCancel={onCancel}
      closeIcon={<CloseIcon />}
      destroyOnClose
    >
      <ScannerPickerModalWrapper>
        <AntdRow>
          {userField.render({
            form: null,
            value: userId,
            onChange: (value) => setUserId(value),
            client,
          })}
        </AntdRow>
      </ScannerPickerModalWrapper>
    </ScannerPickerModal>
  );
};

export default ScannerPicker;
