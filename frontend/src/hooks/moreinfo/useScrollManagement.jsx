import { useState, useEffect } from 'react';

export const useScrollManagement = ({ 
    castSliderRef, 
    similarSliderRef, 
    recommendationsSliderRef 
}) => {
    const [canScrollStates, setCanScrollStates] = useState({
        cast: { left: false, right: false },
        similar: { left: false, right: false },
        recommendations: { left: false, right: false }
    });

    const checkScroll = (slider, section) => {
        if (slider) {
            const { scrollLeft, scrollWidth, clientWidth } = slider;
            const hasOverflow = scrollWidth > clientWidth + 1;
            
            setCanScrollStates(prev => ({
                ...prev,
                [section]: {
                    left: hasOverflow && scrollLeft > 0,
                    right: hasOverflow && scrollLeft + clientWidth < scrollWidth - 1
                }
            }));
        }
    };

    const scroll = (direction, sliderRef, section) => {
        if (sliderRef.current) {
            const scrollAmount = direction === 'left' 
                ? -sliderRef.current.offsetWidth 
                : sliderRef.current.offsetWidth;
            
            sliderRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
            
            // Check scroll possibility after animation
            setTimeout(() => checkScroll(sliderRef.current, section), 400);
        }
    };

    useEffect(() => {
        const sliders = {
            cast: castSliderRef?.current,
            similar: similarSliderRef?.current,
            recommendations: recommendationsSliderRef?.current
        };

        Object.entries(sliders).forEach(([section, slider]) => {
            if (slider) {
                // Initial check
                checkScroll(slider, section);

                // Add event listeners
                const handleScroll = () => checkScroll(slider, section);
                slider.addEventListener('scroll', handleScroll);
                window.addEventListener('resize', handleScroll);

                // Cleanup
                return () => {
                    slider.removeEventListener('scroll', handleScroll);
                    window.removeEventListener('resize', handleScroll);
                };
            }
        });
    }, [castSliderRef, recommendationsSliderRef, similarSliderRef]);

    return { canScrollStates, scroll };
};