import Chart from 'react-google-charts';
import { useSelector } from 'react-redux';

import LoadingSpinner from '@Components/LoadingSpinner';
import { RootState } from '@Redux/store/store';

const LineChartOptions = {
  hAxis: {
    title: 'Ticket ID',
  },
  vAxis: {
    title: 'Actual/Estimated',
  },
};

export const LineChart = () => {
  const ticketDetail = useSelector(
    (state: RootState) => state.UserTicket.results
  );
  if (ticketDetail.length === 0) {
    return <></>;
  }

  const actualAndEstimatedData = ticketDetail.map((item: any) => [
    item.ticket_detail.id,
    item.ticket_detail.final_estimation,
    item.estimate,
  ]);

  actualAndEstimatedData.sort(
    (a: Array<number>, b: Array<number>) => a[0] - b[0]
  );
  const LineData = [
    ['Ticket', 'actual', 'estimated'],
    ...actualAndEstimatedData,
  ];

  return (
    <div className='container mt-5'>
      <h2>Tickets Chart:</h2>
      <Chart
        width={'700px'}
        height={'410px'}
        chartType='LineChart'
        loader={<LoadingSpinner />}
        data={LineData}
        options={LineChartOptions}
      />
    </div>
  );
};
