import { Component, Input, OnChanges } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
    selector: 'app-employment-chart',
    standalone: false,
    template: `
    <div class="w-full max-w-md mx-auto">
        <canvas baseChart
            [data]="employmentChartData"
            [type]="'pie'"
            [options]="employmentChartOptions">
        </canvas>
    </div>
    `
})
export class EmploymentChartComponent implements OnChanges {
    @Input() isEmployed = 0;
    @Input() isNotEmployed = 0;

    employmentChartData: ChartData<'pie', number[], string | string[]> = {
        labels: [],
        datasets: []
    };

    employmentChartOptions: ChartOptions<'pie'> = {
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
        this.employmentChartData = {
            labels: ['Çalışan', 'Çalışmayan'],
            datasets: [
                {
                    data: [this.isEmployed, this.isNotEmployed],
                    backgroundColor: ['#EC4899', '#3B82F6']
                }
            ]
        };
    }
}