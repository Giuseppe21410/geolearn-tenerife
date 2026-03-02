export const TENERIFE_BOUNDS = {
    minLat: 27.95,
    maxLat: 28.65,
    minLng: -16.95,
    maxLng: -16.05,
};

export const isLocationInTenerife = (lat: number, lng: number): boolean => {
    return (
        lat >= TENERIFE_BOUNDS.minLat &&
        lat <= TENERIFE_BOUNDS.maxLat &&
        lng >= TENERIFE_BOUNDS.minLng &&
        lng <= TENERIFE_BOUNDS.maxLng
    );
};
