import React, { useMemo, useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatTitleCase, ACTIVIDAD_COLORS } from '../../utils/Textutils';
import { ChartPie, List } from 'lucide-react';
import '../../assets/css/DashBoard/DashboardCharts.css';

interface ActivityPieChartProps {
    features: any[];
    filterMunicipio: string;
}

const ActivityPieChart: React.FC<ActivityPieChartProps> = ({ features, filterMunicipio }) => {
    const [windowWidth, setWindowWidth] = useState(() => window.innerWidth);

    useEffect(() => {
        const onResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const isMobile = windowWidth <= 480;
    const [showList, setShowList] = useState(false);
    const showChart = !isMobile || !showList;

    const dataDona = useMemo(() => {
        const filtrados = filterMunicipio === 'Todos'
            ? features
            : features.filter(f => f.properties?.municipio_nombre === filterMunicipio);

        const counts: Record<string, number> = {};
        filtrados.forEach(f => {
            const t = f.properties?.actividad_tipo;
            if (t) {
                const name = formatTitleCase(t);
                counts[name] = (counts[name] || 0) + 1;
            }
        });

        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [features, filterMunicipio]);

    return (
        <section
            className="chart-wrapper glass dona-container"
            aria-label={
                filterMunicipio !== 'Todos'
                    ? `Distribución por actividad en ${filterMunicipio}`
                    : 'Distribución por actividad en todos los municipios'
            }
        >
            <div className="chart-title">
                <ChartPie aria-hidden="true" color="black" width={20} height={20} />
                <h3>
                    Distribución por Actividad{' '}
                    {filterMunicipio !== 'Todos' ? `en ${filterMunicipio}` : '(Todos los municipios)'}
                </h3>
                {isMobile && (
                    <button
                        type="button"
                        className="dona-toggle-btn icon-button-tooltip tooltip-left"
                        onClick={() => setShowList(v => !v)}
                        aria-pressed={showList}
                        aria-label={showList ? 'Ocultar listado y ver gráfico visual' : 'Ver listado detallado de categorías'}
                        data-label={showList ? 'Ver gráfico' : 'Ver listado'}
                    >
                        {showList ? <ChartPie size={16} color="#1367d3" /> : <List size={16} color="#1367d3" />}
                    </button>
                )}
            </div>

            <ul className="sr-only" aria-label="Desglose numérico de centros por categoría">
                {dataDona.map((entry, index) => (
                    <li key={`sr-dona-${index}`} role="text">
                        La actividad formativa o cultural de {entry.name}, comprende un total de {entry.value} centros a tu disposición.
                    </li>
                ))}
            </ul>

            {showChart && (
                <div
                    className="chart-responsive-container"
                    aria-hidden="true"
                    tabIndex={-1}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart aria-hidden="true">
                            <Pie
                                data={dataDona}
                                innerRadius={isMobile ? 55 : 70}
                                outerRadius={isMobile ? 85 : 100}
                                paddingAngle={5}
                                dataKey="value"
                                nameKey="name"
                                cy="50%"
                            >
                                {dataDona.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={ACTIVIDAD_COLORS[entry.name] || ACTIVIDAD_COLORS.Default}
                                    />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '10px', border: 'none' }} />
                            {!isMobile && (
                                <Legend
                                    layout="vertical"
                                    align="right"
                                    verticalAlign="middle"
                                    iconType="circle"
                                    iconSize={10}
                                    wrapperStyle={{ paddingLeft: '20px', fontSize: '11px' }}
                                />
                            )}
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}

            {isMobile && !showChart && (
                <ul className="dona-list-view">
                    {dataDona.map((entry, index) => (
                        <li key={index} className="dona-list-item">
                            <span
                                className="dona-list-dot"
                                style={{ backgroundColor: ACTIVIDAD_COLORS[entry.name] || ACTIVIDAD_COLORS.Default }}
                            />
                            <span className="dona-list-name">{entry.name}</span>
                            <span className="dona-list-count">{entry.value}</span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default ActivityPieChart;
