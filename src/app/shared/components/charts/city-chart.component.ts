import { Component, Input, OnChanges } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
    selector: 'app-city-chart',
    standalone: false,
    template: `
    <div class="w-full max-w-md mx-auto">
        <canvas baseChart
            [data]="cityChartData"
            [type]="'bar'"
            [options]="cityChartOptions">
        </canvas>
    </div>
    `
})
export class CityChartComponent implements OnChanges {
    @Input() citiesAndCounts: { cityName: number; count: number }[] = [];

    cityChartData: ChartData<'bar'> = {
        labels: [],
        datasets: []
    };

    cityChartOptions: ChartOptions<'bar'> = {
        responsive: true,
        // indexAxis: 'y',
        plugins: {
            legend: {
                display: true
            },
            tooltip: {
                enabled: true
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'İl'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Kullanıcı Sayısı'
                },
                beginAtZero: true
            }
        }
    };

    ngOnChanges(): void {
        const cities = this.citiesAndCounts.map(item => item.cityName);
        const values = this.citiesAndCounts.map(item => item.count);
        this.cityChartData = {
            labels: [...cities],
            datasets: [
                {
                    label: 'Kullanıcı Sayısı',
                    data: [...values],
                    backgroundColor: '#42A5F5'
                }
            ]
        };
    }
}