/**
 * FlatPackCo — Main JavaScript
 * Features: sticky header, mobile nav, scroll animations,
 *           testimonials slider, FAQ accordion, counter animation
 */

(function () {
    'use strict';

    /* ─────────────────────────────────────────
       STICKY HEADER — adds .scrolled class
    ───────────────────────────────────────── */
    const siteHeader = document.querySelector('.site-header');

    if (siteHeader) {
        const onScroll = () => {
            siteHeader.classList.toggle('scrolled', window.scrollY > 60);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ─────────────────────────────────────────
       MOBILE NAVIGATION TOGGLE
    ───────────────────────────────────────── */
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            mobileToggle.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });

        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('open');
                mobileToggle.classList.remove('active');
                document.body.classList.remove('nav-open');
            });
        });
    }

    /* ─────────────────────────────────────────
       SCROLL ANIMATIONS — IntersectionObserver
    ───────────────────────────────────────── */
    const fadeEls = document.querySelectorAll(
        '.fade-up, .fade-in, .fade-left, .fade-right'
    );

    if (fadeEls.length) {
        const fadeObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: '0px 0px -40px 0px'
            }
        );

        fadeEls.forEach(el => fadeObserver.observe(el));
    }

    /* ─────────────────────────────────────────
       COUNTER ANIMATION
    ───────────────────────────────────────── */
    const counters = document.querySelectorAll('[data-counter]');

    if (counters.length) {
        const counterObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    const el = entry.target;
                    const target =
                        parseFloat(el.getAttribute('data-counter')) || 0;
                    const duration =
                        parseInt(el.getAttribute('data-duration'), 10) || 1600;
                    const suffix =
                        el.getAttribute('data-suffix') || '';
                    const prefix =
                        el.getAttribute('data-prefix') || '';

                    let startTime = null;

                    const animate = timestamp => {
                        if (!startTime) startTime = timestamp;

                        const progress = Math.min(
                            (timestamp - startTime) / duration,
                            1
                        );

                        const eased = 1 - Math.pow(1 - progress, 3);
                        const value = target * eased;

                        el.textContent =
                            prefix +
                            (
                                Number.isInteger(target)
                                    ? Math.round(value)
                                    : value.toFixed(1)
                            ) +
                            suffix;

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    };

                    requestAnimationFrame(animate);
                    observer.unobserve(el);
                });
            },
            {
                threshold: 0.5
            }
        );

        counters.forEach(counter => counterObserver.observe(counter));
    }

    /* ─────────────────────────────────────────
       TESTIMONIALS SLIDER
    ───────────────────────────────────────── */
    const testimonialTrack =
        document.querySelector('.testimonials-track');
    const testimonialSlides =
        document.querySelectorAll('.testimonial-slide');
    const testimonialPrev =
        document.querySelector('.testimonial-prev');
    const testimonialNext =
        document.querySelector('.testimonial-next');
    const testimonialDots =
        document.querySelectorAll('.testimonial-dot');

    if (testimonialTrack && testimonialSlides.length) {
        let testimonialIndex = 0;

        function updateTestimonials() {
            testimonialTrack.style.transform =
                `translateX(-${testimonialIndex * 100}%)`;

            testimonialDots.forEach((dot, index) => {
                dot.classList.toggle(
                    'active',
                    index === testimonialIndex
                );
            });
        }

        if (testimonialPrev) {
            testimonialPrev.addEventListener('click', () => {
                testimonialIndex =
                    (testimonialIndex - 1 + testimonialSlides.length) %
                    testimonialSlides.length;

                updateTestimonials();
            });
        }

        if (testimonialNext) {
            testimonialNext.addEventListener('click', () => {
                testimonialIndex =
                    (testimonialIndex + 1) %
                    testimonialSlides.length;

                updateTestimonials();
            });
        }

        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                testimonialIndex = index;
                updateTestimonials();
            });
        });

        updateTestimonials();
    }

    /* ─────────────────────────────────────────
       FAQ ACCORDION
    ───────────────────────────────────────── */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question =
            item.querySelector('.faq-question');

        if (!question) return;

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            faqItems.forEach(otherItem => {
                otherItem.classList.remove('open');
            });

            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });

    /* ─────────────────────────────────────────
       SCOPE ACCORDION
    ───────────────────────────────────────── */
    const scopeItems =
        document.querySelectorAll('.scope-item');

    scopeItems.forEach(item => {
        const trigger =
            item.querySelector('.scope-trigger');

        if (!trigger) return;

        trigger.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            scopeItems.forEach(otherItem => {
                otherItem.classList.remove('open');
            });

            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });

    /* ─────────────────────────────────────────
       PORTFOLIO CATEGORY FILTER
    ───────────────────────────────────────── */
    const filterBtns =
        document.querySelectorAll('.filter-btn');

    const portfolioItems =
        document.querySelectorAll(
            '.portfolio-item[data-category]'
        );

    if (filterBtns.length && portfolioItems.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b =>
                    b.classList.remove('active')
                );

                btn.classList.add('active');

                const filter =
                    btn.getAttribute('data-filter');

                portfolioItems.forEach(item => {
                    const cat =
                        item.getAttribute('data-category');

                    const show =
                        filter === 'all' || cat === filter;

                    item.style.display =
                        show ? '' : 'none';
                });
            });
        });
    }

    /* ─────────────────────────────────────────
       BLOG CATEGORY FILTER — driven by ?cat=
    ───────────────────────────────────────── */
    const blogGrid =
        document.getElementById('blogGrid');

    const blogItems =
        document.querySelectorAll(
            '.blog-filter-item[data-category]'
        );

    if (blogGrid && blogItems.length) {
        const params =
            new URLSearchParams(window.location.search);

        const activeCat =
            params.get('cat') || '';

        const catLinks =
            document.querySelectorAll(
                '.cat-list-item[data-cat]'
            );

        const emptyState =
            document.getElementById('blogEmptyState');

        const filterStatus =
            document.getElementById('blogFilterStatus');

        const filterLabel =
            filterStatus
                ? filterStatus.querySelector('strong')
                : null;

        let visibleCount = 0;

        blogItems.forEach(item => {
            const show =
                !activeCat ||
                item.getAttribute('data-category') === activeCat;

            item.style.display =
                show ? '' : 'none';

            if (show) visibleCount++;
        });

        catLinks.forEach(link => {
            link.classList.toggle(
                'active',
                activeCat !== '' &&
                link.getAttribute('data-cat') === activeCat
            );
        });

        if (filterStatus) {
            if (activeCat) {
                filterStatus.style.display = '';

                if (filterLabel) {
                    filterLabel.textContent = activeCat;
                }
            } else {
                filterStatus.style.display = 'none';
            }
        }

        if (emptyState) {
            emptyState.style.display =
                activeCat && visibleCount === 0
                    ? ''
                    : 'none';
        }
    }

    /* ─────────────────────────────────────────
       PRODUCT GALLERY — thumbnail swap & lightbox
    ───────────────────────────────────────── */
    const gallery =
        document.querySelector('.product-gallery');

    if (gallery) {
        const mainImg =
            gallery.querySelector('.product-main-img img');

        const thumbs =
            gallery.querySelectorAll('.product-thumb');

        const allSrcs = [];

        if (mainImg) {
            allSrcs.push(mainImg.src);
        }

        thumbs.forEach(function (thumb) {
            var img = thumb.querySelector('img');

            if (img) {
                allSrcs.push(img.src);
            }
        });

        var currentLightboxIdx = 0;

        thumbs.forEach(function (thumb) {
            thumb.addEventListener('click', function () {
                var img =
                    thumb.querySelector('img');

                if (img && mainImg) {
                    mainImg.src = img.src;
                    mainImg.alt =
                        img.alt || mainImg.alt;
                }

                thumbs.forEach(function (t) {
                    t.classList.remove('active');
                });

                thumb.classList.add('active');
            });
        });

        // Lightbox
        var lightbox =
            document.createElement('div');

        lightbox.className =
            'product-lightbox';

        lightbox.innerHTML =
            '<button class="lightbox-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>' +
            '<button class="lightbox-nav lightbox-prev" aria-label="Previous"><i class="fa-solid fa-chevron-left"></i></button>' +
            '<img src="" alt="Product image enlarged">' +
            '<button class="lightbox-nav lightbox-next" aria-label="Next"><i class="fa-solid fa-chevron-right"></i></button>';

        document.body.appendChild(lightbox);

        var lbImg =
            lightbox.querySelector('img');

        var lbClose =
            lightbox.querySelector('.lightbox-close');

        var lbPrev =
            lightbox.querySelector('.lightbox-prev');

        var lbNext =
            lightbox.querySelector('.lightbox-next');

        function openLightbox(src) {
            currentLightboxIdx =
                allSrcs.indexOf(src);

            if (currentLightboxIdx === -1) {
                currentLightboxIdx = 0;
            }

            lbImg.src =
                allSrcs[currentLightboxIdx];

            lightbox.classList.add('open');

            document.body.style.overflow =
                'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
        }

        function navLightbox(dir) {
            currentLightboxIdx =
                (currentLightboxIdx + dir + allSrcs.length) %
                allSrcs.length;

            lbImg.src =
                allSrcs[currentLightboxIdx];
        }

        if (mainImg) {
            mainImg.parentElement.addEventListener(
                'click',
                function () {
                    openLightbox(mainImg.src);
                }
            );
        }

        thumbs.forEach(function (thumb) {
            thumb.addEventListener(
                'dblclick',
                function () {
                    var img =
                        thumb.querySelector('img');

                    if (img) {
                        openLightbox(img.src);
                    }
                }
            );
        });

        lbClose.addEventListener(
            'click',
            closeLightbox
        );

        lightbox.addEventListener(
            'click',
            function (e) {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            }
        );

        lbPrev.addEventListener(
            'click',
            function (e) {
                e.stopPropagation();
                navLightbox(-1);
            }
        );

        lbNext.addEventListener(
            'click',
            function (e) {
                e.stopPropagation();
                navLightbox(1);
            }
        );

        document.addEventListener(
            'keydown',
            function (e) {
                if (!lightbox.classList.contains('open')) {
                    return;
                }

                if (e.key === 'Escape') {
                    closeLightbox();
                }

                if (e.key === 'ArrowLeft') {
                    navLightbox(-1);
                }

                if (e.key === 'ArrowRight') {
                    navLightbox(1);
                }
            }
        );
    }

    /* ─────────────────────────────────────────
       SMOOTH SCROLL for anchor links
    ───────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]')
        .forEach(anchor => {
            anchor.addEventListener('click', e => {
                const target =
                    document.querySelector(
                        anchor.getAttribute('href')
                    );

                if (target) {
                    e.preventDefault();

                    const offset = 90;

                    const top =
                        target.getBoundingClientRect().top +
                        window.scrollY -
                        offset;

                    window.scrollTo({
                        top,
                        behavior: 'smooth'
                    });
                }
            });
        });

    /* ─────────────────────────────────────────
       NEWSLETTER FORM — basic submission handler
    ───────────────────────────────────────── */
    const newsletterForms =
        document.querySelectorAll('.newsletter-form');

    newsletterForms.forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();

            const input =
                form.querySelector('.newsletter-input');

            if (input && input.value.includes('@')) {
                input.value = '';

                showToast(
                    'Thank you! You\'ve been subscribed.'
                );
            } else {
                showToast(
                    'Please enter a valid email address.',
                    'error'
                );
            }
        });
    });

    function showToast(message, type = 'success') {
        const toast =
            document.createElement('div');

        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#C8963E' : '#E53E3E'};
            color: #fff;
            padding: 12px 24px;
            border-radius: 50px;
            font-size: 0.875rem;
            font-weight: 600;
            z-index: 9999;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            animation: fadeIn 0.3s ease;
            font-family: 'Poppins', sans-serif;
        `;

        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => toast.remove(), 3500);
    }

    /* ─────────────────────────────────────────
       PARALLAX BACKGROUND LAYERS
    ───────────────────────────────────────── */
    const parallaxEls =
        document.querySelectorAll('[data-parallax]');

    if (parallaxEls.length) {
        const updateParallax = () => {
            parallaxEls.forEach(el => {
                const speed =
                    parseFloat(
                        el.dataset.parallaxSpeed
                    ) || 0.15;

                const rect =
                    el.parentElement.getBoundingClientRect();

                const offset =
                    rect.top * speed;

                el.style.transform =
                    `translate3d(0, ${offset}px, 0)`;
            });
        };

        window.addEventListener(
            'scroll',
            updateParallax,
            { passive: true }
        );

        window.addEventListener(
            'resize',
            updateParallax
        );

        updateParallax();
    }

})();

/* ─────────────────────────────────────────
   PROJECT POPUP — iframe modal
───────────────────────────────────────── */
(function () {
    'use strict';

    var popup =
        document.getElementById('projectPopup');

    if (!popup) return;

    var backdrop =
        popup.querySelector('.project-popup-backdrop');

    var closeBtn =
        popup.querySelector('.project-popup-close');

    var frame =
        popup.querySelector('.project-popup-frame');

    function openPopup(url) {
        frame.src = url;

        popup.classList.add('open');

        document.body.style.overflow =
            'hidden';
    }

    function closePopup() {
        popup.classList.remove('open');

        document.body.style.overflow = '';

        setTimeout(function () {
            frame.src = '';
        }, 420);
    }

    document.querySelectorAll('[data-popup]')
        .forEach(function (el) {
            el.addEventListener(
                'click',
                function (e) {
                    e.preventDefault();

                    openPopup(
                        el.getAttribute('data-popup')
                    );
                }
            );
        });

    if (closeBtn) {
        closeBtn.addEventListener(
            'click',
            closePopup
        );
    }

    if (backdrop) {
        backdrop.addEventListener(
            'click',
            closePopup
        );
    }

    document.addEventListener(
        'keydown',
        function (e) {
            if (
                e.key === 'Escape' &&
                popup.classList.contains('open')
            ) {
                closePopup();
            }
        }
    );

}());

/* ─────────────────────────────────────────
   CONTACT FORM — POST directly to BMS
───────────────────────────────────────── */
(function () {
    'use strict';

    var form =
        document.getElementById('contact-form');

    if (!form) return;

    // Anti-spam: measure how long the contact form has been open.
    var formStartTime = Date.now();

    /*
     * ANTI-SPAM — Google reCAPTCHA v3
     *
     * This site key is PUBLIC (safe to ship in client JS — it identifies the site to
     * Google, it is not a secret). The matching secret key lives only on the BMS backend
     * (.env RECAPTCHA_SECRET_KEY) and verifies every token server-side before a lead is
     * ever created; a token generated here proves nothing by itself.
     *
     * TODO: replace with the real reCAPTCHA v3 site key from the Google reCAPTCHA admin
     * console (same key pair as RECAPTCHA_SECRET_KEY on the BMS backend). Until this is
     * set, the form still works exactly as before — no token is sent, and the backend
     * treats a missing token as a soft spam-score signal, not a hard block.
     */
    var RECAPTCHA_SITE_KEY = '6LfZ5dYtAAAAACbgI9pW1jIVdvereagH5WpT4my1';
    var RECAPTCHA_ACTION = 'fpco_lead_submit';
    var recaptchaReady = null;

    function isRecaptchaConfigured() {
        return !!RECAPTCHA_SITE_KEY && RECAPTCHA_SITE_KEY.indexOf('YOUR_RECAPTCHA') !== 0;
    }

    function loadRecaptcha() {
        if (recaptchaReady) {
            return recaptchaReady;
        }

        recaptchaReady = new Promise(function (resolve) {
            if (!isRecaptchaConfigured()) {
                resolve(false);
                return;
            }

            var script = document.createElement('script');

            script.src =
                'https://www.google.com/recaptcha/api.js?render=' +
                encodeURIComponent(RECAPTCHA_SITE_KEY);

            script.async = true;

            script.onload = function () {
                if (window.grecaptcha && window.grecaptcha.ready) {
                    window.grecaptcha.ready(function () {
                        resolve(true);
                    });
                } else {
                    resolve(false);
                }
            };

            script.onerror = function () {
                resolve(false);
            };

            document.head.appendChild(script);
        });

        return recaptchaReady;
    }

    // Generates a fresh token immediately before submit, as required (tokens are
    // short-lived). Resolves to '' (not a rejection) on any failure so a reCAPTCHA outage
    // never blocks the form client-side -- the backend treats a missing token as a soft
    // signal only, never an automatic hard block.
    function getRecaptchaToken() {
        return loadRecaptcha().then(function (ready) {
            if (!ready || !window.grecaptcha) {
                return '';
            }

            return window.grecaptcha
                .execute(RECAPTCHA_SITE_KEY, { action: RECAPTCHA_ACTION })
                .catch(function () {
                    return '';
                });
        });
    }

    if (isRecaptchaConfigured()) {
        loadRecaptcha();
    }

    /*
     * CONTACT FORM TOAST
     *
     * This is intentionally defined inside the contact-form
     * IIFE so the FPCO contact form can access it.
     */
    function showToast(message, type = 'success') {
        var toast =
            document.createElement('div');

        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#C8963E' : '#E53E3E'};
            color: #fff;
            padding: 12px 24px;
            border-radius: 50px;
            font-size: 0.875rem;
            font-weight: 600;
            z-index: 9999;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            animation: fadeIn 0.3s ease;
            font-family: 'Poppins', sans-serif;
            max-width: calc(100vw - 40px);
            text-align: center;
        `;

        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(function () {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 3500);
    }

    // API field → form field name mapping
    var fieldMap = {
        full_name: 'full_name',
        phone: 'phone',
        email: 'email',
        project_type: 'project_type',
        source: 'source',
        message: 'message',
        location: 'location',
        budget: 'budget',
        brand: 'company'
    };

    function clearErrors() {
        form
            .querySelectorAll('.field-error')
            .forEach(function (el) {
                el.remove();
            });

        form
            .querySelectorAll('.input-error')
            .forEach(function (el) {
                el.classList.remove('input-error');
            });
    }

    function showFieldErrors(errors) {
        Object.keys(errors).forEach(function (apiKey) {
            var formField =
                fieldMap[apiKey] || apiKey;

            var input =
                form.elements[formField];

            var msg =
                errors[apiKey][0];

            if (input) {
                input.classList.add('input-error');

                var span =
                    document.createElement('span');

                span.className = 'field-error';
                span.textContent = msg;

                input.parentNode.appendChild(span);
            }
        });

        var first =
            form.querySelector('.input-error');

        if (first) {
            first.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    form.addEventListener(
        'submit',
        async function (e) {
            e.preventDefault();

            clearErrors();

            var btn =
                form.querySelector(
                    'button[type="submit"]'
                );

            if (!btn) {
                console.error(
                    'FPCO contact form submit button not found.'
                );
                return;
            }

            var originalHTML =
                btn.innerHTML;

            btn.disabled = true;

            btn.innerHTML =
                'Loading... <i class="fa-solid fa-spinner fa-spin"></i>';

            var get = function (name) {
                return (
                    form.elements[name] &&
                    form.elements[name].value ||
                    ''
                ).trim();
            };

            var params =
                new URLSearchParams(
                    window.location.search
                );

            var utm = function (key) {
                return params.get(key) || undefined;
            };

            // FREE ANTI-SPAM — reCAPTCHA v3 (generated fresh, immediately before submit)
            var recaptchaToken = await getRecaptchaToken();

            var payload = {
                full_name: get('full_name'),
                phone: get('phone'),
                email: get('email') || undefined,

                // FREE ANTI-SPAM — honeypot
                website: get('website'),

                // FREE ANTI-SPAM — reCAPTCHA v3 token; verified server-side, never trusted
                // on its own. Omitted entirely if reCAPTCHA isn't configured/available.
                recaptcha_token: recaptchaToken || undefined,

                // FREE ANTI-SPAM — submission timing
                form_time_ms:
                    Date.now() - formStartTime,

                project_type:
                    get('project_type') || undefined,

                source:
                    get('source') || undefined,

                message:
                    get('message') || undefined,

                whatsapp_opt_in: false,
                preferred_language: 'English',

                brand:
                    get('company') || undefined,

                location:
                    get('location') || undefined,

                budget:
                    get('budget') || undefined,

                UTM_Source:
                    utm('utm_source'),

                UTM_Medium:
                    utm('utm_medium'),

                UTM_Content:
                    utm('utm_content'),

                UTM_Term:
                    utm('utm_term'),

                Campaign_Name:
                    utm('utm_campaign')
            };

            Object.keys(payload).forEach(function (k) {
                if (payload[k] === undefined) {
                    delete payload[k];
                }
            });

            try {
                var response =
                    await fetch(
                        'https://bms.sprint-co.com/api/fpco/leads',
                        {
                            method: 'POST',

                            headers: {
                                'Content-Type':
                                    'application/json',
                                'Accept':
                                    'application/json'
                            },

                            body:
                                JSON.stringify(payload)
                        }
                    );

                var data = null;

                try {
                    data =
                        await response.json();
                } catch (parseError) {
                    data = null;
                }

                /* ─────────────────────────────────
                   ANTI-SPAM RESPONSE — DUPLICATE
                ───────────────────────────────── */
                if (
                    data &&
                    data.status === 'duplicate'
                ) {
                    showToast(
                        data.message ||
                        'Your request has already been submitted.',
                        'error'
                    );

                    btn.disabled = false;
                    btn.innerHTML = originalHTML;

                    return;
                }

                /* ─────────────────────────────────
                   ANTI-SPAM RESPONSE — BLOCKED
                ───────────────────────────────── */
                if (
                    data &&
                    data.status === 'blocked'
                ) {
                    showToast(
                        data.message ||
                        'We could not process this request. Please try again later.',
                        'error'
                    );

                    btn.disabled = false;
                    btn.innerHTML = originalHTML;

                    return;
                }

                /* ─────────────────────────────────
                   ANTI-SPAM RESPONSE — RATE LIMITED
                ───────────────────────────────── */
                if (
                    response.status === 429 ||
                    (
                        data &&
                        data.status === 'rate_limited'
                    )
                ) {
                    showToast(
                        data && data.message
                            ? data.message
                            : 'Too many requests. Please try again later.',
                        'error'
                    );

                    btn.disabled = false;
                    btn.innerHTML = originalHTML;

                    return;
                }

                /* ─────────────────────────────────
                   EXISTING VALIDATION RESPONSE
                ───────────────────────────────── */
                if (response.status === 422) {
                    showFieldErrors(
                        (
                            data &&
                            data.error &&
                            data.error.details
                        ) || {}
                    );

                    btn.disabled = false;
                    btn.innerHTML = originalHTML;

                    return;
                }

                /* ─────────────────────────────────
                   EXISTING GENERAL ERROR RESPONSE
                ───────────────────────────────── */
                if (!response.ok) {
                    showToast(
                        (
                            data &&
                            data.message
                        ) ||
                        'Something went wrong. Please try again.',
                        'error'
                    );

                    btn.disabled = false;
                    btn.innerHTML = originalHTML;

                    return;
                }

                /* ─────────────────────────────────
                   EXISTING SUCCESS FLOW
                ───────────────────────────────── */
                window.location.href =
                    'thank-you.html';

            } catch (err) {
                console.error(
                    'BMS lead submission error:',
                    err
                );

                showToast(
                    'Network error. Please check your connection.',
                    'error'
                );

                btn.disabled = false;
                btn.innerHTML = originalHTML;
            }
        }
    );

}());

/* ─────────────────────────────────────────
   LANDING FORM — POST directly to BMS
───────────────────────────────────────── */
(function () {
    'use strict';

    var form =
        document.getElementById('landing-form');

    if (!form) return;

    var fieldMap = {
        full_name: 'full_name',
        phone: 'phone',
        email: 'email',
        project_type: 'project_type',
        location: 'location'
    };

    function clearErrors() {
        form
            .querySelectorAll('.field-error')
            .forEach(function (el) {
                el.remove();
            });

        form
            .querySelectorAll('.input-error')
            .forEach(function (el) {
                el.classList.remove('input-error');
            });
    }

    function showFieldErrors(errors) {
        Object.keys(errors).forEach(function (apiKey) {
            var formField =
                fieldMap[apiKey] || apiKey;

            var input =
                form.elements[formField];

            var msg =
                errors[apiKey][0];

            if (input) {
                input.classList.add('input-error');

                var span =
                    document.createElement('span');

                span.className = 'field-error';
                span.textContent = msg;

                input.parentNode.appendChild(span);
            }
        });

        var first =
            form.querySelector('.input-error');

        if (first) {
            first.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    form.addEventListener(
        'submit',
        async function (e) {
            e.preventDefault();

            clearErrors();

            var btn =
                form.querySelector(
                    'button[type="submit"]'
                );

            if (!btn) {
                console.error(
                    'Landing form submit button not found.'
                );
                return;
            }

            var originalHTML =
                btn.innerHTML;

            btn.disabled = true;

            btn.innerHTML =
                'Loading... <i class="fa-solid fa-spinner fa-spin"></i>';

            var get = function (name) {
                return (
                    form.elements[name] &&
                    form.elements[name].value ||
                    ''
                ).trim();
            };

            var params =
                new URLSearchParams(
                    window.location.search
                );

            var utm = function (key) {
                return params.get(key) || undefined;
            };

            var payload = {
                full_name:
                    get('full_name'),

                phone:
                    get('phone'),

                email:
                    get('email') || undefined,

                project_type:
                    get('project_type') || undefined,

                location:
                    get('location') || undefined,

                whatsapp_opt_in: false,

                preferred_language:
                    'English',

                UTM_Source:
                    utm('utm_source'),

                UTM_Medium:
                    utm('utm_medium'),

                UTM_Content:
                    utm('utm_content'),

                UTM_Term:
                    utm('utm_term'),

                Campaign_Name:
                    utm('utm_campaign'),

                message:
                    'message from landing page'
            };

            Object.keys(payload).forEach(function (k) {
                if (payload[k] === undefined) {
                    delete payload[k];
                }
            });

            try {
                var response =
                    await fetch(
                        'https://bms.sprint-co.com/api/fpco/leads',
                        {
                            method: 'POST',

                            headers: {
                                'Content-Type':
                                    'application/json',
                                'Accept':
                                    'application/json'
                            },

                            body:
                                JSON.stringify(payload)
                        }
                    );

                if (response.status === 422) {
                    var data =
                        await response.json();

                    showFieldErrors(
                        (
                            data.error &&
                            data.error.details
                        ) || {}
                    );

                    btn.disabled = false;
                    btn.innerHTML = originalHTML;

                    return;
                }

                if (!response.ok) {
                    showToast(
                        'Something went wrong. Please try again.',
                        'error'
                    );

                    btn.disabled = false;
                    btn.innerHTML = originalHTML;

                    return;
                }

                window.location.href =
                    'thank-you.html';

            } catch (err) {
                console.error(
                    'BMS lead submission error:',
                    err
                );

                showToast(
                    'Network error. Please check your connection.',
                    'error'
                );

                btn.disabled = false;
                btn.innerHTML = originalHTML;
            }
        }
    );

}());