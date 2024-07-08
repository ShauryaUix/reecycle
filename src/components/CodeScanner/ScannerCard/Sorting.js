import React, {
  useState,
  useEffect,
} from 'react';
import styled from 'styled-components';

import AntdButton from 'antd/lib/button';
import AntdInput from 'antd/lib/input';

import Types from '../../../helpers/types';

const SortingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  flex-shrink: 0;
  margin-top: -20px;
  padding-top: 0px;
  padding-bottom: 40px;
`;

const SortingCategoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 30px;
`;

const SortingCategoryTitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: 400;
  opacity: 0.6;
  width: 100%;
  text-align: center;
`;

const SortingCategoryUnit = styled.div`
  display: flex;
  font-size: 12px;
  text-align: center;
  opacity: 0.6;
`;

const SortingCategoryControls = styled.div`
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  justify-content: space-between;
  margin-top: 10px;
`;

const SortingCategoryButtonGroup = styled(AntdButton.Group)`
  flex-shrink: 0;
  flex-wrap: nowrap;
  white-space: nowrap;
  &:first-child .ant-btn:last-child {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }
  &:last-child .ant-btn:first-child {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }
`;

const SortingCategoryButton = styled(AntdButton)`
  width: 40px;
  max-width: 40px;
  min-width: 40px;
  padding: 0px;
  text-align: center;
`;

SortingCategoryButton.defaultProps = {
  type: 'primary',
  ghost: true,
};

const AntdInputHTML = ({ error, ...props }) => (
  <AntdInput {...props} />
);

// eslint-disable-next-line max-len
const SortingCategoryInput = styled(AntdInputHTML).attrs(
  ({ error, theme }) => ({
    style: (
      error
      ? {
          color: theme.less.errorColor,
        }
      : undefined
    ),
  }),
)`
  flex: 1;
  flex-shrink: 1;
  flex-grow: 1;
  text-align: center;
  border-radius: 0px;
  border-left: 0px;
  border-right: 0px;
  font-size: 140%;
  &:focus::placeholder {
    opacity: 0;
  }
`;

function SortingCategoryField({ value, onChange, ...props }) {
  const [localValue, setLocalValue] = useState(value);
  const [error, setError] = useState(false);
  useEffect(
    () => {
      if (Number.isFinite(value)) {
        setLocalValue(value);
      }
    },
    [value],
  );
  return (
    <SortingCategoryInput
      value={localValue}
      placeholder="0"
      inputMode="decimal"
      error={error}
      onChange={(event) => {
        const { value: inputValue } = event.target;
        const number = parseFloat(inputValue);
        if (Number.isFinite(number)) {
          setError(false);
          onChange(number);
        } else {
          setError(null);
          onChange(undefined);
        }
        setLocalValue(inputValue);
      }}
      {...props}
    />
  );
}

SortingCategoryField.getValidNumber = (value) => {
  const number = parseFloat(value);
  if (Number.isFinite(number)) {
    return number;
  }
  return null;
};

export default function Sorting({
  categories = [],
  value,
  onChange,
}) {
  const onRelativeChange = (id, inc) => onChange({
    ...value,
    [id]: Math.max(0, (Number.isFinite(value[id]) ? value[id] : 0) + inc),
  });
  return (
    <SortingWrapper>
      {
        categories.map(({ id, label, unit }) => (
          <SortingCategoryWrapper key={id}>
            <SortingCategoryTitle>
              {label}
              <SortingCategoryUnit>
                {(Types.CATEGORY_UNITS_MAP[unit] || {}).label}
              </SortingCategoryUnit>
            </SortingCategoryTitle>
            <SortingCategoryControls>
              <SortingCategoryButtonGroup>
                <SortingCategoryButton
                  onClick={() => onRelativeChange(id, -10)}
                >
                  -10
                </SortingCategoryButton>
                <SortingCategoryButton
                  onClick={() => onRelativeChange(id, -1)}
                >
                  -1
                </SortingCategoryButton>
              </SortingCategoryButtonGroup>
              <SortingCategoryField
                value={value[id]}
                onChange={newValue => onChange({
                  ...value,
                  [id]: newValue,
                })}
              />
              <SortingCategoryButtonGroup>
                <SortingCategoryButton
                  onClick={() => onRelativeChange(id, 1)}
                >
                  +1
                </SortingCategoryButton>
                <SortingCategoryButton
                  onClick={() => onRelativeChange(id, 10)}
                >
                  +10
                </SortingCategoryButton>
              </SortingCategoryButtonGroup>
            </SortingCategoryControls>
          </SortingCategoryWrapper>
        ))
      }
    </SortingWrapper>
  );
}
