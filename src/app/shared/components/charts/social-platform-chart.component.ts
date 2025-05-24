import { Component, Input, OnChanges } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
    selector: 'app-social-platform-chart',
    standalone: false,
    template: `
    <div class="w-full max-w-md mx-auto">
        <canvas baseChart
            [data]="socialPlatformChartData"
            [type]="'bar'"
            [options]="socialPlatformChartOptions">
        </canvas>
    </div>
    `
})
export class SocialPlatformChartComponent implements OnChanges {
    @Input() socialPlatformsAndCounts: { socialPlatformName: number; count: number }[] = [];

    socialPlatformChartData: ChartData<'bar'> = {
        labels: [],
        datasets: []
    };

    socialPlatformChartOptions: ChartOptions<'bar'> = {
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
                    text: 'Sosyal Platform'
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
        const socialPlatforms = this.socialPlatformsAndCounts.map(item => item.socialPlatformName);
        const values = this.socialPlatformsAndCounts.map(item => item.count);
        this.socialPlatformChartData = {
            labels: [...socialPlatforms],
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