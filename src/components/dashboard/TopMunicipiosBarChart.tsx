import React, { useMemo, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, LabelList, ResponsiveContainer } from 'recharts';
import { formatTitleCase } from '../../utils/Textutils';
import { ChartBarBig } from 'lucide-react';
import '../../assets/css/DashBoard/DashboardCharts.css';

interface TopMunicipiosBarChartProps {
    features: any[];
    filterTipo: string;
}

const TopMunicipiosBarChart: React.FC<TopMunicipiosBarChartProps> = ({ features, filterTipo }) => {
    const [windowWidth, setWindowWidth] = useState(() => window.innerWidth);

    useEffect(() => {
        const onResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const isMobile = windowWidth <= 480;
    const isTablet = windowWidth <= 900;

    const dataTopMunicipios = useMemo(() => {
        const filtradosPorTipo = filterTipo === 'Todos'
            ? features
            : features.filter(f => f.properties?.actividad_tipo === filterTipo);

        const counts: Record<string, number> = {};
        filtradosPorTipo.forEach(f => {
            const m = f.properties?.municipio_nombre;
            if (m) {
                const name = formatTitleCase(m);
                counts[name] = (counts[name] || 0) + 1;
            }
        });

        return Object.entries(counts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [features, filterTipo]);

    return (
        <section
            className="chart-wrapper glass"
            aria-label={
                filterTipo === 'Todos'
                    ? 'Top 5 municipios por número total de centros'
                    : `Top 5 municipios en ${formatTitleCase(filterTipo)}`
            }
        >
            <div className="chart-title">
                <ChartBarBig aria-hidden="true" color="black" width={20} height={20} />
                <h3>
                    {filterTipo === 'Todos'
                        ? 'Top 5 Municipios (Total Centros)'
                        : `Top 5 Municipios en ${formatTitleCase(filterTipo)}`}
                </h3>
            </div>

            <ol className="sr-only" aria-label="Ranking de los mejores municipios por número de centros">
                {dataTopMunicipios.map((mun, i) => {
                    const positions = ["Primero", "Segundo", "Tercero", "Cuarto", "Quinto"];
                    return (
                        <li key={`sr-rank-${i}`} role="text">
                            {positions[i]} {mun.name} totaliza {mun.count} centros vinculados a este sector.
                        </li>
                    )
                })}
            </ol>

            <div
                className="chart-responsive-container"
                aria-hidden="true"
                tabIndex={-1}
            >
                <ResponsiveContainer width="100%" height="100%" aria-hidden="true">
                    <BarChart
                        layout="vertical"
                        data={dataTopMunicipios}
                        margin={{
                            top: 5,
                            right: isMobile ? 28 : 45,
                            left: isMobile ? -20 : isTablet ? 0 : 40,
                            bottom: 5,
                        }}
                    >
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            tick={{ fontSize: isMobile ? 10 : 12, fill: '#666' }}
                            width={isMobile ? 80 : isTablet ? 100 : 120}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Bar
                            dataKey="count"
                            fill="#1a73e8"
                            radius={[0, 10, 10, 0]}
                            barSize={isMobile ? 18 : 25}
                        >
                            <LabelList
                                dataKey="count"
                                position="right"
                                offset={8}
                                style={{
                                    fill: '#1a73e8',
                                    fontWeight: 'bold',
                                    fontSize: isMobile ? '11px' : '14px',
                                }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
};

export default TopMunicipiosBarChart;
