import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MapClickedEvent } from '../../models/common/map.model';

@Component({
    selector: 'app-map',
    standalone: false,
    template: `
    <google-map (mapInitialized)="onMapReady($event)" [lang]="'tr'" [height]="height" width="100%" [center]="center" [zoom]="zoom" (mapClick)="onMapClick($event)" class="w-full">
        <map-marker *ngIf="showMarker && markerPosition" [position]="markerPosition" [icon]="{ url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' }"></map-marker>
        <map-marker *ngFor="let markerPosition of markerPositions" [position]="markerPosition"></map-marker>
    </google-map>
    `
})
export class MapComponent {

    @Input() keywords: { keyword: string }[] = []
    @Input() showMarker = true;
    @Input() height = '400px';
    @Output() mapClick = new EventEmitter<MapClickedEvent>();

    center = { lat: 41.015137, lng: 28.979530 };
    zoom = 6;
    geocoder!: google.maps.Geocoder;
    markerPosition?: google.maps.LatLngLiteral;

    onMapReady(mapInstance: google.maps.Map) {
        this.geocoder = new google.maps.Geocoder();
    }

    onMapClick(event: google.maps.MapMouseEvent) {
        if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();

            this.markerPosition = {
                lat,
                lng
            };

            this.geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK && results?.length) {

                    const addressComponents = results[0].address_components;

                    console.log(addressComponents);

                    const getComponent = (type: string) =>
                        addressComponents.find(c => c.types.includes(type))?.long_name;

                    console.log(addressComponents);

                    const getItem = (index: number = 0): { name: string | undefined, index: number } => {
                        if (index == 0) return { name: getComponent('country'), index };
                        else if (index > 5) return { name: getComponent('locality'), index };
                        else {
                            const component = getComponent('administrative_area_level_' + index);
                            if (component) return { name: component, index };
                            else return getItem(index + 1);
                        }
                    };

                    const country = getItem();
                    const state = getItem(country.index + 1);
                    const city = getItem(country.index + 1);
                    const district = getItem(state.index + 1);

                    /*console.log('Country:', country.name);
                    console.log('State:', state.name);
                    console.log('City:', city.name);
                    console.log('District:', district.name);*/

                    this.mapClick.emit({
                        country: country.name,
                        state: state.name,
                        city: city.name,
                        district: district.name
                    });

                } else {
                    console.error('Adres bulunamadı:', status);
                }
            });
        }
    }

    @Input() set clearMarkerTrigger(value: boolean) {
        if (value && this.markerPosition) {
            this.clearMarker();
        }
    }

    clearMarker() {
        if (this.markerPosition)
            this.markerPosition = undefined;
    }

    markerPositions: google.maps.LatLngLiteral[] = [];

    public searchAndPlaceMarker() {
        this.markerPositions = [];
        for (const item of this.keywords) {
            const keyword = item.keyword;
            if (!keyword.trim()) return;

            this.geocoder.geocode({ address: keyword }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK && results?.length) {
                    const location = results[0].geometry.location;
                    const latLng = { lat: location.lat(), lng: location.lng() };

                    this.markerPositions.push(latLng);
                } else {
                    console.error('Konum bulunamadı:', status);
                }
            });
        }
    }
} 