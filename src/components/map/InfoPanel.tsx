import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../../assets/css/TenerifeMap/InfoPanel.css';
import type { PlaceProperties } from './utils/mapTypes';
import { useNearbyTransport } from './utils/useNearbyTransport';
import InfoPanelHeader from './InfoPanelHeader';
import InfoPanelDetails from './InfoPanelDetails';
import InfoPanelTransport from './InfoPanelTransport';
import InfoPanelFooter from './InfoPanelFooter';

interface InfoPanelProps {
  selectedItem: PlaceProperties;
  onClose: () => void;
  markerColor: string;
}

const MOBILE_BREAKPOINT = 900;

const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;

type SnapState = 'expanded' | 'peek';

const getSnapY = (snap: SnapState): number => {
  const h = window.innerHeight;
  switch (snap) {
    case 'expanded': return 10;
    case 'peek': return Math.round(h * 0.65);
  }
};

const InfoPanel: React.FC<InfoPanelProps> = ({ selectedItem, onClose, markerColor }) => {
  const [favorites, setFavorites] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem('favs') || '[]'),
  );
  const nearbyTransport = useNearbyTransport(selectedItem);

  const [snapState, setSnapState] = useState<SnapState>('peek');

  const panelRef = useRef<HTMLDivElement>(null);
  const isOpening = useRef(true);

  const dragStartY = useRef<number>(0);
  const dragStartTime = useRef<number>(0);
  const dragging = useRef<boolean>(false);
  const lastDeltaY = useRef<number>(0);
  const applySnap = useCallback((snap: SnapState, animate = true) => {
    if (!panelRef.current) return;
    const y = getSnapY(snap);

    panelRef.current.style.transition = animate
      ? 'transform 0.4s cubic-bezier(0.32, 0, 0.12, 1)'
      : 'none';

    panelRef.current.style.transform = `translateY(${y}px)`;
  }, []);

  useEffect(() => {
    setSnapState('peek');

    if (isOpening.current) {
      requestAnimationFrame(() => {
        applySnap('peek', false);
        isOpening.current = false;
        setTimeout(() => panelRef.current?.focus(), 100);
      });
    } else {
      requestAnimationFrame(() => applySnap('peek', true));
      setTimeout(() => panelRef.current?.focus(), 100);
    }
  }, [selectedItem, applySnap]);

  useEffect(() => {
    isOpening.current = true;
    return () => { isOpening.current = true; };
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile()) return;
    dragging.current = true;
    dragStartY.current = e.touches[0].clientY;
    dragStartTime.current = Date.now();
    lastDeltaY.current = 0;
    if (panelRef.current) panelRef.current.style.transition = 'none';
  }, []);

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!dragging.current || !isMobile() || !panelRef.current) return;
      const delta = e.touches[0].clientY - dragStartY.current;
      lastDeltaY.current = delta;
      const baseY = getSnapY(snapState);
      const newY = Math.max(getSnapY('expanded') - 20, baseY + delta);
      panelRef.current.style.transform = `translateY(${newY}px)`;
    },
    [snapState],
  );

  const onTouchEnd = useCallback(() => {
    if (!dragging.current || !isMobile()) return;
    dragging.current = false;
    const delta = lastDeltaY.current;
    const elapsed = Date.now() - dragStartTime.current;
    const velocity = delta / Math.max(elapsed, 1);

    let nextSnap: SnapState = snapState;
    const isFlickDown = velocity > 0.5;
    const isFlickUp = velocity < -0.5;
    const THRESHOLD = 80;

    if (isFlickDown) {
      if (snapState === 'expanded') nextSnap = 'peek';
      else { onClose(); return; }
    } else if (isFlickUp) {
      nextSnap = 'expanded';
    } else if (delta > THRESHOLD) {
      if (snapState === 'expanded') nextSnap = 'peek';
      else { onClose(); return; }
    } else if (delta < -THRESHOLD) {
      nextSnap = 'expanded';
    }

    setSnapState(nextSnap);
    applySnap(nextSnap, true);
    lastDeltaY.current = 0;
  }, [snapState, applySnap, onClose]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isMobile()) return;
    dragging.current = true;
    dragStartY.current = e.clientY;
    dragStartTime.current = Date.now();
    lastDeltaY.current = 0;
    if (panelRef.current) panelRef.current.style.transition = 'none';
  }, []);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging.current || !isMobile() || !panelRef.current) return;
      const delta = e.clientY - dragStartY.current;
      lastDeltaY.current = delta;
      const baseY = getSnapY(snapState);
      const newY = Math.max(getSnapY('expanded') - 20, baseY + delta);
      panelRef.current.style.transform = `translateY(${newY}px)`;
    },
    [snapState],
  );

  const onMouseUp = useCallback(() => {
    if (!dragging.current || !isMobile()) return;
    dragging.current = false;
    const delta = lastDeltaY.current;
    const elapsed = Date.now() - dragStartTime.current;
    const velocity = delta / Math.max(elapsed, 1);

    let nextSnap: SnapState = snapState;
    const isFlickDown = velocity > 0.5;
    const isFlickUp = velocity < -0.5;
    const THRESHOLD = 80;

    if (isFlickDown) {
      if (snapState === 'expanded') nextSnap = 'peek';
      else { onClose(); return; }
    } else if (isFlickUp) {
      nextSnap = 'expanded';
    } else if (delta > THRESHOLD) {
      if (snapState === 'expanded') nextSnap = 'peek';
      else { onClose(); return; }
    } else if (delta < -THRESHOLD) {
      nextSnap = 'expanded';
    }

    setSnapState(nextSnap);
    applySnap(nextSnap, true);
    lastDeltaY.current = 0;
  }, [snapState, applySnap, onClose]);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  const isFavorite = favorites.includes(selectedItem.nombre);

  const toggleFavorite = () => {
    const updated = isFavorite
      ? favorites.filter(f => f !== selectedItem.nombre)
      : [...favorites, selectedItem.nombre];
    setFavorites(updated);
    localStorage.setItem('favs', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const sharePage = async () => {
    const shareData = {
      title: selectedItem.nombre,
      text: `Mira este lugar en Tenerife: ${selectedItem.nombre}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        alert('¡Enlace copiado al portapapeles!');
        await navigator.share(shareData);
      }
    } catch (err) {
      console.error('Error al compartir:', err);
    }
  };

  const normalizeText = (text: string): string => {
    if (!text) return '';
    if (text === 'museos salas de arte') return 'Museos y Salas de arte';
    if (text === 'biblioteca ludoteca') return 'Biblioteca y Ludoteca';
    if (text === 'guarderias centros infantiles')
      return 'Guarderías y Centros infantiles';
    const preposiciones = ['de', 'del', 'la', 'las', 'el', 'los', 'en', 'y', 'a'];
    return text
      .toLowerCase()
      .split(' ')
      .map((word, index) =>
        preposiciones.includes(word) && index !== 0
          ? word
          : word.charAt(0).toUpperCase() + word.slice(1),
      )
      .join(' ');
  };

  const activityLabel = normalizeText(selectedItem.actividad_tipo);

  return (
    <div
      className="info-panel"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalles de ${selectedItem.nombre}`}
      data-snap={snapState}
      tabIndex={-1}
    >
      <div
        className="drawer-handle-zone"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        aria-hidden="true"
      >
        <span className="drawer-handle" />
      </div>

      <InfoPanelHeader
        selectedItem={selectedItem}
        markerColor={markerColor}
        isFavorite={isFavorite}
        activityLabel={activityLabel}
        onToggleFavorite={toggleFavorite}
        onClose={onClose}
      />

      <div className="separator"></div>

      <InfoPanelDetails selectedItem={selectedItem} />

      <div className="separator"></div>

      <div className="secondary-actions"></div>

      <InfoPanelTransport nearbyTransport={nearbyTransport} />

      <InfoPanelFooter onShare={sharePage} />

      <button
        type="button"
        className="sr-only sr-only-focusable"
        onClick={onClose}
      >
        Cerrar detalles del centro y volver al mapa
      </button>

    </div>
  );
};

export default InfoPanel;
