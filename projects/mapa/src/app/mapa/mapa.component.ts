import { Component } from '@angular/core';

interface TaxiUnit {
  id: number;
  driver: string;
  plate: string;
  status: 'activo' | 'inactivo' | 'en_servicio';
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-mapa',
  standalone: true,
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css'
})
export class MapaComponent {

  units: TaxiUnit[] = [
    { id: 1, driver: 'Carlos Huaman',   plate: 'ABC-123', status: 'activo',      lat: -12.0464, lng: -77.0428 },
    { id: 2, driver: 'Maria Quispe',    plate: 'DEF-456', status: 'en_servicio', lat: -12.0560, lng: -77.0300 },
    { id: 3, driver: 'Jorge Mendoza',   plate: 'GHI-789', status: 'inactivo',    lat: -12.0700, lng: -77.0500 },
    { id: 4, driver: 'Luis Paredes',    plate: 'JKL-012', status: 'activo',      lat: -12.0890, lng: -77.0600 },
    { id: 5, driver: 'Ana Torres',      plate: 'MNO-345', status: 'en_servicio', lat: -12.1000, lng: -77.0200 },
    { id: 6, driver: 'Pedro Salazar',   plate: 'PQR-678', status: 'activo',      lat: -12.0300, lng: -77.0800 },
    { id: 7, driver: 'Rosa Flores',     plate: 'STU-901', status: 'inactivo',    lat: -12.0650, lng: -77.0150 },
    { id: 8, driver: 'Diego Castillo',  plate: 'VWX-234', status: 'en_servicio', lat: -12.0400, lng: -77.0700 },
  ];

  getStatusLabel(status: string): string {
    switch (status) {
      case 'activo':      return 'Activo';
      case 'en_servicio': return 'En Servicio';
      case 'inactivo':    return 'Inactivo';
      default:            return status;
    }
  }
}
