$(function () {
    // Visitor counter
    const key = 'bobVisitorCount';
    let count = Number(localStorage.getItem(key) || 0) + 1;
    localStorage.setItem(key, count);
    $('#visitorCount').text(count.toLocaleString());

    // Live date and time ticker
    function tick() {
        const d = new Date();
        $('#dateTime').text(d.toLocaleString(undefined, {
            weekday: 'long', day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        }));
    }
    tick();
    setInterval(tick, 1000);

    // Current navigation item
    const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    $('.navbar .nav-link').each(function () {
        if (($(this).attr('href') || '').toLowerCase() === current) {
            $(this).addClass('active');
        }
    });

    // Open the photo carousel at the exact gallery image the visitor selected.
    const galleryViewerElement = document.getElementById('galleryImageCarousel');
    const galleryModalElement = document.getElementById('galleryModal');
    let galleryViewer = null;

    function openGalleryImage(image) {
        if (!galleryViewerElement || !galleryModalElement || !window.bootstrap) return;
        const selectedIndex = Number($(image).attr('data-gallery-index') || 0);
        galleryViewer = bootstrap.Carousel.getOrCreateInstance(galleryViewerElement, {
            interval: false,
            ride: false,
            touch: true,
            wrap: true
        });
        galleryViewer.to(selectedIndex);
        bootstrap.Modal.getOrCreateInstance(galleryModalElement).show();
    }

    $('.gallery-grid .gallery-img').on('click', function () {
        openGalleryImage(this);
    }).on('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openGalleryImage(this);
        }
    });

    if (galleryViewerElement) {
        galleryViewerElement.addEventListener('slide.bs.carousel', function (event) {
            const nextImage = galleryViewerElement.querySelectorAll('.gallery-viewer-image')[event.to];
            if (nextImage) $('#galleryModalCaption').text(nextImage.dataset.caption || nextImage.alt);
        });
    }

    // jQuery form validation for Booking, Contact, Feedback and Login.
    if ($.fn.validate) {
        $('.demo-form').each(function () {
            const $form = $(this);
            const formType = $form.data('form') || 'booking';
            let rules = {};
            let messages = {};

            if (formType === 'booking') {
                rules = {
                    myName: { required: true, minlength: 3, maxlength: 30 },
                    email: { required: true, email: true },
                    zone: { required: true },
                    date: { required: true, date: true },
                    messages: { required: true, minlength: 20, maxlength: 500 }
                };
                messages = {
                    myName: { required: 'Please enter your name.', minlength: 'Name must contain at least 3 characters.', maxlength: 'Name cannot exceed 30 characters.' },
                    email: { required: 'Please enter your email address.', email: 'Please enter a valid email address.' },
                    zone: { required: 'Please select a beach zone.' },
                    date: { required: 'Please select your preferred date.', date: 'Please enter a valid date.' },
                    messages: { required: 'Please describe your travel interests.', minlength: 'Please enter at least 20 characters.', maxlength: 'Please keep your message under 500 characters.' }
                };
            } else if (formType === 'contact') {
                rules = {
                    fullName: { required: true, minlength: 3, maxlength: 40 },
                    email: { required: true, email: true },
                    message: { required: true, minlength: 10, maxlength: 500 }
                };
                messages = {
                    fullName: { required: 'Please enter your name.', minlength: 'Name must contain at least 3 characters.', maxlength: 'Name cannot exceed 40 characters.' },
                    email: { required: 'Please enter your email address.', email: 'Please enter a valid email address.' },
                    message: { required: 'Please enter your message.', minlength: 'Message must contain at least 10 characters.', maxlength: 'Message cannot exceed 500 characters.' }
                };
            } else if (formType === 'feedback') {
                rules = {
                    myName: { required: true, minlength: 3, maxlength: 40 },
                    rating: { required: true },
                    messages: { required: true, minlength: 10, maxlength: 500 }
                };
                messages = {
                    myName: { required: 'Please enter your name.', minlength: 'Name must contain at least 3 characters.', maxlength: 'Name cannot exceed 40 characters.' },
                    rating: { required: 'Please select a rating.' },
                    messages: { required: 'Please write your comments.', minlength: 'Comments must contain at least 10 characters.', maxlength: 'Comments cannot exceed 500 characters.' }
                };
            } else if (formType === 'login') {
                rules = {
                    email: { required: true, email: true },
                    password: { required: true, minlength: 6, maxlength: 50 }
                };
                messages = {
                    email: { required: 'Please enter your email address.', email: 'Please enter a valid email address.' },
                    password: { required: 'Please enter your password.', minlength: 'Password must contain at least 6 characters.', maxlength: 'Password cannot exceed 50 characters.' }
                };
            }

            $form.validate({
                rules: rules,
                messages: messages,
                errorElement: 'div',
                errorClass: 'validation-error',
                errorPlacement: function (error, element) {
                    error.insertAfter(element);
                },
                highlight: function (element) {
                    $(element).addClass('is-invalid').removeClass('is-valid');
                },
                unhighlight: function (element) {
                    $(element).removeClass('is-invalid').addClass('is-valid');
                },
                submitHandler: function (form) {
                    const successText = $form.data('success') || 'Your form has been checked successfully.';
                    $('#formMessage').removeClass('d-none alert-danger').addClass('alert-success').text(successText);
                    form.reset();
                    $form.find('.is-valid').removeClass('is-valid');
                    return false; // Frontend form: validate without navigating away.
                }
            });

            $form.find('input, select, textarea').on('input change', function () {
                $('#formMessage').addClass('d-none').text('');
            });
        });
    }

    $('#printPage').on('click', function () { window.print(); });
    $('#year').text(new Date().getFullYear());

    $('#getLocation').on('click', function () {
        if (!navigator.geolocation) {
            $('#locationText').text('Location is not supported by this browser.');
            return;
        }
        $('#locationText').text('Requesting location permission…');
        navigator.geolocation.getCurrentPosition(
            p => $('#locationText').text('Approx. coordinates: ' + p.coords.latitude.toFixed(2) + ', ' + p.coords.longitude.toFixed(2)),
            () => $('#locationText').text('Location permission was not granted.')
        );
    });
});
