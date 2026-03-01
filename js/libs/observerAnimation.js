"use strict";

document.addEventListener('DOMContentLoaded', function() {
   
    const inViewport = (entries, observer) => {
    entries.forEach(entry => {
            const el = entry.target;

            el.classList.toggle("is-inViewport", entry.isIntersecting);

            if (entry.isIntersecting && !el.classList.contains('watched')) {
            let delay = el.getAttribute('data-delay');
            if (window.innerWidth < 992 && delay) {
                    const delayNum = parseFloat(delay) || 0;
                    delay = Math.min(delayNum, 0.2) + 's';
            }

            if (delay) {
                    el.style.transitionDelay = delay;
                    el.style.animationDelay = delay;
            }

            el.classList.add("watched");
            }
    });
    };

    let ioConfiguration = {
    rootMargin: '0% 0% 0% 0%',
    threshold: 0.2
    };

    const Obs = new IntersectionObserver(inViewport, ioConfiguration);
    document.querySelectorAll('[data-inviewport]').forEach(EL => {
    Obs.observe(EL);
    });

});