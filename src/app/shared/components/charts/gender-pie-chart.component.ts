import { Component, Input, OnChanges } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
    selector: 'app-gender-pie-chart',
    standalone: false,
    template: `
    <div class="w-full max-w-md mx-auto">
        <canvas baseChart
            [data]="genderChartData"
            [type]="'pie'"
            [options]="genderChartOptions">
        </canvas>
    </div>
    `
})
export class GenderPieChartComponent implements OnChanges {
    @Input() femaleCount = 0;
    @Input() maleCount = 0;

    genderChartData: ChartData<'pie', number[], string | string[]> = {
        labels: [],
        datasets: []
    };

    genderChartOptions: ChartOptions<'pie'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom'
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.parsed;
                        const total = context.dataset.data.reduce((acc: number, val: any) => acc + val, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${context.label}: ${value} kişi (%${percentage})`;
                    }
                }
            }
        }
    };

    ngOnChanges(): void {
        this.genderChartData = {
            labels: ['Kadın', 'Erkek'],
            datasets: [
                {
                    data: [this.femaleCount, this.maleCount],
                    backgroundColor: ['#EC4899', '#3B82F6']
                }
            ]
        };
    }
}