import { Component, Input, OnChanges } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
    selector: 'app-profession-chart',
    standalone: false,
    template: `
    <div class="w-full max-w-md mx-auto">
        <canvas baseChart
            [data]="professionChartData"
            [type]="'bar'"
            [options]="professionChartOptions">
        </canvas>
    </div>
    `
})
export class ProfessionChartComponent implements OnChanges {
    @Input() professionsAndCounts: { professionName: number; count: number }[] = [];

    professionChartData: ChartData<'bar'> = {
        labels: [],
        datasets: []
    };

    professionChartOptions: ChartOptions<'bar'> = {
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
                    text: 'Meslek'
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
        const professions = this.professionsAndCounts.map(item => item.professionName);
        const values = this.professionsAndCounts.map(item => item.count);
        this.professionChartData = {
            labels: [...professions],
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