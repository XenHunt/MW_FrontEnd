import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';
import { MeetingsService } from 'src/app/services/meetings.service';
import { MeetingsTable } from 'src/app/shared/helpers';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, OnDestroy {
  meetings!: Array<MeetingsTable>;
  subscription!: Subscription;
  chart: any;

  constructor(private meetingsService: MeetingsService) {
  }
  ngOnInit(): void {

    Chart.register(...registerables);
    this.subscription = this.meetingsService.getMeetings().subscribe({
      next: (meetings) => {
        console.log('1')
        this.meetings = meetings as Array<MeetingsTable>;

        // chart = new Chart('myChart', type='bar',)
        if (!this.meetings) {
          return
        }
        const label = this.meetings.map(m => m.address)
        const data = this.meetings.map(m => m.count)
        const ctx = document.getElementById('myChart');
        console.log('2')
        if (ctx) {
          this.chart = new Chart("myChart", {
            type: 'bar',
            data: {
              labels: label,
              datasets: [{
                label: 'Number of Meetings',
                data: data,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                ]
              }]
            }
          }
          )
        }
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
