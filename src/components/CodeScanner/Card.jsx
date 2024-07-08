import React from 'react';
import styled, { css } from 'styled-components';

import ModalCardDefault, {
  Card as ModalCard,
  Spacer as ModalSpacer,
} from '../ModalCard/ModalCard';
import { ButtonCancel } from '../button/button';





export const Space = styled.div`
  width: ${({ w }) => w}px;
  height: ${({ h }) => h}px;
  flex: 1 0 auto;
`;

export const Modal = styled(ModalCardDefault)`
  ${ModalCard} {
    align-items: center;
    padding: 20px;
    padding-bottom: 40px;
  }
`;

export const Close = styled(ButtonCancel)`
  position: absolute;
  top: -80px;
`;

export const SpacerClickThrough = styled(ModalSpacer)`
  pointer-events: none;
`;

export const Image = styled.img`
  height: auto;
  width: 100%;
  max-width: 200px;
  margin: 15px;
`;

export const Title = styled.h1`
  margin: 15px;
  text-align: center;
  font-size: 34px;
  font-weight: 700;
  margin-bottom: 0px;
  color: ${({ theme }) => theme.less.textColor};
`;

export const Subtitle = styled.h2`
  color: ${({ theme }) => theme.less.textColor};
  text-align: center;
  opacity: 0.5;
  font-size: 18px;
  margin: 15px;
  margin-bottom: 0px;
`;

export const Description = styled.p`
  text-align: center;
  font-size: 14px;
  line-height: 120%;
  opacity: 0.6;
  margin: 10px;
`;

export const Link = styled.a`
  margin: 15px;
  margin-top: 5px;
  text-decoration: underline;
  font-weight: 600;
  font-size: 90%;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  border-radius: 30px;
  max-width: 300px;
  background-color: ${({ background, theme }) =>
    background || theme.colors.dark};
  color: ${({ theme }) => theme.colors.text.light};
  text-align: center;
  height: 60px;
  font-weight: 600;
  white-space: nowrap;

  ${({ index }) =>
    index &&
    css`
      margin-top: 10px;
    `}

  transition: background-color 700ms;
`;

export const ButtonTitle = styled.div``;

export const ButtonSubtitle = styled.div`
  font-size: 10px;
  opacity: 0.5;
  margin-top: 5px;
`;


export const Button= ({
  title,
  subtitle,
  ...props
}) => {
  return (
    <ButtonWrapper {...props}>
      {title && <ButtonTitle>{title}</ButtonTitle>}
      {subtitle && <ButtonSubtitle>{subtitle}</ButtonSubtitle>}
    </ButtonWrapper>
  );
};
