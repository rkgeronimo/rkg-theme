"use strict";

/* global rkgTheme Croppie */

jQuery(document).ready(function ($) {
  //= include ../../../node_modules/pdf417/bcmath-min.js
  //= include ../../../node_modules/pdf417/pdf417.js
  var BarcodePayment;
  var sequence;
  var codewords;
  //= include ../../../node_modules/generator-barkoda-uplatnica/BarcodePayment.js

  function modalStatusClass() {
    var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'na';
    $('.rkg-modal-status').removeClass('error ok');
    if (s === 1) {
      $('.rkg-modal-status').addClass('error');
    } else if (s === 0) {
      $('.rkg-modal-status').addClass('ok');
    }
  }
  var loginStatus = {
    action: 'is_user_logged_in'
  };
  $('.rkg-meni-open').click(function () {
    $('body').addClass('modal-open');
    $('.rkg-meni-background').fadeIn(200, function () {
      $('.rkg-meni').fadeIn({
        queue: false,
        duration: 200
      }).animate({
        bottom: '0',
        top: '0'
      }, 200);
    });
    $('#rkg-top-meni').fadeOut('fast');
    $('#rkg-header-meni').fadeOut('fast');
  });
  $('.rkg-meni-close, #nav-main a').click(function () {
    $('body').removeClass('modal-open');
    $('.rkg-meni').fadeOut({
      queue: false,
      duration: 200
    }).animate({
      bottom: '50%',
      top: '-50%'
    }, 200, function () {
      $('.rkg-meni-background').fadeOut(200);
    });
    $('#rkg-top-meni').fadeIn('fast');
    $('#rkg-header-meni').fadeIn('fast');
  });

  /* global rkgTheme loginStatus Croppie rkgScript PDF417 BarcodePayment modalStatusClass */
  var modalShow = false;
  var signup = null;
  var modalOpen = function modalOpen(modal, callback) {
    modalStatusClass();
    $('.rkg-modal-status').text('');
    $('body').addClass('modal-open');
    if (modalShow) {
      $('.rkg-modal form, .modal-div').fadeOut('fast').promise().done(function () {
        $(modal).fadeIn(400);
      });
    } else {
      $('.rkg-modal form, .modal-div').hide();
      $(modal).show();
    }
    modalShow = true;
    if ($(window).width() <= 1080) {
      $('.rkg-modal').fadeIn({
        queue: false,
        duration: 'fast'
      }).promise().done(callback);
      return;
    }
    $('.rkg-modal-background').fadeIn('fast').promise().done(function () {
      $('.rkg-modal').fadeIn({
        queue: false,
        duration: 'fast'
      }).animate({
        top: '50%'
      }).promise().done(callback);
    });
  };
  $('.ShowPayModal').click(function (e) {
    e.preventDefault();
    var textToEncode = $(e.currentTarget).data('barcode_text');
    console.log(textToEncode);
    PDF417.init(textToEncode);
    var barcode = PDF417.getBarcodeArray();

    // block sizes (width and height) in pixels
    var bw = 2;
    var bh = 1;

    // create canvas element based on number of columns and rows in barcode
    var container = document.getElementById('payment-barcode');
    if (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    var canvas = document.createElement('canvas');
    canvas.width = bw * barcode.num_cols;
    canvas.height = bh * barcode.num_rows;
    container.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    // graph barcode elements
    var y = 0;
    // for each row
    for (var r = 0; r < barcode.num_rows; ++r) {
      var x = 0;
      // for each column
      for (var c = 0; c < barcode.num_cols; ++c) {
        if (barcode.bcode[r][c] === '1') {
          ctx.fillRect(x, y, bw, bh);
        }
        x += bw;
      }
      y += bh;
    }
    var title = $(e.currentTarget).data('title');
    var primatelj = $(e.currentTarget).data('primatelj');
    var iban = $(e.currentTarget).data('iban');
    var modelPlacanja = $(e.currentTarget).data('model_placanja');
    var pozivNaBroj = $(e.currentTarget).data('poziv_na_broj');
    var opisPlacanja = $(e.currentTarget).data('opis_placanja');
    var iznos = $(e.currentTarget).data('iznos');
    $('#payment-title').html(title);
    $('#payment-primatelj').html(primatelj);
    $('#payment-iban').html(iban);
    $('#payment-model_placanja').html(modelPlacanja);
    $('#payment-poziv_na_broj').html(pozivNaBroj);
    $('#payment-opis_placanja').html(opisPlacanja);
    $('#payment-iznos').html(iznos);

    // $('.rkg-profile-meni').hide()
    // .promise()
    // .done(() => {
    // modalOpen('#payment-modal');
    // });
  });

  $('.rkg-modal-close, rkg-info-close').click(function (e) {
    modalShow = false;
    e.preventDefault();
    modalStatusClass();
    $('.rkg-modal-status').text('');
    $('body').removeClass('modal-open');
    signup = null;
    if ($(window).width() <= 1080) {
      $('.rkg-modal').fadeOut({
        queue: false,
        duration: 'fast'
      }).promise().done(function () {
        $('.rkg-modal form, .modal-div').hide();
      });
      return;
    }
    $('.rkg-modal').fadeOut({
      queue: false,
      duration: 'fast'
    }).animate({
      top: '37.5%'
    }).promise().done(function () {
      $('.rkg-modal form, .modal-div').hide();
      $('.rkg-modal-background').fadeOut('fast');
    });
  });
  $('.course-signup-ok-close').click(function (e) {
    modalShow = false;
    e.preventDefault();
    modalStatusClass();
    $('.rkg-modal-status').text('');
    $('body').removeClass('modal-open');
    signup = null;
    if ($(window).width() <= 1080) {
      $('.rkg-modal').fadeOut({
        queue: false,
        duration: 'fast'
      }).promise().done(function () {
        $('.rkg-modal form, .modal-div').hide().promise().done(function () {
          window.location.reload();
        });
      });
      return;
    }
    $('.rkg-modal').fadeOut({
      queue: false,
      duration: 'fast'
    }).animate({
      top: '37.5%'
    }).promise().done(function () {
      $('.rkg-modal form, .modal-div').hide();
      $('.rkg-modal-background').fadeOut('fast').hide().promise().done(function () {
        window.location.reload();
      });
    });
  });
  if ($('#no-required-user').length !== 0) {
    modalOpen('#registration');
  }
  $('.rkg-login-button, .rkg-login-show').click(function () {
    modalOpen('#login');
  });
  $('.rkg-registration-show').click(function () {
    modalOpen('#registration');
  });
  $('.rkg-lost-password-show').click(function () {
    modalOpen('#lost-password');
  });
  $('#rkg-members-button').click(function () {
    if ($('#rkg-members-table-container').is(':empty')) {
      $.ajax({
        type: 'POST',
        url: rkgTheme.ajaxurl,
        data: {
          action: 'getMembersList'
        },
        success: function success(data) {
          $('#rkg-members-table-container').html(data);
        }
      });
    }
    if ($(window).width() <= 1080 && window.devicePixelRatio > 1.5) {
      $('.rkg-profile-meni').css('left', '-90vw').promise().done(function () {
        modalOpen('#rkg-moddal-members');
      });
      return;
    }
    $('.rkg-profile-meni').animate({
      height: 'toggle',
      opacity: 'toggle'
    }, 'fast').promise().done(function () {
      modalOpen('#rkg-moddal-members');
    });
  });
  $('.course-signup').on('click', function (e) {
    e.preventDefault();
    signup = 'course';
    var signupId = $(e.currentTarget).data('course');
    var signupName = $(e.currentTarget).data('name');
    var signupDate = $(e.currentTarget).data('date');
    var link = $(e.currentTarget).data('link');
    $('input[name="signup-course"]').val(signupId);
    $('.course-signup-name').text(signupName);
    $('.course-signup-date').text(signupDate);
    $('#course-signup-modal-link').attr('href', link);
    jQuery.post(rkgTheme.ajaxurl, loginStatus, function (response) {
      if (response === 'yes') {
        var dob = $('#dob').val();
        var oib = $('#oib').val();
        var tel = $('#tel').val();
        if (dob.length === 0 || oib.length === 0 || tel.length === 0) {
          modalOpen('#additional-details-form');
        } else {
          $('#additional-details-form').submit();
        }
      } else {
        modalOpen('#registration');
      }
    });
  });
  $('form#login').on('submit', function (e) {
    modalStatusClass();
    $('.rkg-modal-status').text('Prijava u tijeku...');
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: rkgTheme.ajaxurl,
      data: {
        action: 'ajaxlogin',
        username: $('form#login #username').val(),
        password: $('form#login #password').val(),
        security: $('form#login #security').val()
      },
      success: function success(data) {
        modalStatusClass(data.status);
        $('.rkg-modal-status').text(data.message);
        if (data.status === 0) {
          if (signup === 'course') {
            modalOpen('#additional-details-form');
            signup = null;
          } else {
            window.location.reload();
          }
        }
      },
      error: function error(_error) {
        console.log(_error);
      }
    });
    e.preventDefault();
  });
  $('form#registration').on('submit', function (e) {
    modalStatusClass();
    $('.rkg-modal-status').text('Registracija u tijeku...');
    var regNonce = $('#vb_new_user_nonce').val();
    var regPass = $('#vb_pass').val();
    var regMail = $('#vb_email').val();
    var regFirstname = $('#vb_name').val();
    var regLastname = $('#vb_surname').val();
    var data = {
      action: 'register_user',
      nonce: regNonce,
      pass: regPass,
      mail: regMail,
      firstname: regFirstname,
      lastname: regLastname
    };
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: rkgTheme.ajaxurl,
      data: data,
      success: function success(data) {
        modalStatusClass(data.status);
        $('.rkg-modal-status').text(data.message);
        if (data.status === 0) {
          if (signup === 'course') {
            modalOpen('#additional-details-form');
            signup = null;
          } else {
            window.location.reload();
          }
        }
      },
      error: function error(_error2) {
        console.log(_error2);
      }
    });
    e.preventDefault();
  });
  $('form#additional-details-form').on('submit', function (e) {
    modalStatusClass();
    $('.rkg-modal-status').text(rkgTheme.loadingmessage);
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: rkgTheme.ajaxurl,
      data: {
        action: 'rkg_user_additional_details',
        pob: $('form#additional-details-form #pob').val(),
        dob: $('form#additional-details-form #dob').val(),
        oib: $('form#additional-details-form #oib').val(),
        tel: $('form#additional-details-form #tel').val(),
        course: $('form#additional-details-form #signup-course').val()
      },
      success: function success(data) {
        modalStatusClass(data.status);
        $('form#additional-details-form p.status').text(data.message);
        modalOpen('#course-signup-ok');
      }
    });
    e.preventDefault();
  });
  $('.rkg-course-signup-close').click(function () {
    $('.rkg-course-signup').fadeOut({
      queue: false,
      duration: 'fast'
    }).animate({
      top: '25%'
    }, function () {
      $('.rkg-modal-background').fadeOut('fast', function () {
        return window.location.reload();
      });
    });
    if ($(window).width() <= 1080) {
      $('.rkg-modal').fadeOut({
        queue: false,
        duration: 'fast'
      }).promise().done(function () {
        window.location.reload();
      });
      return;
    }
    $('.rkg-modal').fadeOut({
      queue: false,
      duration: 'fast'
    }).animate({
      top: '37.5%'
    }).promise().done(function () {
      window.location.reload();
    });
  });
  $('.course-signout').on('click', function (e) {
    e.preventDefault();
    var signupId = $(e.currentTarget).data('course');
    var signoutName = $(e.currentTarget).data('name');
    $('input[name="signout-course"]').val(signupId);
    $('.course-signout-name').text(signoutName);
    modalOpen('#course-signout-form');
  });
  $('#course-signup-ok-pay, #course-signup-show-pay').click(function (e) {
    modalOpen('#course-signup-pay');
    e.preventDefault();
  });
  $('#helth-survey-link').click(function (e) {
    modalOpen('#helth-survey');
    e.preventDefault();
  });
  $('#responsibility-survey-link').click(function (e) {
    modalOpen('#responsibility-survey');
    e.preventDefault();
  });
  var resize = new Croppie(document.getElementById('brevet-crop'), {
    viewport: {
      width: 257,
      height: 300
    },
    boundary: {
      width: 320,
      height: 363
    },
    showZoomer: true,
    enableOrientation: true,
    url: 'http://lorempixel.com/500/400/'
  });
  $('.croppie-rotate').on('click', function (e) {
    resize.rotate(parseInt($(e.currentTarget).data('deg'), 10));
  });
  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        // $('.croppie-container').html('');
        // $('#brevet-crop')[0].croppie('destroy');
        modalOpen('#rkg-moddal-brevet', function () {
          console.log(e);
          resize.bind({
            url: e.target.result
          });
          $('.brevet-upload-button').on('click', function () {
            resize.result('base64').then(function (dataImg) {
              // const data = [{image: dataImg}, {name: 'myimgage.jpg'}];
              var formData = new FormData();
              formData.append('action', 'brevet_upload');
              formData.append('image', dataImg);
              jQuery.ajax({
                url: rkgScript.ajaxUrl,
                type: 'POST',
                contentType: false,
                processData: false,
                data: formData,
                success: function success(response) {
                  console.log(response);
                  $('.course-brevet-image').html("<img src=\"".concat(response, "\" />"));
                  modalStatusClass();
                  $('.rkg-modal-status').text('');
                  $('body').removeClass('modal-open');
                  signup = null;
                  if ($(window).width() <= 1080) {
                    $('.rkg-modal').fadeOut({
                      queue: false,
                      duration: 'fast'
                    }).promise().done(function () {
                      window.location.reload();
                    });
                    return;
                  }
                  $('.rkg-modal').fadeOut({
                    queue: false,
                    duration: 'fast'
                  }).animate({
                    top: '37.5%'
                  }).promise().done(function () {
                    window.location.reload();
                  });
                }
              });
              $('#result').attr('src', dataImg);
            });
          });
        });
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  $('#brevet').change(function () {
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
      alert('The File APIs are not fully supported in this browser.');
      return;
    }
    readURL(this);
  });
  $('#brevet-link').click(function (e) {
    e.preventDefault();
    $('#brevet').click();
  });
  $('form#helth-survey').on('submit', function (e) {
    e.preventDefault();
    var formData = new FormData($('#helth-survey').get(0));
    console.log(rkgTheme.ajaxurl);
    formData.append('action', 'health_survey');
    jQuery.ajax({
      url: rkgTheme.ajaxurl,
      type: 'POST',
      contentType: false,
      processData: false,
      data: formData,
      success: function success() {
        window.location.reload();
      },
      error: function error(response) {
        console.log(response);
      }
    });
  });
  $('form#responsibility-survey').on('submit', function (e) {
    e.preventDefault();
    var formData = new FormData($('#responsibility-survey').get(0));
    console.log(rkgTheme.ajaxurl);
    formData.append('action', 'responsibility_survey');
    jQuery.ajax({
      url: rkgTheme.ajaxurl,
      type: 'POST',
      contentType: false,
      processData: false,
      data: formData,
      success: function success() {
        window.location.reload();
      },
      error: function error(response) {
        console.log(response);
      }
    });
  });
  $('.excursion-signup').click(function (e) {
    e.preventDefault();
    var signupId = $(e.currentTarget).data('post');
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: rkgTheme.ajaxurl,
      data: {
        action: 'rkg_user_excursion_signup',
        post: signupId
      },
      success: function success() {
        modalOpen('#excursion-signup-ok');
      },
      error: function error(_error3) {
        console.log(_error3);
      }
    });
  });
  $('#excursion-signup-ok-gear, #excursion-signup-gear').click(function (e) {
    e.preventDefault();
    modalOpen('#gear-form');
  });
  $('.excursion-signout').click(function (e) {
    e.preventDefault();
    signup = 'course';
    var signupId = $(e.currentTarget).data('post');
    var signoutName = $(e.currentTarget).data('name');
    $('input[name="signout-excursion"]').val(signupId);
    $('.excursion-signout-name').text(signoutName);
    jQuery.post(rkgTheme.ajaxurl, loginStatus, function (response) {
      if (response === 'yes') {
        modalOpen('#excursion-signout-form');
      }
    });
  });
  $('.excursion-signup-waiting').click(function (e) {
    e.preventDefault();
    var signupId = $(e.currentTarget).data('post');
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: rkgTheme.ajaxurl,
      data: {
        action: 'rkg_user_excursion_signup_waiting',
        post: signupId
      },
      success: function success() {
        modalOpen('#excursion-signup-ok');
      },
      error: function error(_error4) {
        console.log(_error4);
      }
    });
  });
  $('.excursion-signout-waiting').click(function (e) {
    e.preventDefault();
    signup = 'course';
    var signupId = $(e.currentTarget).data('post');
    var signoutName = $(e.currentTarget).data('name');
    $('input[name="signout-excursion"]').val(signupId);
    $('.excursion-signout-name').text(signoutName);
    jQuery.post(rkgTheme.ajaxurl, loginStatus, function (response) {
      if (response === 'yes') {
        modalOpen('#excursion-signout-waiting-form');
      }
    });
  });
  $('form#excursion-signout-form').on('submit', function (e) {
    $('form#excursion-signout-form p.status').show().text('Odjava u tijeku...');
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: rkgTheme.ajaxurl,
      data: {
        action: 'rkg_excursion_signout',
        post: $('form#excursion-signout-form #signout-excursion').val()
      },
      success: function success(data) {
        $('form#excursion-signout-form p.status').text(data.message);
        window.location.reload();
      }
    });
    e.preventDefault();
  });
  $('form#excursion-signout-waiting-form').on('submit', function (e) {
    $('form#excursion-signout-form p.status').show().text('Odjava u tijeku...');
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: rkgTheme.ajaxurl,
      data: {
        action: 'rkg_excursion_signout_waiting',
        post: $('form#excursion-signout-form #signout-excursion').val()
      },
      success: function success(data) {
        $('form#excursion-signout-form-waiting p.status').text(data.message);
        window.location.reload();
      }
    });
    e.preventDefault();
  });
  $('form#gear-form').on('submit', function (e) {
    e.preventDefault();
    var formData = new FormData($('#gear-form').get(0));
    formData.append('action', 'gear_reserve');
    jQuery.ajax({
      url: rkgTheme.ajaxurl,
      type: 'POST',
      contentType: false,
      processData: false,
      data: formData,
      success: function success() {
        window.location.reload();
      },
      error: function error(response) {
        console.log(response);
      }
    });
  });
  $('#no-gear').click(function (e) {
    e.preventDefault();
    var gearId = $(e.currentTarget).data('post');
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: rkgTheme.ajaxurl,
      data: {
        action: 'gear_reserve_no',
        post: gearId
      },
      success: function success() {
        window.location.reload();
      }
    });
  });
  $('#excursion-signup-guest').click(function (e) {
    modalOpen('#excursion-guest-form');
    e.preventDefault();
  });
  $('form#excursion-guest-form').on('submit', function (e) {
    e.preventDefault();
    var formData = new FormData($('#excursion-guest-form').get(0));
    formData.append('action', 'guest_invite');
    jQuery.ajax({
      url: rkgTheme.ajaxurl,
      type: 'POST',
      contentType: false,
      processData: false,
      data: formData,
      success: function success() {
        window.location.reload();
      },
      error: function error(response) {
        console.log(response);
      }
    });
  });
  $('.guest-uninvite').click(function (e) {
    e.preventDefault();
    var name = $(e.currentTarget).data('name');
    var email = $(e.currentTarget).data('email');
    $('#guest-remove-name').html(name);
    $('#guest-remove-email').val(email);
    modalOpen('#excursion-guest-remove-form');
  });
  $('form#excursion-guest-remove-form').on('submit', function (e) {
    e.preventDefault();
    var formData = new FormData($('#excursion-guest-form').get(0));
    formData.append('action', 'guest_uninvite');
    jQuery.ajax({
      url: rkgTheme.ajaxurl,
      type: 'POST',
      contentType: false,
      processData: false,
      data: formData,
      success: function success() {
        window.location.reload();
      },
      error: function error(response) {
        console.log(response);
      }
    });
  });
  $('.course-interested').click(function (e) {
    e.preventDefault();
    var course = $(e.currentTarget).data('course');
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: rkgTheme.ajaxurl,
      data: {
        action: 'course_interest',
        course: course
      },
      success: function success() {
        modalOpen('#course-interested-form');
      },
      error: function error(_error5) {
        console.log(_error5);
      }
    });
  });
  $('.course-not-interested').click(function (e) {
    e.preventDefault();
    var course = $(e.currentTarget).data('course');
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: rkgTheme.ajaxurl,
      data: {
        action: 'course_not_interest',
        course: course
      },
      success: function success() {
        modalOpen('#course-not-interested-form');
      },
      error: function error(_error6) {
        console.log(_error6);
      }
    });
  });

  /* global modalOpen */

  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = "expires=".concat(d.toUTCString());
    if (exdays === 0) {
      expires = '';
    }
    console.log(expires);
    document.cookie = "".concat(cname, "=").concat(cvalue, ";").concat(expires, ";path=/");
  }
  function getCookie(cname) {
    var name = "".concat(cname, "=");
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }
  function checkBetaCookie() {
    var betaMessage = getCookie('betaMessage');
    if (betaMessage === '') {
      modalOpen('#beta-message');
      setCookie('betaMessage', true, 0);
    }
  }
  checkBetaCookie();

  // $(document).mouseup((e) => {
  // if ($('.rkg-profile-meni').css('display') === 'block'
  // && !$('.rkg-profile-meni').is(e.target)
  // && !$('.rkg-profile-meni-switch').is(e.target)
  // && $('.rkg-profile-meni').has(e.target).length === 0) {
  // $('.rkg-profile-meni').animate({
  // height: 'toggle',
  // opacity: 'toggle',
  // }, 'fast');
  // }
  // });

  $('.rkg-profile-meni-switch').click(function () {
    if ($(window).width() <= 1080 && window.devicePixelRatio > 1.5) {
      $('.rkg-profile-meni').css('left', '0vw');
      return;
    }
    $('.rkg-profile-meni').animate({
      height: 'toggle',
      opacity: 'toggle'
    }, 'fast');
  });
  $('.rkg-profile-meni-close').click(function () {
    if ($(window).width() <= 1080 && window.devicePixelRatio > 1.5) {
      $('.rkg-profile-meni').css('left', '-90vw');
      return;
    }
    $('.rkg-profile-meni').animate({
      height: 'toggle',
      opacity: 'toggle'
    }, 'fast');
  });

  // $(document).mouseup((e) => {
  // if (!$('.rkg-profile-meni').is(e.target)
  // && $('.rkg-profile-meni').has(e.target).length === 0) {
  // $('.rkg-profile-meni').css('left', '-90vw');
  // }
  // });

  var sticky = $('#rkg-top-stick').offset();
  var rkgStick = function rkgStick() {
    if (window.pageYOffset > sticky.top) {
      $('#rkg-top-stick').addClass('sticky');
      $('.rkg-front-hide').fadeIn('fast');
    } else {
      $('#rkg-top-stick').removeClass('sticky');
      $('.rkg-front-hide').fadeOut(100);
    }
  };
  window.onscroll = function () {
    return rkgStick();
  };
  $('#rkg-header-arrow-container, #rkg-ancor-1-go').click(function () {
    document.getElementById('rkg-scroll-ancor').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
  $('#rkg-ancor-2-go').click(function () {
    document.getElementById('rkg-ancor-2').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
  $('#rkg-ancor-3-go').click(function () {
    document.getElementById('rkg-ancor-3').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
  $('#rkg-ancor-4-go').click(function () {
    document.getElementById('rkg-ancor-4').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
  $('form#course-signout-form').on('submit', function (e) {
    modalStatusClass();
    $('.rkg-modal-status').text('Odjava u tijeku...');
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: rkgTheme.ajaxurl,
      data: {
        action: 'rkg_course_signout',
        course: $('form#course-signout-form #signout-course').val()
      },
      success: function success(data) {
        modalStatusClass(0);
        $('.rkg-modal-status').text(data.message);
        window.location.reload();
      }
    });
    e.preventDefault();
  });
  $('form#lost-password').on('submit', function (e) {
    e.preventDefault();
    modalStatusClass();
    $('.rkg-modal-status').text('Slanje u tijeku...');
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: rkgTheme.ajaxurl,
      data: {
        action: 'sendPasswordReset',
        lost_username: $('#lost_username').val()
      },
      success: function success(data) {
        modalStatusClass(data.status);
        $('.rkg-modal-status').text(data.message);
      },
      error: function error(_error7) {
        console.log(_error7);
      }
    });
  });
  $('.courses-terms-control').click(function (e) {
    var cat = $(e.currentTarget).data('cat');
    var state = $(e.currentTarget).data('state');
    if (state === 'off') {
      $('.courses-terms-up').hide();
      $('.courses-terms-down').show();
      $(".courses-terms-down-".concat(cat)).hide();
      $(".courses-terms-up-".concat(cat)).show();
      $('.courses-terms').hide();
      $(".courses-terms-".concat(cat)).css('display', 'block');
      $('.courses-terms-control').data('state', 'off');
      $(e.currentTarget).data('state', 'on');
    } else {
      $('.courses-terms-up').hide();
      $('.courses-terms-down').show();
      $('.courses-terms').hide();
      $(e.currentTarget).data('state', 'off');
    }
  });
  $('.rkg-excursion-signout-close').click(function () {
    $('.rkg-excursion-signout').fadeOut({
      queue: false,
      duration: 'fast'
    }).animate({
      top: '25%'
    }, function () {
      $('.rkg-modal-background').fadeOut('fast', function () {
        return window.location.reload();
      });
    });
  });
  $('.rkg-moddal-gallery-slick').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: $('.rkg-moddal-gallery-chevron-left'),
    nextArrow: $('.rkg-moddal-gallery-chevron-right')
  });
  $('.gallery-item').click(function (e) {
    var gallery = $(e.currentTarget).parent();
    $('.rkg-meni-background').fadeIn('fast').promise().done(function () {
      $('.rkg-moddal-gallery').fadeIn({
        queue: false,
        duration: 'fast'
      });
      gallery.children('img').each(function (index, img) {
        var src = $(img).attr('src');
        $('.rkg-moddal-gallery-slick').slick('slickAdd', '<div class="rkg-moddal-gallery-slide">' + "<img src='".concat(src, "'>") + '</div>');
      });
    });
  });
  $('.rkg-moddal-gallery-close').click(function () {
    $('.rkg-moddal-gallery').fadeOut('fast').promise().done(function () {
      $('.rkg-moddal-gallery-slick').slick('slickRemove', null, null, true);
      $('.rkg-meni-background').fadeOut('fast');
    });
  });
  if ($('#rkg-users-input').length) {
    $('#rkg-users-input').on('keyup', function () {
      var value = $(this).val().toLowerCase();
      $('#rkg-users tr, #rkg-users-mob tbody').filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    });
  }
  $('.rkg-user').click(function (e) {
    var target = $(e.currentTarget).find('.rkg-user-details');
    $('.rkg-user-details').not(target).hide();
    target.animate({
      height: 'toggle',
      opacity: 'toggle'
    }, 'fast');
  });
  $(document).mouseup(function (e) {
    if (!$('.rkg-user').is(e.target) && $('.rkg-user-details').has(e.target).length === 0) {
      $('.rkg-user-details').hide();
    }
  });
  $('#rkg-excursion-calendar').on('click', '.calendar-excursion', function (e) {
    var target = $(e.currentTarget).find('.date-excursions');
    $('.date-excursions').not(target).hide();
    target.animate({
      height: 'toggle',
      opacity: 'toggle'
    }, 'fast');
  });
  $(document).mouseup(function (e) {
    if (!$('.calendar-excursion').is(e.target) && $('.date-excursions').has(e.target).length === 0) {
      $('.date-excursions').hide();
    }
  });
  $(window).scroll(function () {
    $('.rkg-user-details').hide();
  });
  $('.rkg-profile-meni-toggle').click(function (e) {
    e.preventDefault();
    $(e.currentTarget).next().slideToggle();
  });
  function getParameterByName(name) {
    var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.location.href;
    var rename = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp("[?&]".concat(rename, "(=([^&#]*)|&|#|$)"));
    var results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
  $('#rkg-excursion-calendar').on('click', '.rkg-cal-prev, .rkg-cal-next', function (e) {
    e.preventDefault();
    var url = $(e.currentTarget).attr('href');
    var month = getParameterByName('month', url);
    var year = getParameterByName('year', url);
    $.ajax({
      type: 'GET',
      url: rkgTheme.ajaxurl,
      data: {
        action: 'excursion_calendar',
        month: month,
        year: year
      },
      success: function success(response) {
        $('#rkg-excursion-calendar').html(response);
      }
    });
  });
  $('#excursion-contorl-search').click(function () {
    $('#rkg-excursion-page-search').toggle();
    $('.rkg-excursion-search-down').toggle();
    $('.rkg-excursion-search-up').toggle();
    $('.rkg-excursion-cal-down').show();
    $('.rkg-excursion-cal-up').hide();
  });
});
//# sourceMappingURL=site.js.map
