"use strict";
document.addEventListener('DOMContentLoaded', function() {

    // consts 
    const forms = document.querySelectorAll('.needs-validation');
    const inputPhoneMask = document.querySelectorAll("._phone-mask");
    const lazyIframe = document.querySelectorAll('.js-lazy-iframe')
    const navLinksScroll = document.querySelectorAll(".navbar-collapse .js-scrollTo");
    const navbarCollapse = document.querySelector(".navbar-collapse");

    // close menu on click nav link
    navLinksScroll.forEach(function(link) {
        link.addEventListener("click", function() {

        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
            toggle: false
        });
        bsCollapse.hide();

        });
    });

    // anchores 
    document.body.addEventListener('click', function(e) {
        if (!e.target.matches('.js-scrollTo')) return;
        let href = e.target.getAttribute('href');
        if (!href) return;
        if (href.startsWith('/')) href = href.slice(1);
        if (href.startsWith('#')) {
            const targetElement = document.querySelector(href);
            if (!targetElement) return;

            e.preventDefault();

            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 0;
            const duration = 800; // Faster scroll (800ms)
            const start = window.scrollY;
            let startTime = null;

            function easeInOutQuad(t) {
            return t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t;
            }

            function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeInOutQuad(progress);

            // Recalculate target position dynamically
            const targetY = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
            const scrollTo = start + (targetY - start) * easedProgress;

            window.scrollTo(0, scrollTo);

            if (progress < 1) {
                    requestAnimationFrame(step);
            }
            }

            requestAnimationFrame(step);
        }
    }, true);

    // details toggle
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-toggle-details]');
        if (!btn) return;

        e.preventDefault();
        btn.closest('._product')
        ?.querySelector('.js-details')
        ?.classList.toggle('active');
    });

    // bootstrap 5 validation
    Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
            }, false);
    });

    // Phone mask 
    inputPhoneMask.forEach((input) => {
        const numberLength = 11;

        const prefixNumber = (str) => {
            if (str === "7") return "7 (";
            if (str === "8") return "8 (";
            if (str === "9") return "7 (9";
            return "7 (";
        };

        const validatePhone = () => {
            const digits = input.value.replace(/\D+/g, "");
            
            if (digits.length === numberLength) {
                input.setCustomValidity("");
            } else {
                input.setCustomValidity("Введите полный номер телефона");
            }
        };

        // ✅ Autofill +7 on focus
        input.addEventListener("focus", () => {
            if (!input.value) {
                input.value = "+7 (";
            }
        });

        input.addEventListener("input", () => {

            let value = input.value.replace(/\D+/g, "");

            // always force 7 as first digit
            if (value.length === 0) {
                input.value = "+7 (";
                return;
            }

            if (value[0] !== "7" && value[0] !== "8") {
                value = "7" + value;
            }

            let result = value[0] === "8" ? "" : "+";

            for (let i = 0; i < value.length && i < numberLength; i++) {

                switch (i) {
                    case 0:
                        result += prefixNumber(value[i]);
                        continue;
                    case 4:
                        result += ") ";
                        break;
                    case 7:
                    case 9:
                        result += "-";
                        break;
                }

                result += value[i];
            }

            input.value = result;

            validatePhone();
        });

        input.addEventListener("blur", () => {
            if (input.value === "+7 (" || input.value === "+") {
                input.value = "";
            }
            validatePhone();
        });

        input.addEventListener("keydown", (e) => {

            const digits = input.value.replace(/\D+/g, "");

            // prevent deleting +7 completely
            if (
                (e.key === "Backspace" || e.key === "Delete") &&
                digits.length <= 1
            ) {
                e.preventDefault();
            }

        });

    });

    // iframe lazy load 
    const observerIframe=new IntersectionObserver(e=>e.forEach(i=>{
        if(i.isIntersecting){
            i.target.src=i.target.dataset.src;
            observerIframe.unobserve(i.target);
        }
    }));
    lazyIframe.forEach(el=>observerIframe.observe(el));

    // fancybox 
    Fancybox.bind("[data-fancybox]", { });
})
