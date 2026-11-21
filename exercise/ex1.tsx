export type BadgePosition = "bottom-left" | "bottom-right" | "top-left";

export interface LowerThirdProps {
    name: string;
    role: string;
    handle?: string;
    themeColor?: string;
    position?: BadgePosition;
}

export const LowerThird: React.FC<LowerThirdProps> = ({
    name,
    role,
    handle,
    themeColor = "#38bdf8",
    position = "bottom-left",
}) => {
    return (
        <div
      style= {{
        position: "absolute",
            bottom: position.startsWith("bottom") ? 80 : undefined,
                top: position.startsWith("top") ? 80 : undefined,
                    left: position.endsWith("left") ? 80 : undefined,
                        right: position.endsWith("right") ? 80 : undefined,
                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                                borderLeft: `6px solid ${themeColor}`,
                                    padding: "16px 24px",
                                        borderRadius: 8,
                                            color: "#ffffff",
                                                fontFamily: "sans-serif",
      }
}
    >
    <h2 style={ { margin: 0, fontSize: 28 } }> { name } </h2>
        < p style = {{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: 18 }}>
            { role } { handle && `• @${handle}` }
</p>
    </div>
  );
};