const body = document.body;
const hamburger = document.querySelector('.hamburger');
const overlay = document.querySelector('.overlay');

const menuLinks = document.querySelectorAll('.menu__link');

menuLinks.forEach( e => {
    e.addEventListener('click', toggleMenu);
});

function toggleMenu () {
    hamburger.classList.toggle('hamburger--active');
    overlay.classList.toggle('overlay--active');
    body.classList.toggle('body--active-menu');
}; 

hamburger.addEventListener('click', toggleMenu);


// hamburger.addEventListener('click', (e) => {
//     clicked = !clicked;

//     if (clicked) {
//         hamburger.classList.add('hamburger--active');
//         menuList.classList.add('menu__list--active');
//         body.classList.add('body--active-menu');
//     } else {
//         hamburger.classList.remove('hamburger--active');
//         menuList.classList.remove('menu__list--active');
//         body.classList.remove('body--active-menu');
//     }
// });

var clicked = false;

// const goodsOpenBtn = document.querySelector('.goods__composition-btn');
// const goodsComponentList = document.querySelector('.goods__composition-block');

// goodsOpenBtn.addEventListener('click', (e) => {
//     clicked = !clicked;

//     if (clicked) {
//         goodsComponentList.style.visibility = "visible";
//     } else {
//         goodsComponentList.style.visibility = "hidden";
//     }
// })

// Батончики - слайдер

$('.goods__composition-btn').click( e => {
    const $this = $(e.currentTarget);

    const block = $this.find('.goods__composition-block');

    clicked = !clicked;

    if (clicked) {
        block.css('visibility', 'visible');
    } else {
        block.css('visibility', 'hidden');
    }
});

// // // 

const slider = $('.goods__list').bxSlider({
    pager : false,
    controls: false,
    touchEnabled: false
}
);

$('.left-arrow-block').click((e) => {
    slider.goToPrevSlide();
})

$('.right-arrow-block').click((e) => {
    slider.goToNextSlide();
})

// // // // // // // // // // // // // // //

// Отзывы - слайдшоу

const findSlide = (e) => {
    return $('.reviews__item').filter((ndx, item) => {
        return $(item).attr('data-linked') === e;
    });
} 

$('.interactive-avatar__link').click((e) => {
    e.preventDefault();

    const $this = $(e.currentTarget);
    const target = $this.attr('data-link');
    const necessarySlide = findSlide(target);


    const curItem = $this.closest('.reviews__switcher-item');

    necessarySlide.addClass('reviews__item--active').siblings().removeClass('reviews__item--active');
    curItem.addClass('interactive-avatar--active').siblings().removeClass('interactive-avatar--active');
});

// // // // // // // // // // // // // // //

// Команда - аккордеон

const openItem = e => {
    const container = e.closest('.team__item');
    const content = container.find('.team__content-wrapper');
    const textBlock = content.find('.team__content');
    const textBlockHeight = textBlock.height();

    e.find('.team__person-btn').addClass('team__person-btn--active');

    container.addClass('active-member');
    content.height(textBlockHeight);
}

const closeAllItems = container => {
    const items = container.find('.team__content-wrapper');

    container.find('.team__person-btn').removeClass('team__person-btn--active');

    const itemContainer = container.find('.team__item');

    itemContainer.removeClass('active-member');
    items.height(0);
}

$('.team__title').click((e) => {
    const $this = $(e.currentTarget);
    const container = $this.closest('.team');
    
    const item = $this.closest('.team__item');
    
    if (item.hasClass('active-member')) {
        closeAllItems(container); 
    } else {
        closeAllItems(container);
        openItem($this);
    }
});

// // // // // // // // // // // // // // //

// Модальное окно на ванильном JS

const myForm = document.querySelector('.form');
const submitBtn = document.querySelector('.form__submit-btn');

submitBtn.addEventListener('click', e => {
    e.preventDefault();

    if (validateForm(myForm)) {
        const data = {
            name: myForm.elements.name.value,
            phone: myForm.elements.phone.value,
            comment: myForm.elements.comment.value,
            to: myForm.elements.to.value
        }

        // console.log(data);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://webdev-api.loftschool.com/sendmail');
        xhr.setRequestHeader('content-type', 'application/json');
        xhr.send(JSON.stringify(data));
        xhr.addEventListener('load', () => {
            // console.log(xhr.status);

            const status = xhr.status;

            const responseForm = document.querySelector('.form-response');
            const modalResponse = document.querySelector('.modal__response');

            if (status < 400) {
                responseForm.classList.add('form-response--active');
                modalResponse.textContent = "Сообщение отправлено";
                modalResponse.classList.remove('post-error');

                // Очистка формы происходит только при успешной отправке

                document.querySelectorAll('.form__input').forEach(element => {
                    element.value = "";
                });

                document.querySelectorAll('.radio__elem').forEach(element => {
                    element.checked = false;
                });

            } else {
                responseForm.classList.add('form-response--active');
                modalResponse.textContent = "Произошла ошибка. Повторите попытку позже";
                modalResponse.classList.add('post-error');
            }
        });

    }
});

const validateForm = form => {
    let valid = true;

    if (!validateField(form.elements.name)) {
        valid = false
    }

    if (!validateField(form.elements.phone)) {
        valid = false
    }

    if (!validateField(form.elements.comment)) {
        valid = false
    }

    if (!validateField(form.elements.to)) {
        valid = false
    }

    return valid;
};

const validateField = field => {
    if (!field.checkValidity()) {
        field.classList.add('field-error');
        return false;
    } else {
        field.classList.remove('field-error');
        return true;
    }
};


const modalCloseBtn = document.querySelector('.modal__close-btn');

modalCloseBtn.addEventListener('click', () => {
    const responseForm = document.querySelector('.form-response');
    responseForm.classList.remove('form-response--active');
});



// // // // // // // // // // // // // // //

// Карта

let myMap;

const init = () => {
    myMap = new ymaps.Map('map', {
        center: [55.831883, 37.575994],
        zoom: 11,
        controls: []
    });

    const coords = [
        [55.753124, 37.582400],
        [55.789846, 37.521374],
        [55.907134, 37.403915],
        [55.943311, 37.302710],
    ];

    var myCollection = new ymaps.GeoObjectCollection({}, {
        draggable: false, // и их можно перемещать
        iconLayout: 'default#image',
        iconImageHref: 'img/chocco-marker.svg',
        iconImageSize: [30, 42],
        // iconImageOffset: [-3, -42]
    });

    coords.forEach(coord => {
        myCollection.add(new ymaps.Placemark(coord));
    });

    myMap.geoObjects.add(myCollection);

    myMap.behaviors.disable('scrollZoom');
};

ymaps.ready(init);



// // // // // // // // // // // // // // //

// Горизонтальный аккордеон

const measureWidth = item => {
    let reqItemWidth = 0;

    const winWidth = $(window).width();
    const container = item.closest('.products-menu');
    const titleBlocks = container.find('.products-menu__button');
    const titleWidth = titleBlocks.width() * titleBlocks.length;
    
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const textContent = item.find('.products-menu__content-wrapper');
    const pl = parseInt(textContent.css('padding-left'));
    const pr = parseInt(textContent.css('padding-right'));

    if (isMobile) {
        reqItemWidth = winWidth - titleWidth;
    } else {
        reqItemWidth = 500;
    }

    return {
        itemWidth: reqItemWidth,
        textContentWidth: reqItemWidth - pl - pr
    }

};

const closeHorizontalItem = container => {
    const items = container.find('.products-menu__item');
    const content = container.find('.products-menu__content');

    items.removeClass('active');
    content.width(0);
};

const openHorizontalItem = e => {
    const content = e.find('.products-menu__content');
    const textContainer = e.find('.products-menu__content-text');
    e.addClass('active');

    const item = measureWidth(e);

    content.width(item.itemWidth);
    textContainer.width(item.textContentWidth);
};

$('.products-menu__button').click(e => {
    e.preventDefault();
    
    const $this = $(e.currentTarget);
    const item = $this.closest('.products-menu__item');
    const container = $this.closest('.products-menu');

    const isOpened = item.hasClass('active');

    if (isOpened) {
        closeHorizontalItem(container);
    } else {
        closeHorizontalItem(container);
        openHorizontalItem(item);
    }
});

$('.products-menu__close-button').click(e => {
    e.preventDefault();
    const $this = $(e.currentTarget);

    const container = $this.closest('.products-menu');
    closeHorizontalItem(container);
});





// // // // // // // // // // // // // // //

// One Page Scroll

const section = $('.section');
const display = $('.maincontent');
const sideMenu = $('.fixed-menu');
const menuItems = sideMenu.find('.fixed-menu__item');

let inScroll = false;

section.first().addClass('active');

const mobileDetect = new MobileDetect(window.navigator.userAgent);
const isMobile = mobileDetect.mobile();

const countSectionPosition = sectionEq => {
    return sectionEq * -100;
}

const menuColorChanger = sectionEq => {
    const currentSection = section.eq(sectionEq);
    const menuTheme = currentSection.attr('data-side-menu-theme');
    const activeClass = 'fixed-menu--shadowed';

    if (menuTheme === "dark") {
        sideMenu.addClass(activeClass);
    } else {
        sideMenu.removeClass(activeClass);
    }
}

const resetActiveClassForItem = (items, itemsEq, activeClass) => {
    items.eq(itemsEq).addClass(activeClass).siblings().removeClass(activeClass);
}

const performTransition = sectionEq => {
    if (inScroll) return;

    const transitionOver = 1000;
    const mouseInertionOver = 300;

    inScroll = true;
    const position = countSectionPosition(sectionEq);

    if (isNaN(position)) {
        return 0;
    }

    menuColorChanger(sectionEq);
    
    display.css({
        transform: `translateY(${position}%)`,
    });


    resetActiveClassForItem(section, sectionEq, 'active');

    setTimeout(() => {
        inScroll = false;

        resetActiveClassForItem(menuItems, sectionEq, 'fixed-menu__item--active');
    }, transitionOver + mouseInertionOver);
};

const viewportScroller = direction => {
    const activeSection = section.filter('.active');
    const nextSection = activeSection.next();
    const prevSection = activeSection.prev();

    return {
        next () {
            if (nextSection.length) {
                performTransition(nextSection.index());
            }
        }, 
        prev () {
            if (prevSection.length) {
                performTransition(prevSection.index());
            }
        }
    }
    

};

$(window).on('wheel', e => {
    const deltaY = e.originalEvent.deltaY;
    const scroller = viewportScroller();

    if (deltaY > 0) {
        scroller.next();
    } 

    if (deltaY < 0) {
        scroller.prev();
    }
});

$(window).on('keydown', e => {
    const tagName = e.target.tagName.toLowerCase();

    const userTypingInInput = tagName === "input" || tagName === 'textarea';

    const scroller = viewportScroller();

    if (userTypingInInput) return;
    switch (e.keyCode) {
        case 38:
            scroller.prev();
            break;

        case 40:
            scroller.next();
            break;
    }
});

$('.wrapper').on('touchmove', e => e.preventDefault());

$('[data-scroll-to]').on('click', e => {
    e.preventDefault();

    const $this = $(e.currentTarget);

    const target = $this.attr("data-scroll-to");
    const reqSection = $(`[data-section-id=${target}]`);

    performTransition(reqSection.index());
});

// https://github.com/mattbryson/TouchSwipe-Jquery-Plugin

// https://cdnjs.com/libraries/jquery.touchswipe


if (isMobile) {
    $(body).swipe( {
        //Generic swipe handler for all directions
        swipe:function(event, direction) {
            const scroller = viewportScroller();
            let scrollerDirection = "";
            
            if (direction === 'up') scrollerDirection = "next";
            if (direction === 'down') scrollerDirection = "prev";
    
            scroller[scrollerDirection]();
        }
    });
}





// // // // // // // // // // // // // // //

// Video



const video = document.querySelector('.video__player-content');
const playBtn = document.querySelector('.video__play');
const videoSplash = document.querySelector('.video__splash');
const videoSplashPlayBtn = document.querySelector('.video__splash-play-btn');
const videoPlaybackBtn = document.querySelector('.video__playback-button');
const videoPlayback = document.querySelector('.video__playback');
const muteBtn = document.querySelector('.video__mute-button');
const videoVolumeBtn = document.querySelector('.video__volume-scrollbar-button');
const videoVolume = document.querySelector('.video__volume-scrollbar');
const videoCurrentTime = document.querySelector('.video__current-time');
const videoDuration = document.querySelector('.video__duration');

const activeVideoClass = 'video__play--active';

const playFunc = () => {
    playBtn.classList.toggle(activeVideoClass);
    
    if (playBtn.classList.contains(activeVideoClass)) {
        video.play();
        videoSplash.style.display = "none";
    } else {
        video.pause();
    }
}

playBtn.addEventListener('click', e => {
    playFunc();
});

videoSplashPlayBtn.addEventListener('click', e => {
    playFunc();
});

muteBtn.addEventListener('click', e => {
    const mutedVideoClass = 'video__mute-button--muted';
    muteBtn.classList.toggle(mutedVideoClass);

    if (muteBtn.classList.contains(mutedVideoClass)) {
        video.muted = true;
    } else {
        video.muted = false;
    }
});

video.addEventListener('timeupdate', e => {
    const completedSec = video.currentTime;
    const completedPercent = (completedSec * 100) / video.duration;
    videoPlaybackBtn.style.left = `${completedPercent}%`;
});

video.addEventListener('ended', e => {
    playBtn.classList.remove(activeVideoClass);
    video.currentTime = 0;
    videoSplash.style.display = "block";
});

videoPlayback.addEventListener('click', e => {
    const bar = $(e.currentTarget);
    const btnNewPosition = e.pageX - bar.offset().left;
    const btnPositionPercent = (btnNewPosition * 100) / bar.width();
    const newPlayerTimeSec = (video.duration / 100) * btnPositionPercent;
    videoPlaybackBtn.style.left = `${btnPositionPercent}%`;
    video.currentTime = newPlayerTimeSec;
});

const formatTime = timeSec => {
    const roundTime = Math.round(timeSec);
    
    const minutes = addZero(Math.floor(roundTime / 60));
    const seconds = addZero(roundTime - minutes * 60);
    
    function addZero(num) {
      return num < 10 ? `0${num}` : num;
    }
    
    return `${minutes} : ${seconds}`;
};

video.addEventListener('canplay', e => {
    const durationSec = video.duration;
    
    let interval;
    
    if (typeof interval !== undefined) {
        clearInterval(interval);
    }
    
    interval = setInterval (() => {
        const currentTime = video.currentTime;
        videoCurrentTime.textContent = formatTime(currentTime);
    }, 1000);


    videoDuration.textContent = formatTime(durationSec);
})

videoVolume.addEventListener('click', e => {
    const bar = $(e.currentTarget);
    const btnNewPosition = e.pageX - bar.offset().left;
    const btnPositionPercent = (btnNewPosition * 100) / bar.width();
    const newVolume = (1 / 100) * btnPositionPercent;
    videoVolumeBtn.style.left = `${btnPositionPercent}%`;
    video.volume = newVolume;
});