import { Star } from "lucide-react";

// eslint-disable-next-line react/prop-types
const StarRating = ({ rating, maxStars = 5, size = "w-4 h-4" }) => {
    const fullStars = Math.floor(rating); // Number of full stars
    const decimal = rating - fullStars;  // Remaining decimal part of the star

    return (
        <div className="flex space-x-1">
            {[...Array(maxStars)].map((_, index) => {
                const isCurrentStarPartial = index === fullStars && decimal > 0;
                const clipPath = isCurrentStarPartial
                    ? `inset(0 ${(1 - decimal) * 100}% 0 0)` // Adjust clip for the partial star
                    : "none";
                const shouldFill = index < fullStars || isCurrentStarPartial;

                return (
                    <div key={index} className={`relative ${size}`}>
                        {/* Gray background star */}
                        <Star color="gray" fill="gray" className="absolute inset-0" />

                        {/* Yellow foreground star */}
                        {shouldFill && (
                            <Star
                                color="yellow"
                                fill="yellow"
                                className="absolute inset-0"
                                style={{ clipPath }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default StarRating;