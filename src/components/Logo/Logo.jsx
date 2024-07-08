import React from 'react';
import styled from 'styled-components';

import logoSrc from '../../assets/logo.png';




const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 40px 0 40px;
  align-items: center;
  justify-content: center;

  #admin[data-is-tablet="true"] #sidebar & {
    display: none;
  }
`;


const Image = styled.div`
  background-image: url(${({ src }) => src || logoSrc});
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  height: 85px;
  width: 100%;
  max-width: 250px;

  [data-component="PageLogin"] & {
    max-width: 280px;
  }
`;


export const Logo= ({ src, ...props }) => (
  <Wrapper {...props}>
    <Image src={src || logoSrc} />
  </Wrapper>
);


export const LogoFull= ({ src, ...props }) => (
  <Wrapper {...props}>
    <Image src={src || logoSrc} />
  </Wrapper>
);


export const renderLogo = () => <LogoFull />;

export const renderSidebarLogo = () => <Logo />;
