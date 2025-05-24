import { Component, Input, OnChanges } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
    selector: 'app-age-bar-chart',
    standalone: false,
    template: `
    <div class="w-full max-w-md mx-auto">
        <canvas baseChart
            [data]="ageChartData"
            [type]="'bar'"
            [options]="ageChartOptions">
        </canvas>
    </div>
    `
})
export class AgeBarChartComponent implements OnChanges {
    @Input() agesAndCounts: { age: number; count: number }[] = [];

    ageChartData: ChartData<'bar'> = {
        labels: [],
        datasets: []
    };

    ageChartOptions: ChartOptions<'bar'> = {
        responsive: true,
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
                    text: 'Yaş'
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
        const ages = this.agesAndCounts.map(item => item.age.toString());
        const values = this.agesAndCounts.map(item => item.count);
        this.ageChartData = {
            labels: [...ages],
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