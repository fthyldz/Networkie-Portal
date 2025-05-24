import { Component, Input, OnChanges } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
    selector: 'app-department-chart',
    standalone: false,
    template: `
    <div class="w-full max-w-md mx-auto">
        <canvas baseChart
            [data]="departmentChartData"
            [type]="'bar'"
            [options]="departmentChartOptions">
        </canvas>
    </div>
    `
})
export class DepartmentChartComponent implements OnChanges {
    @Input() departmentsAndCounts: { departmentName: number; count: number }[] = [];

    departmentChartData: ChartData<'bar'> = {
        labels: [],
        datasets: []
    };

    departmentChartOptions: ChartOptions<'bar'> = {
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
                    text: 'Bölüm'
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
        const departments = this.departmentsAndCounts.map(item => item.departmentName);
        const values = this.departmentsAndCounts.map(item => item.count);
        this.departmentChartData = {
            labels: [...departments],
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