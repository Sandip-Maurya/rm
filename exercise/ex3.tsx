type MetricItem =
    | { kind: "currency"; label: string; amount: number; currencySymbol: string }
    | { kind: "percentage"; label: string; percentage: number; isIncrease: boolean };

export interface MetricDashboardProps {
    title: string
    metrics: MetricItem[]
}

export const MetricDashboard: React.FC<MetricDashboardProps> = ({ title, metrics }) => {
    return (
        <div style={{ backgroundColor: "#0f172a", padding: 32, borderRadius: 16, width: 450 }
        }>
            <h3 style={{ color: "#94a3b8", textTransform: "uppercase", fontSize: 14, margin: "0 0 16px 0" }}>
                {title}
            </h3>
            < div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {
                    metrics.map((item, idx) => {
                        if (item.kind === "currency") {
                            return (
                                <div key={idx} style={{ display: "flex", justifyContent: "space-between", color: "#f8fafc" }
                                }>
                                    <span>{item.label} </span>
                                    < span style={{ fontWeight: "bold" }
                                    }>
                                        {item.currencySymbol}{item.amount.toLocaleString()}
                                    </span>
                                </div>
                            );
                        }
                        // TypeScript automatically narrows item to the 'percentage' branch here
                        return (
                            <div key={idx} style={{ display: "flex", justifyContent: "space-between", color: "#f8fafc" }}>
                                <span>{item.label} </span>
                                < span style={{ color: item.isIncrease ? "#22c55e" : "#ef4444", fontWeight: "bold" }}>
                                    {item.isIncrease ? "▲" : "▼"} {item.percentage}%
                                </span>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

