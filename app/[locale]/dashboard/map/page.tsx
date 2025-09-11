"use client";

import GoogleMap from "@/components/google-map";
import { algeriaMarkers, algeriaCenter, mapZoom } from "@/lib/algeria-markers";
import { useTranslations } from 'next-intl';

const MapPage = () => {
  const t = useTranslations('map');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <div className="h-[600px] w-full rounded-md overflow-hidden">
            <GoogleMap
              center={algeriaCenter}
              zoom={mapZoom}
              markers={algeriaMarkers}
            />
          </div>
        </div>
        
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span>{t('totalMarkers')}: {algeriaMarkers.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <span>{t('highDensity')}: {t('highDensityCities')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-600"></div>
              <span>{t('coverage')}: {t('allAlgeriaRegions')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
