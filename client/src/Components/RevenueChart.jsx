import { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, BarController, LineController, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
import CategoryPieChart from "./CategoryPieChart";
import useGetPedidosGananciasAlaSemana from "../hooks/useGetPedidosGananciasAlaSemana";
import useGetPedidosGananciasAlMes from "../hooks/useGetPedidosGananciasAlMes";
import useGetProductosVendidos from "../hooks/useGetProductosVendidos";
import useGetCategoriasMasVendidas from "../hooks/useGetCategoriasMasVendidas";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  BarController,
  LineController,
  Tooltip
);

const RevenueChart = () => {
  const [range, setRange] = useState("week");
  const [chartData, setChartData] = useState({});

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 800,
      },
    },
  };

  const { pedidosGanancias: pedidosGananciasSemanales, loading: loadingSemana, error: errorSemana } = useGetPedidosGananciasAlaSemana();

  const { pedidosGanancias: pedidosGananciasMes, loading: loadingMes, error: errorMes } = useGetPedidosGananciasAlMes();

  const { productosVendidos, loading: loadingProductosVendidos, error: errorProductosVendidos } = useGetProductosVendidos(range);

  const { categoriasMasVendidas, loading: loadingCategorias, error: errorCategorias } = useGetCategoriasMasVendidas(range);

  if (errorSemana || errorMes || errorProductosVendidos || errorCategorias) return <p>Error al cargar los datos</p>;

  const getStyles = (index) => {
    switch (index) {
      case 0:
        return "first-card";
      case 1:
        return "second-card";
      case 2:
        return "third-card";
      case 3:
        return "fourth-card";
      default:
        return "";
    }
  }

  const getTotalGanancias = () => {
    if (range === "week") {
      return pedidosGananciasSemanales.data.reduce((acc, val) => acc + val, 0)
    }

    if (range === "month") {
      return pedidosGananciasMes.data.reduce((acc, val) => acc + val, 0)
    }
  }

  useEffect(() => {
    if ((range === "week" && loadingSemana) || (range === "month" && loadingMes)) return;

    const data = range === "week" ? pedidosGananciasSemanales : pedidosGananciasMes;

    setChartData({
      labels: data.labels,
      datasets: [
        {
          type: "bar",
          label: "Ganancia",
          data: data.data,
          backgroundColor: "#3b82f6",
          barThickness: 35,
          borderRadius: 10,
        },
        {
          type: "line",
          label: "Trend",
          data: data.data,
          borderColor: "#f43f5e",
          borderWidth: 4,
          tension: 0.4,
        },
      ],
    });
  }, [range, loadingSemana, loadingMes]);

  return (
    <div className="dashboard">
      <div className="wrapper-chart">
        <div className="revenue-chart">
          <div className="tabs">
            <button className={range === "week" ? "active-tab" : ""} onClick={() => setRange("week")}>Semana Actual</button>
            <button className={range === "month" ? "active-tab" : ""} onClick={() => setRange("month")}>Mes Actual</button>
          </div>

          <div className="summary-cards">
            <div className="card green">
              { loadingSemana ? (
                <h3>0</h3> ): <h3>${ getTotalGanancias() }</h3>}
              <p>Total Ganancias</p>
            </div>
            <div className="card red">
              <h3>{ loadingProductosVendidos ? '0' : productosVendidos }</h3>
              <p>Total Productos</p>
            </div>
          </div>

          <div className="chart-container">
            <h3>Total de Ganancias</h3>
            {
              loadingSemana ? (
                <section className="dots-container-inicio">
                  <div className="dot-inicio"></div>
                  <div className="dot-inicio"></div>
                  <div className="dot-inicio"></div>
                  <div className="dot-inicio"></div>
                  <div className="dot-inicio"></div>
                </section>
              ) : (
                chartData.labels && <Bar type="bar" data={chartData} options={options} />
              )
            }
          </div>
        </div>
        <div className="categories-chart">
          <div className="categories">
            <h4>Top categorías en ventas</h4>
            <div className="categories-cards">
              {
                loadingCategorias ? (
                  <section className="dots-container-inicio">
                    <div className="dot-inicio"></div>
                    <div className="dot-inicio"></div>
                    <div className="dot-inicio"></div>
                    <div className="dot-inicio"></div>
                    <div className="dot-inicio"></div>
                  </section>
                ) : (
                  categoriasMasVendidas.map((categoria, index) => (
                    <div className={`card ${getStyles(index)}`} key={index}>
                      <h4>{categoria.categoria}</h4>
                      <p>${categoria.ganancia}</p>
                    </div>
                  ))
                )
              }
            </div>
          </div>
          <CategoryPieChart range={range} />
        </div>
      </div>
    </div>
  )
}

export default RevenueChart;