import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Loading({ rows = 5 }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, index) => (
                <Skeleton
                    key={index}
                    height={48}
                    borderRadius={16}
                />
            ))}
        </div>
    );
}

export default Loading;