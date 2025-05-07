import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import useGetCategoriasMasVendidasPorProducto from '../hooks/useGetCategoriasMasVendidasPorProducto';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryPieChart = ({range}) => {
  const { categoriasMasVendidasPorProducto, loading, error } = useGetCategoriasMasVendidasPorProducto(range);

  const colors = ['#81934e', '#1d8a2b', '#5ca2a8', '#2d4c4f'];

  const pieData = {
    labels: categoriasMasVendidasPorProducto.categoria,
    datasets: [
      {
        label: 'Ganancia',
        data: categoriasMasVendidasPorProducto.cantidad,
        backgroundColor: colors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = 'Cantidad';
            const value = context.formattedValue || 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <div className="category-chart">
      {loading ? (
        <section className="dots-container-inicio">
          <div className="dot-inicio"></div>
          <div className="dot-inicio"></div>
          <div className="dot-inicio"></div>
          <div className="dot-inicio"></div>
          <div className="dot-inicio"></div>
        </section>
      ) : <Doughnut data={pieData} options={options} />}
    </div>
  );
}


export default CategoryPieChart;