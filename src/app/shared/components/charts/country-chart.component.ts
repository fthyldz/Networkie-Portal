import { Component, Input, OnChanges } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
    selector: 'app-country-chart',
    standalone: false,
    template: `
    <div class="w-full max-w-md mx-auto">
        <canvas baseChart
            [data]="countryChartData"
            [type]="'bar'"
            [options]="countryChartOptions">
        </canvas>
    </div>
    `
})
export class CountryChartComponent implements OnChanges {
    @Input() countriesAndCounts: { countryName: number; count: number }[] = [];

    countryChartData: ChartData<'bar'> = {
        labels: [],
        datasets: []
    };

    countryChartOptions: ChartOptions<'bar'> = {
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
                    text: 'Ülke'
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
        const countries = this.countriesAndCounts.map(item => item.countryName);
        const values = this.countriesAndCounts.map(item => item.count);
        this.countryChartData = {
            labels: [...countries],
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