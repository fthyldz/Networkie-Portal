import { Component, Input, OnChanges } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
    selector: 'app-university-chart',
    standalone: false,
    template: `
    <div class="w-full max-w-md mx-auto">
        <canvas baseChart
            [data]="universityChartData"
            [type]="'bar'"
            [options]="universityChartOptions">
        </canvas>
    </div>
    `
})
export class UniversityChartComponent implements OnChanges {
    @Input() universitiesAndCounts: { universityName: number; count: number }[] = [];

    universityChartData: ChartData<'bar'> = {
        labels: [],
        datasets: []
    };

    universityChartOptions: ChartOptions<'bar'> = {
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
                    text: 'Üniversite'
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
        const universities = this.universitiesAndCounts.map(item => item.universityName);
        const values = this.universitiesAndCounts.map(item => item.count);
        this.universityChartData = {
            labels: [...universities],
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