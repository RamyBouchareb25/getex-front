import { MarkerData, MarkerType } from "@/components/google-map";

// Algeria regions with coordinates and marker densities
export const algeriaMarkers: MarkerData[] = [
  // Algiers (High concentration - ~50 markers)
  ...Array.from({ length: 50 }, (_, i) => ({
    lat: 36.7538 + (Math.random() - 0.5) * 0.3, // Algiers center with spread
    lng: 3.0588 + (Math.random() - 0.5) * 0.3,
    title: `Algiers Marker ${i + 1}`,
    type: (["point-de-vente", "grossiste", "grande-surface"] as MarkerType[])[Math.floor(Math.random() * 3)]
  })),

  // Oran (High concentration - ~40 markers)
  ...Array.from({ length: 40 }, (_, i) => ({
    lat: 35.6969 + (Math.random() - 0.5) * 0.25,
    lng: -0.6331 + (Math.random() - 0.5) * 0.25,
    title: `Oran Marker ${i + 1}`,
    type: (["point-de-vente", "grossiste", "grande-surface"] as MarkerType[])[Math.floor(Math.random() * 3)]
  })),

  // Annaba (High concentration - ~35 markers)
  ...Array.from({ length: 35 }, (_, i) => ({
    lat: 36.9000 + (Math.random() - 0.5) * 0.2,
    lng: 7.7667 + (Math.random() - 0.5) * 0.2,
    title: `Annaba Marker ${i + 1}`,
    type: (["point-de-vente", "grossiste", "grande-surface"] as MarkerType[])[Math.floor(Math.random() * 3)]
  })),

  // Constantine (Medium concentration - ~20 markers)
  ...Array.from({ length: 20 }, (_, i) => ({
    lat: 36.3650 + (Math.random() - 0.5) * 0.15,
    lng: 6.6147 + (Math.random() - 0.5) * 0.15,
    title: `Constantine Marker ${i + 1}`,
    type: (["point-de-vente", "grossiste", "grande-surface"] as MarkerType[])[Math.floor(Math.random() * 3)]
  })),

  // Setif (Medium concentration - ~15 markers)
  ...Array.from({ length: 15 }, (_, i) => ({
    lat: 36.1906 + (Math.random() - 0.5) * 0.12,
    lng: 5.4131 + (Math.random() - 0.5) * 0.12,
    title: `Setif Marker ${i + 1}`,
    type: (["point-de-vente", "grossiste", "grande-surface"] as MarkerType[])[Math.floor(Math.random() * 3)]
  })),

  // Batna (Medium concentration - ~12 markers)
  ...Array.from({ length: 12 }, (_, i) => ({
    lat: 35.5559 + (Math.random() - 0.5) * 0.12,
    lng: 6.1741 + (Math.random() - 0.5) * 0.12,
    title: `Batna Marker ${i + 1}`,
    type: (["point-de-vente", "grossiste", "grande-surface"] as MarkerType[])[Math.floor(Math.random() * 3)]
  })),

  // Tlemcen (Low concentration - ~8 markers)
  ...Array.from({ length: 8 }, (_, i) => ({
    lat: 34.8780 + (Math.random() - 0.5) * 0.1,
    lng: -1.3150 + (Math.random() - 0.5) * 0.1,
    title: `Tlemcen Marker ${i + 1}`,
    type: (["point-de-vente", "grossiste", "grande-surface"] as MarkerType[])[Math.floor(Math.random() * 3)]
  })),

  // Biskra (Low concentration - ~8 markers)
  ...Array.from({ length: 8 }, (_, i) => ({
    lat: 34.8481 + (Math.random() - 0.5) * 0.1,
    lng: 5.7281 + (Math.random() - 0.5) * 0.1,
    title: `Biskra Marker ${i + 1}`,
    type: (["point-de-vente", "grossiste", "grande-surface"] as MarkerType[])[Math.floor(Math.random() * 3)]
  })),

  // Ouargla (Low concentration - ~6 markers)
  ...Array.from({ length: 6 }, (_, i) => ({
    lat: 31.9539 + (Math.random() - 0.5) * 0.1,
    lng: 5.3281 + (Math.random() - 0.5) * 0.1,
    title: `Ouargla Marker ${i + 1}`,
    type: (["point-de-vente", "grossiste", "grande-surface"] as MarkerType[])[Math.floor(Math.random() * 3)]
  })),

  // Ghardaia (Low concentration - ~6 markers)
  ...Array.from({ length: 6 }, (_, i) => ({
    lat: 32.4840 + (Math.random() - 0.5) * 0.1,
    lng: 3.6736 + (Math.random() - 0.5) * 0.1,
    title: `Ghardaia Marker ${i + 1}`,
    type: (["point-de-vente", "grossiste", "grande-surface"] as MarkerType[])[Math.floor(Math.random() * 3)]
  })),

  // Bechar (Low concentration - ~5 markers)
  ...Array.from({ length: 5 }, (_, i) => ({
    lat: 31.6167 + (Math.random() - 0.5) * 0.08,
    lng: -2.2167 + (Math.random() - 0.5) * 0.08,
    title: `Bechar Marker ${i + 1}`,
    type: (["point-de-vente", "grossiste", "grande-surface"] as MarkerType[])[Math.floor(Math.random() * 3)]
  })),

  // Tamanrasset (Low concentration - ~4 markers)
  ...Array.from({ length: 4 }, (_, i) => ({
    lat: 22.7851 + (Math.random() - 0.5) * 0.08,
    lng: 5.5281 + (Math.random() - 0.5) * 0.08,
    title: `Tamanrasset Marker ${i + 1}`,
    type: (["point-de-vente", "grossiste", "grande-surface"] as MarkerType[])[Math.floor(Math.random() * 3)]
  })),

  // Adrar (Low concentration - ~4 markers)
  ...Array.from({ length: 4 }, (_, i) => ({
    lat: 27.8739 + (Math.random() - 0.5) * 0.08,
    lng: -0.2957 + (Math.random() - 0.5) * 0.08,
    title: `Adrar Marker ${i + 1}`,
    type: (["point-de-vente", "grossiste", "grande-surface"] as MarkerType[])[Math.floor(Math.random() * 3)]
  })),

  // Illizi (Low concentration - ~3 markers)
  ...Array.from({ length: 3 }, (_, i) => ({
    lat: 26.4833 + (Math.random() - 0.5) * 0.08,
    lng: 8.4667 + (Math.random() - 0.5) * 0.08,
    title: `Illizi Marker ${i + 1}`,
    type: (["point-de-vente", "grossiste", "grande-surface"] as MarkerType[])[Math.floor(Math.random() * 3)]
  })),

  // Tindouf (Low concentration - ~3 markers)
  ...Array.from({ length: 3 }, (_, i) => ({
    lat: 27.6710 + (Math.random() - 0.5) * 0.08,
    lng: -8.1476 + (Math.random() - 0.5) * 0.08,
    title: `Tindouf Marker ${i + 1}`,
    type: (["point-de-vente", "grossiste", "grande-surface"] as MarkerType[])[Math.floor(Math.random() * 3)]
  })),

  // Additional scattered markers across other regions
  ...Array.from({ length: 30 }, (_, i) => ({
    lat: 28 + Math.random() * 8, // Random across Algeria's latitude range
    lng: -2 + Math.random() * 10, // Random across Algeria's longitude range
    title: `Region Marker ${i + 1}`,
    type: (["point-de-vente", "grossiste", "grande-surface"] as MarkerType[])[Math.floor(Math.random() * 3)]
  })),
];

// Algeria center coordinates for map centering
export const algeriaCenter = {
  lat: 28.0, // Centered to show all of Algeria
  lng: 2.0,
};

export const mapZoom = 6; // Zoom level to show all of Algeria
