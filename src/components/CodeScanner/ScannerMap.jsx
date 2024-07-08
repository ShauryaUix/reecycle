/* eslint-disable no-undef */
import React, {
    useRef,
    useMemo,
    useState,
    useEffect,
    forwardRef,
  } from 'react';
  import styled, { css, useTheme } from 'styled-components';
  import { motion } from 'framer-motion';
  
  import {
    Space,
    Modal,
    Close,
    Image,
    Title,
    Subtitle,
    Description,
    Link,
    Button,
  } from './Card';
  
  import logoFullSrc from '../../assets/logo.png';
  import cageActiveSrc from '../../assets/cage-active@3x.png';
  import cageInactiveSrc from '../../assets/cage-inactive@3x.png';
  

  
  // const MARKER_ICON = {
  //   scaledSize: new google.maps.Size(100, 110),
  //   anchor: new google.maps.Point(50, 90),
  //   origin: new google.maps.Point(0, 0),
  //   rotation: 0,
  // };

  
  
  const MapWrapper = styled(motion.div)`
    position: fixed;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    background: ${({ color }) =>
      typeof color === 'object'
        ? `linear-gradient(to right, ${color[0]}, ${color[1]})`
        : color || 'rgba(0, 0, 0, 0.4)'};
    z-index: 9999999999;
    ${({ blur }) =>
      blur &&
      css`
        backdrop-filter: blur(5px);
      `}
    pointer-events: initial;
  `;
  
  MapWrapper.defaultProps = {
    color: 'rgba(0, 0, 0, 0.4)',
    blur: true,
  };
  
  const MapContainer = styled.div`
    position: absolute;
    top: 0px;
    bottom: 0px;
    right: 0px;
    left: 0px;
    pointer-events: initial;
  `;
  

  
  export const GoogleMap = forwardRef(
    (
      {
        zoom,
        location,
        cage,
        cages,
        onCageClick,
        ...props
      },
      ref,
    ) => {
      const theme = useTheme();
      const mapContainerRef = useRef(null);
      // eslint-disable-next-line no-undef
      const mapRef = useRefnull();
      const cagesRef = useRef([]);
  
      useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
          mapRef.current = new google.maps.Map(
            mapContainerRef.current,
            {
              scaleControl: true,
              center: { ...location },
              zoom,
              disableDefaultUI: true,
              gestureHandling: 'greedy',
              clickableIcons: false,
            },
          );
          mapRef.current.addListener('click', () => onCageClick(null));
        }
        if (mapRef.current) {
          mapRef.current.panTo({ ...location });
          mapRef.current.setZoom(zoom);
          mapRef.current.panBy(0, 150);
        }
      }, [location, zoom, onCageClick, mapRef]);
  
      useEffect(() => {
        cagesRef.current.forEach(({ marker }) => {
          marker.setMap(null);
        });
        cagesRef.current = [];
        const bounds = new google.maps.LatLngBounds();
        cages.forEach((currentCage) => {
          bounds.extend({
            lng: currentCage.address.coordinates[0],
            lat: currentCage.address.coordinates[1],
          });
          const isActive = cage && currentCage._id === cage._id;
          const marker = new google.maps.Marker({
            icon: {
              ...MARKER_ICON,
              url: isActive ? cageActiveSrc : cageInactiveSrc,
            },
            position: {
              lng: currentCage.address.coordinates[0],
              lat: currentCage.address.coordinates[1],
            },
            title: currentCage.name,
            // map: mapRef.current!,
          });
          // marker.setMap(mapRef.current!);
          marker.addListener('click', () => {
            onCageClick(currentCage._id);
          });
          cagesRef.current.push({ marker, cage: currentCage });
        });
        mapRef.current?.fitBounds(bounds, 120);
        const timeout = setTimeout(() => {
          if (cages.length < 2) {
            mapRef.current?.setZoom(zoom);
            mapRef.current?.panBy(0, 100);
          }
        }, 300);
        return () => {
          clearTimeout(timeout);
        };
      }, [cages, cage, zoom, onCageClick, mapRef]);
  
      useEffect(() => {
        cagesRef.current.forEach(({ cage: currentCage, marker }) => {
          const isActive = cage && currentCage._id === cage._id;
          marker.setIcon({
            ...MARKER_ICON,
            url: isActive ? cageActiveSrc : cageInactiveSrc,
          });
        });
      }, [theme, cage]);
  
      return (
        <MapWrapper ref={ref} {...props}>
          <MapContainer ref={mapContainerRef} />
        </MapWrapper>
      );
    },
  );
  
  GoogleMap.defaultProps = {
    onCageClick: () => {},
  };
  
 
  
  const ScannerMap= ({
    isVisible,
    client,
    cage,
    cages,
    onClose,
    onCageClick,
    children,
    setIsMapVisible,
    ...props
  }) => {
    const [userLocation] = useState({
      lng: 55.19885206855022,
      lat: 25.113897110259508,
    });
  
    const location = useMemo(() => (
      cage
        ? {
          lng: cage.address.coordinates[0],
          lat: cage.address.coordinates[1],
        }
        : userLocation
    ), [userLocation, cage]);
  
    return (
      <Modal
        ComponentBackDrop={GoogleMap}
        backdropProps={{
          zoom: 15,
          location,
          cage,
          cages,
          onCageClick,
        }}
        wrapperProps={{ style: { pointerEvents: 'none' } }}
        {...props}
      >
        {
          isVisible
            ? (
              <>
                <Close onClick={onClose} />
                {
                  cage
                    ? (
                      <>
                        <Image
                          onError={(e) => e.target.style.display = 'none'}
                          src={
                            cage.organization.image
                              ? cage.organization.image.src
                              : logoFullSrc
                          }
                          alt=""
                        />
                        <Title>
                          {cage.organization.name}
                        </Title>
                        <Subtitle>
                          {cage.name}
                        </Subtitle>
                        <Description>
                          {cage.address.lines}
                        </Description>
                        <Link
                          href={
                            `https://www.google.com/maps/dir/?api=1&destination=${
                            cage.address.coordinates[1]
                            },${
                            cage.address.coordinates[0]
                            }`
                          }
                          target="_blank"
                        >
                          How do I get there?
                        </Link>
                        <Button
                          title="CONTINUE"
                          onClick={() => setIsMapVisible(false)}
                        />
                      </>
                    )
                    : (
                      <>
                        <Image src={logoFullSrc} />
                        <Title>Choose The Cage</Title>
                        <Subtitle>To Start a Request</Subtitle>
                      </>
                    )
                }
                <Space h={10} />
              </>
            )
            : null
        }
      </Modal>
    );
  };
  
  export default ScannerMap;
  