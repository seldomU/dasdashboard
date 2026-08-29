import * as ui from '/util/uiComponents.js';
import * as os from '/util/osInterface.js';
import {} from '/extensions/chart.3.9.1.min.js';

export async function createCell(parent){

    ui.createText(parent, "This cell loads chart.js and uses it to draw a chart.");
    
    // wrap the chart canvas in a div
    let containerDiv = document.createElement("div");
    containerDiv.style.height = "300px";
    parent.appendChild( containerDiv );
    let canvas = document.createElement("canvas");
    containerDiv.appendChild( canvas );

    // using chart.js example data
    var ctx = canvas.getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            responsiveAnimationDuration: 100,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
}