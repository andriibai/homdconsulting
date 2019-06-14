$( document ).ready(function() {

    /*===========================SCROLL SPY=============================*/
    $(window).on('scroll', function () {
        var sections = $('section');
        var nav = $('.menu');
        var navHeight = nav.outerHeight();
        var curPos = $(this).scrollTop();
        sections.each(function() {
            var top = $(this).offset().top - navHeight;
            var bottom = top + $(this).outerHeight();

            if (curPos >= top && curPos <= bottom) {
                nav.find('a').removeClass('menu__link-current');
                //sections.removeClass('active');
                //$(this).addClass('menu__link-current');
                nav.find('a[href="#'+$(this).attr('id')+'"]').addClass('menu__link-current');
            }

        });
    });

    /*============================MENU LINK=============================*/
    var menuLink = $('.menu__list .menu__item .menu__link');
    menuLink.click(function(e){
        var href = $(this).attr('href'),
            offsetTop = href === "#" ? 0 : $(href).offset().top;
        $('html, body').stop().animate({
            scrollTop: offsetTop
        }, 700);
        e.preventDefault();
    });

    var linkDot = $('.menu__list .menu__item');
    linkDot.hover(function () {
        if (window.innerWidth > 747){
            $(this).addClass('menu__item-dot');
        }
    }, function () {
        if (window.innerWidth > 747) {
            $(this).removeClass('menu__item-dot');
        }
    });

    /*========================HEADER FIXED================================*/
    var headerResize = $('.header__content').data('header-resize');
    if (headerResize == 1) {
        $(window).bind('scroll', toggleNavClass);
    }
    function toggleNavClass() {
        var scrollTop = $(window).scrollTop();
        $('.header__content').toggleClass('js-fixed', scrollTop > 100);
    }

    /*==========================MOBILE MENU==============================*/
    var nav = $('.menu');
    var menuMobLink = $('.header__menu-mob');
    var overlay = $('.header__overlay');
    menuMobLink.click(function(e) {
        e.preventDefault();
        menuMobLink.toggleClass('open');
        nav.toggleClass('active');
        //hederfixed.addClass('fixed');

        if (menuMobLink.hasClass('open')){
            overlay.fadeIn(600);
        } else{
            overlay.fadeOut(600);
        }
    });

    overlay.click(function(e){
        e.preventDefault();
        menuMobLink.removeClass('open');
        overlay.fadeOut(600);
        nav.toggleClass('active');
    });

    var menuLink = $('.menu__list .menu__item .menu__link');
    menuLink.on('click', function (e){
        e.preventDefault();
        menuMobLink.removeClass('open');
        overlay.fadeOut(600);
        nav.toggleClass('active');
    });

    $(document).on('keydown', function(e) {
        if (e.keyCode == 27) {
            menuMobLink.removeClass('open');
            overlay.fadeOut(600);
            nav.toggleClass('active');
        }
    });

    /*=========================SLIDER==============================*/
$('.owl-carousel.reviews__slider').owlCarousel({
    animateIn: 'fadeIn',
    loop: true,
    //center:true,
    margin: 20,
    autoPlay: 5000,
    autoplay: true,
    nav: false,
    autoplayTimeout:5000,
    responsive: {
        0: {
            items: 1
            // center: true,
        },
        767: {
            items: 1
        },
        992:{
            items: 2
        },
        1200:{
            items: 3
        }
    }
});

    /*=========================BUTTON TOP===============================*/
    var btnTop = $('.button__top');
    $(window).scroll(function() {
        if ($(window).scrollTop() > 300) {
            btnTop.addClass('show');
        } else {
            btnTop.removeClass('show');
        }
    });
    btnTop.on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({scrollTop:0}, '300');
    });


    /*=========================POPUP===================================*/
    $(document).on('click','.popup__btn',function(){
        $('.popup__content').fadeIn(300);
        $('.overlay').fadeIn(300);
    });

    $(document).on('click','.popup__close',function(){
        $('.popup__content').fadeOut(300);
        $('.overlay').fadeOut(300);
    });

    $(document).on('click','.overlay',function(){
        $('.popup__content').fadeOut(300);
        $('.overlay').fadeOut(300);
    });

    $(document).on('keydown', function(e) {
        if (e.keyCode == 27) {
            $('.popup__content').fadeOut(300);
            $('.overlay').fadeOut(300);
        }
    });

    /*=========================WOW===============================*/
    new WOW().init();

    /*=========================CONTACT FORM FOOTER===============================*/
    $('#form-footer').on('submit', function (e) {
        e.preventDefault();
        var $that = $(this);
        var userName = $that.find("input[name='name']").val();
        var userPhone = $that.find("input[name='phone']").val();
        var phone_pattern = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
        var check_phone = phone_pattern.test(userPhone);
        var customerEmail = $that.find("input[name='email']").val();
        var textPattern = /[0-9a-z_\s]{2,200}/i;
        var mail_pattern = /[0-9a-z_]+@[0-9a-z_]+\.[a-z]{2,5}/i;
        var check_mail = mail_pattern.test(customerEmail);

        if (check_mail == true && check_phone == true) {
            $.ajax({
                type: 'POST',
                url: '/wp-admin/admin-ajax.php',
                data: {
                    action: 'contacts_send_msg',
                    name: userName,
                    phone: userPhone,
                    email: customerEmail,
                    captcha: grecaptcha.getResponse(idCaptcha1)
                },
                success: function (result) {
                    //var par = JSON.parse(result);
                    console.log(result);
                    var res = JSON.parse(result);
                    if (res.status === 'success') {
                        $that[0].reset();
                        grecaptcha.reset(idCaptcha1);
                        $('.overlay').fadeIn(600);
                        $('.thank').fadeIn(600);
                        setTimeout(function(){
                            $('.thank').fadeOut();
                            $('.overlay').fadeOut(600);
                        }, 3000);

                    } else {
                        $that.find('#recaptcha-footer > div').css({'border': '1px solid red'});
                        setTimeout(function() {
                            $that.find('#recaptcha-footer > div').css({'border': 'none'});
                        }, 3000);
                    }

                },
                error: function (jqxhr, status, exception) {
                    console.log('Exception:', exception);
                }
            });
        } else {
            if (check_phone == false) {
                $that.find("input[name='phone']").css({'border': '1px solid red'});
                setTimeout(function() {
                    $that.find("input[name='phone']").css({'border': '1px solid #cccccc', 'color': '#000'});
                }, 2000);
            } else{
                $that.find("input[name='phone']").css({'border': '1px solid #cccccc', 'color': '#000'});
            }

            if (check_mail == false) {
                $that.find("input[name='email']").css({'border': '1px solid red'});
                setTimeout(function() {
                    $that.find("input[name='email']").css({'border': '1px solid #cccccc', 'color': '#000'});
                }, 2000);
            } else{
                $that.find("input[name='email']").css({'border': '1px solid #cccccc', 'color': '#000'});
            }
        }
    });
    /*=========================CONTACT FORM POPUP===============================*/
    $('#form-popup').on('submit', function (e) {
        e.preventDefault();
        var $that = $(this);
        var userName = $that.find("input[name='name']").val();
        var userPhone = $that.find("input[name='phone']").val();
        var phone_pattern = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
        var check_phone = phone_pattern.test(userPhone);
        var customerEmail = $that.find("input[name='email']").val();
        var textPattern = /[0-9a-z_\s]{2,200}/i;
        var mail_pattern = /[0-9a-z_]+@[0-9a-z_]+\.[a-z]{2,5}/i;
        var check_mail = mail_pattern.test(customerEmail);

        if (check_mail == true && check_phone == true) {
            $.ajax({
                type: 'POST',
                url: '/wp-admin/admin-ajax.php',
                data: {
                    action: 'contacts_send_msg',
                    name: userName,
                    phone: userPhone,
                    email: customerEmail,
                    captcha: grecaptcha.getResponse(idCaptcha2)
                },
                success: function (result) {
                    //var par = JSON.parse(result);
                    console.log(result);
                    var res = JSON.parse(result);
                    if (res.status === 'success') {
                        $that[0].reset();
                        grecaptcha.reset(idCaptcha2);
                        $('.popup__content').fadeOut(600);
                        $('.thank').fadeIn(600);
                        setTimeout(function(){
                            $('.thank').fadeOut();
                            $('.overlay').fadeOut(600);
                        }, 3000);

                    } else {
                        $that.find('#recaptcha-popup > div').css({'border': '1px solid red'});
                        setTimeout(function() {
                            $that.find('#recaptcha-popup > div').css({'border': 'none'});
                        }, 3000);
                    }

                },
                error: function (jqxhr, status, exception) {
                    console.log('Exception:', exception);
                }
            });
        } else {
            if (check_phone == false) {
                $that.find("input[name='phone']").css({'border': '1px solid red'});
                setTimeout(function() {
                    $that.find("input[name='phone']").css({'border': '1px solid #55ae16', 'color': '#000'});
                }, 2000);
            } else{
                $that.find("input[name='phone']").css({'border': '1px solid #55ae16', 'color': '#000'});
            }

            if (check_mail == false) {
                $that.find("input[name='email']").css({'border': '1px solid red'});
                setTimeout(function() {
                    $that.find("input[name='email']").css({'border': '1px solid #55ae16', 'color': '#000'});
                }, 2000);
            } else{
                $that.find("input[name='email']").css({'border': '1px solid #55ae16', 'color': '#000'});
            }
        }
    });

});