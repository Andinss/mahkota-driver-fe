"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { monitoringApi } from "@/lib/api/monitoring";

interface FleetVehicle {
  id: string;
  plate: string;
  driverName: string;
  driverPhone?: string;
  latitude: number;
  longitude: number;
  status: "emergency" | "moving" | "idle";
  engineStatus?: "on" | "off";
  speed?: number;
  fuelLevel?: number;
  lastUpdated?: string;
}

interface GeofenceArea {
  id: string;
  name: string;
  center_lat: number;
  center_lng: number;
  radius: number;
  is_active: boolean;
}

interface MonitoringMapProps {
  vehicles?: FleetVehicle[];
  center?: [number, number];
  zoom?: number;
  onVehicleClick?: (vehicle: FleetVehicle) => void;
  selectedVehicle?: FleetVehicle | null;
}

const vehicleIcons: Record<string, L.DivIcon> = {
  emergency: L.divIcon({
    className: "",
    html: `<div class="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center shadow-xl border-2 border-white animate-pulse" style="transform: translate(-50%, -50%)"><span class="material-symbols-outlined text-base">warning</span></div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  }),
  moving: L.divIcon({
    className: "",
    html: `<div class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white" style="transform: translate(-50%, -50%)"><span class="material-symbols-outlined text-base">local_shipping</span></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  }),
  idle: L.divIcon({
    className: "",
    html: `<div class="w-10 h-10 bg-gray-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white" style="transform: translate(-50%, -50%)"><span class="material-symbols-outlined text-base">local_shipping</span></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  }),
};

export default function MonitoringMap({
  vehicles = [],
  center = [-6.2088, 106.8456],
  zoom = 12,
  onVehicleClick,
  selectedVehicle,
}: MonitoringMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const geofenceCirclesRef = useRef<L.Circle[]>([]);
  const [geofences, setGeofences] = useState<GeofenceArea[]>([]);

  useEffect(() => {
    const fetchGeofences = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/geofences/active`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        );
        const data = await res.json();
        if (data.success && data.data) {
          setGeofences(data.data);
        }
      } catch {
        // silent fail
      }
    };

    fetchGeofences();
  }, []);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
    }

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      geofenceCirclesRef.current.forEach((c) => c.remove());
      geofenceCirclesRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing geofence circles
    geofenceCirclesRef.current.forEach((c) => c.remove());
    geofenceCirclesRef.current = [];

    // Add geofence circles
    geofences.forEach((gf) => {
      const circle = L.circle([gf.center_lat, gf.center_lng], {
        radius: gf.radius,
        color: "#3b82f6",
        fillColor: "#3b82f6",
        fillOpacity: 0.08,
        weight: 2,
        dashArray: "8 4",
      }).addTo(mapRef.current!);

      circle.bindTooltip(gf.name, {
        permanent: false,
        direction: "center",
        className: "geofence-tooltip",
      });

      geofenceCirclesRef.current.push(circle);
    });
  }, [geofences]);

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    vehicles.forEach((vehicle) => {
      const icon = vehicleIcons[vehicle.status] || vehicleIcons.idle;
      const popupContent = `
        <div style="font-family: system-ui, sans-serif; min-width: 200px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <span style="font-weight:700;font-size:16px;">${vehicle.plate}</span>
            <span style="font-size:10px;padding:2px 6px;border-radius:4px;font-weight:600;text-transform:uppercase;background:${
              vehicle.status === "emergency" ? "#fee2e2" : vehicle.status === "moving" ? "#dbeafe" : "#f3f4f6"
            };color:${
              vehicle.status === "emergency" ? "#dc2626" : vehicle.status === "moving" ? "#2563eb" : "#6b7280"
            }">${vehicle.status}</span>
            <span style="font-size:10px;padding:2px 6px;border-radius:4px;font-weight:600;text-transform:uppercase;background:${
              vehicle.engineStatus === "on" ? "#dcfce7" : "#f3f4f6"
            };color:${
              vehicle.engineStatus === "on" ? "#16a34a" : "#6b7280"
            }">Engine ${vehicle.engineStatus === "on" ? "ON" : "OFF"}</span>
          </div>
          <div style="font-size:13px;color:#374151;">
            <div><strong>Driver:</strong> ${vehicle.driverName}</div>
            ${vehicle.driverPhone ? `<div><strong>Phone:</strong> ${vehicle.driverPhone}</div>` : ""}
            ${vehicle.speed !== undefined ? `<div><strong>Speed:</strong> ${vehicle.speed} km/h</div>` : ""}
            ${vehicle.fuelLevel !== undefined ? `<div><strong>Fuel:</strong> ${vehicle.fuelLevel}%</div>` : ""}
            ${vehicle.status === "emergency" ? `<div style="color:#dc2626;margin-top:4px;"><strong>⚠ Outside operational area</strong></div>` : ""}
          </div>
        </div>
      `;

      const marker = L.marker([vehicle.latitude, vehicle.longitude], { icon })
        .addTo(mapRef.current!)
        .bindPopup(popupContent, { closeButton: true });

      if (onVehicleClick) {
        marker.on("click", () => onVehicleClick(vehicle));
      }

      markersRef.current.push(marker);
    });

    if (vehicles.length > 0) {
      const bounds = L.latLngBounds(
        vehicles.map((v) => [v.latitude, v.longitude] as [number, number]),
      );
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [vehicles, onVehicleClick]);

  useEffect(() => {
    if (!mapRef.current || !selectedVehicle) return;

    mapRef.current.flyTo(
      [selectedVehicle.latitude, selectedVehicle.longitude],
      16,
      { duration: 1.0 }
    );

    const marker = markersRef.current.find(
      (m) => {
        const pos = m.getLatLng();
        return Math.abs(pos.lat - selectedVehicle.latitude) < 0.0001 &&
               Math.abs(pos.lng - selectedVehicle.longitude) < 0.0001;
      }
    );
    if (marker) {
      marker.openPopup();
    }
  }, [selectedVehicle]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
}

export type { FleetVehicle };
