import { Component, Input, OnChanges } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
    selector: 'app-employment-status-chart',
    standalone: false,
    template: `
    <div class="w-full max-w-md mx-auto">
        <canvas baseChart
            [data]="employmentStatusChartData"
            [type]="'pie'"
            [options]="employmentStatusChartOptions">
        </canvas>
    </div>
    `
})
export class EmploymentStatusChartComponent implements OnChanges {
    @Input() isSeekingForJob = 0;
    @Input() isHiring = 0;

    employmentStatusChartData: ChartData<'pie', number[], string | string[]> = {
        labels: [],
        datasets: []
    };

    employmentStatusChartOptions: ChartOptions<'pie'> = {
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
        this.employmentStatusChartData = {
            labels: ['İş Arayan', 'Personel Arayan'],
            datasets: [
                {
                    data: [this.isSeekingForJob, this.isHiring],
                    backgroundColor: ['#EC4899', '#3B82F6']
                }
            ]
        };
    }
}