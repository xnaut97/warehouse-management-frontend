import Badge from "../common/Badge.jsx";
import {
    SEVERITY_COLORS,
    SEVERITY_DOTS,
    SEVERITY_LABELS
} from "./alertConstants.js";

function AlertSeverityBadge({ severity }) {
    return (
        <Badge color={SEVERITY_COLORS[severity] ?? "gray"}>
            <span className="mr-1">
                {SEVERITY_DOTS[severity] ?? ""}
            </span>
            {SEVERITY_LABELS[severity] ?? severity}
        </Badge>
    );
}

export default AlertSeverityBadge;
